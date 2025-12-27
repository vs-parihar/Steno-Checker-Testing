function toggleTheme(){document.body.classList.toggle('light-mode',('tx').value='';('wc').value=0;('trI').value='';('resBox').style.display='none';('eL').innerHTML='';upWC();if(is)au.pause();is=0;updatePlBtn();crpS=0;crpE=0;origTxt=''}
function updateStatus(){('wi').value+' WPM';('ri').value+'x';('wc').value+' W';('stMode').style.color=exMode==='mock'?'#ef4444':'inherit'}

function init(){regs.forEach(r=>{let o=document.createElement('option');o.value=r.u;o.textContent=r.t;('ws').appendChild(o)});[0.8,1,1.2,1.5].forEach(v=>{let o=document.createElement('option');o.value=v;o.textContent=v;('rg').onchange=e=>lG(e.target.value);/i)||f.type.includes('text')){const t=await f.text();$('tx').value=t;origTxt=t;txt=1}}setTimeout(()=>{if(txt)upWC(true);if(aud&&txt)prepMock()},500)};lG(null);upExD()}

function meta(n){('wMin').value=val;('wMax').value=val;('md').classList.toggle('active')}
function openEx(){$('exM').classList.add('active')}

function upExD(){const s=('cWpm').value=e.wpm;('cLg').value=e.rules.wc;('cCom').value=https://www.google.com/search?q=e.rules.com;('cSpl').value=e.rules.spl;('cMaxE').value=e.rules.max}('trT').value=e.trans>0?e.trans:0;('exSel').value];curEx=('exMode').value;if(curEx==='custom'||curEx){exRules={cap:('cCom').value,pun:('cSpl').value,sub:('cLg').value,max:('cWpm').value;exams[curEx].dur=('trC').value||exams[curEx].trans}('exM').classList.remove('active');$('srcM').classList.add('active')}

async function lG(u){let list=[];try{for(let r of(u?[regs.find(x=>x.u===u)]:regs)){const res=await fetch(`https://gist.githubusercontent.com/vs-parihar/${r.u}/raw?t=${Date.now()}`);const j=await res.json();if(Array.isArray(j))list=list.concat(j.map(i=>({...i,reg:r.t})))}}catch(e){}lD(list);renT();renL()}

function lD(list){maxW=0;curL=list.map((i,idx)=>{let m=i.title.match(/WORDS\s*(\d+)/i),w=i.w||[],b=Math.max(...w,m?parseInt(m[1]):0);if(b>maxW)maxW=b;return{...i,_id:idx,maxW:b,tags:(i.tags||[]).map(t=>t.toUpperCase())}});('slMi').value=('slMa').value=maxW;uSl('min',0);uSl('max',maxW)}

function gW(i){const l=$('lg').value;if(i.w){if(l==='s')return i.w[0];if(l==='sp')return i.w[1];return i.w[2]}return i.maxW||0}

function renT(){const t=$('tags'),set=new Set();curL.forEach(i=>i.tags.forEach(g=>set.add(g)));t.innerHTML='';Array.from(set).sort().forEach(g=>{let s=document.createElement('span');s.className='filter-chip';s.textContent=g;s.onclick=()=>{s.classList.toggle('active');renL()};t.appendChild(s)})}

function renL(){const mi=parseInt(('wMax').value)||maxW,at=Array.from(document.querySelectorAll('.filter-chip.active')).map(x=>x.textContent),so=('ls').innerHTML='';filtL.forEach((i,idx)=>{let d=document.createElement('div');d.className='list-item';d.innerHTML=`<div style="font-weight:500">${i.title}</div><div style="font-size:9px;opacity:0.7">${gW(i)} words • ${fT(i.dur||0)}</div>`;d.onclick=()=>lA(i,idx);$('ls').appendChild(d)})}

async function lA(i,idx){curI=idx;curO=i;openM();('wc').value=v;('wi').value=(v/(i.dur/60)).toFixed(2);/i)),tf=fs.find(f=>f.name.endsWith('.txt')||f.name.endsWith('.md'));if(mf)auSrc=dl+mf.name;else if(of)auSrc=dl+of.name;if(i.matter){const r=await fetch(i.matter);('tx').value=await r.text()}else{('tx').value="Text Load Fail"}clnAu();au.src=auSrc;au.load();meta(i.title);origTxt=$('tx').value;upWC();if(exMode==='mock')prepMock()}

function sync(s){const w=parseFloat(('ri').value=(parseFloat(('ri').value))}else{const wpm=((w/m)*parseFloat(('wi').value=wpm.toFixed(2);au.playbackRate=Math.max(0.1,parseFloat(('ws'),wv=$('wi').value;ws.value=[...ws.options].some(o=>o.value===wv)?wv:"";updateStatus()}

function dS(k,v){if(!v)return;if(k==='w')('wi').value||0)+d).toFixed(2);sync('w')}
function adR(d){('ri').value||1)+d).toFixed(4);sync('r')}

('ri').oninput=()=>sync('r');

function updatePlBtn(){('pl').classList.add('pausing');else $('pl').classList.remove('pausing')}

('pb').getBoundingClientRect();au.currentTime=((e.clientX-r.left)/r.width)*au.duration};
