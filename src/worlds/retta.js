import { rand, randNZ, pick, num, frac, poly, makeQuestion, MINUS, pt, shuffle, cx } from '../lib/utils.js';

const P = (x, y) => pt(num(x), num(y));
const SLOPES = [[1, 1], [2, 1], [3, 1], [2, 3], [1, 2], [3, 2], [-1, 1], [-2, 1], [-3, 1], [-2, 3], [-1, 2], [-3, 2]];
const mS = ([n, d]) => frac(n, d);
const line = (m, q) => `y = ${poly([[m, 'x'], [q, '']])}`;
const val = ([n, d]) => n / d;

// ---------- LIVELLO 1 ----------

function affermazioneCorretta() {
  const m = pick(SLOPES);
  const q = randNZ(-6, 6);
  let wrongY;
  do wrongY = randNZ(-6, 6);
  while (wrongY === q);
  const up = val(m) > 0;
  return makeQuestion({
    text: `Sia data la retta di equazione ${line(m, q)}. Individua l'affermazione corretta.`,
    correct: up ? 'La retta è crescente' : 'La retta è decrescente',
    wrong: [
      { text: `La retta passa per il punto P${P(0, wrongY)}`, why: `Per x = 0 si ottiene y = ${num(q)}: la retta passa per (0; ${num(q)}), non per (0; ${num(wrongY)}).` },
      { text: "La retta passa per l'origine", why: `Passa per l'origine solo se q = 0. Qui q = ${num(q)}.` },
      { text: "La retta è parallela all'asse delle ordinate", why: 'Le rette parallele all’asse y hanno equazione x = numero. Questa è y = mx + q.' },
      { text: up ? 'La retta è decrescente' : 'La retta è crescente', why: `m = ${mS(m)} è ${up ? 'positivo ⇒ crescente' : 'negativo ⇒ decrescente'}.` },
    ],
    solution: [`m = ${mS(m)}, q = ${num(q)}`, `m ${up ? '> 0 ⇒ crescente' : '< 0 ⇒ decrescente'}`, `Passa per (0; ${num(q)}), non per l'origine`],
  });
}

function affermazioneFalsa() {
  const m = randNZ(-4, 4);
  const q = randNZ(-6, 6);
  const S = [
    { T: `Il coefficiente angolare è ${num(m)}`, F: `Il coefficiente angolare è ${num(q)}`, wt: 'è il numero davanti a x', wf: `${num(q)} è il termine noto; il coefficiente angolare è ${num(m)}` },
    { T: `La retta passa per il punto (0; ${num(q)})`, F: "La retta passa per l'origine degli assi", wt: `per x = 0 si ottiene y = ${num(q)}`, wf: `per x = 0 si ha y = ${num(q)} ≠ 0` },
    { T: 'La retta interseca entrambi gli assi', F: "La retta è parallela all'asse x", wt: `taglia l'asse y in (0; ${num(q)}) e l'asse x in (${frac(-q, m)}; 0)`, wf: `ha m = ${num(m)} ≠ 0, quindi è inclinata` },
    { T: `La retta è ${m > 0 ? 'crescente' : 'decrescente'}`, F: `La retta è ${m > 0 ? 'decrescente' : 'crescente'}`, wt: `m = ${num(m)} è ${m > 0 ? 'positivo' : 'negativo'}`, wf: `m = ${num(m)} è ${m > 0 ? 'positivo ⇒ crescente' : 'negativo ⇒ decrescente'}` },
  ];
  const fi = rand(0, 3);
  return makeQuestion({
    text: `Considera la retta ${line(m, q)}. Fra le seguenti affermazioni, individua quella FALSA.`,
    correct: S[fi].F,
    wrong: S.filter((_, i) => i !== fi).map((x) => ({ text: x.T, why: `Questa è VERA: ${x.wt}. Cerchiamo quella falsa.` })),
    solution: [`L'affermazione falsa è “${S[fi].F}”: ${S[fi].wf}.`],
  });
}

// ---------- LIVELLO 2 ----------

function intersezioneX() {
  const m = randNZ(-4, 4);
  const q = randNZ(-8, 8);
  return makeQuestion({
    text: `Trova il punto di intersezione della retta ${line(m, q)} con l'asse x.`,
    correct: `(${frac(-q, m)}; 0)`,
    wrong: [
      { text: `(0; ${num(q)})`, why: "Questo è il punto sull'asse y (x = 0). Sull'asse x è y a valere 0." },
      { text: `(${frac(q, m)}; 0)`, why: `Errore di segno: ${poly([[m, 'x'], [q, '']])} = 0 ⇒ ${cx(m)} = ${num(-q)}.` },
      { text: `(${frac(-m, q)}; 0)`, why: `Hai capovolto: x = ${num(-q)} : (${num(m)}).` },
      { text: `(0; ${frac(-q, m)})`, why: 'Coordinate scambiate: il punto sull’asse x ha y = 0.' },
    ],
    solution: ["Sull'asse x: y = 0", `${poly([[m, 'x'], [q, '']])} = 0 ⇒ x = ${frac(-q, m)}`, `Punto: (${frac(-q, m)}; 0)`],
  });
}

function veraLineare() {
  const m = randNZ(-4, 4);
  const q = randNZ(-9, 9);
  let q2;
  do q2 = randNZ(-9, 9);
  while (q2 === q);
  return makeQuestion({
    text: `Considera la funzione lineare ${line(m, q)}. Quale affermazione è vera?`,
    correct: `Il coefficiente angolare della retta è ${num(m)}`,
    wrong: [
      { text: "La funzione passa per l'origine degli assi", why: `Per x = 0 si ottiene y = ${num(q)}, non 0.` },
      { text: 'La funzione è una retta scritta in forma implicita', why: 'È scritta in forma ESPLICITA (y = mx + q). La forma implicita è ax + by + c = 0.' },
      { text: `La funzione ${line(m, q2)} è perpendicolare alla retta iniziale`, why: `Ha lo stesso coefficiente angolare (${num(m)}): è PARALLELA, non perpendicolare.` },
      { text: `Il coefficiente angolare della retta è ${num(q)}`, why: `${num(q)} è il termine noto q, non il coefficiente angolare.` },
    ],
    solution: [`In y = mx + q il coefficiente angolare è il numero davanti a x: m = ${num(m)}`],
  });
}

function parPerp() {
  const m = pick(SLOPES);
  const q = randNZ(-5, 5);
  const q2 = randNZ(-5, 5);
  const askPerp = Math.random() < 0.5;
  const perp = [-m[1], m[0]];
  return makeQuestion({
    text: `Quale retta è ${askPerp ? 'PERPENDICOLARE' : 'PARALLELA'} a ${line(m, q)}?`,
    correct: askPerp ? line(perp, q2) : line(m, q2),
    wrong: askPerp
      ? [
          { text: line(m, q2), why: 'Stesso coefficiente angolare ⇒ parallela.' },
          { text: line([m[1], m[0]], q2), why: `Hai capovolto ma non cambiato segno: m⊥ = ${mS(perp)}.` },
          { text: line([-m[0], m[1]], q2), why: `Hai cambiato segno ma non capovolto: m⊥ = ${mS(perp)}.` },
        ]
      : [
          { text: line(perp, q2), why: 'Questa è perpendicolare (coefficiente antireciproco).' },
          { text: line([-m[0], m[1]], q2), why: 'Per essere parallele serve lo STESSO coefficiente angolare, segno compreso.' },
          { text: line([m[1], m[0]], q2), why: `Coefficiente diverso: serve m = ${mS(m)}.` },
        ],
    solution: askPerp ? [`Perpendicolare: m₂ = −1/m₁ = ${mS(perp)}`] : [`Parallela: stesso m = ${mS(m)}`],
  });
}

// ---------- LIVELLO 3: parallelogramma ----------

function parallelogrammaD() {
  const A = [rand(-4, 0), rand(-2, 2)];
  const B = [A[0] + rand(4, 7), A[1]];
  const C = [B[0] + randNZ(1, 3), B[1] + rand(2, 4)];
  const D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
  return makeQuestion({
    text: `Considera il quadrilatero ABCD con A${P(...A)}, B${P(...B)}, C${P(...C)}. Trova le coordinate di D affinché sia un parallelogramma.`,
    visual: { type: 'plot', xmin: Math.min(A[0], D[0], 0) - 2, xmax: Math.max(C[0], 0) + 2, ymin: Math.min(A[1], 0) - 2, ymax: Math.max(C[1], 0) + 2, points: [{ x: A[0], y: A[1], label: 'A' }, { x: B[0], y: B[1], label: 'B' }, { x: C[0], y: C[1], label: 'C' }], segments: [[A, B], [B, C]] },
    correct: `D${P(...D)}`,
    wrong: [
      [D[1], D[0]],
      [B[0] + C[0] - A[0], B[1] + C[1] - A[1]],
      [A[0] + B[0] - C[0], A[1] + B[1] - C[1]],
      [D[0], A[1]],
    ].map((p) => ({ text: `D${P(...p)}`, why: p[0] === D[1] && p[1] === D[0] ? 'Coordinate scambiate.' : `AD deve essere uguale e parallelo a BC: da B a C ci si sposta di ${num(C[0] - B[0])} in x e ${num(C[1] - B[1])} in y; da A, con lo stesso spostamento, si arriva in ${P(...D)}.` })),
    solution: [`Spostamento B → C: ${num(C[0] - B[0])} in x, ${num(C[1] - B[1])} in y`, `D = A + spostamento = ${P(...D)}`],
  });
}

function parallelogrammaFalsa() {
  const A = [rand(-4, 0), rand(-2, 2)];
  const B = [A[0] + rand(4, 7), A[1]];
  const C = [B[0] + randNZ(1, 3), B[1] + rand(2, 4)];
  const ab = B[0] - A[0];
  const S = [
    { t: `Il segmento AB misura ${ab} unità`, ok: true, w: `A e B hanno la stessa y: AB = ${num(B[0])} ${MINUS} (${num(A[0])}) = ${ab}` },
    { t: 'AC è una diagonale del parallelogramma', ok: true, w: 'A e C sono vertici opposti' },
    { t: "La retta AB è parallela all'asse x", ok: true, w: `A e B hanno la stessa ordinata (${num(A[1])})` },
    { t: 'BC è perpendicolare ad AB', ok: false, w: `AB è orizzontale, ma BC non è verticale (B e C hanno x diverse: ${num(B[0])} e ${num(C[0])})` },
  ];
  const F = S.find((s) => !s.ok);
  return makeQuestion({
    text: `Nel parallelogramma ABCD si ha A${P(...A)}, B${P(...B)}, C${P(...C)}. Individua l'affermazione FALSA.`,
    visual: { type: 'plot', xmin: Math.min(A[0], 0) - 2, xmax: Math.max(C[0], 0) + 2, ymin: Math.min(A[1], 0) - 2, ymax: Math.max(C[1], 0) + 2, points: [{ x: A[0], y: A[1], label: 'A' }, { x: B[0], y: B[1], label: 'B' }, { x: C[0], y: C[1], label: 'C' }], segments: [[A, B], [B, C]] },
    correct: F.t,
    wrong: S.filter((s) => s.ok).map((s) => ({ text: s.t, why: `È VERA: ${s.w}.` })),
    solution: [`Falsa: “${F.t}”, perché ${F.w}.`],
  });
}

export default {
  id: 'retta',
  title: 'Retta e piano cartesiano',
  icon: 'y=mx+q',
  color: '#16a34a',
  description: 'Coefficiente angolare, intersezioni, parallelogramma.',
  levels: [
    { id: 'r1', title: 'Leggere la retta', description: 'Crescente, origine, punti', pool: [affermazioneCorretta, affermazioneFalsa, veraLineare] },
    { id: 'r2', title: 'Intersezioni e rette', description: 'Asse x, parallele e perpendicolari', pool: [intersezioneX, intersezioneX, parPerp, veraLineare] },
    { id: 'r3', title: 'Come in verifica', description: 'Il parallelogramma', pool: [parallelogrammaD, parallelogrammaFalsa, affermazioneCorretta, affermazioneFalsa] },
  ],
};
