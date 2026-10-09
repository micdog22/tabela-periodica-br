import { ELEMENTS, CATEGORIES, STATES, byNumber, layoutPosition } from './elements.js';
import {
  energyOrder, shells, isException, expectedConfig, formatMass, searchElements, matchesFilters,
  makeQuizQuestion, SHELL_NAMES,
} from './chem.js';

const RECORD_KEY = 'tabela-periodica-br:recorde';
const $ = (sel) => document.querySelector(sel);
const els = {
  search: $('#search'),
  results: $('#results'),
  category: $('#category'),
  state: $('#state'),
  clear: $('#clear'),
  filterStatus: $('#filter-status'),
  legend: $('#legend'),
  table: $('#table'),
  detail: $('#detail'),
  quizMode: $('#quiz-mode'),
  quizRange: $('#quiz-range'),
  quizStart: $('#quiz-start'),
  quizBox: $('#quiz-box'),
  quizQuestion: $('#quiz-question'),
  quizAnswers: $('#quiz-answers'),
  quizFeedback: $('#quiz-feedback'),
  quizNext: $('#quiz-next'),
  hits: $('#score-hits'),
  misses: $('#score-misses'),
  streak: $('#score-streak'),
  best: $('#score-best'),
};

const cells = new Map();
let selected = null;
let mini = null;
const quiz = { question: null, answered: false, hits: 0, misses: 0, streak: 0, best: loadRecord(), timer: 0 };

/* ---------------- utilidades ---------------- */

function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
    else el.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : String(child));
  }
  return el;
}

function loadRecord() {
  try {
    return Math.max(0, Number(localStorage.getItem(RECORD_KEY)) || 0);
  } catch {
    return 0;
  }
}

function saveRecord() {
  try {
    localStorage.setItem(RECORD_KEY, String(quiz.best));
  } catch {
    /* sem armazenamento: o recorde vale só nesta visita */
  }
}

/** Configuração com expoentes: "[Ar] 3d6 4s2" vira [Ar] 3d<sup>6</sup> 4s<sup>2</sup>. */
function configNode(text) {
  const span = h('span', { class: 'config' });
  text.split(' ').forEach((token, i) => {
    if (i) span.append(' ');
    const m = /^(\d[spdf])(\d+)$/.exec(token);
    if (m) span.append(m[1], h('sup', { text: m[2] }));
    else span.append(token);
  });
  return span;
}

function stateLabel(element) {
  return STATES[element.state ?? 'unknown'];
}

function groupLabel(element) {
  if (element.group !== null) return String(element.group);
  return element.category === 'lanthanide' ? 'série dos lantanídeos (linha de baixo)' : 'série dos actinídeos (linha de baixo)';
}

/* ---------------- tabela ---------------- */

function buildTable() {
  const table = els.table;
  for (let g = 1; g <= 18; g++) {
    table.append(h('span', { class: 'axis group-num', style: `grid-row:1;grid-column:${g + 1}`, 'aria-hidden': 'true', text: String(g) }));
  }
  for (let p = 1; p <= 7; p++) {
    table.append(h('span', { class: 'axis period-num', style: `grid-row:${p + 1};grid-column:1`, 'aria-hidden': 'true', text: String(p) }));
  }
  table.append(h('span', { class: 'placeholder cat-lanthanide', style: 'grid-row:7;grid-column:4', 'aria-hidden': 'true', text: '57-71' }));
  table.append(h('span', { class: 'placeholder cat-actinide', style: 'grid-row:8;grid-column:4', 'aria-hidden': 'true', text: '89-103' }));
  table.append(h('span', { class: 'series-label', style: 'grid-row:10;grid-column:1 / span 3', 'aria-hidden': 'true', text: 'Lantanídeos' }));
  table.append(h('span', { class: 'series-label', style: 'grid-row:11;grid-column:1 / span 3', 'aria-hidden': 'true', text: 'Actinídeos' }));
  mini = h('div', { class: 'mini', style: 'grid-row:2 / span 3;grid-column:4 / span 10', 'aria-hidden': 'true' });
  table.append(mini);
  for (const e of ELEMENTS) {
    const { row, col } = layoutPosition(e);
    const button = h('button', {
      type: 'button',
      class: `el cat-${e.category}`,
      style: `grid-row:${row + 1};grid-column:${col + 1}`,
      'data-z': String(e.z),
      tabindex: '-1',
      title: e.name,
      'aria-label': `${e.name}, ${e.symbol}, número atômico ${e.z}`,
    },
    h('span', { class: 'el-z', text: String(e.z) }),
    h('span', { class: 'el-symbol', text: e.symbol }),
    h('span', { class: 'el-name', text: e.name }),
    h('span', { class: 'el-mass', text: formatMass(e) }));
    cells.set(e.z, button);
    table.append(button);
  }
  cells.get(1).tabIndex = 0;
}

function buildControls() {
  els.category.append(new Option('Todas', 'all'), ...Object.entries(CATEGORIES).map(([id, label]) => new Option(label, id)));
  els.state.append(new Option('Todos', 'all'), ...Object.entries(STATES).map(([id, label]) => new Option(label, id)));
  els.legend.replaceChildren(...Object.entries(CATEGORIES).map(([id, label]) => h('li', {},
    h('button', {
      type: 'button', class: `legend-item cat-${id}`, 'data-category': id, 'aria-pressed': 'false',
      onclick: () => {
        els.category.value = els.category.value === id ? 'all' : id;
        applyFilters();
      },
    }, label))));
}

/* ---------------- detalhe ---------------- */

function renderMini(e) {
  mini.replaceChildren(
    h('div', { class: `mini-tile cat-${e.category}` }, h('span', { class: 'mini-z', text: String(e.z) }), h('span', { class: 'mini-symbol', text: e.symbol })),
    h('div', { class: 'mini-text' },
      h('strong', { text: e.name }),
      h('span', { text: `${CATEGORIES[e.category]} · ${formatMass(e)}` }),
      configNode(e.config)),
  );
}

function renderDetail(e) {
  const rows = [];
  const add = (label, ...value) => rows.push(h('div', { class: 'row' }, h('dt', { text: label }), h('dd', {}, ...value)));
  if (e.weight) {
    add('Massa atômica', `${formatMass(e)} u`, h('small', { text: ' peso atômico padrão abreviado (IUPAC, 2024)' }));
  } else {
    const alt = (e.alternatives || []).map((a) => `${e.symbol}-${a.massNumber} (${a.halfLife})`);
    add('Massa atômica', `${formatMass(e)}`, h('small', {
      text: ` número de massa do isótopo mais estável conhecido, o ${e.symbol}-${e.massNumber}, com meia-vida de ${e.halfLife}.`
        + (alt.length ? ` Por causa da incerteza das medidas, a CIAAW também lista como candidato${alt.length > 1 ? 's' : ''}: ${alt.join(' e ')}.` : ''),
    }));
  }
  add('Categoria', CATEGORIES[e.category]);
  add('Período', String(e.period));
  add('Grupo', groupLabel(e));
  add('Estado a 25 °C', stateLabel(e) + (e.state === null ? ' (só foram produzidos poucos átomos)' : ''));
  add('Configuração eletrônica', configNode(e.config));
  add('Em ordem de energia', configNode(energyOrder(e.config)));
  const counts = shells(e.config);
  add('Elétrons por camada', counts.map((n, i) => `${SHELL_NAMES[i]} ${n}`).join(' · '));

  const notes = [];
  if (isException(e)) {
    notes.push(h('li', { class: 'exception' }, 'Exceção à regra de Madelung (diagrama de Linus Pauling): pelo diagrama seria ',
      configNode(expectedConfig(e)), '. Quando dois subníveis têm energias muito próximas, o estado mais estável do átomo pode ser outro.'));
  }
  if (e.predicted) notes.push(h('li', { text: 'Configuração e propriedades previstas por cálculos: só alguns átomos deste elemento foram produzidos.' }));
  for (const n of e.notes || []) notes.push(h('li', { text: n }));

  els.detail.replaceChildren(
    h('div', { class: 'detail-head' },
      h('div', { class: `big-tile cat-${e.category}` }, h('span', { class: 'big-z', text: String(e.z) }), h('span', { class: 'big-symbol', text: e.symbol })),
      h('div', {},
        h('p', { class: 'detail-name', text: e.name }),
        h('p', { class: 'muted', text: `Número atômico ${e.z} · ${CATEGORIES[e.category]}` }))),
    h('dl', { class: 'facts' }, rows),
    notes.length ? h('ul', { class: 'notes' }, notes) : null,
  );
}

function select(z, { focus = false, scroll = false, updateHash = true } = {}) {
  const e = byNumber(z);
  if (!e) return;
  if (selected) cells.get(selected).classList.remove('selected');
  selected = e.z;
  const cell = cells.get(e.z);
  cell.classList.add('selected');
  cells.forEach((c) => { c.tabIndex = -1; });
  cell.tabIndex = 0;
  if (focus) cell.focus();
  if (scroll) cell.scrollIntoView({ block: 'nearest', inline: 'center' });
  renderMini(e);
  renderDetail(e);
  if (updateHash) history.replaceState(null, '', `#${e.z}`);
}

els.table.addEventListener('click', (event) => {
  const cell = event.target.closest('.el');
  if (cell) select(Number(cell.dataset.z));
});

/** Próximo elemento na direção das setas, pela posição na grade. */
function neighbor(z, key) {
  const here = layoutPosition(byNumber(z));
  const delta = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[key];
  if (!delta) return null;
  let best = null;
  let bestScore = Infinity;
  for (const e of ELEMENTS) {
    const p = layoutPosition(e);
    const dr = p.row - here.row;
    const dc = p.col - here.col;
    if (delta[1] !== 0) {
      if (dr !== 0 || Math.sign(dc) !== delta[1]) continue;
      if (Math.abs(dc) < bestScore) {
        bestScore = Math.abs(dc);
        best = e;
      }
    } else {
      if (Math.sign(dr) !== delta[0]) continue;
      const score = Math.abs(dr) * 100 + Math.abs(dc);
      if (score < bestScore) {
        bestScore = score;
        best = e;
      }
    }
  }
  return best ? best.z : null;
}

els.table.addEventListener('keydown', (event) => {
  const cell = event.target.closest('.el');
  if (!cell) return;
  const z = Number(cell.dataset.z);
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    select(event.key === 'Home' ? 1 : 118, { focus: true, scroll: true });
    return;
  }
  const next = neighbor(z, event.key);
  if (next) {
    event.preventDefault();
    select(next, { focus: true, scroll: true });
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    select(z);
    els.detail.closest('section').scrollIntoView({ block: 'nearest' });
  }
});

/* ---------------- busca e filtros ---------------- */

function applyFilters() {
  const filters = { category: els.category.value, state: els.state.value };
  const query = els.search.value;
  const found = query.trim() ? new Set(searchElements(query).map((e) => e.z)) : null;
  let visible = 0;
  for (const e of ELEMENTS) {
    const on = matchesFilters(e, filters) && (!found || found.has(e.z));
    cells.get(e.z).classList.toggle('dim', !on);
    if (on) visible++;
  }
  els.legend.querySelectorAll('.legend-item').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.category === filters.category));
  });
  const active = filters.category !== 'all' || filters.state !== 'all' || found;
  els.filterStatus.textContent = active ? `${visible} de 118 elementos em destaque.` : '';
  renderResults(found ? searchElements(query) : []);
}

function renderResults(list) {
  els.results.replaceChildren(...list.slice(0, 8).map((e) => h('li', {},
    h('button', { type: 'button', class: `result cat-${e.category}`, onclick: () => select(e.z, { scroll: true }) },
      h('strong', { text: e.symbol }), ` ${e.name} (${e.z})`))));
  if (list.length > 8) els.results.append(h('li', { class: 'muted small', text: `e mais ${list.length - 8}` }));
}

els.search.addEventListener('input', applyFilters);
els.search.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const first = searchElements(els.search.value)[0];
    if (first) select(first.z, { focus: true, scroll: true });
  } else if (event.key === 'Escape') {
    els.search.value = '';
    applyFilters();
  }
});
els.category.addEventListener('change', applyFilters);
els.state.addEventListener('change', applyFilters);
els.clear.addEventListener('click', () => {
  els.search.value = '';
  els.category.value = 'all';
  els.state.value = 'all';
  applyFilters();
  els.search.focus();
});

/* ---------------- quiz ---------------- */

function secureRandom() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 4294967296;
}

function renderScore() {
  els.hits.textContent = String(quiz.hits);
  els.misses.textContent = String(quiz.misses);
  els.streak.textContent = String(quiz.streak);
  els.best.textContent = String(quiz.best);
}

function nextQuestion() {
  clearTimeout(quiz.timer);
  quiz.question = makeQuizQuestion({
    mode: els.quizMode.value,
    maxZ: Number(els.quizRange.value),
    previous: quiz.question ? quiz.question.z : null,
    rng: secureRandom,
  });
  quiz.answered = false;
  const q = quiz.question;
  els.quizBox.hidden = false;
  els.quizQuestion.textContent = q.mode === 'name' ? `Qual é o símbolo de ${q.prompt}?` : `Qual elemento tem o símbolo ${q.prompt}?`;
  els.quizAnswers.replaceChildren(...q.options.map((option, i) => h('button', {
    type: 'button', class: 'answer', 'data-answer': option,
    onclick: () => answer(option),
  }, h('span', { class: 'answer-key', text: String(i + 1) }), option)));
  els.quizFeedback.textContent = '';
  els.quizFeedback.className = 'quiz-feedback';
  els.quizNext.hidden = true;
  els.quizAnswers.querySelector('button').focus();
}

function answer(option) {
  if (!quiz.question || quiz.answered) return;
  quiz.answered = true;
  const q = quiz.question;
  const right = option === q.answer;
  els.quizAnswers.querySelectorAll('.answer').forEach((b) => {
    b.disabled = true;
    if (b.dataset.answer === q.answer) b.classList.add('right');
    else if (b.dataset.answer === option) b.classList.add('wrong');
  });
  const e = byNumber(q.z);
  if (right) {
    quiz.hits++;
    quiz.streak++;
    if (quiz.streak > quiz.best) {
      quiz.best = quiz.streak;
      saveRecord();
    }
    els.quizFeedback.textContent = `Isso! ${e.name} é ${e.symbol}, número atômico ${e.z}.`;
    els.quizFeedback.className = 'quiz-feedback ok';
    quiz.timer = setTimeout(nextQuestion, 1400);
  } else {
    quiz.misses++;
    quiz.streak = 0;
    els.quizFeedback.textContent = `Não foi dessa vez: ${e.name} é ${e.symbol} (número atômico ${e.z}).`;
    els.quizFeedback.className = 'quiz-feedback bad';
    els.quizNext.hidden = false;
    els.quizNext.focus();
  }
  select(e.z);
  renderScore();
}

els.quizStart.addEventListener('click', () => {
  quiz.hits = 0;
  quiz.misses = 0;
  quiz.streak = 0;
  quiz.question = null;
  els.quizStart.textContent = 'Recomeçar';
  renderScore();
  nextQuestion();
});
els.quizNext.addEventListener('click', nextQuestion);
els.quizBox.addEventListener('keydown', (event) => {
  if (/^[1-4]$/.test(event.key) && quiz.question && !quiz.answered) {
    const option = quiz.question.options[Number(event.key) - 1];
    if (option) answer(option);
  }
});

/* ---------------- início ---------------- */

buildControls();
buildTable();
renderScore();
const fromHash = Number(location.hash.slice(1));
const hasHash = Number.isInteger(fromHash) && Boolean(byNumber(fromHash));
select(hasHash ? fromHash : 26, { updateHash: false });
applyFilters();
