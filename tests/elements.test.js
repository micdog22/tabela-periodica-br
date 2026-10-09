import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ELEMENTS, CATEGORIES, STATES, byNumber, bySymbol, layoutPosition } from '../src/elements.js';
import {
  MADELUNG_ORDER, parseConfig, electronCount, madelungConfig, formatAbbreviated, energyOrder, shells,
  isException, expectedConfig, formatMass, normalize, searchElements, matchesFilters, makeQuizQuestion, seededRandom,
} from '../src/chem.js';

const el = (symbol) => bySymbol(symbol);

test('118 elementos, números de 1 a 118 em ordem e símbolos únicos', () => {
  assert.equal(ELEMENTS.length, 118);
  ELEMENTS.forEach((e, i) => assert.equal(e.z, i + 1));
  const symbols = ELEMENTS.map((e) => e.symbol);
  assert.equal(new Set(symbols).size, 118);
  assert.equal(new Set(symbols.map((s) => s.toLowerCase())).size, 118);
  for (const s of symbols) assert.match(s, /^[A-Z][a-z]?$/);
  assert.equal(new Set(ELEMENTS.map((e) => e.name)).size, 118);
  assert.equal(byNumber(26).symbol, 'Fe');
  assert.equal(bySymbol('og').z, 118);
  assert.equal(byNumber(119), null);
});

test('nomes em português do Brasil', () => {
  const expected = {
    H: 'Hidrogênio', N: 'Nitrogênio', P: 'Fósforo', W: 'Tungstênio', Nb: 'Nióbio', Kr: 'Criptônio', Xe: 'Xenônio',
    Rn: 'Radônio', Nh: 'Nihônio', Fl: 'Fleróvio', Mc: 'Moscóvio', Lv: 'Livermório', Ts: 'Tenesso', Og: 'Oganessônio',
    Fe: 'Ferro', Pb: 'Chumbo', Ag: 'Prata', Au: 'Ouro', Hg: 'Mercúrio', Sn: 'Estanho', Sb: 'Antimônio', Na: 'Sódio',
    K: 'Potássio', S: 'Enxofre', Cu: 'Cobre', At: 'Astato', Pa: 'Protactínio', Np: 'Netúnio', Bk: 'Berquélio',
    Es: 'Einstênio', Lr: 'Laurêncio', Rf: 'Rutherfórdio', Db: 'Dúbnio', Sg: 'Seabórgio', Bh: 'Bóhrio', Hs: 'Hássio',
    Mt: 'Meitnério', Ds: 'Darmstádtio', Rg: 'Roentgênio', Cn: 'Copernício',
  };
  for (const [symbol, name] of Object.entries(expected)) assert.equal(el(symbol).name, name, symbol);
});

test('posições coerentes com a tabela padrão', () => {
  // Período pelo último elemento de cada linha; grupo calculado à parte, sem olhar os dados.
  const periodOf = (z) => [2, 10, 18, 36, 54, 86, 118].findIndex((last) => z <= last) + 1;
  const groupOf = (z) => {
    const p = periodOf(z);
    const start = [1, 3, 11, 19, 37, 55, 87][p - 1];
    const k = z - start; // posição dentro do período
    if (p === 1) return z === 1 ? 1 : 18;
    if (p <= 3) return k < 2 ? k + 1 : k + 11;
    if (p <= 5) return k + 1;
    if (k < 2) return k + 1;
    if (k < 17) return null; // série f (lantanídeos ou actinídeos)
    return k - 13;
  };
  for (const e of ELEMENTS) {
    assert.equal(e.period, periodOf(e.z), `${e.symbol}: período`);
    assert.equal(e.group, groupOf(e.z), `${e.symbol}: grupo`);
  }
  // Âncoras conhecidas.
  const anchors = { Fe: [4, 8], Au: [6, 11], Hf: [6, 4], Rf: [7, 4], Og: [7, 18], Fr: [7, 1], Hg: [6, 12], Tl: [6, 13], B: [2, 13] };
  for (const [s, [p, g]] of Object.entries(anchors)) assert.deepEqual([el(s).period, el(s).group], [p, g], s);
  // Grade: nenhuma casa ocupada duas vezes, 18 colunas, linhas f embaixo.
  const seen = new Set();
  for (const e of ELEMENTS) {
    const { row, col } = layoutPosition(e);
    assert.ok(col >= 1 && col <= 18 && row >= 1 && row <= 10 && row !== 8, `${e.symbol}: ${row},${col}`);
    const key = `${row},${col}`;
    assert.ok(!seen.has(key), `${e.symbol} repete a casa ${key}`);
    seen.add(key);
  }
  assert.deepEqual(layoutPosition(el('La')), { row: 9, col: 3 });
  assert.deepEqual(layoutPosition(el('Lu')), { row: 9, col: 17 });
  assert.deepEqual(layoutPosition(el('Ac')), { row: 10, col: 3 });
  assert.deepEqual(layoutPosition(el('Lr')), { row: 10, col: 17 });
  // Cada período tem 2, 8, 8, 18, 18, 32 e 32 elementos.
  const perPeriod = [1, 2, 3, 4, 5, 6, 7].map((p) => ELEMENTS.filter((e) => e.period === p).length);
  assert.deepEqual(perPeriod, [2, 8, 8, 18, 18, 32, 32]);
});

test('categorias válidas e coerentes com os grupos', () => {
  const ids = Object.keys(CATEGORIES);
  assert.equal(ids.length, 10);
  for (const e of ELEMENTS) assert.ok(ids.includes(e.category), `${e.symbol}: ${e.category}`);
  const count = (c) => ELEMENTS.filter((e) => e.category === c).map((e) => e.symbol);
  assert.deepEqual(count('alkali'), ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr']);
  assert.deepEqual(count('alkaline-earth'), ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra']);
  assert.deepEqual(count('noble-gas'), ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og']);
  assert.deepEqual(count('halogen'), ['F', 'Cl', 'Br', 'I', 'At', 'Ts']);
  assert.deepEqual(count('nonmetal'), ['H', 'C', 'N', 'O', 'P', 'S', 'Se']);
  assert.deepEqual(count('metalloid'), ['B', 'Si', 'Ge', 'As', 'Sb', 'Te', 'Po']);
  assert.equal(count('lanthanide').length, 15);
  assert.equal(count('lanthanide')[0], 'La');
  assert.equal(count('lanthanide')[14], 'Lu');
  assert.equal(count('actinide').length, 15);
  assert.equal(count('actinide')[0], 'Ac');
  assert.equal(count('actinide')[14], 'Lr');
  for (const e of ELEMENTS) {
    if (e.category === 'noble-gas') assert.equal(e.group, 18, `${e.symbol} é gás nobre e está no grupo 18`);
    if (e.group === 18) assert.equal(e.category, 'noble-gas', `${e.symbol}: grupo 18 é de gases nobres`);
    if (e.category === 'halogen') assert.equal(e.group, 17);
    if (e.group === 17) assert.equal(e.category, 'halogen');
    if (e.category === 'alkali') assert.equal(e.group, 1);
    if (e.group === 1 && e.symbol !== 'H') assert.equal(e.category, 'alkali');
    if (e.category === 'alkaline-earth') assert.equal(e.group, 2);
    if (e.category === 'transition') assert.ok(e.group >= 3 && e.group <= 12, e.symbol);
    if (e.category === 'lanthanide' || e.category === 'actinide') assert.equal(e.group, null);
  }
});

test('estado físico a 25 °C: só Br e Hg são líquidos; gases são H, N, O, F, Cl e os gases nobres conhecidos', () => {
  const liquids = ELEMENTS.filter((e) => e.state === 'liquid').map((e) => e.symbol);
  assert.deepEqual(liquids, ['Br', 'Hg']);
  const gases = ELEMENTS.filter((e) => e.state === 'gas').map((e) => e.symbol);
  assert.deepEqual(gases, ['H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn']);
  for (const e of ELEMENTS) {
    assert.ok(['solid', 'liquid', 'gas', null].includes(e.state));
    if (e.z >= 100) assert.equal(e.state, null, `${e.symbol}: estado não determinado`);
    if (e.z < 100) assert.notEqual(e.state, null, `${e.symbol}: estado conhecido`);
  }
  assert.equal(el('Og').state, null, 'o oganessônio não foi observado em quantidade suficiente');
  assert.ok(Object.keys(STATES).includes('unknown'));
});

test('massa atômica: peso padrão abreviado da IUPAC ou [número de massa]', () => {
  const standard = ELEMENTS.filter((e) => e.weight !== null);
  assert.equal(standard.length, 84);
  for (const e of ELEMENTS) {
    if (e.weight !== null) {
      assert.match(e.weight, /^\d{1,3}\.\d{1,4}$/, e.symbol);
      assert.equal(e.massNumber, undefined);
    } else {
      assert.ok(Number.isInteger(e.massNumber) && e.massNumber > e.z, `${e.symbol}: número de massa`);
      assert.equal(typeof e.halfLife, 'string');
    }
  }
  const values = { H: '1.0080', He: '4.0026', Li: '6.94', C: '12.011', O: '15.999', Na: '22.990', Cl: '35.45', Ar: '39.95',
    Fe: '55.845', Cu: '63.546', Zr: '91.222', Ag: '107.87', Au: '196.97', Hg: '200.59', Pb: '207.2', Th: '232.04', Pa: '231.04', U: '238.03' };
  for (const [s, w] of Object.entries(values)) assert.equal(el(s).weight, w, s);
  const masses = { Tc: 97, Pm: 145, Po: 209, At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Np: 237, Pu: 244, Am: 243,
    Cm: 247, Bk: 247, Cf: 251, Es: 252, Fm: 257, Md: 258, No: 259, Lr: 266, Rf: 267, Db: 268, Og: 294 };
  for (const [s, mass] of Object.entries(masses)) assert.equal(el(s).massNumber, mass, s);
  assert.deepEqual(el('Tc').alternatives, [{ massNumber: 98, halfLife: '4,2 milhões de anos' }]);
  assert.equal(formatMass(el('Fe')), '55,845');
  assert.equal(formatMass(el('Tc')), '[97]');
  // A massa cresce com Z, com as quatro inversões clássicas.
  const inversions = [];
  for (let i = 0; i + 1 < ELEMENTS.length; i++) {
    const a = ELEMENTS[i];
    const b = ELEMENTS[i + 1];
    if (a.weight && b.weight && Number(a.weight) > Number(b.weight)) inversions.push(`${a.symbol}>${b.symbol}`);
  }
  assert.deepEqual(inversions, ['Ar>K', 'Co>Ni', 'Te>I', 'Th>Pa']);
});

test('configurações: o total de elétrons é igual ao número atômico', () => {
  for (const e of ELEMENTS) {
    assert.equal(electronCount(e.config), e.z, `${e.symbol}: ${e.config}`);
    const tokens = e.config.split(' ').filter((t) => !t.startsWith('['));
    const order = tokens.map((t) => Number(t[0]) * 10 + 'spdf'.indexOf(t[1]));
    assert.deepEqual(order, [...order].sort((a, b) => a - b), `${e.symbol}: subníveis em ordem de camada`);
  }
  assert.throws(() => parseConfig('[Zz] 1s2'), /Núcleo/);
  assert.throws(() => parseConfig('2d1'), /impossível/);
  assert.throws(() => parseConfig('3p7'), /demais/);
  assert.throws(() => parseConfig('1s2 1s2'), /repetido/);
});

test('exceções reais à regra de Madelung', () => {
  const exceptions = ELEMENTS.filter(isException).map((e) => e.symbol);
  assert.deepEqual(exceptions, ['Cr', 'Cu', 'Nb', 'Mo', 'Ru', 'Rh', 'Pd', 'Ag', 'La', 'Ce', 'Gd', 'Pt', 'Au', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Cm', 'Lr']);
  const expected = {
    Cr: ['[Ar] 3d5 4s1', '[Ar] 3d4 4s2'],
    Cu: ['[Ar] 3d10 4s1', '[Ar] 3d9 4s2'],
    Pd: ['[Kr] 4d10', '[Kr] 4d8 5s2'],
    La: ['[Xe] 5d1 6s2', '[Xe] 4f1 6s2'],
    Gd: ['[Xe] 4f7 5d1 6s2', '[Xe] 4f8 6s2'],
    Pt: ['[Xe] 4f14 5d9 6s1', '[Xe] 4f14 5d8 6s2'],
    Th: ['[Rn] 6d2 7s2', '[Rn] 5f2 7s2'],
    Lr: ['[Rn] 5f14 7s2 7p1', '[Rn] 5f14 6d1 7s2'],
  };
  for (const [s, [real, madelung]] of Object.entries(expected)) {
    assert.equal(el(s).config, real, s);
    assert.equal(expectedConfig(el(s)), madelung, s);
  }
  assert.equal(el('Ni').config, '[Ar] 3d8 4s2');
  assert.equal(isException(el('Fe')), false);
});

test('ordem de Madelung, distribuição em ordem de energia e camadas', () => {
  assert.deepEqual(MADELUNG_ORDER.slice(0, 19), ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p']);
  assert.equal(energyOrder(el('Fe').config), '1s2 2s2 2p6 3s2 3p6 4s2 3d6');
  assert.equal(energyOrder(el('Cr').config), '1s2 2s2 2p6 3s2 3p6 4s1 3d5');
  assert.deepEqual(shells(el('Fe').config), [2, 8, 14, 2]);
  assert.deepEqual(shells(el('Au').config), [2, 8, 18, 32, 18, 1]);
  assert.deepEqual(shells(el('Og').config), [2, 8, 18, 32, 32, 18, 8]);
  for (const e of ELEMENTS) {
    const s = shells(e.config);
    assert.equal(s.reduce((a, b) => a + b, 0), e.z);
    // O paládio ([Kr] 4d10) é o único sem elétron na camada do seu período.
    assert.equal(s.length, e.symbol === 'Pd' ? 4 : e.period, `${e.symbol}: número de camadas igual ao período`);
  }
  assert.equal(formatAbbreviated(madelungConfig(26)), '[Ar] 3d6 4s2');
  assert.equal(formatAbbreviated(madelungConfig(2)), '1s2');
  assert.equal(formatAbbreviated(madelungConfig(54)), '[Kr] 4d10 5s2 5p6');
});

test('busca por nome, símbolo ou número, sem acentos', () => {
  assert.equal(normalize('Nitrogênio'), 'nitrogenio');
  assert.equal(normalize('  ÓSMIO '), 'osmio');
  assert.deepEqual(searchElements('nitrogenio').map((e) => e.symbol), ['N']);
  assert.deepEqual(searchElements('FÓSFORO').map((e) => e.symbol), ['P']);
  assert.equal(searchElements('Fe')[0].symbol, 'Fe', 'símbolo exato primeiro');
  assert.equal(searchElements('26')[0].name, 'Ferro');
  assert.deepEqual(searchElements('119'), []);
  assert.equal(searchElements('tung')[0].symbol, 'W');
  assert.equal(searchElements('oganess')[0].symbol, 'Og');
  assert.equal(searchElements('criptonio')[0].symbol, 'Kr');
  assert.ok(searchElements('io').length > 50);
  assert.deepEqual(searchElements('   '), []);
  assert.deepEqual(searchElements('xyz'), []);
});

test('filtros por categoria e estado', () => {
  const gases = ELEMENTS.filter((e) => matchesFilters(e, { state: 'gas' }));
  assert.equal(gases.length, 11);
  const nobleGases = ELEMENTS.filter((e) => matchesFilters(e, { category: 'noble-gas', state: 'gas' }));
  assert.deepEqual(nobleGases.map((e) => e.symbol), ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn']);
  assert.equal(ELEMENTS.filter((e) => matchesFilters(e, { state: 'unknown' })).length, 19);
  assert.equal(ELEMENTS.filter((e) => matchesFilters(e, {})).length, 118);
});

test('quiz do símbolo: uma resposta certa entre quatro opções distintas', () => {
  const rng = seededRandom(42);
  let previous = null;
  for (let i = 0; i < 500; i++) {
    const mode = i % 2 ? 'name' : 'symbol';
    const maxZ = [20, 36, 86, 118][i % 4];
    const q = makeQuizQuestion({ mode, maxZ, rng, previous });
    assert.notEqual(q.z, previous);
    assert.ok(q.z <= maxZ);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.equal(q.options.filter((o) => o === q.answer).length, 1);
    const e = byNumber(q.z);
    assert.equal(q.prompt, mode === 'name' ? e.name : e.symbol);
    assert.equal(q.answer, mode === 'name' ? e.symbol : e.name);
    for (const o of q.options) {
      const other = mode === 'name' ? bySymbol(o) : ELEMENTS.find((x) => x.name === o);
      assert.ok(other && other.z <= maxZ);
    }
    previous = q.z;
  }
});
