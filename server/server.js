const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const store = require('./lib/store');
const { compat } = require('./lib/compat');
const { LANGS, translate } = require('./lib/translator');
const { dateIdea } = require('./lib/dateIdeas');
const { botReply } = require('./lib/bots');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const norm = (s) => String(s || '').trim().toUpperCase();
const pub = ({ cosmicId, ...p }) => p; // never expose Cosmic IDs in the public list
const auth = (req, res, next) => {
  const u = store.byCosmic(norm(req.body.cosmicId || req.query.cosmicId));
  if (!u) return res.status(401).json({ error: 'Unknown Cosmic ID' });
  req.me = u;
  next();
};
const view = (m) => {
  const a = store.get(m.from), b = store.get(m.to);
  return { ...m, fromLang: a.lang, toLang: b.lang, inFrom: translate(m.text, a.lang), inTo: translate(m.text, b.lang) };
};

app.get('/api/profiles', (_, res) => res.json(store.all().map(pub)));
app.get('/api/languages', (_, res) => res.json(Object.entries(LANGS).map(([id, l]) => ({ id, name: l.name }))));

app.post('/api/register', (req, res) => {
  const id = norm(req.body.cosmicId), name = String(req.body.name || '').trim().slice(0, 30);
  if (!/^[A-Z0-9-]{4,20}$/.test(id)) return res.status(400).json({ error: 'Cosmic ID must be 4 to 20 letters, numbers or dashes.' });
  if (!name) return res.status(400).json({ error: 'Please enter your name.' });
  if (store.byCosmic(id)) return res.status(409).json({ error: 'That Cosmic ID is taken in this galaxy. Pick another.' });
  res.json({ profile: store.addUser({ id: 'u' + Date.now().toString(36), cosmicId: id, name, lang: 'common', bioDone: false }) });
});
app.post('/api/login', (req, res) => {
  const u = store.byCosmic(norm(req.body.cosmicId));
  u ? res.json({ profile: u }) : res.status(404).json({ error: 'No being found with this Cosmic ID. Register first.' });
});

const FIELDS = ['g', 'age', 'species', 'planet', 'bio', 'hands', 'eyes', 'legs', 'ant', 'skin', 'lang', 'pref', 'm', 'badge', 'bioDone', 'auto'];
app.put('/api/profile', auth, (req, res) => {
  const p = req.body.profile || {};
  FIELDS.forEach((k) => { if (k in p) req.me[k] = p[k]; });
  if (!LANGS[req.me.lang]) req.me.lang = 'common';
  store.save();
  res.json({ profile: req.me });
});

app.post('/api/interest', auth, (req, res) => {
  const t = store.get(req.body.toId);
  if (!t || t.id === req.me.id) return res.status(400).json({ error: 'Pick someone else.' });
  const c = compat(req.me, t, req.body.prefs);
  if (!c.ok) return res.json({ match: false, score: c.score });
  store.addMatch(req.me.id, t.id);
  res.json({ match: true, score: c.score, idea: dateIdea(req.me, t) });
});
app.get('/api/matches', auth, (req, res) =>
  res.json(store.matchesOf(req.me.id).map((id) => ({ id, idea: dateIdea(req.me, store.get(id)) }))));
app.get('/api/chat/:id', auth, (req, res) => {
  if (!store.isMatch(req.me.id, req.params.id)) return res.status(403).json({ error: 'Not matched yet.' });
  res.json(store.history(req.me.id, req.params.id).map(view));
});

function send(from, to, text) {
  const out = view(store.addMessage({ from, to, text }));
  io.to(from).to(to).emit('chat:message', out);
  const target = store.get(to);
  const online = io.sockets.adapter.rooms.get(to);
  if (target.bot && !(online && online.size)) setTimeout(() => send(to, from, botReply(target, text)), 1200);
}
io.on('connection', (s) => {
  s.on('auth', (cid) => { const u = store.byCosmic(norm(cid)); if (u) { s.uid = u.id; s.join(u.id); } });
  s.on('chat:send', ({ to, text }) => {
    if (s.uid && text && store.isMatch(s.uid, to)) send(s.uid, to, String(text).slice(0, 500));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Cosmic Jodi running at http://localhost:${PORT}`));
