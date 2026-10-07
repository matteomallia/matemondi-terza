import equazioni1 from './equazioni1.js';
import problemi from './problemi.js';
import disequazioni1 from './disequazioni1.js';
import equazioni2 from './equazioni2.js';
import retta from './retta.js';
import parabola from './parabola.js';
import scelta from './scelta.js';
import geometria from './geometria.js';
import statistica from './statistica.js';
import { safeGenerate, shuffle } from '../lib/utils.js';

export const WORLDS = [equazioni1, problemi, disequazioni1, equazioni2, retta, parabola, scelta, geometria, statistica];

export const QUESTIONS_PER_LEVEL = 10;
export const PASS_SCORE = 7;

/** Crea le domande di un livello pescando dai generatori (senza duplicati). */
export function buildLevel(level, count = QUESTIONS_PER_LEVEL) {
  const out = [];
  const keys = new Set();
  let order = shuffle(level.pool);
  let i = 0;
  let attempts = 0;
  while (out.length < count && attempts < 300) {
    attempts++;
    if (i >= order.length) {
      order = shuffle(level.pool);
      i = 0;
    }
    const gen = order[i++];
    let q;
    try {
      q = safeGenerate(gen);
    } catch {
      continue;
    }
    const key = q.text + '|' + (q.formula || '') + '|' + q.options.find((o) => o.correct).text;
    if (keys.has(key)) continue;
    keys.add(key);
    out.push(q);
  }
  return out;
}
