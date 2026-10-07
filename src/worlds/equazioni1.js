import { rand, randNZ, pick, num, frac, poly, makeQuestion, MINUS, gcd, cx } from '../lib/utils.js';

const side = (a, b) => poly([[a, 'x'], [b, '']]);
const xs = (n, d) => `x = ${frac(n, d)}`;

// ---------- LIVELLO 1: risolvere ----------

function semplice() {
  const x0 = randNZ(-8, 9);
  const a = pick([2, 3, 4, 5, -2, -3]);
  const b = randNZ(-12, 12);
  const c = a * x0 + b;
  return makeQuestion({
    text: "Risolvi l'equazione:",
    formula: `${side(a, b)} = ${num(c)}`,
    correct: `x = ${num(x0)}`,
    wrong: [
      { text: xs(c + b, a), why: `Portando ${num(b)} dall'altra parte dell'uguale bisogna CAMBIARE SEGNO: ${cx(a)} = ${num(c)} ${b > 0 ? MINUS : '+'} ${Math.abs(b)} = ${num(c - b)}.` },
      { text: xs(a, c - b), why: `Hai capovolto la divisione: da ${cx(a)} = ${num(c - b)} si ottiene x = ${num(c - b)} : (${num(a)}).` },
      { text: `x = ${num(-x0)}`, why: `Errore di segno. Verifica: ${num(a)}·(${num(-x0)}) ${b > 0 ? '+' : MINUS} ${Math.abs(b)} = ${num(-a * x0 + b)}, non ${num(c)}.` },
      { text: xs(c - b, -a), why: `Il coefficiente ${num(a)} resta con il suo segno quando dividi: x = ${num(c - b)} : (${num(a)}).` },
    ],
    solution: [`Porto ${num(b)} a destra cambiando segno: ${cx(a)} = ${num(c)} ${b > 0 ? MINUS : '+'} ${Math.abs(b)}`, `${cx(a)} = ${num(c - b)}`, `Divido per ${num(a)}: x = ${num(x0)}`],
  });
}

function dueMembri() {
  const x0 = randNZ(-6, 8);
  let a, c;
  do {
    a = randNZ(-5, 6);
    c = randNZ(-5, 6);
  } while (a === c);
  const b = randNZ(-10, 10);
  const d = (a - c) * x0 + b;
  const k = a - c;
  return makeQuestion({
    text: "Risolvi l'equazione:",
    formula: `${side(a, b)} = ${side(c, d)}`,
    correct: `x = ${num(x0)}`,
    wrong: [
      { text: xs(d - b, a + c), why: `Portando ${poly([[c, 'x']])} a sinistra cambia segno: si ottiene ${poly([[a, 'x'], [-c, 'x']])}, cioè ${cx(k)}.` },
      { text: xs(d + b, k), why: `Portando ${num(b)} a destra cambia segno: ${num(d)} ${b > 0 ? MINUS : '+'} ${Math.abs(b)} = ${num(d - b)}.` },
      { text: `x = ${num(-x0)}`, why: `Errore di segno. Verifica sostituendo: i due membri non risultano uguali.` },
      { text: xs(k, d - b), why: `Hai capovolto la divisione: ${cx(k)} = ${num(d - b)} ⇒ x = ${num(d - b)} : (${num(k)}).` },
    ],
    solution: [`Porto le x a sinistra e i numeri a destra (cambiando segno): ${cx(a)} ${c >= 0 ? MINUS : '+'} ${cx(Math.abs(c))} = ${num(d)} ${b >= 0 ? MINUS : '+'} ${Math.abs(b)}`, `${cx(k)} = ${num(d - b)}`, `x = ${num(d - b)} : (${num(k)}) = ${num(x0)}`],
  });
}

// ---------- LIVELLO 2: parentesi e frazioni algebriche ----------

function parentesi() {
  const x0 = randNZ(-5, 6);
  const a = pick([2, 3, 4, 5]);
  const p = randNZ(-5, 5);
  const b = randNZ(-6, 6);
  const c = a * (x0 - p) + b;
  return makeQuestion({
    text: "Risolvi l'equazione:",
    formula: `${a}(${side(1, -p)}) ${b >= 0 ? '+' : MINUS} ${Math.abs(b)} = ${num(c)}`,
    correct: `x = ${num(x0)}`,
    wrong: [
      { text: xs(c - b - p, a), why: `Il ${a} va moltiplicato per TUTTI i termini della parentesi: ${a}(${side(1, -p)}) = ${side(a, -a * p)}.` },
      { text: xs(c - b - a * p, a), why: `Attenzione al segno: ${a}·(${num(-p)}) = ${num(-a * p)}; portandolo a destra diventa ${num(a * p)}.` },
      { text: `x = ${num(-x0)}`, why: 'Errore di segno: verifica sostituendo nell’equazione.' },
    ],
    solution: [`Moltiplico: ${side(a, -a * p)} ${b >= 0 ? '+' : MINUS} ${Math.abs(b)} = ${num(c)}`, `${cx(a)} = ${num(c)} ${-a * p + b >= 0 ? MINUS : '+'} ${Math.abs(-a * p + b)} = ${num(c + a * p - b)}`, `x = ${num(x0)}`],
  });
}

function fracData() {
  let p, q, r, s;
  do {
    p = randNZ(-6, 6);
    q = randNZ(-10, 10);
    r = pick([2, 3, 4, 5]);
    s = randNZ(-10, 10);
  } while (p * s === -q * r || Math.abs(p) === Math.abs(q) || gcd(r, s) === r);
  return { p, q, r, s };
}
const fracFormula = ({ p, q, r, s }) => `{{${poly([[q, ''], [p, 'x']])}|${poly([[r, 'x'], [-s, '']])}}}`;

function annulla() {
  const d = fracData();
  const { p, q, r, s } = d;
  return makeQuestion({
    text: 'Per quale valore di x la frazione si annulla (vale 0)?',
    formula: fracFormula(d),
    correct: xs(-q, p),
    wrong: [
      { text: xs(-p, q), why: `Hai capovolto: ${poly([[q, ''], [p, 'x']])} = 0 ⇒ ${cx(p)} = ${num(-q)} ⇒ x = ${frac(-q, p)}.` },
      { text: xs(q, p), why: `Errore di segno: portando ${num(q)} a destra diventa ${num(-q)}.` },
      { text: xs(s, r), why: 'Questo valore annulla il DENOMINATORE: lì la frazione non esiste. Una frazione vale 0 quando è zero il NUMERATORE.' },
      { text: 'x = 0', why: `Con x = 0 la frazione vale ${frac(q, -s)}, non 0.` },
    ],
    solution: ['Una frazione vale 0 quando il numeratore è 0 (e il denominatore no)', `${poly([[q, ''], [p, 'x']])} = 0 ⇒ ${cx(p)} = ${num(-q)} ⇒ x = ${frac(-q, p)}`],
  });
}

function condizione() {
  const d = fracData();
  const { p, q, r, s } = d;
  return makeQuestion({
    text: 'Qual è la condizione di esistenza (C.E.) della frazione?',
    formula: fracFormula(d),
    correct: `x ≠ ${frac(s, r)}`,
    wrong: [
      { text: `x = ${frac(s, r)}`, why: `Per x = ${frac(s, r)} il denominatore vale 0 e la frazione NON esiste: la condizione è x ≠ ${frac(s, r)}.` },
      { text: `x ≠ ${frac(-q, p)}`, why: 'La condizione di esistenza riguarda il DENOMINATORE, non il numeratore.' },
      { text: `x ≠ ${frac(-s, r)}`, why: `Errore di segno: ${poly([[r, 'x'], [-s, '']])} = 0 ⇒ x = ${frac(s, r)}.` },
      { text: `x ≠ ${frac(r, s)}`, why: `Hai capovolto: ${r}x = ${num(s)} ⇒ x = ${frac(s, r)}.` },
    ],
    solution: ['Non si può dividere per zero: il denominatore deve essere diverso da 0', `${poly([[r, 'x'], [-s, '']])} ≠ 0 ⇒ ${r}x ≠ ${num(s)} ⇒ x ≠ ${frac(s, r)}`],
  });
}

// ---------- LIVELLO 3: come in verifica ----------

function verificaSoluzione() {
  const x0 = randNZ(-5, 6);
  let a, c;
  do {
    a = randNZ(-4, 5);
    c = randNZ(-4, 5);
  } while (a === c);
  const b = randNZ(-8, 8);
  const d = (a - c) * x0 + b;
  const L = (x) => a * x + b;
  const R = (x) => c * x + d;
  const cands = [-x0, x0 + 1, x0 - 1, x0 + 2, 0].filter((v) => v !== x0);
  return makeQuestion({
    text: "Quale dei seguenti valori è la soluzione dell'equazione?",
    formula: `${side(a, b)} = ${side(c, d)}`,
    correct: `x = ${num(x0)}`,
    wrong: cands.map((v) => ({ text: `x = ${num(v)}`, why: `Sostituisci x = ${num(v)}: a sinistra ottieni ${num(L(v))}, a destra ${num(R(v))}. Non sono uguali.` })),
    solution: [`Sostituendo x = ${num(x0)}: a sinistra ${num(L(x0))}, a destra ${num(R(x0))} ✔`, 'Oppure risolvi: porta le x da una parte e i numeri dall’altra.'],
  });
}

export default {
  id: 'equazioni1',
  title: 'Equazioni di 1° grado',
  icon: 'ax+b',
  color: '#2563eb',
  description: 'Risolvere equazioni, parentesi e frazioni algebriche.',
  levels: [
    { id: 'e1a', title: 'Risolvere', description: 'Portare di là cambiando segno', pool: [semplice, semplice, dueMembri] },
    { id: 'e1b', title: 'Parentesi e frazioni', description: 'Parentesi, zero e condizione di esistenza', pool: [parentesi, annulla, condizione, dueMembri] },
    { id: 'e1c', title: 'Come in verifica', description: 'Frazioni algebriche e verifica', pool: [annulla, condizione, verificaSoluzione, dueMembri] },
  ],
};
