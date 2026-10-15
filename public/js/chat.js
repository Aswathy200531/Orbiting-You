// Chat drawer: real-time messages (Socket.IO), voice input, spoken translations
let sock = null, chatWith = null;
const VOICE = { crystalline: [1.7, 1], aetheric: [1.3, .9], drakonic: [.2, .7], bubblish: [1.9, 1.2], leafsong: [1.2, .95], hummish: [.6, .6], clickspeak: [1, 1.5], sporish: [.8, 1.1], common: [1, 1] };
const langName = (id) => (langs.find((l) => l.id === id) || { name: id }).name;

function say(text, lang) {
  if (!('speechSynthesis' in window)) return;
  const [pitch, rate] = VOICE[lang] || [1, 1], u = new SpeechSynthesisUtterance(text);
  u.pitch = pitch; u.rate = rate; speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function connect() {
  if (sock || !window.io) return;
  sock = io();
  sock.on('connect', () => sock.emit('auth', cid));
  sock.on('chat:message', onMsg);
}
function ideaHtml(i) {
  return `<strong>💡 First date idea</strong><br>${i.emoji} <strong>${esc(i.title)}</strong>: ${esc(i.text)}<br><span class="meta">Backup: ${i.backup.emoji} ${esc(i.backup.title)}</span>`;
}
function addMsg(m) {
  const mine = m.from === me.id, d = document.createElement('div');
  d.className = 'msg ' + (mine ? 'me' : 'them');
  d.innerHTML = `<div class="l1">🗣 ${esc(langName(m.fromLang))}: ${esc(m.inFrom)}</div><div class="l2">🔁 ${esc(langName(m.toLang))}: ${esc(m.inTo)}</div><div class="l3">Meaning: ${esc(m.text)}</div><button class="spk" aria-label="Play message">🔊</button>`;
  d.querySelector('.spk').onclick = () => say(mine ? m.inFrom : m.inTo, mine ? m.fromLang : m.toLang);
  $('#cMsgs').append(d);
  $('#cMsgs').scrollTop = 1e9;
}
function onMsg(m) {
  const other = m.from === me.id ? m.to : m.from;
  if (!$('#chat').hidden && other === chatWith) addMsg(m);
  else if (m.to === me.id) toast(`New message from ${people.find((p) => p.id === m.from).name}`);
  if (m.to === me.id && $('#cAuto').checked) say(m.inTo, m.toLang);
}
async function openChat(id, first) {
  const p = people.find((x) => x.id === id);
  chatWith = id; connect();
  $('#cName').textContent = p.name;
  $('#cLang').textContent = `You speak ${langName(me.lang)}. ${p.name} speaks ${langName(p.lang)}.`;
  $('#cIdea').innerHTML = ideaHtml(matches[id]);
  $('#cMsgs').innerHTML = '';
  try { (await api(`/api/chat/${id}?cosmicId=${cid}`)).forEach(addMsg); } catch (e) { toast(e.message); }
  $('#chat').hidden = false;
  if (first) say(`Your first date idea. ${matches[id].title}. ${matches[id].text}`, 'common');
}
function sendMsg() {
  const t = $('#cText').value.trim();
  if (!t || !chatWith || !sock) return;
  sock.emit('chat:send', { to: chatWith, text: t });
  $('#cText').value = '';
}
$('#cSend').onclick = sendMsg;
$('#cText').onkeydown = (e) => { if (e.key === 'Enter') sendMsg(); };
$('#cClose').onclick = () => { $('#chat').hidden = true; speechSynthesis.cancel(); };
$('#cMic').onclick = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { toast('Voice input needs Chrome or Edge.'); return; }
  const r = new SR();
  r.lang = 'en-US';
  r.onstart = () => $('#cMic').classList.add('on');
  r.onend = () => $('#cMic').classList.remove('on');
  r.onresult = (e) => { $('#cText').value = e.results[0][0].transcript; sendMsg(); };
  r.onerror = () => toast('Could not hear you. Allow the microphone or type instead.');
  r.start();
};
