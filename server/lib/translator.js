// Fake "universal translator": every alien language is a deterministic syllable dictionary.
const LANGS = {
  common:     { name: 'Galactic Common' },
  crystalline:{ name: 'Crystalline', syl: ['ky','ri','ze','el','sha','vi','lu'], sep: '' },
  aetheric:   { name: 'Aetheric',    syl: ['ae','lo','ven','thi','ra','si','mir'], sep: "'" },
  drakonic:   { name: 'Drakonic',    syl: ['dra','ghor','vok','ul','kar','zath','mog'], sep: '' },
  bubblish:   { name: 'Bubblish',    syl: ['blu','bo','glub','ploo','wa','bli'], sep: '-' },
  leafsong:   { name: 'Leafsong',    syl: ['fe','lo','na','wi','sha','ora','ly'], sep: '' },
  hummish:    { name: 'Hummish',     syl: ['mm','hum','rrm','oom','vv','hmm'], sep: '-' },
  clickspeak: { name: 'Clickspeak',  syl: ['tk','ik','ck','ak','tsk','uk'], sep: '!' },
  sporish:    { name: 'Sporish',     syl: ['spo','fu','mu','pff','ra','ni'], sep: '' }
};
function translate(text, lang) {
  const L = LANGS[lang];
  if (!L || !L.syl) return text;
  return text.replace(/[A-Za-z']+/g, (w) => {
    let h = 0;
    for (const c of lang + w.toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const parts = [];
    for (let i = 0; i < Math.max(1, Math.ceil(w.length / 3)); i++) {
      parts.push(L.syl[h % L.syl.length]);
      h = (h * 1103515245 + 12345) >>> 0;
    }
    const out = parts.join(L.sep);
    return /^[A-Z]/.test(w) ? out[0].toUpperCase() + out.slice(1) : out;
  });
}
module.exports = { LANGS, translate };
