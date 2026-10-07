import { rand, pick, num, frac, makeQuestion, MINUS, euro, shuffle, cx } from '../lib/utils.js';

// ---------- Traduzione in equazione ----------

const TEMPLATES = [
  () => {
    const x = pick([2, 4, 6, 8, 10, 12]);
    const k = rand(1, 9);
    const m = 2 * x - x / 2 - k; // x/2 + k = 2x − m
    if (m <= 0) throw new Error('retry');
    return {
      text: `Trova quel numero x la cui metà aumentata di ${k} equivale al doppio del numero stesso diminuito di ${m}.`,
      eq: `{{x|2}} + ${k} = 2x ${MINUS} ${m}`,
      wrong: [
        { text: `2x + ${k} = {{x|2}} ${MINUS} ${m}`, why: 'Hai scambiato: “la metà del numero” è x/2, “il doppio” è 2x.' },
        { text: `{{x + ${k}|2}} = 2x ${MINUS} ${m}`, why: `“La metà aumentata di ${k}”: prima si fa la metà (x/2), poi si aggiunge ${k}. Non (x + ${k})/2.` },
        { text: `{{x|2}} + ${k} = 2(x ${MINUS} ${m})`, why: `“Il doppio del numero diminuito di ${m}”: prima il doppio (2x), poi si toglie ${m}.` },
        { text: `{{x|2}} ${MINUS} ${k} = 2x + ${m}`, why: '“Aumentata” vuol dire +, “diminuito” vuol dire −.' },
      ],
      x,
      check: (v) => `${num(v)}/2 + ${k} = ${num(v / 2 + k)} e 2·${num(v)} ${MINUS} ${m} = ${num(2 * v - m)}`,
    };
  },
  () => {
    const x = pick([4, 6, 8, 10, 12, 14, 16, 20, 24]);
    const N = x - x / 2 + 2 * x;
    return {
      text: `Un numero, diminuito della sua metà e sommato al suo doppio, è uguale a ${num(N)}.`,
      eq: `x ${MINUS} {{x|2}} + 2x = ${num(N)}`,
      wrong: [
        { text: `x ${MINUS} 2x + {{x|2}} = ${num(N)}`, why: 'Si toglie la METÀ (x/2) e si aggiunge il DOPPIO (2x).' },
        { text: `{{x|2}} + 2x = ${num(N)}`, why: 'Manca il numero di partenza x: “un numero, diminuito della sua metà” è x − x/2.' },
        { text: `x ${MINUS} 2 + 2x = ${num(N)}`, why: '“La sua metà” è x/2, non 2.' },
        { text: `(x ${MINUS} {{x|2}})·2x = ${num(N)}`, why: '“Sommato” vuol dire +, non ×.' },
      ],
      x,
      check: (v) => `${num(v)} ${MINUS} ${num(v / 2)} + ${num(2 * v)} = ${num(v - v / 2 + 2 * v)}`,
    };
  },
  () => {
    const x = rand(3, 20);
    const k = rand(2, 15);
    const N = 3 * x + k;
    return {
      text: `Il triplo di un numero, aumentato di ${k}, è uguale a ${N}.`,
      eq: `3x + ${k} = ${N}`,
      wrong: [
        { text: `3(x + ${k}) = ${N}`, why: `Prima si fa il triplo (3x), poi si aggiunge ${k}: 3x + ${k}.` },
        { text: `x + 3 + ${k} = ${N}`, why: '“Il triplo” vuol dire moltiplicare per 3: 3x.' },
        { text: `{{x|3}} + ${k} = ${N}`, why: '“Il triplo” è 3x; x/3 sarebbe “la terza parte”.' },
        { text: `3x ${MINUS} ${k} = ${N}`, why: '“Aumentato” vuol dire +.' },
      ],
      x,
      check: (v) => `3·${num(v)} + ${k} = ${num(3 * v + k)}`,
    };
  },
  () => {
    const x = rand(5, 40);
    const N = 2 * x + 1;
    return {
      text: `La somma di un numero e del suo successivo è ${N}.`,
      eq: `x + (x + 1) = ${N}`,
      wrong: [
        { text: `x + 1 = ${N}`, why: 'Manca uno dei due numeri: servono x e il successivo x + 1.' },
        { text: `x·(x + 1) = ${N}`, why: '“Somma” vuol dire +, non ×.' },
        { text: `x + 2x = ${N}`, why: 'Il successivo di x è x + 1, non 2x.' },
      ],
      x,
      check: (v) => `${num(v)} + ${num(v + 1)} = ${num(2 * v + 1)}`,
    };
  },
];

function traduci() {
  const t = pick(TEMPLATES)();
  return makeQuestion({
    text: `${t.text} Quale equazione rappresenta il problema?`,
    correct: t.eq,
    wrong: t.wrong,
    solution: ['Traduco il testo pezzo per pezzo:', t.eq, `(La soluzione è x = ${num(t.x)})`],
  });
}

function risolviProblema() {
  const t = pick(TEMPLATES)();
  const cands = shuffle([t.x + 1, t.x - 1, t.x + 2, 2 * t.x, Math.max(1, Math.round(t.x / 2)), t.x + 5]).filter((v) => v !== t.x && v > 0);
  return makeQuestion({
    text: `${t.text} Qual è quel numero?`,
    correct: num(t.x),
    wrong: cands.map((v) => ({ text: num(v), why: `Verifica: ${t.check(v)}. Non torna con i dati del problema.` })),
    solution: [`Equazione: ${t.eq}`, `Risolvendo si trova x = ${num(t.x)}`, `Verifica: ${t.check(t.x)} ✔`],
  });
}

// ---------- Biglietti (interi e ridotti) ----------

function biglietti() {
  const p1 = pick([8, 9, 10, 12, 15]);
  const p2 = pick([4, 5, 6, 7]);
  if (p2 >= p1) throw new Error('retry');
  const n = pick([100, 120, 150, 200, 250]);
  const x = pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8].map((f) => Math.round(n * f)));
  const I = p1 * x + p2 * (n - x);
  const opt = (a) => `${a} biglietti interi e ${n - a} ridotti`;
  const chk = (a) => `${a}·${p1} + ${n - a}·${p2} = ${euro(p1 * a + p2 * (n - a))}`;
  const alts = [n / 2, n - x, Math.round(x / 2), Math.min(n, x + 10)].filter((a) => a !== x && Number.isInteger(a));
  return makeQuestion({
    text: `In un museo il biglietto intero costa ${p1} €, il ridotto ${p2} €. Sono entrati ${n} visitatori e l'incasso totale è stato di ${euro(I)}. Quanti biglietti interi e quanti ridotti sono stati venduti?`,
    correct: opt(x),
    wrong: [
      ...alts.map((a) => ({ text: opt(a), why: `Verifica l'incasso: ${chk(a)}, non ${euro(I)}.` })),
      { text: 'Non è possibile saperlo', why: 'Si può: con un’equazione (o provando le risposte) si trova il numero esatto.' },
    ],
    solution: [
      `Interi = x, ridotti = ${n} ${MINUS} x`,
      `${cx(p1)} + ${p2}(${n} ${MINUS} x) = ${I}`,
      `${cx(p1)} + ${p2 * n} ${MINUS} ${cx(p2)} = ${I} ⇒ ${p1 - p2}x = ${I - p2 * n} ⇒ x = ${x}`,
      `Interi ${x}, ridotti ${n - x}. Verifica: ${chk(x)} ✔`,
    ],
    tip: 'Nelle domande a crocette puoi anche provare ogni risposta e controllare l’incasso.',
  });
}

// ---------- Frazioni di un totale ----------

const FR = [
  [[1, 4], [1, 5]],
  [[1, 3], [1, 6]],
  [[1, 5], [1, 10]],
  [[2, 5], [1, 4]],
  [[1, 4], [1, 8]],
];
const fs = ([a, b]) => `${a}/${b}`;

function frazioniFormula() {
  const [f1, f2] = pick(FR);
  return makeQuestion({
    text: `In un parco ci sono n persone: ${fs(f1)} sono over 60 e ${fs(f2)} hanno meno di 10 anni. Quale formula dà il numero N delle persone tra i 10 e i 60 anni?`,
    correct: `N = n ${MINUS} ${fs(f1)} n ${MINUS} ${fs(f2)} n`,
    wrong: [
      { text: `N = ${fs(f1)} n + ${fs(f2)} n`, why: 'Questi sono gli over 60 più i bambini: proprio le persone da ESCLUDERE.' },
      { text: `n = N ${MINUS} ${fs(f1)} n ${MINUS} ${fs(f2)} n`, why: 'Hai scambiato n e N: il totale è n, e da quello si tolgono le due parti.' },
      { text: `n ${MINUS} N = ${fs(f1)} n ${MINUS} ${fs(f2)} n`, why: 'n − N sono le persone escluse, cioè la SOMMA delle due parti, non la differenza.' },
    ],
    solution: ['Persone tra 10 e 60 anni = tutte − over 60 − sotto i 10', `N = n ${MINUS} ${fs(f1)} n ${MINUS} ${fs(f2)} n`],
  });
}

function frazioniNumero() {
  const [f1, f2] = pick(FR);
  const n = pick([120, 200, 240, 400, 600, 800]);
  const a = (n * f1[0]) / f1[1];
  const b = (n * f2[0]) / f2[1];
  if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error('retry');
  const ask = pick(['esclusi', 'medi']);
  const val = ask === 'esclusi' ? a + b : n - a - b;
  return makeQuestion({
    text: `In un parco ci sono ${n} persone: ${fs(f1)} sono over 60 e ${fs(f2)} hanno meno di 10 anni. ${ask === 'esclusi' ? 'Quante sono in tutto le persone over 60 e quelle sotto i 10 anni?' : 'Quante persone hanno tra i 10 e i 60 anni?'}`,
    correct: `${val}`,
    wrong: [
      { text: `${ask === 'esclusi' ? n - a - b : a + b}`, why: ask === 'esclusi' ? 'Questi sono quelli tra 10 e 60 anni, cioè il resto.' : 'Questi sono gli over 60 più i bambini, da togliere al totale.' },
      { text: `${a}`, why: `${a} sono solo gli over 60 (${fs(f1)} di ${n}).` },
      { text: `${b}`, why: `${b} sono solo i bambini sotto i 10 anni (${fs(f2)} di ${n}).` },
      { text: `${Math.round(n / (f1[1] + f2[1]))}`, why: 'Le frazioni non si sommano così: calcola ciascuna parte (totale : denominatore × numeratore).' },
    ],
    solution: [`Over 60: ${n} : ${f1[1]} × ${f1[0]} = ${a}`, `Sotto i 10: ${n} : ${f2[1]} × ${f2[0]} = ${b}`, ask === 'esclusi' ? `Totale: ${a} + ${b} = ${a + b}` : `Tra 10 e 60: ${n} ${MINUS} ${a} ${MINUS} ${b} = ${n - a - b}`],
  });
}

// ---------- Il circo ----------

function circo() {
  const pb = pick([6, 7, 8, 10]);
  const pa = pick([12, 14, 15, 18]);
  const P = pick([150, 240, 300, 360]);
  const [fn, fd] = pick([[2, 3], [1, 3], [3, 4], [1, 2]]);
  const B = (P * fn) / fd;
  if (!Number.isInteger(B)) throw new Error('retry');
  const A = P - B;
  return makeQuestion({
    text: `L'ingresso al circo costa ${pb} € per i bambini e ${pa} € per gli adulti. La platea (${P} posti) era piena e il pubblico era composto per ${fn}/${fd} da bambini. Quale espressione rappresenta l'incasso I?`,
    correct: `I = ${pb}·${B} + ${pa}·${A}`,
    wrong: [
      { text: `I = ${pa}·${B} + ${pb}·${A}`, why: `Hai scambiato i prezzi: i bambini (${B}) pagano ${pb} €.` },
      { text: `I = (${pb} + ${pa})·${fn}/${fd}·${P}`, why: 'Bambini e adulti pagano prezzi diversi e sono in numero diverso: va calcolato separatamente.' },
      { text: `I = ${fn}/${fd}·(${P}/${pb})`, why: 'Il numero di bambini va MOLTIPLICATO per il prezzo, non diviso.' },
      { text: `I = ${pb}·${P} + ${pa}·${P}`, why: `Gli spettatori sono ${P} in tutto, non ${P} bambini e ${P} adulti.` },
    ],
    solution: [`Bambini: ${fn}/${fd} di ${P} = ${B};  adulti: ${P} ${MINUS} ${B} = ${A}`, `I = ${pb}·${B} + ${pa}·${A} = ${pb * B + pa * A} €`],
  });
}

function circoBambini() {
  const pb = pick([6, 8, 10]);
  const pa = pick([12, 14, 15]);
  const P = pick([200, 250, 300]);
  const B = rand(Math.round(P * 0.4), Math.round(P * 0.8));
  const I = pb * B + pa * (P - B);
  const chk = (b) => `${pb}·${b} + ${pa}·${P - b} = ${euro(pb * b + pa * (P - b))}`;
  return makeQuestion({
    text: `L'ingresso al circo costa ${pb} € per i bambini e ${pa} € per gli adulti. La platea (${P} posti) era piena e l'incasso è stato di ${euro(I)}. Quanti bambini c'erano?`,
    correct: `${B}`,
    wrong: [P - B, B + 10, B - 10, Math.round(I / (pb + pa))].filter((b) => b !== B && b > 0 && b < P).map((b) => ({ text: `${b}`, why: `Verifica: ${chk(b)}, non ${euro(I)}.` })),
    solution: [`Bambini = x, adulti = ${P} ${MINUS} x`, `${cx(pb)} + ${pa}(${P} ${MINUS} x) = ${I}`, `${cx(pb)} + ${pa * P} ${MINUS} ${cx(pa)} = ${I} ⇒ ${MINUS}${pa - pb}x = ${num(I - pa * P)} ⇒ x = ${B}`],
  });
}

export default {
  id: 'problemi',
  title: 'Problemi con le equazioni',
  icon: '? = x',
  color: '#7c3aed',
  description: 'Tradurre il testo in equazione e risolvere problemi.',
  levels: [
    { id: 'pr1', title: 'Dalle parole all’equazione', description: 'Metà, doppio, triplo, successivo', pool: [traduci, traduci, traduci, frazioniFormula] },
    { id: 'pr2', title: 'Trova il numero', description: 'Risolvere e verificare', pool: [risolviProblema, risolviProblema, frazioniNumero] },
    { id: 'pr3', title: 'Come in verifica', description: 'Biglietti, parco, circo', pool: [biglietti, frazioniNumero, frazioniFormula, circo, circoBambini, traduci] },
  ],
};
