import { rand, pick, num, numFixed, perc, euro, makeQuestion, MINUS, shuffle } from '../lib/utils.js';

// ---------- LIVELLO 1: media e percentuali ----------

function mediaTrimestre() {
  const v = [rand(20, 90) * 1000, rand(20, 90) * 1000, rand(20, 90) * 1000];
  const S = v[0] + v[1] + v[2];
  const m = S / 3;
  const months = pick([['Ottobre', 'Novembre', 'Dicembre'], ['Gennaio', 'Febbraio', 'Marzo'], ['Aprile', 'Maggio', 'Giugno']]);
  return makeQuestion({
    text: 'Una ditta nel trimestre ha incassato quanto riportato in tabella. Qual è stato l’incasso medio mensile?',
    visual: { type: 'table', headers: ['Mese', 'Incasso'], rows: months.map((mo, i) => [mo, euro(v[i])]) },
    correct: euro(Math.round(m * 100) / 100),
    wrong: [
      { text: euro(S), why: `${euro(S)} è il totale: va diviso per 3 mesi.` },
      { text: euro((Math.max(...v) + Math.min(...v)) / 2), why: 'La media usa tutti e tre i valori, non solo il massimo e il minimo.' },
      { text: euro(v[1]), why: 'Questo è il valore centrale della tabella, non la media.' },
      { text: euro(S / 2), why: 'I mesi sono 3: si divide per 3.' },
    ],
    solution: [`Somma: ${v.map((x) => euro(x)).join(' + ')} = ${euro(S)}`, `Media = ${euro(S)} : 3 = ${euro(Math.round(m * 100) / 100)}`],
  });
}

function percentualeParte() {
  const T = rand(150, 600);
  const p = rand(Math.round(T * 0.2), Math.round(T * 0.7));
  const ctx = pick([
    ['iscritti alla palestra', 'maschi'],
    ['studenti della scuola', 'ragazze'],
    ['spettatori', 'bambini'],
  ]);
  const r = (p / T) * 100;
  return makeQuestion({
    text: `Su ${T} ${ctx[0]}, ${p} sono ${ctx[1]}. Qual è la percentuale di ${ctx[1]}? (arrotonda a 1 decimale)`,
    correct: `${numFixed(r, 1)}%`,
    wrong: [
      { text: `${numFixed(((T - p) / T) * 100, 1)}%`, why: `Questa è la percentuale della parte restante (${T - p} su ${T}).` },
      { text: `${numFixed((p / (T - p)) * 100, 1)}%`, why: `Al denominatore va il TOTALE (${T}), non solo l'altra parte.` },
      { text: `${numFixed(p / T, 1)}%`, why: `${p}/${T} = ${num(p / T, 3)}: per avere la percentuale devi moltiplicare per 100.` },
    ],
    solution: [`Percentuale = parte / totale × 100`, `${p} / ${T} × 100 = ${numFixed(r, 1)}%`],
  });
}

function votoNecessario() {
  for (let t = 0; t < 300; t++) {
    const n = rand(5, 7);
    const g = Array.from({ length: n }, () => pick([4, 4.5, 5, 5.5, 6, 6.5, 7]));
    const minG = Math.min(...g);
    const kept = [...g];
    kept.splice(kept.indexOf(minG), 1);
    const S = kept.reduce((s, x) => s + x, 0);
    const cnt = kept.length + 1;
    const x = 6 * cnt - S;
    if (x < 6 || x > 9) continue;
    const res = (v) => (S + v) / cnt;
    return makeQuestion({
      text: `Uno studente ha preso questi voti: ${g.map((v) => num(v)).join(' – ')}. La professoressa NON tiene conto del voto più basso e gli fa fare un'altra prova. Che voto deve prendere, come minimo, per avere la sufficienza?`,
      correct: num(x),
      wrong: [x - 0.5, x + 0.5, x + 1, x - 1].filter((v) => v > 0 && v <= 10).map((v) => ({ text: num(v), why: `Con ${num(v)} la media sarebbe (${num(S)} + ${num(v)}) / ${cnt} = ${num(res(v), 2)}${res(v) < 6 ? ': insufficiente.' : ': va bene, ma basta un voto più basso!'}` })),
      solution: [`Tolgo il voto più basso (${num(minG)}): restano ${kept.length} voti, somma ${num(S)}`, `Con la nuova prova i voti sono ${cnt}: serve una somma di 6 × ${cnt} = ${6 * cnt}`, `Voto: ${6 * cnt} ${MINUS} ${num(S)} = ${num(x)}`],
    });
  }
  throw new Error('retry');
}

// ---------- LIVELLO 2: tabelle e grafici ----------

const CORSI = ['Pilates', 'Spinning', 'Zumba', 'Pesi', 'Yoga'];

function tabellaPalestra() {
  const corsi = shuffle(CORSI).slice(0, 4);
  const M = corsi.map(() => rand(5, 40));
  const F = corsi.map(() => rand(5, 40));
  const tm = M.reduce((s, x) => s + x, 0);
  const tf = F.reduce((s, x) => s + x, 0);
  const T = tm + tf;
  const askM = Math.random() < 0.5;
  const part = askM ? tm : tf;
  const other = askM ? tf : tm;
  const lab = askM ? 'maschi' : 'femmine';
  return makeQuestion({
    text: `La tabella riporta gli iscritti ai corsi di una palestra. Qual è la percentuale di ${lab} che frequentano la palestra?`,
    visual: { type: 'table', headers: ['Corso', 'Maschi', 'Femmine'], rows: [...corsi.map((c, i) => [c, M[i], F[i]]), ['Totale', tm, tf]] },
    correct: `${numFixed((part / T) * 100, 1)}%`,
    wrong: [
      { text: `${numFixed((other / T) * 100, 1)}%`, why: `Questa è la percentuale di ${askM ? 'femmine' : 'maschi'}.` },
      { text: `${numFixed((part / other) * 100, 1)}%`, why: `Hai diviso ${lab} per ${askM ? 'femmine' : 'maschi'}: si divide per il TOTALE degli iscritti (${T}).` },
      { text: `${numFixed(part / T, 1)}%`, why: 'Hai dimenticato di moltiplicare per 100.' },
      { text: `${part}%`, why: `${part} è il numero di ${lab}, non la percentuale.` },
    ],
    solution: [`Totale ${lab}: ${part};  totale iscritti: ${tm} + ${tf} = ${T}`, `${part} / ${T} × 100 = ${numFixed((part / T) * 100, 1)}%`],
  });
}

function mediaPonderata() {
  const scores = pick([[5, 6, 7, 8, 9], [6, 7, 8, 9, 10], [4, 5, 6, 7, 8]]);
  const f = scores.map(() => rand(1, 9));
  const N = f.reduce((s, x) => s + x, 0);
  const S = scores.reduce((s, x, i) => s + x * f[i], 0);
  const m = S / N;
  const simple = scores.reduce((s, x) => s + x, 0) / scores.length;
  if (Math.abs(simple - m) < 0.05) throw new Error('retry');
  return makeQuestion({
    text: 'Il grafico mostra quante coppie hanno ottenuto ciascun punteggio in una gara di ballo. Qual è il punteggio medio? (arrotonda a 2 decimali)',
    visual: { type: 'bars', title: 'Numero di coppie per punteggio', labels: scores.map((x) => `${x} punti`), values: f },
    correct: numFixed(m, 2),
    wrong: [
      { text: numFixed(simple, 2), why: 'Hai fatto la media dei punteggi senza tener conto di quante coppie hanno preso ciascun punteggio (media ponderata!).' },
      { text: numFixed(N / scores.length, 2), why: 'Questa è la media del numero di coppie, non del punteggio.' },
      { text: numFixed(S / scores.length, 2), why: `Dividi per il numero di COPPIE (${N}), non per il numero di punteggi.` },
    ],
    solution: [`Somma dei punteggi: ${scores.map((x, i) => `${x}·${f[i]}`).join(' + ')} = ${S}`, `Coppie: ${f.join(' + ')} = ${N}`, `Media = ${S} / ${N} = ${numFixed(m, 2)}`],
  });
}

// ---------- LIVELLO 3: probabilità ----------

const del = (p) => (p === 1 || p === 8 || p === 11 ? `dell'${p}%` : `del ${p}%`);

function lotteria() {
  const p1 = rand(1, 8);
  const p2 = rand(1, 6);
  return makeQuestion({
    text: `Giulia e Gianni comprano biglietti diversi di una lotteria. La probabilità che Giulia vinca il primo premio è ${del(p1)}, quella di Gianni ${del(p2)}. Qual è la probabilità che Giulia o Gianni vincano il primo premio?`,
    correct: `${p1 + p2}%`,
    wrong: [
      { text: `${num((p1 * p2) / 100, 2)}%`, why: '“O” tra eventi che non possono capitare insieme (c’è un solo primo premio): le probabilità si SOMMANO.' },
      { text: `${Math.max(p1, p2)}%`, why: 'Vincono se vince l’uno OPPURE l’altro: si sommano le probabilità.' },
      { text: `${num((p1 + p2) / 2, 1)}%`, why: 'Non si fa la media: si sommano.' },
    ],
    solution: ['Un solo primo premio: i due eventi non possono avvenire insieme (incompatibili)', `P(Giulia o Gianni) = ${p1}% + ${p2}% = ${p1 + p2}%`],
  });
}

function sportTabella() {
  const sports = ['Calcio', 'Nuoto', 'Pallavolo', 'Basket'];
  const M = sports.map(() => rand(10, 60));
  const F = sports.map(() => rand(10, 60));
  const T = M.reduce((s, x) => s + x, 0) + F.reduce((s, x) => s + x, 0);
  const [i, j] = shuffle([0, 1, 2, 3]).slice(0, 2);
  const fav = M[i] + F[i] + M[j] + F[j];
  return makeQuestion({
    text: `La tabella riporta gli sport praticati dagli studenti di una scuola (ognuno ne pratica uno solo). Prendendo a caso uno studente, qual è la probabilità che pratichi ${sports[i].toLowerCase()} o ${sports[j].toLowerCase()}? (in percentuale, 1 decimale)`,
    visual: { type: 'table', headers: ['Sport', 'Ragazzi', 'Ragazze'], rows: sports.map((s, k) => [s, M[k], F[k]]) },
    correct: `${numFixed((fav / T) * 100, 1)}%`,
    wrong: [
      { text: `${numFixed(((M[i] + F[i]) / T) * 100, 1)}%`, why: `Hai contato solo ${sports[i].toLowerCase()}: con “o” vanno sommati anche gli studenti di ${sports[j].toLowerCase()}.` },
      { text: `${numFixed(((M[i] + M[j]) / T) * 100, 1)}%`, why: 'Hai contato solo i ragazzi: servono ragazzi E ragazze.' },
      { text: `${numFixed((((M[i] + F[i]) * (M[j] + F[j])) / (T * T)) * 100, 1)}%`, why: 'Con “o” si sommano i casi favorevoli, non si moltiplicano le probabilità.' },
      { text: `${numFixed(((T - fav) / T) * 100, 1)}%`, why: 'Questa è la probabilità degli altri sport.' },
    ],
    solution: [`Totale studenti: ${T}`, `Favorevoli: ${M[i]} + ${F[i]} + ${M[j]} + ${F[j]} = ${fav}`, `P = ${fav} / ${T} ≈ ${perc(fav / T)}`],
  });
}

export default {
  id: 'statistica',
  title: 'Statistica e probabilità',
  icon: 'x̄ %',
  color: '#0d9488',
  description: 'Media, percentuali, grafici e probabilità.',
  levels: [
    { id: 'st1', title: 'Media e percentuali', description: 'Incasso medio, percentuali, voto', pool: [mediaTrimestre, percentualeParte, votoNecessario] },
    { id: 'st2', title: 'Tabelle e grafici', description: 'Percentuali dalla tabella e media ponderata', pool: [tabellaPalestra, mediaPonderata, mediaPonderata, percentualeParte] },
    { id: 'st3', title: 'Come in verifica', description: 'Probabilità con “o” e tabelle', pool: [lotteria, sportTabella, sportTabella, tabellaPalestra, votoNecessario] },
  ],
};
