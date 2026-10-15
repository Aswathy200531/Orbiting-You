
const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SKINS={brown:'#8a5a3c',grey:'#9aa3ad',white:'#eef2f7',black:'#2b2b35',teal:'#2ec4b6',purple:'#9b6bff',pink:'#ff6fae',lime:'#9be34a',blue:'#4aa3ff',orange:'#ff9f43',peach:'#f1c6a0'};
const SYN={gray:'grey',silver:'white',pale:'white',green:'lime',violet:'purple',magenta:'pink',cyan:'teal',yellow:'orange',human:'peach'};

function alien(a){
  const k=SKINS[a.skin]||a.skin;let s=`<svg class="cart" viewBox="0 0 120 150" role="img" aria-label="Portrait of ${esc(a.name)}">`;
  for(let i=0;i<a.ant;i++){const x=60+(i-(a.ant-1)/2)*20,tx=x+(x-60)*.4;
    s+=`<path d="M${60+(x-60)*.5} 38 Q${x} 16 ${tx} 10" stroke="${k}" stroke-width="3" fill="none"/><circle cx="${tx}" cy="10" r="4.5" fill="#ffd166"/>`}
  for(let i=0;i<a.hands;i++){const sd=i%2?1:-1,r=Math.floor(i/2),y0=72+r*8,x1=60+sd*(48+r*3),y1=y0+14;
    s+=`<line x1="${60+sd*22}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${k}" stroke-width="5" stroke-linecap="round"/><circle cx="${x1}" cy="${y1}" r="4.5" fill="${k}"/>`}
  for(let i=0;i<a.legs;i++){const x=60+(i-(a.legs-1)/2)*14;
    s+=`<line x1="${x*.7+18}" y1="116" x2="${x}" y2="144" stroke="${k}" stroke-width="6" stroke-linecap="round"/><ellipse cx="${x}" cy="146" rx="6" ry="3" fill="${k}"/>`}
  s+=`<ellipse cx="60" cy="90" rx="26" ry="32" fill="${k}"/><ellipse cx="60" cy="96" rx="14" ry="18" fill="#fff" opacity=".18"/>`;
  s+=`<ellipse cx="60" cy="50" rx="30" ry="26" fill="${k}"/>`;
  if(a.hair)s+=`<path d="M30 48 Q32 20 60 22 Q88 20 90 48 Q80 32 60 33 Q40 32 30 48Z" fill="#2b1a12"/>`;
  const n=a.eyes,rows=n>3?2:1,per=[Math.ceil(n/rows),n-Math.ceil(n/rows)];
  const er=n==1?10:n>4?5:6.5;
  for(let r=0;r<rows;r++){const c=per[r],y=rows==1?50:43+r*13;
    for(let j=0;j<c;j++){const x=60+(j-(c-1)/2)*(c>3?12:16);
      s+=`<circle cx="${x}" cy="${y}" r="${er}" fill="#fff"/><circle cx="${x+1}" cy="${y}" r="${er*.5}" fill="#1a0d22"/>`}}
  s+=`<path d="M50 65 Q60 73 70 65" stroke="#2a0b14" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  s+=`<circle cx="42" cy="62" r="4" fill="#ff8aa8" opacity=".5"/><circle cx="78" cy="62" r="4" fill="#ff8aa8" opacity=".5"/></svg>`;
  return s;
}

function portrait(p){
  const m=p.m,id=p.id,f=p.g==='f',sc=m.sclera||'#150a1f',pi=Math.PI,gl=m.glow||'#3de8d0',br=m.brow||m.hair||'#1a0d14';
  const wing=`<g fill="${m.wing||'#ffe3d6'}" fill-opacity=".4" stroke="#f2b8a6" stroke-width="1.4"><path d="M58 100C40 70 22 40 12 4C42 22 64 50 74 78Z"/><path d="M54 114C30 106 12 90 2 68C28 76 46 90 60 102Z"/><path d="M58 100L30 38M64 92L44 24M56 108L22 76" fill="none" stroke-width="1"/></g>`;
  const side=`<g>${p.ant>=2?wing:m.human||m.round?`<ellipse cx="53" cy="106" rx="7" ry="13" fill="${m.skin2}"/>`:`<path d="M56 98L26 84L54 118Z" fill="${m.skin2}"/>`}${m.horns?`<path d="M66 54C50 34 54 12 68 2C62 22 72 36 82 48Z" fill="#2a1a24" stroke="${gl}" stroke-width="1"/>`:""}${f?`<circle cx="53" cy="122" r="3.5" fill="#ffd166"/><circle cx="53" cy="128" r="2.4" fill="${gl}"/>`:""}</g>`;
  const Es={1:[[100,100,22]],2:[[78,102,17],[122,102,17]],3:[[78,104,16],[122,104,16],[100,68,8]],4:[[78,104,15],[122,104,15],[74,80,8],[126,80,8]],5:[[78,106,14],[122,106,14],[74,82,8],[126,82,8],[100,64,7]]}[Math.min(p.eyes,5)]||[];
  const eye=([x,y,w])=>{const r=m.round?w*.2:w*.08,ry=m.round?w*.2:w*.36;return `<path d="M${x-w} ${y}Q${x} ${y-w} ${x+w} ${y}Q${x} ${y+w*.8} ${x-w} ${y}Z" fill="${sc}"/><circle cx="${x}" cy="${y}" r="${w*.42}" fill="${m.eye}"/><circle cx="${x}" cy="${y}" r="${w*.42}" fill="none" stroke="#000" stroke-opacity=".25"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${ry}" fill="#120818"/><circle cx="${x+w*.16}" cy="${y-w*.15}" r="${w*.1}" fill="#fff"/><path d="M${x-w-1} ${y+1}Q${x} ${y-w*1.1} ${x+w+1} ${y+1}" fill="none" stroke="${f?"#1a0a1a":m.skin2}" stroke-width="${f?3.2:2.2}"/>${f?`<path d="M${x+w} ${y}l5-4M${x-w} ${y}l-5-4" stroke="#1a0a1a" stroke-width="2" fill="none"/>`:""}`};
  const brows=p.eyes>=2?Es.slice(0,2).map(([x,y,w],i)=>`<path d="M${i?x+w+2:x-w-2} ${y-w*.75}Q${x} ${y-w*1.5-(f?2:0)} ${i?x-w-2:x+w+2} ${y-w*.95}" fill="none" stroke="${br}" stroke-width="${f?2.4:4.2}" stroke-linecap="round"/>`).join(""):"";
  let back="",front="",flow="";
  if(m.hair){
    for(let i=0;i<9;i++){const a=pi+i*pi/8;back+=`<circle cx="${100+54*Math.cos(a)}" cy="${74+46*Math.sin(a)}" r="${15+(i%2)*3}" fill="${m.hair}"/>`}
    back+=`<circle cx="48" cy="104" r="12" fill="${m.hair}"/><circle cx="152" cy="104" r="12" fill="${m.hair}"/>`;
    if(f){
      flow=`<path d="M52 80C24 122 40 172 12 236L74 236L86 160Z" fill="${m.hair}"/><path d="M148 80C176 122 160 172 188 236L126 236L114 160Z" fill="${m.hair}"/><path d="M46 112C38 152 46 190 30 226M154 112C162 152 154 190 170 226" fill="none" stroke="${m.hi}" stroke-width="3" stroke-linecap="round"/>`;
      front=`<path d="M54 92C50 50 80 32 106 38C126 42 144 56 146 86C132 62 112 56 92 66C76 74 64 84 54 92Z" fill="${m.hair}"/><path d="M70 44Q92 34 112 44M60 70Q70 54 88 50" fill="none" stroke="${m.hi}" stroke-width="2.5" stroke-linecap="round"/>`;
    }else{
      for(let i=0;i<7;i++){const a=1.12*pi+i*.76*pi/6;front+=`<circle cx="${100+47*Math.cos(a)}" cy="${68+32*Math.sin(a)}" r="${9+(i%2)*3}" fill="${m.hair}"/>`}
      front+=`<path d="M70 28Q84 14 100 24M104 20Q122 12 134 30M56 52Q62 40 74 38" fill="none" stroke="${m.hi}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
  }
  const crown=m.crown?`<path d="M62 50L70 30L84 44L100 24L116 44L130 30L138 50" fill="none" stroke="#ffd166" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="24" r="3.5" fill="${gl}"/><circle cx="70" cy="30" r="2.5" fill="${gl}"/><circle cx="130" cy="30" r="2.5" fill="${gl}"/>`:"";
  const crest=p.ant%2?`<path d="M100 44C88 20 92 6 100 0C108 6 112 20 100 44Z" fill="${gl}" fill-opacity=".8"/>`:"";
  const plate=m.human||m.round?"":`<path d="M100 42C126 42 142 62 136 86C122 76 110 78 100 92C90 78 78 76 64 86C58 62 74 42 100 42Z" fill="#fff" fill-opacity=".26"/><path d="M100 48L100 84M82 54L90 76M118 54L110 76" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/><circle cx="58" cy="116" r="1.6" fill="#fff" opacity=".7"/><circle cx="62" cy="122" r="1.2" fill="#fff" opacity=".7"/><circle cx="142" cy="116" r="1.6" fill="#fff" opacity=".7"/><circle cx="138" cy="122" r="1.2" fill="#fff" opacity=".7"/>`;
  const head=f?"M100 42C136 42 148 70 146 100C144 130 126 162 100 178C74 162 56 130 54 100C52 70 64 42 100 42Z":"M100 40C138 40 150 68 149 98C148 126 138 150 120 168Q100 186 80 168C62 150 52 126 51 98C50 68 62 40 100 40Z";
  const lips=f?`<path d="M85 150Q93 143 100 148Q107 143 115 150Q108 162 100 163Q92 162 85 150Z" fill="${m.lip||"#e8456f"}"/><path d="M92 150Q100 152 108 150" stroke="#fff" stroke-opacity=".5" stroke-width="1.5" fill="none"/><circle cx="74" cy="132" r="9" fill="#ff7aa8" opacity=".3"/><circle cx="126" cy="132" r="9" fill="#ff7aa8" opacity=".3"/>`:`<path d="M64 128Q82 168 100 174Q118 168 136 128Q122 150 100 156Q78 150 64 128Z" fill="#000" opacity=".13"/><path d="M88 152Q100 158 112 152" fill="none" stroke="#7a3a4a" stroke-width="2.6" stroke-linecap="round"/>`;
  const dress=f?`<path d="M80 184Q100 214 120 184" fill="none" stroke="#ffd166" stroke-width="2"/><circle cx="100" cy="205" r="4" fill="${gl}"/>`:`<path d="M68 240L66 204Q70 182 84 172L100 214L116 172Q130 182 134 204L132 240Z" fill="${m.collar||"#0c2b2b"}"/><path d="M84 172L100 214L116 172" fill="none" stroke="${gl}" stroke-width="2.5"/>`;
  const bf=m.bf?`<g transform="translate(205 196) rotate(-20)"><path d="M0 0C-14-14-18 4 0 5ZM0 0C14-14 18 4 0 5Z" fill="#ffe9a8"/><path d="M0 5C-9 16-4 20 0 9ZM0 5C9 16 4 20 0 9Z" fill="#ffd166"/></g>`:"";
  return `<svg class="pt" viewBox="0 0 260 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Portrait of ${esc(p.name)}"><defs><radialGradient id="bg${id}" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${m.bg}"/><stop offset="1" stop-color="#0d0510"/></radialGradient><radialGradient id="au${id}"><stop offset=".4" stop-color="${gl}" stop-opacity=".4"/><stop offset="1" stop-color="${gl}" stop-opacity="0"/></radialGradient><linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m.skin}"/><stop offset="1" stop-color="${m.skin2}"/></linearGradient></defs>
<rect width="260" height="240" fill="url(#bg${id})"/><circle cx="130" cy="100" r="105" fill="url(#au${id})"/><circle cx="30" cy="40" r="1.6" fill="#fff"/><circle cx="228" cy="70" r="1.3" fill="#fff"/><circle cx="214" cy="20" r="1.8" fill="#ffd9c7"/><circle cx="20" cy="150" r="1.2" fill="#fff"/>
<g transform="translate(30 0)">${side}<g transform="translate(200 0) scale(-1 1)">${side}</g>${back}
<path d="M82 150L82 192L118 192L118 150Z" fill="${m.skin2}"/>
<path d="M10 240C16 206 56 192 84 190L100 214L116 190C144 192 184 206 190 240Z" fill="${m.jacket}"/>${dress}${flow}
${crest}<path d="${head}" fill="url(#sk${id})"/>${plate}<path d="M64 118Q70 128 82 132M136 118Q130 128 118 132" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/>${front}${crown}
${Es.map(eye).join("")}${brows}
<path d="M100 114L95 132Q100 137 105 132Z" fill="${m.skin2}" opacity=".7"/><circle cx="97" cy="133" r="1.2" fill="#3a1a2a"/><circle cx="103" cy="133" r="1.2" fill="#3a1a2a"/>${lips}</g>${bf}</svg>`;
}
function shade(c,k){const n=parseInt(c.slice(1),16);return '#'+[16,8,0].map(i=>Math.max(0,Math.min(255,Math.round(((n>>i)&255)*k))).toString(16).padStart(2,'0')).join('')}
function look(u){const k=SKINS[u.skin],fm=u.g==='f',hu=u.skin==='peach';return{human:hu,round:hu,sclera:hu?'#fff':'',skin:k,skin2:shade(k,.78),hair:fm?'#3a1a5a':'#22124a',hi:fm?'#ff9ad5':'#5ee6ff',eye:'#ffd23f',jacket:fm?'#ffe0ee':'#e8dfc0',collar:'#0c2b2b',glow:'#7cf3d0',bg:'#3a1a4a',crown:fm?1:0,lip:'#e8456f'}}

