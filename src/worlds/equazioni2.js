import { rand, randNZ, pick, num, frac, poly, makeQuestion, MINUS, shuffle } from '../lib/utils.js';

const eq = (a, b, c) => `${poly([[a, 'x²'], [b, 'x'], [c, '']])} = 0`;
const sol = (x1, x2) => `x = ${x1} ; x = ${x2}`;

// ---------- LIVELLO 1: equazioni incomplete ----------

function pura() {
  const k = rand(1, 8);
  const a = pick([1, 2, 3, 4]);
  return makeQuestion({
    text: "Risolvi l'equazione pura:",
    formula: eq(a, 0, -a * k * k),
    correct: sol(`${MINUS}${k}`, k),
    wrong: [
      { text: `x = ${k}`, why: `Anche (${MINUS}${k})² = ${k * k}: le soluzioni sono due, +${k} e ${MINUS}${k}.` },
      { text: sol(`${MINUS}${k * k}`, k * k), why: `Ti sei fermato a x² = ${k * k}: devi fare la radice quadrata, √${k * k} = ${k}.` },
      { text: 'Impossibile', why: `x² = ${k * k} è positivo: le soluzioni esistono.` },
      { text: sol(0, k), why: 'x = 0 è soluzione solo delle equazioni spurie (senza termine noto).' },
    ],
    solution: [`${a === 1 ? '' : a}x² = ${a * k * k}`, a === 1 ? `x² = ${k * k}` : `Divido per ${a}: x² = ${k * k}`, `x = ±√${k * k} = ±${k}`],
  });
}

function spuria() {
  const a = pick([1, 1, 2, 3]);
  const b = randNZ(-9, 9);
  const r = frac(-b, a);
  return makeQuestion({
    text: "Risolvi l'equazione spuria:",
    formula: eq(a, b, 0),
    correct: sol(0, r),
    wrong: [
      { text: sol(0, frac(b, a)), why: `Errore di segno: da ${poly([[a, 'x'], [b, '']])} = 0 si ottiene x = ${r}.` },
      { text: `x = ${r}`, why: 'Hai perso x = 0: non si divide per x, si raccoglie!' },
      { text: 'x = 0', why: `Raccogliendo: x·(${poly([[a, 'x'], [b, '']])}) = 0. Anche il secondo fattore può essere zero.` },
    ],
    solution: [`Raccolgo x: x·(${poly([[a, 'x'], [b, '']])}) = 0`, 'Un prodotto è zero se almeno un fattore è zero', `x = 0  oppure  ${poly([[a, 'x'], [b, '']])} = 0 ⇒ x = ${r}`],
  });
}

function impossibile() {
  // 4 equazioni, una sola impossibile (come nella simulazione)
  const sp = [pick([2, 3, 5]), randNZ(-6, 6), 0];
  const pu = [pick([2, 3, 5]), 0, -rand(2, 12)];
  let r1, r2;
  do {
    r1 = randNZ(-6, 8);
    r2 = randNZ(-6, 8);
  } while (r1 === r2 || r1 === -r2);
  const co = [1, -(r1 + r2), r1 * r2];
  const b = rand(-4, 4) || 3;
  const im = [1, b, rand(Math.floor((b * b) / 4) + 1, Math.floor((b * b) / 4) + 8)];
  const D = ([a, bb, c]) => bb * bb - 4 * a * c;
  return makeQuestion({
    text: 'Una tra le seguenti equazioni di secondo grado è impossibile. Identificala.',
    correct: eq(...im),
    wrong: [
      { text: eq(...sp), why: 'È spuria: si raccoglie x e ha sempre la soluzione x = 0. Non è impossibile.' },
      { text: eq(...pu), why: `È pura con termine noto negativo: x² = ${frac(-pu[2], pu[0])}, che è positivo ⇒ due soluzioni.` },
      { text: eq(...co), why: `Δ = ${D(co)} > 0: ha due soluzioni (x = ${num(r1)} e x = ${num(r2)}).` },
    ],
    solution: ['Calcola Δ = b² − 4ac: è impossibile quella con Δ < 0', `${eq(...im)}: Δ = ${num(b * b)} ${MINUS} 4·${im[2]} = ${num(D(im))} < 0 ⇒ impossibile`],
  });
}

// ---------- LIVELLO 2: complete ----------

function completa() {
  let r1, r2;
  do {
    r1 = randNZ(-6, 8);
    r2 = randNZ(-6, 8);
  } while (r1 === r2 || r1 === -r2);
  if (r1 < r2) [r1, r2] = [r2, r1];
  const b = -(r1 + r2);
  const c = r1 * r2;
  const D = b * b - 4 * c;
  const s = Math.sqrt(D);
  const f = (x) => x * x + b * x + c;
  const why = (x1, x2) => `Verifica: sostituendo ${[x1, x2].filter((v) => f(v) !== 0).map((v) => `x = ${num(v)} ottieni ${num(f(v))}`).join(' e ')}, non 0.`;
  return makeQuestion({
    text: 'Trova le soluzioni dell’equazione:',
    formula: eq(1, b, c),
    correct: sol(num(r1), num(r2)),
    wrong: [
      { text: sol(num(r1), num(-r2)), why: why(r1, -r2) },
      { text: sol(num(-r1), num(-r2)), why: `${why(-r1, -r2)} Nella formula c'è ${MINUS}b = ${num(-b)}.` },
      { text: sol(num(-r1), num(r2)), why: why(-r1, r2) },
    ],
    solution: [`a = 1, b = ${num(b)}, c = ${num(c)}`, `Δ = (${num(b)})² ${MINUS} 4·1·(${num(c)}) = ${D} ⇒ √Δ = ${s}`, `x = (${num(-b)} ± ${s}) / 2`, `x₁ = ${num(r1)} ; x₂ = ${num(r2)}`],
  });
}

function delta() {
  const b = randNZ(-8, 8);
  const c = randNZ(-9, 9);
  const a = pick([1, 1, 2]);
  const D = b * b - 4 * a * c;
  return makeQuestion({
    text: 'Calcola il discriminante Δ = b² − 4ac:',
    formula: eq(a, b, c),
    correct: `Δ = ${num(D)}`,
    wrong: [
      { text: `Δ = ${num(b * b + 4 * a * c)}`, why: `Δ = b² ${MINUS} 4ac: qui 4ac = ${num(4 * a * c)} e va sottratto.` },
      { text: `Δ = ${num(-b * b - 4 * a * c)}`, why: `b² è sempre positivo: (${num(b)})² = ${b * b}.` },
      { text: `Δ = ${num(b - 4 * a * c)}`, why: 'Hai dimenticato di elevare b al quadrato.' },
      { text: `Δ = ${num(2 * b - 4 * a * c)}`, why: `b² è b·b, non 2·b.` },
    ],
    solution: [`a = ${a}, b = ${num(b)}, c = ${num(c)}`, `Δ = (${num(b)})² ${MINUS} 4·${a}·(${num(c)}) = ${num(D)}`],
  });
}

// ---------- LIVELLO 3: come in verifica ----------

function comune() {
  // a x² − a k² = 0  e  x² ± k x = 0  ⇒ soluzione comune ±k
  const k = rand(2, 6);
  const a = pick([1, 2, 3]);
  const s = pick([1, -1]);
  const common = -s * k; // x² + s·k·x = 0 ha soluzioni 0 e −s·k
  return makeQuestion({
    text: `Date le equazioni ${eq(a, 0, -a * k * k)}  e  ${eq(1, s * k, 0)}, individua la soluzione comune.`,
    correct: `x = ${num(common)}`,
    wrong: [
      { text: `x = ${num(-common)}`, why: `x = ${num(-common)} risolve la prima ma non la seconda: (${num(-common)})² ${s > 0 ? '+' : MINUS} ${k}·(${num(-common)}) = ${num(2 * k * k)} ≠ 0.` },
      { text: 'x = 0', why: `x = 0 risolve la seconda ma non la prima: ${a === 1 ? '' : a + '·'}0 ${MINUS} ${a * k * k} ≠ 0.` },
      { text: `x = ${num(k * k)}`, why: `Prima equazione: x² = ${k * k} ⇒ x = ±${k}. Bisogna fare la radice.` },
      { text: 'Nessuna', why: `La prima ha soluzioni ±${k}, la seconda 0 e ${num(common)}: un valore in comune c'è.` },
    ],
    solution: [`Prima (pura): x² = ${k * k} ⇒ x = ${MINUS}${k} ; x = ${k}`, `Seconda (spuria): x(${poly([[1, 'x'], [s * k, '']])}) = 0 ⇒ x = 0 ; x = ${num(common)}`, `In comune: x = ${num(common)}`],
  });
}

function nonEquivalente() {
  const k = rand(2, 6);
  const a = pick([2, 3, 4]);
  return makeQuestion({
    text: `Individua fra le seguenti un'equazione NON equivalente a ${eq(a, 0, -a * k * k)} (cioè che non ha le stesse soluzioni).`,
    correct: `${a}x² ${MINUS} ${a * k * k}x = 0`,
    wrong: [
      { text: `${a * k * k} = ${a}x²`, why: 'È la stessa equazione con i termini spostati dall’altra parte: è equivalente.' },
      { text: `x² ${MINUS} ${k * k} = 0`, why: `È la stessa equazione divisa per ${a}: è equivalente.` },
      { text: `${a}(x ${MINUS} ${k})(x + ${k}) = 0`, why: `È la stessa equazione scomposta: ${a}(x² ${MINUS} ${k * k}) = ${a}x² ${MINUS} ${a * k * k}. È equivalente.` },
    ],
    solution: [`${eq(a, 0, -a * k * k)} ha soluzioni x = ±${k}`, `${a}x² ${MINUS} ${a * k * k}x = 0 invece ha soluzioni x = 0 e x = ${k * k}: NON è equivalente`],
  });
}

export default {
  id: 'equazioni2',
  title: 'Equazioni di 2° grado',
  icon: 'x²',
  color: '#4f46e5',
  description: 'Pure, spurie, complete e impossibili.',
  levels: [
    { id: 'e2a', title: 'Incomplete', description: 'Pure, spurie e impossibili', pool: [pura, pura, spuria, spuria, impossibile] },
    { id: 'e2b', title: 'Complete', description: 'Δ e formula risolutiva', pool: [completa, completa, delta] },
    { id: 'e2c', title: 'Come in verifica', description: 'Soluzione comune, equivalenze, impossibili', pool: [comune, comune, nonEquivalente, impossibile, completa] },
  ],
};
