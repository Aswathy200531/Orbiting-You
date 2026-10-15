// Seed profiles answer for themselves when nobody is logged in as them.
const LINES = [
  'Hello! My hearts just skipped a beat.',
  'I told my mother-ship about you. She approves.',
  'Do you prefer moonlight or double moonlight?',
  'Tell me more about your home planet!',
  'You make my antennae tingle. Is that normal?',
  'I could talk to you until the suns come up.'
];
const botReply = (bot, text) => LINES[(text.length + bot.name.length) % LINES.length];
module.exports = { botReply };
