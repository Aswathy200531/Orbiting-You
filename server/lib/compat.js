const KEYS = ['hands', 'eyes', 'legs', 'ant', 'skin'];
// prefs: { g, hands, eyes, legs, ant, skin } where '' / null means "any"
function compat(me, target, prefs) {
  const p = prefs || me.pref || {};
  if (p.g && target.g !== p.g) return { ok: false, score: 0 };
  const set = KEYS.filter((k) => p[k] !== undefined && p[k] !== null && p[k] !== '');
  if (!set.length) return { ok: true, score: 100 };
  const hit = set.filter((k) => String(target[k]) === String(p[k])).length;
  const score = Math.round((100 * hit) / set.length);
  return { ok: score >= 60, score };
}
module.exports = { compat };
