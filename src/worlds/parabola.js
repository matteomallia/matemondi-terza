import { rand, randNZ, pick, num, poly, makeQuestion, MINUS, pt } from '../lib/utils.js';

const P = (x, y) => pt(num(x), num(y));
const par = (a, b, c) => `y = ${poly([[a, 'x²'], [b, 'x'], [c, '']])}`;

// ---------- LIVELLO 1: retta o parabola? ----------

function rettaOParabola() {
  const isPar = Math.random() < 0.65;
  const O = { rc: 'Una retta crescente', rd: 'Una retta decrescente', pp: 'Una parabola con concavità positiva (verso l’alto)', pn: 'Una parabola con concavità negativa (verso il basso)' };
  let f, k;
  if (isPar) {
    const a = randNZ(-3, 3);
    f = par(a, randNZ(-5, 5), rand(-5, 5));
    k = a > 0 ? 'pp' : 'pn';
  } else {
    const m = randNZ(-4, 4);
    f = `y = ${poly([[m, 'x'], [randNZ(-6, 6), '']])}`;
    k = m > 0 ? 'rc' : 'rd';
  }
  const why = {
    rc: 'È una retta solo se la x compare al primo grado (niente x²); crescente se m > 0.',
    rd: 'È una retta solo se la x compare al primo grado (niente x²); decrescente se m < 0.',
    pp: 'È una parabola se c’è x²; la concavità è positiva se il coefficiente di x² è positivo.',
    pn: 'È una parabola se c’è x²; la concavità è negativa se il coefficiente di x² è negativo.',
  };
  return makeQuestion({
    text: 'La seguente funzione nel piano cartesiano rappresenta:',
    formula: f,
    correct: O[k],
    wrong: Object.keys(O)
      .filter((x) => x !== k)
      .map((x) => ({ text: O[x], why: why[x] })),
    solution: [isPar ? 'C’è il termine x² ⇒ è una parabola' : 'La x compare solo al primo grado ⇒ è una retta', why[k]],
  });
}

function asseY() {
  const a = randNZ(-3, 3);
  const b = rand(-5, 5);
  let c;
  do c = randNZ(-8, 8);
  while (Math.abs(c) === Math.abs(a) || c === b);
  return makeQuestion({
    text: `In quale punto la parabola ${par(a, b, c)} interseca l'asse y?`,
    correct: P(0, c),
    wrong: [
      { text: P(c, 0), why: "Coordinate scambiate: sull'asse y è la x a valere 0." },
      { text: P(0, a), why: 'Con x = 0 si annullano x² e x: resta solo il termine noto.' },
      { text: P(0, -c), why: 'Il termine noto va preso con il suo segno.' },
      { text: P(0, 0), why: `Passa per l'origine solo se il termine noto è 0. Qui è ${num(c)}.` },
    ],
    solution: ["Sull'asse y: x = 0", `y = ${num(c)}  ⇒  ${P(0, c)}`],
  });
}

// ---------- LIVELLO 2: intersezioni con l'asse x ----------

function zeriPura() {
  const k = rand(1, 5);
  const a = pick([1, 1, -1, 2]);
  const c = -a * k * k;
  return makeQuestion({
    text: `In quali punti la parabola ${par(a, 0, c)} interseca l'asse delle ascisse (asse x)?`,
    correct: `(${k}; 0) e (${MINUS}${k}; 0)`,
    wrong: [
      { text: `(0; ${k}) e (0; ${MINUS}${k})`, why: "Sull'asse x è la y a valere 0: i punti sono del tipo (x; 0)." },
      { text: `(0; 0) e (${k}; ${MINUS}${k})`, why: `Poni y = 0: ${poly([[a, 'x²'], [c, '']])} = 0 ⇒ x² = ${k * k} ⇒ x = ±${k}.` },
      { text: `(${k * k}; 0) e (${MINUS}${k * k}; 0)`, why: `Da x² = ${k * k} devi fare la radice: x = ±${k}.` },
      { text: `(0; ${num(c)})`, why: "Questo è il punto sull'asse y." },
    ],
    solution: [`y = 0 ⇒ ${poly([[a, 'x²'], [c, '']])} = 0`, `x² = ${k * k} ⇒ x = ±${k}`, `Punti: (${k}; 0) e (${MINUS}${k}; 0)`],
  });
}

function zeriSpuria() {
  const a = pick([1, -1]);
  const r = randNZ(-5, 5);
  const b = -a * r; // y = a x (x − r)
  return makeQuestion({
    text: `In quali punti la parabola ${par(a, b, 0)} interseca l'asse x?`,
    correct: `(0; 0) e (${num(r)}; 0)`,
    wrong: [
      { text: `(0; 0) e (${num(-r)}; 0)`, why: `Errore di segno: x(${poly([[a, 'x'], [b, '']])}) = 0 ⇒ x = 0 oppure x = ${num(r)}.` },
      { text: '(0; 0)', why: 'Raccogliendo x i fattori sono due: le intersezioni sono due.' },
      { text: `(0; ${num(r)}) e (0; 0)`, why: "Sull'asse x la y vale 0." },
    ],
    solution: [`y = 0 ⇒ ${poly([[a, 'x²'], [b, 'x']])} = 0`, `Raccolgo x: x(${poly([[a, 'x'], [b, '']])}) = 0 ⇒ x = 0 ; x = ${num(r)}`, `Punti (0; 0) e (${num(r)}; 0)`],
  });
}

function affermazioneParabola() {
  const a = randNZ(-3, 3);
  const c = randNZ(-6, 6);
  const up = a > 0;
  return makeQuestion({
    text: `Considera la parabola ${par(a, 0, c)}. Scegli l'affermazione corretta.`,
    correct: up ? 'Ha concavità positiva' : 'Ha concavità negativa',
    wrong: [
      { text: up ? 'Ha concavità negativa' : 'Ha concavità positiva', why: `Il coefficiente di x² è ${num(a)}: ${up ? 'positivo' : 'negativo'}.` },
      { text: "Interseca l'asse y in due punti", why: "Una parabola di questo tipo incontra l'asse y in UN solo punto: (0; c)." },
      { text: 'Ha il coefficiente angolare positivo', why: 'Il coefficiente angolare è una caratteristica delle RETTE, non delle parabole.' },
    ],
    solution: [`a = ${num(a)} ${up ? '> 0 ⇒ concavità positiva (verso l’alto)' : '< 0 ⇒ concavità negativa (verso il basso)'}`],
  });
}

// ---------- LIVELLO 3: intersezione tra parabole ----------

function dueParabole() {
  let a1, a2, c1, c2;
  do {
    a1 = randNZ(-3, 3);
    a2 = randNZ(-3, 3);
    c1 = rand(-6, 6);
    c2 = rand(-6, 6);
  } while (a1 === a2 || c1 === c2 && Math.random() < 0.6);
  // a1 x² + c1 = a2 x² + c2  ⇒ (a1 − a2) x² = c2 − c1
  const k = (c2 - c1) / (a1 - a2);
  const kind = k > 0 ? 'due' : k === 0 ? 'uno' : 'nessuno';
  const O = { due: 'In due punti distinti', nessuno: 'Nessun punto', uno: c1 === 0 ? "Nell'origine degli assi" : `Nel punto (0; ${num(c1)})` };
  const alt = c1 === 0 ? `Nel punto (0; ${num(c1 + 1)})` : "L'origine degli assi";
  const steps = [`Pongo uguali le due y: ${poly([[a1, 'x²'], [c1, '']])} = ${poly([[a2, 'x²'], [c2, '']])}`, `${poly([[a1 - a2, 'x²']])} = ${num(c2 - c1)} ⇒ x² = ${num(k, 2)}`, kind === 'due' ? 'x² positivo ⇒ due valori di x ⇒ due punti' : kind === 'uno' ? 'x² = 0 ⇒ solo x = 0 ⇒ un punto' : 'x² negativo ⇒ nessuna soluzione ⇒ nessun punto'];
  return makeQuestion({
    text: `Considera le parabole ${par(a1, 0, c1)} e ${par(a2, 0, c2)}. Quali punti di intersezione hanno?`,
    correct: O[kind],
    wrong: [...Object.keys(O).filter((x) => x !== kind).map((x) => ({ text: O[x], why: `Metti a sistema: si arriva a x² = ${num(k, 2)}. ${steps[2]}.` })), { text: alt, why: `Metti a sistema: si arriva a x² = ${num(k, 2)}. ${steps[2]}.` }],
    solution: steps,
  });
}

function grafico() {
  const a = pick([1, -1]);
  const xv = randNZ(-2, 2);
  const yv = randNZ(-3, 3);
  const b = -2 * a * xv;
  const c = a * xv * xv + yv;
  return makeQuestion({
    text: 'Quale equazione corrisponde alla parabola disegnata?',
    visual: { type: 'plot', xmin: xv - 6, xmax: xv + 6, ymin: yv - 6, ymax: yv + 6, curves: [{ kind: 'parabola', a, b, c }], points: [{ x: xv, y: yv, label: 'V' }, { x: 0, y: c, label: P(0, c) }] },
    correct: par(a, b, c),
    wrong: [
      { text: par(-a, -b, -c), why: `La parabola è rivolta verso ${a > 0 ? "l'alto ⇒ coefficiente di x² positivo" : 'il basso ⇒ coefficiente di x² negativo'}.` },
      { text: par(a, -b, c), why: `Con questa il vertice sarebbe in x = ${num(-xv)}, ma nel grafico è in x = ${num(xv)}.` },
      { text: par(a, b, c + 2), why: `Il punto sull'asse y è (0; ${num(c)}): il termine noto è ${num(c)}.` },
      { text: par(a, b, -c), why: `Il punto sull'asse y è (0; ${num(c)}): il termine noto è ${num(c)}.` },
    ],
    solution: [`Concavità: ${a > 0 ? 'verso l’alto ⇒ a > 0' : 'verso il basso ⇒ a < 0'}`, `Asse y in (0; ${num(c)}) ⇒ c = ${num(c)}`, `Vertice in x = ${num(xv)} = −b/(2a)`, par(a, b, c)],
  });
}

export default {
  id: 'parabola',
  title: 'La parabola',
  icon: '∪',
  color: '#ea580c',
  description: 'Retta o parabola, concavità e intersezioni.',
  levels: [
    { id: 'p1', title: 'Retta o parabola?', description: 'Riconoscere e concavità', pool: [rettaOParabola, rettaOParabola, asseY, affermazioneParabola] },
    { id: 'p2', title: 'Intersezioni con gli assi', description: 'Dove taglia l’asse x', pool: [zeriPura, zeriPura, zeriSpuria, affermazioneParabola] },
    { id: 'p3', title: 'Come in verifica', description: 'Due parabole e grafici', pool: [dueParabole, dueParabole, zeriPura, grafico, rettaOParabola] },
  ],
};
