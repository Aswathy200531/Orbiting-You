// Tiny JSON-file "database". Swap for SQLite/MongoDB when you outgrow it.
const fs = require('fs');
const path = require('path');
const seed = require('../data/seed-profiles.json');
const FILE = path.join(__dirname, '../data/db.json');
let db = { users: [], matches: [], messages: [] };
try { db = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) { /* first run */ }
const save = () => fs.writeFileSync(FILE, JSON.stringify(db, null, 1));
const all = () => seed.concat(db.users);
module.exports = {
  all,
  save,
  get: (id) => all().find((p) => p.id === id),
  byCosmic: (cid) => all().find((p) => p.cosmicId === cid),
  addUser(u) { db.users.push(u); save(); return u; },
  addMatch(a, b) { if (!this.isMatch(a, b)) { db.matches.push([a, b]); save(); } },
  isMatch: (a, b) => db.matches.some((m) => m.includes(a) && m.includes(b)),
  matchesOf: (id) => db.matches.filter((m) => m.includes(id)).map((m) => m.find((x) => x !== id)),
  addMessage(m) { const r = { ...m, ts: Date.now() }; db.messages.push(r); save(); return r; },
  history: (a, b) => db.messages.filter((m) => (m.from === a && m.to === b) || (m.from === b && m.to === a))
};
