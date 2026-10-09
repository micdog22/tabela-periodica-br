/**
 * Dados dos 118 elementos, em português do Brasil.
 *
 * Fontes:
 *   - Massa atômica: pesos atômicos padrão abreviados da IUPAC (CIAAW, 2024),
 *     com cinco algarismos significativos quando a variação natural permite.
 *   - Elementos sem peso atômico padrão: número de massa do isótopo mais
 *     estável conhecido e sua meia-vida, segundo a CIAAW a partir da avaliação
 *     NUBASE2020. Quando a CIAAW lista mais de um candidato (as medidas ainda
 *     têm grande incerteza), o primeiro é o de maior meia-vida nominal e os
 *     outros vão em `alternatives`.
 *   - Configuração eletrônica: estado fundamental do átomo neutro em fase
 *     gasosa (dados de espectroscopia; de Rf em diante, cálculos teóricos).
 *   - Estado físico a 25 °C e 1 atm. Do férmio em diante só foram produzidos
 *     poucos átomos, então o estado fica como não determinado (null).
 *
 * Campos: z, symbol, name, weight (texto com ponto decimal, ou null),
 * massNumber e halfLife (só sem peso padrão), category, period, group (null
 * para lantanídeos e actinídeos, que ficam nas linhas de baixo), state
 * ('solid' | 'liquid' | 'gas' | null), config (abreviada, subníveis em ordem
 * de camada), predicted (propriedades apenas previstas) e notes.
 */

export const CATEGORIES = {
  'alkali': 'Metal alcalino',
  'alkaline-earth': 'Metal alcalinoterroso',
  'transition': 'Metal de transição',
  'lanthanide': 'Lantanídeo',
  'actinide': 'Actinídeo',
  'post-transition': 'Metal pós-transição',
  'metalloid': 'Semimetal',
  'nonmetal': 'Não metal',
  'halogen': 'Halogênio',
  'noble-gas': 'Gás nobre',
};

export const STATES = {
  solid: 'Sólido',
  liquid: 'Líquido',
  gas: 'Gasoso',
  unknown: 'Não determinado',
};

export const ELEMENTS = [
  { z: 1, symbol: 'H', name: 'Hidrogênio', weight: '1.0080', category: 'nonmetal', period: 1, group: 1, state: 'gas', config: '1s1', notes: ['Fica no grupo 1 pela configuração (1s1), mas é um não metal, não um metal alcalino.'] },
  { z: 2, symbol: 'He', name: 'Hélio', weight: '4.0026', category: 'noble-gas', period: 1, group: 18, state: 'gas', config: '1s2', notes: ['Tem configuração 1s2, como os elementos do grupo 2, mas fica no grupo 18 por ser um gás nobre.'] },
  { z: 3, symbol: 'Li', name: 'Lítio', weight: '6.94', category: 'alkali', period: 2, group: 1, state: 'solid', config: '[He] 2s1' },
  { z: 4, symbol: 'Be', name: 'Berílio', weight: '9.0122', category: 'alkaline-earth', period: 2, group: 2, state: 'solid', config: '[He] 2s2' },
  { z: 5, symbol: 'B', name: 'Boro', weight: '10.81', category: 'metalloid', period: 2, group: 13, state: 'solid', config: '[He] 2s2 2p1' },
  { z: 6, symbol: 'C', name: 'Carbono', weight: '12.011', category: 'nonmetal', period: 2, group: 14, state: 'solid', config: '[He] 2s2 2p2' },
  { z: 7, symbol: 'N', name: 'Nitrogênio', weight: '14.007', category: 'nonmetal', period: 2, group: 15, state: 'gas', config: '[He] 2s2 2p3' },
  { z: 8, symbol: 'O', name: 'Oxigênio', weight: '15.999', category: 'nonmetal', period: 2, group: 16, state: 'gas', config: '[He] 2s2 2p4' },
  { z: 9, symbol: 'F', name: 'Flúor', weight: '18.998', category: 'halogen', period: 2, group: 17, state: 'gas', config: '[He] 2s2 2p5' },
  { z: 10, symbol: 'Ne', name: 'Neônio', weight: '20.180', category: 'noble-gas', period: 2, group: 18, state: 'gas', config: '[He] 2s2 2p6' },
  { z: 11, symbol: 'Na', name: 'Sódio', weight: '22.990', category: 'alkali', period: 3, group: 1, state: 'solid', config: '[Ne] 3s1' },
  { z: 12, symbol: 'Mg', name: 'Magnésio', weight: '24.305', category: 'alkaline-earth', period: 3, group: 2, state: 'solid', config: '[Ne] 3s2' },
  { z: 13, symbol: 'Al', name: 'Alumínio', weight: '26.982', category: 'post-transition', period: 3, group: 13, state: 'solid', config: '[Ne] 3s2 3p1' },
  { z: 14, symbol: 'Si', name: 'Silício', weight: '28.085', category: 'metalloid', period: 3, group: 14, state: 'solid', config: '[Ne] 3s2 3p2' },
  { z: 15, symbol: 'P', name: 'Fósforo', weight: '30.974', category: 'nonmetal', period: 3, group: 15, state: 'solid', config: '[Ne] 3s2 3p3' },
  { z: 16, symbol: 'S', name: 'Enxofre', weight: '32.06', category: 'nonmetal', period: 3, group: 16, state: 'solid', config: '[Ne] 3s2 3p4' },
  { z: 17, symbol: 'Cl', name: 'Cloro', weight: '35.45', category: 'halogen', period: 3, group: 17, state: 'gas', config: '[Ne] 3s2 3p5' },
  { z: 18, symbol: 'Ar', name: 'Argônio', weight: '39.95', category: 'noble-gas', period: 3, group: 18, state: 'gas', config: '[Ne] 3s2 3p6' },
  { z: 19, symbol: 'K', name: 'Potássio', weight: '39.098', category: 'alkali', period: 4, group: 1, state: 'solid', config: '[Ar] 4s1' },
  { z: 20, symbol: 'Ca', name: 'Cálcio', weight: '40.078', category: 'alkaline-earth', period: 4, group: 2, state: 'solid', config: '[Ar] 4s2' },
  { z: 21, symbol: 'Sc', name: 'Escândio', weight: '44.956', category: 'transition', period: 4, group: 3, state: 'solid', config: '[Ar] 3d1 4s2' },
  { z: 22, symbol: 'Ti', name: 'Titânio', weight: '47.867', category: 'transition', period: 4, group: 4, state: 'solid', config: '[Ar] 3d2 4s2' },
  { z: 23, symbol: 'V', name: 'Vanádio', weight: '50.942', category: 'transition', period: 4, group: 5, state: 'solid', config: '[Ar] 3d3 4s2' },
  { z: 24, symbol: 'Cr', name: 'Cromo', weight: '51.996', category: 'transition', period: 4, group: 6, state: 'solid', config: '[Ar] 3d5 4s1' },
  { z: 25, symbol: 'Mn', name: 'Manganês', weight: '54.938', category: 'transition', period: 4, group: 7, state: 'solid', config: '[Ar] 3d5 4s2' },
  { z: 26, symbol: 'Fe', name: 'Ferro', weight: '55.845', category: 'transition', period: 4, group: 8, state: 'solid', config: '[Ar] 3d6 4s2' },
  { z: 27, symbol: 'Co', name: 'Cobalto', weight: '58.933', category: 'transition', period: 4, group: 9, state: 'solid', config: '[Ar] 3d7 4s2' },
  { z: 28, symbol: 'Ni', name: 'Níquel', weight: '58.693', category: 'transition', period: 4, group: 10, state: 'solid', config: '[Ar] 3d8 4s2' },
  { z: 29, symbol: 'Cu', name: 'Cobre', weight: '63.546', category: 'transition', period: 4, group: 11, state: 'solid', config: '[Ar] 3d10 4s1' },
  { z: 30, symbol: 'Zn', name: 'Zinco', weight: '65.38', category: 'transition', period: 4, group: 12, state: 'solid', config: '[Ar] 3d10 4s2' },
  { z: 31, symbol: 'Ga', name: 'Gálio', weight: '69.723', category: 'post-transition', period: 4, group: 13, state: 'solid', config: '[Ar] 3d10 4s2 4p1', notes: ['Funde a 29,8 °C: derrete na palma da mão.'] },
  { z: 32, symbol: 'Ge', name: 'Germânio', weight: '72.630', category: 'metalloid', period: 4, group: 14, state: 'solid', config: '[Ar] 3d10 4s2 4p2' },
  { z: 33, symbol: 'As', name: 'Arsênio', weight: '74.922', category: 'metalloid', period: 4, group: 15, state: 'solid', config: '[Ar] 3d10 4s2 4p3' },
  { z: 34, symbol: 'Se', name: 'Selênio', weight: '78.971', category: 'nonmetal', period: 4, group: 16, state: 'solid', config: '[Ar] 3d10 4s2 4p4' },
  { z: 35, symbol: 'Br', name: 'Bromo', weight: '79.904', category: 'halogen', period: 4, group: 17, state: 'liquid', config: '[Ar] 3d10 4s2 4p5', notes: ['Único não metal líquido a 25 °C.'] },
  { z: 36, symbol: 'Kr', name: 'Criptônio', weight: '83.798', category: 'noble-gas', period: 4, group: 18, state: 'gas', config: '[Ar] 3d10 4s2 4p6' },
  { z: 37, symbol: 'Rb', name: 'Rubídio', weight: '85.468', category: 'alkali', period: 5, group: 1, state: 'solid', config: '[Kr] 5s1' },
  { z: 38, symbol: 'Sr', name: 'Estrôncio', weight: '87.62', category: 'alkaline-earth', period: 5, group: 2, state: 'solid', config: '[Kr] 5s2' },
  { z: 39, symbol: 'Y', name: 'Ítrio', weight: '88.906', category: 'transition', period: 5, group: 3, state: 'solid', config: '[Kr] 4d1 5s2' },
  { z: 40, symbol: 'Zr', name: 'Zircônio', weight: '91.222', category: 'transition', period: 5, group: 4, state: 'solid', config: '[Kr] 4d2 5s2' },
  { z: 41, symbol: 'Nb', name: 'Nióbio', weight: '92.906', category: 'transition', period: 5, group: 5, state: 'solid', config: '[Kr] 4d4 5s1' },
  { z: 42, symbol: 'Mo', name: 'Molibdênio', weight: '95.95', category: 'transition', period: 5, group: 6, state: 'solid', config: '[Kr] 4d5 5s1' },
  { z: 43, symbol: 'Tc', name: 'Tecnécio', weight: null, category: 'transition', period: 5, group: 7, state: 'solid', config: '[Kr] 4d5 5s2', massNumber: 97, halfLife: '4,21 milhões de anos', alternatives: [{ massNumber: 98, halfLife: '4,2 milhões de anos' }], notes: ['Elemento mais leve sem nenhum isótopo estável.'] },
  { z: 44, symbol: 'Ru', name: 'Rutênio', weight: '101.07', category: 'transition', period: 5, group: 8, state: 'solid', config: '[Kr] 4d7 5s1' },
  { z: 45, symbol: 'Rh', name: 'Ródio', weight: '102.91', category: 'transition', period: 5, group: 9, state: 'solid', config: '[Kr] 4d8 5s1' },
  { z: 46, symbol: 'Pd', name: 'Paládio', weight: '106.42', category: 'transition', period: 5, group: 10, state: 'solid', config: '[Kr] 4d10' },
  { z: 47, symbol: 'Ag', name: 'Prata', weight: '107.87', category: 'transition', period: 5, group: 11, state: 'solid', config: '[Kr] 4d10 5s1' },
  { z: 48, symbol: 'Cd', name: 'Cádmio', weight: '112.41', category: 'transition', period: 5, group: 12, state: 'solid', config: '[Kr] 4d10 5s2' },
  { z: 49, symbol: 'In', name: 'Índio', weight: '114.82', category: 'post-transition', period: 5, group: 13, state: 'solid', config: '[Kr] 4d10 5s2 5p1' },
  { z: 50, symbol: 'Sn', name: 'Estanho', weight: '118.71', category: 'post-transition', period: 5, group: 14, state: 'solid', config: '[Kr] 4d10 5s2 5p2' },
  { z: 51, symbol: 'Sb', name: 'Antimônio', weight: '121.76', category: 'metalloid', period: 5, group: 15, state: 'solid', config: '[Kr] 4d10 5s2 5p3' },
  { z: 52, symbol: 'Te', name: 'Telúrio', weight: '127.60', category: 'metalloid', period: 5, group: 16, state: 'solid', config: '[Kr] 4d10 5s2 5p4' },
  { z: 53, symbol: 'I', name: 'Iodo', weight: '126.90', category: 'halogen', period: 5, group: 17, state: 'solid', config: '[Kr] 4d10 5s2 5p5' },
  { z: 54, symbol: 'Xe', name: 'Xenônio', weight: '131.29', category: 'noble-gas', period: 5, group: 18, state: 'gas', config: '[Kr] 4d10 5s2 5p6' },
  { z: 55, symbol: 'Cs', name: 'Césio', weight: '132.91', category: 'alkali', period: 6, group: 1, state: 'solid', config: '[Xe] 6s1', notes: ['Funde a 28,4 °C, pouco acima da temperatura ambiente.'] },
  { z: 56, symbol: 'Ba', name: 'Bário', weight: '137.33', category: 'alkaline-earth', period: 6, group: 2, state: 'solid', config: '[Xe] 6s2' },
  { z: 57, symbol: 'La', name: 'Lantânio', weight: '138.91', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 5d1 6s2' },
  { z: 58, symbol: 'Ce', name: 'Cério', weight: '140.12', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f1 5d1 6s2' },
  { z: 59, symbol: 'Pr', name: 'Praseodímio', weight: '140.91', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f3 6s2' },
  { z: 60, symbol: 'Nd', name: 'Neodímio', weight: '144.24', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f4 6s2' },
  { z: 61, symbol: 'Pm', name: 'Promécio', weight: null, category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f5 6s2', massNumber: 145, halfLife: '17,7 anos', notes: ['Único lantanídeo sem isótopo estável.'] },
  { z: 62, symbol: 'Sm', name: 'Samário', weight: '150.36', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f6 6s2' },
  { z: 63, symbol: 'Eu', name: 'Európio', weight: '151.96', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f7 6s2' },
  { z: 64, symbol: 'Gd', name: 'Gadolínio', weight: '157.25', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f7 5d1 6s2' },
  { z: 65, symbol: 'Tb', name: 'Térbio', weight: '158.93', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f9 6s2' },
  { z: 66, symbol: 'Dy', name: 'Disprósio', weight: '162.50', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f10 6s2' },
  { z: 67, symbol: 'Ho', name: 'Hólmio', weight: '164.93', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f11 6s2' },
  { z: 68, symbol: 'Er', name: 'Érbio', weight: '167.26', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f12 6s2' },
  { z: 69, symbol: 'Tm', name: 'Túlio', weight: '168.93', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f13 6s2' },
  { z: 70, symbol: 'Yb', name: 'Itérbio', weight: '173.05', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f14 6s2' },
  { z: 71, symbol: 'Lu', name: 'Lutécio', weight: '174.97', category: 'lanthanide', period: 6, group: null, state: 'solid', config: '[Xe] 4f14 5d1 6s2' },
  { z: 72, symbol: 'Hf', name: 'Háfnio', weight: '178.49', category: 'transition', period: 6, group: 4, state: 'solid', config: '[Xe] 4f14 5d2 6s2' },
  { z: 73, symbol: 'Ta', name: 'Tântalo', weight: '180.95', category: 'transition', period: 6, group: 5, state: 'solid', config: '[Xe] 4f14 5d3 6s2' },
  { z: 74, symbol: 'W', name: 'Tungstênio', weight: '183.84', category: 'transition', period: 6, group: 6, state: 'solid', config: '[Xe] 4f14 5d4 6s2' },
  { z: 75, symbol: 'Re', name: 'Rênio', weight: '186.21', category: 'transition', period: 6, group: 7, state: 'solid', config: '[Xe] 4f14 5d5 6s2' },
  { z: 76, symbol: 'Os', name: 'Ósmio', weight: '190.23', category: 'transition', period: 6, group: 8, state: 'solid', config: '[Xe] 4f14 5d6 6s2' },
  { z: 77, symbol: 'Ir', name: 'Irídio', weight: '192.22', category: 'transition', period: 6, group: 9, state: 'solid', config: '[Xe] 4f14 5d7 6s2' },
  { z: 78, symbol: 'Pt', name: 'Platina', weight: '195.08', category: 'transition', period: 6, group: 10, state: 'solid', config: '[Xe] 4f14 5d9 6s1' },
  { z: 79, symbol: 'Au', name: 'Ouro', weight: '196.97', category: 'transition', period: 6, group: 11, state: 'solid', config: '[Xe] 4f14 5d10 6s1' },
  { z: 80, symbol: 'Hg', name: 'Mercúrio', weight: '200.59', category: 'transition', period: 6, group: 12, state: 'liquid', config: '[Xe] 4f14 5d10 6s2', notes: ['Único metal líquido a 25 °C.'] },
  { z: 81, symbol: 'Tl', name: 'Tálio', weight: '204.38', category: 'post-transition', period: 6, group: 13, state: 'solid', config: '[Xe] 4f14 5d10 6s2 6p1' },
  { z: 82, symbol: 'Pb', name: 'Chumbo', weight: '207.2', category: 'post-transition', period: 6, group: 14, state: 'solid', config: '[Xe] 4f14 5d10 6s2 6p2' },
  { z: 83, symbol: 'Bi', name: 'Bismuto', weight: '208.98', category: 'post-transition', period: 6, group: 15, state: 'solid', config: '[Xe] 4f14 5d10 6s2 6p3' },
  { z: 84, symbol: 'Po', name: 'Polônio', weight: null, category: 'metalloid', period: 6, group: 16, state: 'solid', config: '[Xe] 4f14 5d10 6s2 6p4', massNumber: 209, halfLife: '124 anos', notes: ['Classificado como semimetal em boa parte das tabelas; algumas o tratam como metal pós-transição.'] },
  { z: 85, symbol: 'At', name: 'Astato', weight: null, category: 'halogen', period: 6, group: 17, state: 'solid', config: '[Xe] 4f14 5d10 6s2 6p5', massNumber: 210, halfLife: '8,1 horas', notes: ['Nunca foi visto em quantidade visível: o estado sólido é uma previsão. Propriedades pouco conhecidas.'] },
  { z: 86, symbol: 'Rn', name: 'Radônio', weight: null, category: 'noble-gas', period: 6, group: 18, state: 'gas', config: '[Xe] 4f14 5d10 6s2 6p6', massNumber: 222, halfLife: '3,82 dias' },
  { z: 87, symbol: 'Fr', name: 'Frâncio', weight: null, category: 'alkali', period: 7, group: 1, state: 'solid', config: '[Rn] 7s1', massNumber: 223, halfLife: '22,0 minutos', notes: ['Nunca foi visto em quantidade visível. O ponto de fusão estimado fica perto de 27 °C, então o estado sólido a 25 °C é uma estimativa.'] },
  { z: 88, symbol: 'Ra', name: 'Rádio', weight: null, category: 'alkaline-earth', period: 7, group: 2, state: 'solid', config: '[Rn] 7s2', massNumber: 226, halfLife: '1600 anos' },
  { z: 89, symbol: 'Ac', name: 'Actínio', weight: null, category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 6d1 7s2', massNumber: 227, halfLife: '21,77 anos' },
  { z: 90, symbol: 'Th', name: 'Tório', weight: '232.04', category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 6d2 7s2' },
  { z: 91, symbol: 'Pa', name: 'Protactínio', weight: '231.04', category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 5f2 6d1 7s2' },
  { z: 92, symbol: 'U', name: 'Urânio', weight: '238.03', category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 5f3 6d1 7s2' },
  { z: 93, symbol: 'Np', name: 'Netúnio', weight: null, category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 5f4 6d1 7s2', massNumber: 237, halfLife: '2,14 milhões de anos' },
  { z: 94, symbol: 'Pu', name: 'Plutônio', weight: null, category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 5f6 7s2', massNumber: 244, halfLife: '81,3 milhões de anos' },
  { z: 95, symbol: 'Am', name: 'Amerício', weight: null, category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 5f7 7s2', massNumber: 243, halfLife: '7350 anos' },
  { z: 96, symbol: 'Cm', name: 'Cúrio', weight: null, category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 5f7 6d1 7s2', massNumber: 247, halfLife: '15,6 milhões de anos' },
  { z: 97, symbol: 'Bk', name: 'Berquélio', weight: null, category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 5f9 7s2', massNumber: 247, halfLife: '1380 anos' },
  { z: 98, symbol: 'Cf', name: 'Califórnio', weight: null, category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 5f10 7s2', massNumber: 251, halfLife: '898 anos' },
  { z: 99, symbol: 'Es', name: 'Einstênio', weight: null, category: 'actinide', period: 7, group: null, state: 'solid', config: '[Rn] 5f11 7s2', massNumber: 252, halfLife: '471,7 dias' },
  { z: 100, symbol: 'Fm', name: 'Férmio', weight: null, category: 'actinide', period: 7, group: null, state: null, config: '[Rn] 5f12 7s2', massNumber: 257, halfLife: '100,5 dias' },
  { z: 101, symbol: 'Md', name: 'Mendelévio', weight: null, category: 'actinide', period: 7, group: null, state: null, config: '[Rn] 5f13 7s2', massNumber: 258, halfLife: '51,6 dias' },
  { z: 102, symbol: 'No', name: 'Nobélio', weight: null, category: 'actinide', period: 7, group: null, state: null, config: '[Rn] 5f14 7s2', massNumber: 259, halfLife: '58 minutos' },
  { z: 103, symbol: 'Lr', name: 'Laurêncio', weight: null, category: 'actinide', period: 7, group: null, state: null, config: '[Rn] 5f14 7s2 7p1', massNumber: 266, halfLife: '22 horas', alternatives: [{ massNumber: 262, halfLife: 'cerca de 4 horas' }], notes: ['A configuração com 7p1 (em vez de 6d1) vem de cálculos relativísticos e é compatível com a energia de ionização medida em 2015.'] },
  { z: 104, symbol: 'Rf', name: 'Rutherfórdio', weight: null, category: 'transition', period: 7, group: 4, state: null, config: '[Rn] 5f14 6d2 7s2', massNumber: 267, halfLife: '2,5 horas', predicted: true },
  { z: 105, symbol: 'Db', name: 'Dúbnio', weight: null, category: 'transition', period: 7, group: 5, state: null, config: '[Rn] 5f14 6d3 7s2', massNumber: 268, halfLife: '29 horas', predicted: true },
  { z: 106, symbol: 'Sg', name: 'Seabórgio', weight: null, category: 'transition', period: 7, group: 6, state: null, config: '[Rn] 5f14 6d4 7s2', massNumber: 269, halfLife: '5 minutos', alternatives: [{ massNumber: 271, halfLife: '2,2 minutos' }], predicted: true },
  { z: 107, symbol: 'Bh', name: 'Bóhrio', weight: null, category: 'transition', period: 7, group: 7, state: null, config: '[Rn] 5f14 6d5 7s2', massNumber: 270, halfLife: '3,8 minutos', alternatives: [{ massNumber: 274, halfLife: '57 segundos' }], predicted: true },
  { z: 108, symbol: 'Hs', name: 'Hássio', weight: null, category: 'transition', period: 7, group: 8, state: null, config: '[Rn] 5f14 6d6 7s2', massNumber: 269, halfLife: '15 segundos', alternatives: [{ massNumber: 270, halfLife: '9 segundos' }], predicted: true },
  { z: 109, symbol: 'Mt', name: 'Meitnério', weight: null, category: 'transition', period: 7, group: 9, state: null, config: '[Rn] 5f14 6d7 7s2', massNumber: 277, halfLife: '9 segundos', alternatives: [{ massNumber: 278, halfLife: '6 segundos' }], predicted: true },
  { z: 110, symbol: 'Ds', name: 'Darmstádtio', weight: null, category: 'transition', period: 7, group: 10, state: null, config: '[Rn] 5f14 6d8 7s2', massNumber: 281, halfLife: '14 segundos', predicted: true },
  { z: 111, symbol: 'Rg', name: 'Roentgênio', weight: null, category: 'transition', period: 7, group: 11, state: null, config: '[Rn] 5f14 6d9 7s2', massNumber: 282, halfLife: '130 segundos', predicted: true },
  { z: 112, symbol: 'Cn', name: 'Copernício', weight: null, category: 'transition', period: 7, group: 12, state: null, config: '[Rn] 5f14 6d10 7s2', massNumber: 285, halfLife: '30 segundos', predicted: true },
  { z: 113, symbol: 'Nh', name: 'Nihônio', weight: null, category: 'post-transition', period: 7, group: 13, state: null, config: '[Rn] 5f14 6d10 7s2 7p1', massNumber: 286, halfLife: '12 segundos', alternatives: [{ massNumber: 285, halfLife: '4,6 segundos' }], predicted: true },
  { z: 114, symbol: 'Fl', name: 'Fleróvio', weight: null, category: 'post-transition', period: 7, group: 14, state: null, config: '[Rn] 5f14 6d10 7s2 7p2', massNumber: 290, halfLife: '80 segundos', alternatives: [{ massNumber: 289, halfLife: '2,1 segundos' }], predicted: true },
  { z: 115, symbol: 'Mc', name: 'Moscóvio', weight: null, category: 'post-transition', period: 7, group: 15, state: null, config: '[Rn] 5f14 6d10 7s2 7p3', massNumber: 290, halfLife: '840 milissegundos', alternatives: [{ massNumber: 289, halfLife: '410 milissegundos' }, { massNumber: 288, halfLife: '177 milissegundos' }], predicted: true },
  { z: 116, symbol: 'Lv', name: 'Livermório', weight: null, category: 'post-transition', period: 7, group: 16, state: null, config: '[Rn] 5f14 6d10 7s2 7p4', massNumber: 293, halfLife: '70 milissegundos', alternatives: [{ massNumber: 291, halfLife: '26 milissegundos' }, { massNumber: 292, halfLife: '16 milissegundos' }], predicted: true },
  { z: 117, symbol: 'Ts', name: 'Tenesso', weight: null, category: 'halogen', period: 7, group: 17, state: null, config: '[Rn] 5f14 6d10 7s2 7p5', massNumber: 294, halfLife: '70 milissegundos', predicted: true, notes: ['Fica no grupo 17, mas suas propriedades são apenas previstas.'] },
  { z: 118, symbol: 'Og', name: 'Oganessônio', weight: null, category: 'noble-gas', period: 7, group: 18, state: null, config: '[Rn] 5f14 6d10 7s2 7p6', massNumber: 294, halfLife: '0,7 milissegundo', predicted: true, notes: ['Fica no grupo 18, mas só alguns átomos foram produzidos; cálculos indicam que pode ser sólido e pouco parecido com os outros gases nobres.'] },
];

const BY_Z = new Map(ELEMENTS.map((e) => [e.z, e]));
const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol.toLowerCase(), e]));

export function byNumber(z) {
  return BY_Z.get(Number(z)) || null;
}

export function bySymbol(symbol) {
  return BY_SYMBOL.get(String(symbol).toLowerCase()) || null;
}

/**
 * Posição na tabela clássica (linha e coluna de uma grade de 18 colunas).
 * Períodos 1 a 7 nas linhas 1 a 7; lantanídeos na linha 9 e actinídeos na
 * linha 10, das colunas 3 a 17, abaixo do espaço reservado no grupo 3.
 */
export function layoutPosition(element) {
  if (element.group !== null) return { row: element.period, col: element.group };
  const first = element.category === 'lanthanide' ? 57 : 89;
  return { row: element.category === 'lanthanide' ? 9 : 10, col: 3 + element.z - first };
}
