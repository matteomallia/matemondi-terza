import { rand, randNZ, pick, num, poly, makeQuestion, MINUS, shuffle, cx } from '../lib/utils.js';

const INF = '+∞';
const NINF = `${MINUS}∞`;
// rappresentazione di "x op a"
const toInterval = (op, a) =>
  ({ '>': `(${num(a)}; ${INF})`, '≥': `[${num(a)}; ${INF})`, '<': `(${NINF}; ${num(a)})`, '≤': `(${NINF}; ${num(a)}]` })[op];
const OPS = ['>', '≥', '<', '≤'];
const flip = { '>': '<', '<': '>', '≥': '≤', '≤': '≥' };
const strictSwap = { '>': '≥', '≥': '>', '<': '≤', '≤': '<' };
const side = (a, b) => poly([[a, 'x'], [b, '']]);

// ---------- LIVELLO 1: intervalli ----------

function daIntervallo() {
  const a = rand(-6, 6);
  const op = pick(OPS);
  return makeQuestion({
    text: `Considera l'intervallo ${toInterval(op, a)}. In quale disequazione si traduce?`,
    correct: `x ${op} ${num(a)}`,
    wrong: OPS.filter((o) => o !== op).map((o) => ({
      text: `x ${o} ${num(a)}`,
      why: `Leggi le parentesi: “[” o “]” vuol dire che ${num(a)} è COMPRESO (≤ o ≥); “(” o “)” vuol dire ESCLUSO (< o >). Se c'è ${INF} i valori vanno verso destra (maggiori), se c'è ${NINF} verso sinistra (minori).`,
    })),
    solution: [`${toInterval(op, a)}: ${op === '>' || op === '≥' ? `da ${num(a)} verso ${INF} ⇒ x maggiore` : `da ${NINF} fino a ${num(a)} ⇒ x minore`}`, `${op === '≥' || op === '≤' ? 'Parentesi quadra ⇒ estremo compreso' : 'Parentesi tonda ⇒ estremo escluso'}`, `x ${op} ${num(a)}`],
  });
}

function aIntervallo() {
  const a = rand(-6, 6);
  const op = pick(OPS);
  return makeQuestion({
    text: `Come si scrive la soluzione x ${op} ${num(a)} sotto forma di intervallo?`,
    correct: toInterval(op, a),
    wrong: OPS.filter((o) => o !== op).map((o) => ({
      text: toInterval(o, a),
      why: `Questo intervallo corrisponde a x ${o} ${num(a)}. Ricorda: estremo compreso ⇒ parentesi quadra; con ∞ sempre parentesi tonda.`,
    })),
    solution: [`x ${op} ${num(a)} ⇒ ${toInterval(op, a)}`, 'L’infinito non è un numero: accanto a ∞ la parentesi è sempre tonda.'],
  });
}

// ---------- LIVELLO 2: risolvere ----------

function risolvi() {
  const x0 = rand(-5, 6);
  let a, c;
  do {
    a = randNZ(-5, 6);
    c = randNZ(-5, 6);
  } while (a === c);
  const b = randNZ(-9, 9);
  const d = (a - c) * x0 + b; // ax + b = cx + d per x = x0
  const op = pick(OPS);
  const k = a - c;
  const res = k > 0 ? op : flip[op];
  return makeQuestion({
    text: 'Risolvi la disequazione:',
    formula: `${side(a, b)} ${op} ${side(c, d)}`,
    correct: `x ${res} ${num(x0)}`,
    wrong: [
      { text: `x ${k > 0 ? flip[op] : op} ${num(x0)}`, why: k < 0 ? `Arrivi a ${cx(k)} ${op} ${num(d - b)}: dividendo per un numero NEGATIVO (${num(k)}) il verso si INVERTE.` : `Dividendo per ${num(k)}, che è positivo, il verso NON cambia.` },
      { text: `x ${res} ${num(-x0)}`, why: 'Errore di segno nel portare i termini dall’altra parte.' },
      { text: `x ${strictSwap[res]} ${num(x0)}`, why: `Il simbolo resta ${op === '>' || op === '<' ? 'stretto (senza uguale)' : 'con l’uguale'} come nel testo.` },
      { text: 'Impossibile', why: 'Ci sono valori che la verificano: prova a sostituire.' },
    ],
    solution: [`Porto le x a sinistra e i numeri a destra: ${cx(k)} ${op} ${num(d - b)}`, k > 0 ? `Divido per ${num(k)} (positivo): il verso resta` : `Divido per ${num(k)} (NEGATIVO): il verso si inverte`, `x ${res} ${num(x0)}  ⇒  ${toInterval(res, x0)}`],
  });
}

function sempreMai() {
  const a = randNZ(-4, 5);
  const b = randNZ(-8, 8);
  let d;
  do d = randNZ(-8, 8);
  while (d === b);
  const op = pick(OPS);
  // ax + b op ax + d  ⇔  b op d
  const truth = { '>': b > d, '≥': b >= d, '<': b < d, '≤': b <= d }[op];
  const correct = truth ? 'Sempre verificata (ogni x)' : 'Impossibile (nessuna x)';
  return makeQuestion({
    text: 'Risolvi la disequazione:',
    formula: `${side(a, b)} ${op} ${side(a, d)}`,
    correct,
    wrong: [
      { text: truth ? 'Impossibile (nessuna x)' : 'Sempre verificata (ogni x)', why: `Le x si eliminano e resta ${num(b)} ${op} ${num(d)}, che è ${truth ? 'VERO: vale per ogni x' : 'FALSO: nessuna x va bene'}.` },
      { text: `x ${op} ${num(d - b)}`, why: `I termini con la x si cancellano: ${cx(a)} ${MINUS} ${cx(a)} = 0.` },
      { text: `x ${op} 0`, why: `Le x spariscono: resta ${num(b)} ${op} ${num(d)}.` },
    ],
    solution: [`Porto le x a sinistra: ${cx(a)} ${MINUS} ${cx(a)} = 0`, `Resta: 0 ${op} ${num(d - b)}, cioè ${num(b)} ${op} ${num(d)}`, `È ${truth ? 'vero ⇒ sempre verificata' : 'falso ⇒ impossibile'}`],
  });
}

// ---------- LIVELLO 3: come in verifica ----------

function quale() {
  // α(x − p) + β(q − x) op K  ⇒ (α − β)x op K + αp − βq
  for (let t = 0; t < 50; t++) {
    const al = rand(2, 4);
    let be;
    do be = rand(1, 5);
    while (be === al);
    const p = rand(1, 3);
    const q = rand(1, 3);
    const k = al - be;
    const x0 = rand(-3, 3);
    const K = k * x0 - al * p + be * q;
    const expr = `${al}(x ${MINUS} ${p}) + ${be}(${q} ${MINUS} x)`;
    const target = pick(OPS);
    // trova l'operatore op tale che la soluzione sia x target x0
    const op = k > 0 ? target : flip[target];
    const sol = (o) => (k > 0 ? o : flip[o]);
    return makeQuestion({
      text: `L'intervallo ${toInterval(target, x0)} è la soluzione di una sola delle seguenti disequazioni. Quale?`,
      correct: `${expr} ${op} ${num(K)}`,
      wrong: OPS.filter((o) => o !== op).map((o) => ({ text: `${expr} ${o} ${num(K)}`, why: `Svolgendo i calcoli si arriva a ${cx(k)} ${o} ${num(k * x0)}, cioè x ${sol(o)} ${num(x0)}: l'intervallo sarebbe ${toInterval(sol(o), x0)}.` })),
      solution: [
        `Svolgo: ${cx(al)} ${MINUS} ${al * p} + ${be * q} ${MINUS} ${cx(be)} = ${cx(k)} ${-al * p + be * q >= 0 ? '+' : MINUS} ${Math.abs(-al * p + be * q)}`,
        `${cx(k)} ${op} ${num(K + al * p - be * q)} ⇒ ${k > 0 ? 'divido per un positivo' : 'divido per un negativo e inverto'}: x ${target} ${num(x0)}`,
        `Corrisponde a ${toInterval(target, x0)} ✔`,
      ],
    });
  }
  throw new Error('retry');
}

function verificaStile() {
  // come la simulazione: 3x − 2 + x > −2x + 4
  const x0 = rand(-3, 4);
  const a1 = rand(2, 4);
  const a2 = rand(1, 3);
  const c = randNZ(-3, 3);
  const b = randNZ(-6, 6);
  const k = a1 + a2 - c;
  if (k <= 0) throw new Error('retry');
  const d = k * x0 + b;
  const op = pick(OPS);
  return makeQuestion({
    text: 'Data la disequazione di primo grado, qual è la soluzione?',
    formula: `${cx(a1)} ${b >= 0 ? '+' : MINUS} ${Math.abs(b)} + ${cx(a2)} ${op} ${side(c, d)}`,
    correct: `x ${op} ${num(x0)}`,
    wrong: [
      { text: `x ${flip[op]} ${num(x0)}`, why: `Il coefficiente di x alla fine è ${k}, positivo: il verso NON si inverte.` },
      { text: `x ${strictSwap[op]} ${num(x0)}`, why: `Il simbolo deve restare ${op}.` },
      { text: 'Impossibile', why: 'La disequazione ha soluzioni: prova a sostituire un valore.' },
      { text: `x ${op} ${num(-x0)}`, why: 'Errore di segno: ricontrolla i passaggi.' },
    ],
    solution: [`Sommo i termini simili e porto le x a sinistra: ${cx(a1)} + ${cx(a2)} ${c >= 0 ? MINUS : '+'} ${cx(Math.abs(c))} ${op} ${num(d)} ${b >= 0 ? MINUS : '+'} ${Math.abs(b)}`, `${cx(k)} ${op} ${num(d - b)}`, `x ${op} ${num(x0)}  ⇒  ${toInterval(op, x0)}`],
  });
}

export default {
  id: 'disequazioni1',
  title: 'Disequazioni di 1° grado',
  icon: 'x > a',
  color: '#0891b2',
  description: 'Risolvere disequazioni e scrivere gli intervalli.',
  levels: [
    { id: 'd1a', title: 'Gli intervalli', description: 'Parentesi tonde e quadre', pool: [daIntervallo, aIntervallo] },
    { id: 'd1b', title: 'Risolvere', description: 'Quando il verso si inverte', pool: [risolvi, risolvi, risolvi, sempreMai] },
    { id: 'd1c', title: 'Come in verifica', description: 'Dalla disequazione all’intervallo e viceversa', pool: [verificaStile, quale, quale, daIntervallo, risolvi] },
  ],
};
