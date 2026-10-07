import { rand, pick, num, makeQuestion, MINUS } from '../lib/utils.js';

// ---------- LIVELLO 1: proporzioni ----------

function ingrandimento() {
  const [a, b] = pick([[12, 15], [8, 10], [10, 15], [9, 12], [6, 8], [10, 14], [12, 18], [15, 20]]);
  const k = pick([4 / 3, 1.5, 2, 1.25, 2.5]);
  const a2 = a * k;
  const b2 = b * k;
  if (!Number.isInteger(a2) || !Number.isInteger(b2)) throw new Error('retry');
  return makeQuestion({
    text: `Si vuole ingrandire una cartolina mantenendo le proporzioni. Le dimensioni originali sono ${a} cm e ${b} cm. Dopo l'ingrandimento il lato minore misura ${a2} cm. Quanto misura il lato maggiore?`,
    correct: `${num(b2)} cm`,
    wrong: [
      { text: `${num(b + (a2 - a))} cm`, why: `Hai aggiunto ${a2 - a} cm anche al lato maggiore. Mantenere le proporzioni vuol dire MOLTIPLICARE entrambi i lati per lo stesso numero (${num(k, 2)}).` },
      { text: `${num((a * a2) / b, 1)} cm`, why: `Proporzione impostata al contrario: ${a} : ${b} = ${a2} : x.` },
      { text: `${num(b * 2)} cm`, why: `Il lato minore non è raddoppiato: ${a} → ${a2}, cioè ×${num(k, 2)}.` },
      { text: `${num(b2 + 1)} cm`, why: `Ricontrolla: x = ${b} × ${a2} : ${a} = ${num(b2)}.` },
    ],
    solution: [`Proporzione: ${a} : ${b} = ${a2} : x`, `x = ${b} × ${a2} : ${a} = ${num(b2)} cm`],
  });
}

function scala() {
  const s = pick([100, 200, 500, 1000]);
  const cm = rand(2, 12);
  const real = (cm * s) / 100; // metri
  return makeQuestion({
    text: `Su una piantina in scala 1:${s}, una parete misura ${cm} cm. Quanto misura nella realtà?`,
    correct: `${num(real)} m`,
    wrong: [
      { text: `${num(cm * s)} m`, why: `${cm} × ${s} = ${cm * s} CENTIMETRI: per i metri dividi per 100.` },
      { text: `${num(real / 10)} m`, why: `${cm} cm × ${s} = ${cm * s} cm = ${num(real)} m.` },
      { text: `${num(cm / s, 3)} m`, why: 'Nella realtà le misure sono più grandi: si moltiplica per la scala.' },
    ],
    solution: [`Realtà = ${cm} cm × ${s} = ${cm * s} cm`, `${cm * s} cm = ${num(real)} m`],
  });
}

// ---------- LIVELLO 2: aree e perimetri ----------

function aiuolaEquazione() {
  const L = rand(8, 12);
  const W = rand(5, L - 1);
  const x = pick([0.5, 1, 1.5, 2]);
  const A = (L + 2 * x) * (W + 2 * x);
  return makeQuestion({
    text: `Un'aiuola rettangolare è lunga ${L} m e larga ${W} m, circondata da un passaggio pedonale largo x metri. La superficie totale è ${num(A)} m². Quale equazione permette di calcolare x?`,
    visual: { type: 'frame', L, W },
    correct: `(${L} + 2x)·(${W} + 2x) = ${num(A)}`,
    wrong: [
      { text: `(${L} + x)·(${W} + x) = ${num(A)}`, why: 'Il passaggio c’è su entrambi i lati: ogni dimensione aumenta di 2x.' },
      { text: `${L * W} + 2x = ${num(A)}`, why: 'Non si somma una lunghezza a un’area: l’area è lunghezza × larghezza.' },
      { text: `${L} + 2x + ${W} + 2x = ${num(A)}`, why: 'Questo è il semiperimetro, non l’area.' },
    ],
    solution: [`Dimensioni totali: (${L} + 2x) e (${W} + 2x)`, `Area: (${L} + 2x)·(${W} + 2x) = ${num(A)}`],
  });
}

function aiuolaPerimetro() {
  const L = rand(8, 12);
  const W = rand(5, L - 1);
  const x = pick([0.5, 1, 1.5, 2, 2.5]);
  const P = 2 * (L + 2 * x + W + 2 * x);
  return makeQuestion({
    text: `Un'aiuola rettangolare lunga ${L} m e larga ${W} m è circondata da un passaggio largo ${num(x)} m. Quanto misura il perimetro totale dell'area (aiuola + passaggio)?`,
    visual: { type: 'frame', L, W },
    correct: `${num(P)} m`,
    wrong: [
      { text: `${num(2 * (L + W))} m`, why: 'Questo è il perimetro della sola aiuola: devi aggiungere il passaggio.' },
      { text: `${num(2 * (L + x + W + x))} m`, why: `Ogni lato aumenta di ${num(x)} m da ENTRAMBE le parti: + ${num(2 * x)} m.` },
      { text: `${num((L + 2 * x) * (W + 2 * x))} m`, why: 'Questa è l’area (m²), non il perimetro.' },
      { text: `${num(L + 2 * x + W + 2 * x)} m`, why: 'Questo è il semiperimetro: va moltiplicato per 2.' },
    ],
    solution: [`Lunghezza totale: ${L} + 2·${num(x)} = ${num(L + 2 * x)} m`, `Larghezza totale: ${W} + 2·${num(x)} = ${num(W + 2 * x)} m`, `Perimetro: 2·(${num(L + 2 * x)} + ${num(W + 2 * x)}) = ${num(P)} m`],
  });
}

function portone() {
  const w = pick([80, 90, 100, 120]); // cm
  const h = pick([200, 210, 230, 250]); // cm
  const c = pick([5, 10]);
  const sides = pick([1, 2]);
  const area = (sides * (w - 2 * c) * (h - 2 * c)) / 10000;
  const one = ((w - 2 * c) * (h - 2 * c)) / 10000;
  return makeQuestion({
    text: `Un portone rettangolare largo ${w} cm e alto ${num(h / 100)} m va verniciato ${sides === 2 ? 'da entrambi i lati' : 'su un solo lato'}, lasciando bianca una cornice di ${c} cm. Quanti m² andranno dipinti?`,
    correct: `${num(area, 2)} m²`,
    wrong: [
      { text: `${num((sides * w * h) / 10000, 2)} m²`, why: `Non hai tolto la cornice: ogni dimensione si riduce di 2 × ${c} = ${2 * c} cm.` },
      { text: `${num((sides * (w - c) * (h - c)) / 10000, 2)} m²`, why: `La cornice c'è su entrambi i lati di ogni dimensione: si toglie 2 × ${c} cm.` },
      sides === 2 ? { text: `${num(one, 2)} m²`, why: 'Il portone va dipinto da ENTRAMBI i lati: l’area va raddoppiata.' } : { text: `${num(2 * one, 2)} m²`, why: 'Va dipinto un solo lato.' },
      { text: `${num((sides * (w - 2 * c) * (h - 2 * c)) / 1000, 2)} m²`, why: '1 m² = 10 000 cm²: hai sbagliato la conversione.' },
    ],
    solution: [`Parte da dipingere: (${w} ${MINUS} ${2 * c}) × (${h} ${MINUS} ${2 * c}) = ${w - 2 * c} × ${h - 2 * c} = ${(w - 2 * c) * (h - 2 * c)} cm²`, `In m²: ${(w - 2 * c) * (h - 2 * c)} : 10 000 = ${num(one, 4)} m²`, sides === 2 ? `Due lati: × 2 = ${num(area, 2)} m²` : `Un lato: ${num(area, 2)} m²`],
    tip: 'Prima di calcolare porta tutte le misure nella stessa unità (cm oppure m).',
  });
}

function orto() {
  const L = pick([10, 12, 14, 15, 16]);
  const W = pick([8, 10, 12]);
  if (W >= L) throw new Error('retry');
  const square = Math.random() < 0.5;
  const dShort = pick([0.5, 1, 1.5]); // distanza dal lato corto
  let dLong;
  if (square) {
    // W − 2·dLong = L − 2·dShort
    dLong = (W - (L - 2 * dShort)) / 2;
    if (dLong <= 0) throw new Error('retry');
  } else {
    dLong = pick([0.5, 1, 2]);
  }
  const iL = L - 2 * dShort;
  const iW = W - 2 * dLong;
  if (iW <= 0) throw new Error('retry');
  const isSq = Math.abs(iL - iW) < 1e-9;
  return makeQuestion({
    text: `Un giardino rettangolare misura ${W} × ${L} metri. La recinzione dell'orto corre lungo tutto il perimetro a ${num(dLong)} m dai lati lunghi e a ${num(dShort)} m dai lati corti. Che forma ha l'orto?`,
    correct: isSq ? 'Quadrata' : 'Rettangolare',
    wrong: [
      { text: isSq ? 'Rettangolare' : 'Quadrata', why: `Dimensioni dell'orto: ${num(L)} ${MINUS} 2·${num(dShort)} = ${num(iL)} m e ${num(W)} ${MINUS} 2·${num(dLong)} = ${num(iW)} m: ${isSq ? 'sono uguali ⇒ quadrato' : 'sono diverse ⇒ rettangolo'}.` },
      { text: 'Trapezoidale', why: 'Le distanze sono costanti lungo ogni lato: i lati dell’orto restano paralleli a quelli del giardino.' },
      { text: 'Non si può sapere dai dati del problema', why: 'I dati bastano: togli le distanze da ogni lato e confronta le due dimensioni.' },
    ],
    solution: [`Lato lungo: ${num(L)} ${MINUS} 2·${num(dShort)} = ${num(iL)} m`, `Lato corto: ${num(W)} ${MINUS} 2·${num(dLong)} = ${num(iW)} m`, isSq ? 'Lati uguali ⇒ quadrato' : 'Lati diversi ⇒ rettangolo'],
  });
}

export default {
  id: 'geometria',
  title: 'Geometria e proporzioni',
  icon: '▭',
  color: '#db2777',
  description: 'Ingrandimenti, aiuole, portoni, recinzioni.',
  levels: [
    { id: 'g1', title: 'Proporzioni', description: 'Ingrandimenti e scale', pool: [ingrandimento, ingrandimento, scala] },
    { id: 'g2', title: 'Aree e perimetri', description: 'Aiuola con il passaggio', pool: [aiuolaEquazione, aiuolaPerimetro, aiuolaPerimetro, portone] },
    { id: 'g3', title: 'Come in verifica', description: 'Portone, orto, cartolina', pool: [portone, orto, orto, ingrandimento, aiuolaEquazione] },
  ],
};
