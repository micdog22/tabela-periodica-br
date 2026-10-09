/**
 * Química sem DOM: leitura e expansão de configurações eletrônicas, a regra
 * de Madelung (o "diagrama de Linus Pauling" das aulas), distribuição por
 * camadas, detecção das exceções, busca sem acentos e o quiz do símbolo.
 */
import { ELEMENTS, CATEGORIES } from './elements.js';

const L_LETTERS = 'spdf';
const CAPACITY = { s: 2, p: 6, d: 10, f: 14 };
export const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

/** Núcleos de gás nobre usados na forma abreviada. */
const CORES = {
  He: '1s2',
  Ne: '[He] 2s2 2p6',
  Ar: '[Ne] 3s2 3p6',
  Kr: '[Ar] 3d10 4s2 4p6',
  Xe: '[Kr] 4d10 5s2 5p6',
  Rn: '[Xe] 4f14 5d10 6s2 6p6',
};
const CORE_ORDER = ['Rn', 'Xe', 'Kr', 'Ar', 'Ne', 'He'];

/**
 * Ordem de preenchimento de Madelung: por n + l crescente e, no empate, por
 * n crescente. É exatamente a ordem das diagonais do diagrama de Linus Pauling.
 */
export const MADELUNG_ORDER = (() => {
  const list = [];
  for (let n = 1; n <= 7; n++) {
    for (let l = 0; l < Math.min(n, 4); l++) list.push({ n, l });
  }
  return list.sort((a, b) => (a.n + a.l) - (b.n + b.l) || a.n - b.n).map(({ n, l }) => `${n}${L_LETTERS[l]}`);
})();

function subshellKey(label) {
  return { n: Number(label[0]), l: L_LETTERS.indexOf(label[1]) };
}

/** Lê "[Ar] 3d5 4s1" e devolve um Map completo, com o núcleo expandido: 1s -> 2, 2s -> 2, ... */
export function parseConfig(text) {
  const map = new Map();
  for (const token of String(text).trim().split(/\s+/)) {
    const core = /^\[([A-Z][a-z]?)\]$/.exec(token);
    if (core) {
      if (!CORES[core[1]]) throw new Error(`Núcleo desconhecido: ${token}`);
      for (const [k, v] of parseConfig(CORES[core[1]])) map.set(k, (map.get(k) || 0) + v);
      continue;
    }
    const m = /^([1-7])([spdf])(\d{1,2})$/.exec(token);
    if (!m) throw new Error(`Subnível inválido: ${token}`);
    const label = `${m[1]}${m[2]}`;
    const count = Number(m[3]);
    if (L_LETTERS.indexOf(m[2]) >= Number(m[1])) throw new Error(`Subnível impossível: ${label}`);
    if (count < 1 || count > CAPACITY[m[2]]) throw new Error(`Elétrons demais em ${label}: ${count}`);
    if (map.has(label)) throw new Error(`Subnível repetido: ${label}`);
    map.set(label, count);
  }
  return map;
}

export function electronCount(text) {
  let total = 0;
  for (const v of parseConfig(text).values()) total += v;
  return total;
}

/** Configuração prevista pela regra de Madelung para Z elétrons. */
export function madelungConfig(z) {
  const map = new Map();
  let left = z;
  for (const label of MADELUNG_ORDER) {
    if (left <= 0) break;
    const take = Math.min(left, CAPACITY[label[1]]);
    map.set(label, take);
    left -= take;
  }
  return map;
}

function sameConfig(a, b) {
  if (a.size !== b.size) return false;
  for (const [k, v] of a) if (b.get(k) !== v) return false;
  return true;
}

/** Escreve um Map de subníveis na forma abreviada, com o maior núcleo de gás nobre possível. */
export function formatAbbreviated(map) {
  for (const core of CORE_ORDER) {
    const coreMap = parseConfig(CORES[core]);
    let fits = true;
    for (const [k, v] of coreMap) if (map.get(k) !== v) fits = false;
    if (!fits) continue;
    const rest = [...map].filter(([k]) => !coreMap.has(k));
    if (!rest.length && map.size === coreMap.size) {
      // O próprio gás nobre: escreve a partir do núcleo anterior.
      continue;
    }
    return [`[${core}]`, ...sortByShell(rest).map(([k, v]) => `${k}${v}`)].join(' ');
  }
  return sortByShell([...map]).map(([k, v]) => `${k}${v}`).join(' ');
}

function sortByShell(entries) {
  return [...entries].sort(([a], [b]) => {
    const x = subshellKey(a);
    const y = subshellKey(b);
    return x.n - y.n || x.l - y.l;
  });
}

/** Distribuição completa na ordem de energia (Linus Pauling): 1s2 2s2 2p6 3s2 3p6 4s2 3d6. */
export function energyOrder(text) {
  const map = parseConfig(text);
  return MADELUNG_ORDER.filter((label) => map.has(label)).map((label) => `${label}${map.get(label)}`).join(' ');
}

/** Elétrons por camada (K, L, M, N, O, P, Q). */
export function shells(text) {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const [label, v] of parseConfig(text)) counts[Number(label[0]) - 1] += v;
  while (counts.length && counts[counts.length - 1] === 0) counts.pop();
  return counts;
}

/** Elemento cuja configuração real foge da regra de Madelung. */
export function isException(element) {
  return !sameConfig(parseConfig(element.config), madelungConfig(element.z));
}

export function expectedConfig(element) {
  return formatAbbreviated(madelungConfig(element.z));
}

/** Formata a massa: "1,0080" ou "[97]". */
export function formatMass(element) {
  if (element.weight) return element.weight.replace('.', ',');
  return `[${element.massNumber}]`;
}

/* ------------------------------------------------------------------ */
/* Busca                                                               */
/* ------------------------------------------------------------------ */

/** Minúsculas e sem acentos: "Nitrogênio" vira "nitrogenio". */
export function normalize(text) {
  return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/**
 * Busca por número, símbolo ou nome, sem diferenciar acentos e maiúsculas.
 * Ordem: número exato, símbolo exato, nome que começa com o texto, símbolo
 * que começa com o texto e nome que contém o texto.
 */
export function searchElements(query, elements = ELEMENTS) {
  const q = normalize(query);
  if (!q) return [];
  if (/^\d{1,3}$/.test(q)) {
    const e = elements.find((x) => x.z === Number(q));
    return e ? [e] : [];
  }
  const scored = [];
  for (const e of elements) {
    const name = normalize(e.name);
    const symbol = e.symbol.toLowerCase();
    let score = 0;
    if (symbol === q) score = 5;
    else if (name === q) score = 4;
    else if (name.startsWith(q)) score = 3;
    else if (symbol.startsWith(q)) score = 2;
    else if (name.includes(q)) score = 1;
    if (score) scored.push({ e, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.e.z - b.e.z).map((x) => x.e);
}

/** Filtro por categoria e estado ('all' deixa passar tudo; 'unknown' = estado não determinado). */
export function matchesFilters(element, { category = 'all', state = 'all' } = {}) {
  if (category !== 'all' && element.category !== category) return false;
  if (state === 'all') return true;
  if (state === 'unknown') return element.state === null;
  return element.state === state;
}

export function categoryLabel(id) {
  return CATEGORIES[id] || id;
}

/* ------------------------------------------------------------------ */
/* Quiz do símbolo                                                     */
/* ------------------------------------------------------------------ */

function shuffle(list, rng) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Pergunta do quiz. mode 'name' mostra o nome e pede o símbolo; 'symbol'
 * mostra o símbolo e pede o nome. Três alternativas erradas, de preferência
 * parecidas (mesma letra inicial), para não ficar fácil demais.
 */
export function makeQuizQuestion({ mode = 'name', maxZ = 118, rng = Math.random, previous = null, elements = ELEMENTS } = {}) {
  const pool = elements.filter((e) => e.z <= maxZ);
  if (pool.length < 4) throw new Error('São precisos pelo menos 4 elementos.');
  let target;
  do target = pool[Math.floor(rng() * pool.length)]; while (previous && target.z === previous && pool.length > 1);
  const initial = target.symbol[0];
  const similar = shuffle(pool.filter((e) => e.z !== target.z && e.symbol[0] === initial), rng);
  const others = shuffle(pool.filter((e) => e.z !== target.z && e.symbol[0] !== initial), rng);
  const wrong = [...similar.slice(0, 2), ...others].slice(0, 3);
  const options = shuffle([target, ...wrong], rng);
  const show = (e) => (mode === 'name' ? e.symbol : e.name);
  return {
    z: target.z,
    mode,
    prompt: mode === 'name' ? target.name : target.symbol,
    answer: show(target),
    options: options.map(show),
  };
}

export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
