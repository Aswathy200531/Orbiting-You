function dateIdea(a, b) {
  const seed = [...(a.id + b.id)].reduce((s, c) => s + c.charCodeAt(0), 0);
  const I = [];
  const add = (emoji, title, text) => I.push({ emoji, title, text });
  if (a.legs === 0 || b.legs === 0) add('🛸', 'Zero-gravity picnic', 'Float side by side on a drifting comet while the snacks orbit around you.');
  if (a.hands + b.hands >= 8) add('🍲', 'Many-handed cook-off', `With ${a.hands + b.hands} hands between you, cook a nine-course dinner in ten minutes.`);
  if (a.eyes + b.eyes >= 6) add('🔭', 'Double-count stargazing', `With ${a.eyes + b.eyes} eyes between you, count every star twice and argue about the total.`);
  if (a.skin === b.skin) add('📸', 'Twin-colour photoshoot', 'Wear matching outfits in front of a nebula and pose like a royal family portrait.');
  if ([a, b].some((x) => x.species === 'Human')) add('🍜', 'Earth night', 'Recreate an Earth dinner: instant noodles, old songs from a laptop and candlelight.');
  if (a.lang !== b.lang) add('🎭', 'Translator-off charades', 'Switch off the universal translator for one hour and use only gestures and dramatic sighs.');
  add('🌅', 'Sunset swap', `Show each other a favourite sunset from ${a.planet} and ${b.planet}. Bring snacks.`);
  add('🏄', 'Moon-surfing and meteor shower', 'Ride a lunar wave at dusk, then lie back and watch the meteors.');
  const i = seed % I.length;
  const { emoji, title } = I[(i + 1) % I.length];
  return { ...I[i], backup: { emoji, title } };
}
module.exports = { dateIdea };
