import { rand, pick, num, euro, makeQuestion, MINUS, cx } from '../lib/utils.js';

const CTX = [
  { what: 'palestra', A: 'Sporting Club', B: 'Happiness', fixed: 'tessera', unit: 'lezione', units: 'lezioni', fA: [120, 180], pA: [18, 23], fB: [60, 110], pB: [24, 30] },
  { what: 'noleggio auto', A: 'Compagnia A', B: 'Compagnia B', fixed: 'quota fissa', unit: 'giorno', units: 'giorni', fA: [10, 30], pA: [18, 22], fB: [0, 0], pB: [24, 28] },
  { what: 'impianti di risalita', A: 'Offerta A', B: 'Offerta B', fixed: 'costo iniziale', unit: 'giornaliero', units: 'giorni', fA: [80, 120], pA: [10, 14], fB: [0, 0], pB: [26, 30] },
  { what: 'abbonamento telefonico', A: 'Tariffa A', B: 'Tariffa B', fixed: 'costo di attivazione', unit: 'mese', units: 'mesi', fA: [30, 50], pA: [5, 8], fB: [0, 10], pB: [9, 12] },
];

function data() {
  const c = pick(CTX);
  const fA = rand(...c.fA);
  const pA = rand(...c.pA);
  const fB = rand(...c.fB);
  const pB = rand(...c.pB);
  if (!(fA > fB && pA < pB)) throw new Error('retry');
  return { ...c, fA, pA, fB, pB, cA: (n) => fA + pA * n, cB: (n) => fB + pB * n };
}
const descr = (d) =>
  `${d.A}: ${d.fA ? `${d.fixed} di ${d.fA} € più ` : ''}${d.pA} € per ogni ${d.unit}. ${d.B}: ${d.fB ? `${d.fixed} di ${d.fB} € più ` : 'nessun costo fisso e '}${d.pB} € per ogni ${d.unit}.`;

// ---------- LIVELLO 1 ----------

function confronto() {
  const d = data();
  const n = rand(3, 30);
  const a = d.cA(n);
  const b = d.cB(n);
  const calc = `${d.A}: ${d.fA} + ${d.pA}·${n} = ${euro(a)};  ${d.B}: ${d.fB ? d.fB + ' + ' : ''}${d.pB}·${n} = ${euro(b)}`;
  const correct = a === b ? 'È indifferente' : a < b ? `Conviene ${d.A} (${euro(a)})` : `Conviene ${d.B} (${euro(b)})`;
  return makeQuestion({
    text: `${d.what[0].toUpperCase() + d.what.slice(1)}. ${descr(d)} Per ${n} ${d.units}, quale conviene?`,
    correct,
    wrong: [
      { text: `Conviene ${d.A} (${euro(a)})`, why: calc },
      { text: `Conviene ${d.B} (${euro(b)})`, why: calc },
      { text: 'È indifferente', why: calc },
      { text: `Conviene ${d.B}, perché non ha costi fissi`, why: `Non basta guardare il costo fisso: ${calc}.` },
    ],
    solution: ['Costo totale = parte fissa + costo unitario × quantità', calc, correct],
  });
}

function costoTotale() {
  const d = data();
  const n = rand(3, 25);
  const useA = Math.random() < 0.5;
  const [f, p, name] = useA ? [d.fA, d.pA, d.A] : [d.fB, d.pB, d.B];
  if (!f) throw new Error('retry');
  return makeQuestion({
    text: `${descr(d)} Quanto si spende in totale con ${name} per ${n} ${d.units}?`,
    correct: euro(f + p * n),
    wrong: [
      { text: euro(p * n), why: `Manca la parte fissa (${d.fixed}): ${euro(f)}.` },
      { text: euro((f + p) * n), why: `La parte fissa si paga una volta sola, non per ogni ${d.unit}.` },
      { text: euro(f + p), why: `Il costo per ${d.unit} va moltiplicato per ${n}.` },
    ],
    solution: [`${euro(f)} + ${p} × ${n} = ${euro(f)} + ${euro(p * n)} = ${euro(f + p * n)}`],
  });
}

// ---------- LIVELLO 2 ----------

function espressioni() {
  const fA = pick([1000, 1500, 2000, 2500]);
  const pA = pick([8, 10, 12]);
  const fB = fA - pick([500, 1000]);
  const pB = pA + pick([3, 5]);
  if (fB <= 0) throw new Error('retry');
  return makeQuestion({
    text: `Una fabbrica può produrre un tessuto A (costi fissi giornalieri ${fA} € e ${pA} € per metro) oppure un tessuto B (costi fissi ${fB} € e ${pB} € per metro). Quali espressioni danno il costo C al variare dei metri x?`,
    correct: `C(A) = ${fA} + ${cx(pA)}  e  C(B) = ${fB} + ${cx(pB)}`,
    wrong: [
      { text: `C(A) = ${fA + pA}x  e  C(B) = ${fB + pB}x`, why: 'Il costo fisso non dipende dai metri: non va moltiplicato per x.' },
      { text: `C(A) = (${fA} + ${pA})x  e  C(B) = (${fB} + ${pB})x`, why: 'Così anche il costo fisso verrebbe moltiplicato per i metri.' },
      { text: `C(A) = ${fA}x + ${pA}  e  C(B) = ${fB}x + ${pB}`, why: 'È il costo AL METRO che va moltiplicato per x, non il costo fisso.' },
    ],
    solution: ['Costo = costo fisso + costo al metro × x', `C(A) = ${fA} + ${cx(pA)} ;  C(B) = ${fB} + ${cx(pB)}`],
  });
}

function equilibrio() {
  const pA = rand(8, 14);
  const pB = pA + rand(2, 6);
  const n = pick([50, 100, 125, 150, 200, 250]);
  const fB = pick([500, 800, 1000, 1200]);
  const fA = fB + (pB - pA) * n;
  const chk = (m) => `con ${m} m: A costa ${euro(fA + pA * m)}, B costa ${euro(fB + pB * m)}`;
  return makeQuestion({
    text: `Tessuto A: costi fissi ${fA} € + ${pA} € al metro. Tessuto B: costi fissi ${fB} € + ${pB} € al metro. Trova il punto di equilibrio (i metri per cui i costi sono uguali).`,
    correct: `${n} metri`,
    wrong: [
      { text: `${fA - fB} metri`, why: `${fA - fB} è la differenza dei costi fissi: va divisa per la differenza dei costi al metro (${pB - pA}). Verifica: ${chk(fA - fB)}.` },
      { text: `${Math.round((fA + fB) / (pB - pA))} metri`, why: `I costi fissi vanno sottratti, non sommati. Verifica: ${chk(Math.round((fA + fB) / (pB - pA)))}.` },
      { text: `${n * 2} metri`, why: `Verifica: ${chk(n * 2)}.` },
      { text: `${Math.round(n / 2)} metri`, why: `Verifica: ${chk(Math.round(n / 2))}.` },
    ],
    solution: [`${fA} + ${cx(pA)} = ${fB} + ${cx(pB)}`, `${fA} ${MINUS} ${fB} = ${cx(pB)} ${MINUS} ${cx(pA)} ⇒ ${fA - fB} = ${pB - pA}x`, `x = ${fA - fB} : ${pB - pA} = ${n} metri`],
  });
}

// ---------- LIVELLO 3: come in verifica ----------

function finoAQuando() {
  // B senza costo fisso: conviene per pochi giorni
  const pA = rand(10, 14);
  const pB = rand(24, 30);
  const g = rand(4, 9);
  const fA = (pB - pA) * g;
  const ask = pick(['uguale', 'meno']);
  const chk = (m) => `con ${m} giorni: A = ${euro(fA + pA * m)}, B = ${euro(pB * m)}`;
  return makeQuestion({
    text: `Per gli impianti sciistici Mario può scegliere: OFFERTA A ${fA} € fissi + ${pA} € per ogni giornaliero; OFFERTA B ${pB} € al giorno senza costo iniziale. ${ask === 'uguale' ? 'Dopo quanti giorni le due offerte costano uguale?' : "Fino a quanti giorni conviene l'offerta B (cioè costa meno)?"}`,
    correct: ask === 'uguale' ? `${g} giorni` : `Fino a ${g - 1} giorni`,
    wrong:
      ask === 'uguale'
        ? [g + 1, g - 1, Math.round(fA / pA)].filter((m) => m !== g && m > 0).map((m) => ({ text: `${m} giorni`, why: `Verifica: ${chk(m)}. Non sono uguali.` }))
        : [
            { text: `Fino a ${g} giorni`, why: `A ${g} giorni costano uguale (${chk(g)}), quindi B non costa MENO.` },
            { text: `Da ${g + 1} giorni in poi`, why: `Dopo ${g} giorni conviene A: ${chk(g + 1)}.` },
            { text: 'Sempre', why: `Per molti giorni conviene A: ${chk(g + 5)}.` },
          ],
    solution: [`${fA} + ${cx(pA)} = ${cx(pB)} ⇒ ${fA} = ${pB - pA}x ⇒ x = ${g}`, `A ${g} giorni costano uguale; per meno giorni conviene B, per più giorni conviene A.`],
  });
}

function albergo() {
  const s = rand(20, 40);
  const d = rand(30, 60);
  const t = rand(10, 25);
  return makeQuestion({
    text: `In un albergo ci sono ${s} camere singole, ${d} doppie e ${t} con tre letti. Una singola costa x, una doppia y; le camere a tre letti costano il doppio delle singole. Quale relazione dà il ricavo giornaliero R quando sono tutte occupate?`,
    correct: `R = ${s}x + ${d}y + ${t}·2x`,
    wrong: [
      { text: `R = ${s}x + ${d}y + ${t}x²`, why: '“Il doppio” vuol dire 2x, non x².' },
      { text: `R = (${s} + ${d} + ${t})xy`, why: 'Ogni tipo di camera ha il suo prezzo: si moltiplica e poi si somma.' },
      { text: `R = ${s}x + ${d}y + ${t}x`, why: 'Le camere a tre letti costano il DOPPIO della singola: 2x.' },
      { text: `R = ${s + d}(x + y) + ${t}·2x`, why: 'Le singole costano x e le doppie y: non si possono raggruppare così.' },
    ],
    solution: [`Singole: ${s}·x;  doppie: ${d}·y;  triple: ${t}·2x`, `R = ${s}x + ${d}y + ${t}·2x = ${s + 2 * t}x + ${d}y`],
  });
}

export default {
  id: 'scelta',
  title: 'Problemi di scelta',
  icon: '€',
  color: '#ca8a04',
  description: 'Costi fissi e variabili, punto di equilibrio.',
  levels: [
    { id: 's1', title: 'Quale conviene?', description: 'Calcolare e confrontare', pool: [confronto, confronto, costoTotale] },
    { id: 's2', title: 'Funzioni di costo', description: 'Espressioni e punto di equilibrio', pool: [espressioni, equilibrio, equilibrio, confronto] },
    { id: 's3', title: 'Come in verifica', description: 'Sciistica, albergo, tessuti', pool: [finoAQuando, finoAQuando, albergo, equilibrio, confronto] },
  ],
};
