function toggleTheme(){document.body.classList.toggle('light-mode',$('theme').checked)}
function resetData(){$('tx').value='';$('stTitle').innerText='No Audio';clnAu();$('wc').value=0;$('st').innerText='Ready';$('trI').value='';$('trI').disabled=0;$('resBox').style.display='none';$('checkV').innerHTML='';$('eL').innerHTML='';upWC();if(is)au.pause();is=0;updatePlBtn();crpS=0;crpE=0;origTxt=''}
function updateStatus(){$('stWPM').textContent=$('wi').value+' WPM';$('stRate').textContent=$('ri').value+'x';$('stWC').textContent=$('wc').value+' W';$('stMode').textContent=exMode==='mock'?'Mock Mode':'Practice';$('stMode').style.color=exMode==='mock'?'#ef4444':'inherit'}

function init(){regs.forEach(r=>{let o=document.createElement('option');o.value=r.u;o.textContent=r.t;$('rg').appendChild(o)});[40,50,60,80,90,100,120,140,160,180,200].forEach(v=>{let o=document.createElement('option');o.value=v;o.textContent=v;$('ws').appendChild(o)});[0.8,1,1.2,1.5].forEach(v=>{let o=document.createElement('option');o.value=v;o.textContent=v;$('rs').appendChild(o)});$('rg').onchange=e=>lG(e.target.value);$('f').onchange=async e=>{resetData();let aud=0,txt=0;for(const f of Array.from(e.target.files)){if(f.type.includes('audio')){clnAu();lastAuSrc=URL.createObjectURL(f);au.src=lastAuSrc;meta(f.name);aud=1}else if(f.name.match(/\.(txt|md)$/i)||f.type.includes('text')){const t=await f.text();$('tx').value=t;origTxt=t;txt=1}}setTimeout(()=>{if(txt)upWC(true);if(aud&&txt)prepMock()},500)};lG(null);upExD()}

function meta(n){$('stTitle').innerText=n;updateStatus()}
function setP(v){const[min,max]=v.split('-');uSl('min',min);uSl('max',max==='max'?maxW:max)}
function uSl(t,v){let val=parseInt(v)||0;if(t==='min'){$('wMin').value=val;$('slMi').value=val}else{$('wMax').value=val;$('slMa').value=val}renL()}
function adj(k,v){if(k==='sc'){curS=Math.max(0.5,Math.min(1.5,curS+v));document.documentElement.style.setProperty('--sc',curS)}else{curT=Math.max(10,Math.min(48,curT+v));document.documentElement.style.setProperty('--ts',curT+'px')}}
function openM(){$('md').classList.toggle('active')}
function openEx(){$('exM').classList.add('active')}

function upExD(){const s=$('exSel').value,m=$('exMode').value;if(s==='custom'){$('custOpts').style.display='flex';exams.custom.wpm=$('cWpm').value;exams.custom.dur=$('cDur').value}else{$('custOpts').style.display='none'}const e=exams[s];$('exDesc').innerText=`${e.name} | ${e.dur}m @ ${e.wpm}wpm | Rules: ${e.rules.wc.toUpperCase()}`;if(s==='custom')e.rules={cap:$('cCap').value,com:$('cCom').value,pun:$('cPun').value,spl:$('cSpl').value,sub:$('cSub').value,wc:$('cLg').value,max:$('cMaxE').value}}

function selEx(){curEx=$('exSel').value;exMode=$('exMode').value;exRules={...exams[curEx].rules};$('lg').value=exRules.wc;$('exM').classList.remove('active');$('srcM').classList.add('active')}

async function lG(u){let list=[];try{for(let r of(u?[regs.find(x=>x.u===u)]:regs)){const res=await fetch(`https://gist.githubusercontent.com/vs-parihar/${r.u}/raw?t=${Date.now()}`);const j=await res.json();if(Array.isArray(j))list=list.concat(j.map(i=>({...i,reg:r.t})))}}catch(e){}lD(list);renT();renL()}

function lD(list){maxW=0;curL=list.map((i,idx)=>{let m=i.title.match(/WORDS\s*(\d+)/i),w=i.w||[],b=Math.max(...w,m?parseInt(m[1]):0);if(b>maxW)maxW=b;return{...i,_id:idx,maxW:b,tags:(i.tags||[]).map(t=>t.toUpperCase())}});$('slMi').max=$('slMi').value=$('slMa').max=$('slMa').value=maxW;uSl('min',0);uSl('max',maxW)}

function gW(i){const l=$('lg').value;if(i.w){if(l==='s')return i.w[0];if(l==='sp')return i.w[1];return i.w[2]}return i.maxW||0}

function renT(){const t=$('tags'),set=new Set();curL.forEach(i=>i.tags.forEach(g=>set.add(g)));t.innerHTML='';Array.from(set).sort().forEach(g=>{let s=document.createElement('span');s.className='filter-chip';s.textContent=g;s.onclick=()=>{s.classList.toggle('active');renL()};t.appendChild(s)})}

function renL(){const mi=parseInt($('wMin').value)||0,ma=parseInt($('wMax').value)||maxW,at=Array.from(document.querySelectorAll('.filter-chip.active')).map(x=>x.textContent),so=$('srt').value;filtL=curL.filter(i=>{const v=gW(i);return(v>=mi&&v<=ma)&&(at.length===0||at.every(t=>i.tags.includes(t)))});if(so==='on')filtL.sort((a,b)=>a._id-b._id);if(so==='no')filtL.sort((a,b)=>b._id-a._id);if(so==='az')filtL.sort((a,b)=>a.title.localeCompare(b.title));if(so==='sl')filtL.sort((a,b)=>gW(a)-gW(b));if(so==='ls')filtL.sort((a,b)=>gW(b)-gW(a));if(so==='sh'){for(let i=filtL.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[filtL[i],filtL[j]]=[filtL[j],filtL[i]]}}$('ls').innerHTML='';filtL.forEach((i,idx)=>{let d=document.createElement('div');d.className='list-item';d.innerHTML=`<div style="font-weight:500">${i.title}</div><div style="font-size:9px;opacity:0.7">${gW(i)} words • ${fT(i.dur||0)}</div>`;d.onclick=()=>lA(i,idx);$('ls').appendChild(d)})}

async function lA(i,idx){curI=idx;curO=i;openM();$('tx').value="Loading...";const v=gW(i);if(v){$('wc').value=v;$('st').innerText='W: '+v;if(i.dur){$('wi').value=(v/(i.dur/60)).toFixed(2);$('ri').value="1.0000";sync('r')}}const id=i.url?.split('details/')[1],dl=`https://archive.org/download/${id}/`;let auSrc=i.audio;try{if(id){const mr=await fetch(`https://archive.org/metadata/${id}`),md=await mr.json(),fs=md.files||[];const mf=fs.find(f=>f.name.endsWith('.mp3')),of=fs.find(f=>f.name.match(/\.(wav|m4a|ogg|aac)$/i)),tf=fs.find(f=>f.name.endsWith('.txt')||f.name.endsWith('.md'));if(mf)auSrc=dl+mf.name;else if(of)auSrc=dl+of.name;if(i.matter){const r=await fetch(i.matter);$('tx').value=await r.text()}else if(tf){const r=await fetch(dl+tf.name);$('tx').value=await r.text()}else{$('tx').value=md.metadata.description?.replace(/<[^>]*>?/gm,'')||"No text"}}}catch(e){if(!i.matter)$('tx').value="Text Load Fail"}clnAu();au.src=auSrc;au.load();meta(i.title);origTxt=$('tx').value;upWC();if(exMode==='mock')prepMock()}

function sync(s){const w=parseFloat($('wc').value),m=au.duration/60;if(!m||!w)return;if(s==='w'){$('ri').value=(parseFloat($('wi').value)/(w/m)).toFixed(4);au.playbackRate=Math.max(0.1,parseFloat($('ri').value))}else{const wpm=((w/m)*parseFloat($('ri').value));$('wi').value=wpm.toFixed(2);au.playbackRate=Math.max(0.1,parseFloat($('ri').value))}const ws=$('ws'),wv=$('wi').value;ws.value=[...ws.options].some(o=>o.value===wv)?wv:"";updateStatus()}

function dS(k,v){if(!v)return;if(k==='w')$('wi').value=v;else $('ri').value=v}
function adW(d){$('wi').value=(parseFloat($('wi').value||0)+d).toFixed(2);sync('w')}
function adR(d){$('ri').value=(parseFloat($('ri').value||1)+d).toFixed(4);sync('r')}

$('wi').oninput=()=>sync('w');$('ri').oninput=()=>sync('r');

function updatePlBtn(){$('pl').innerHTML=is?'<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';if(is)$('pl').classList.add('pausing');else $('pl').classList.remove('pausing')}

$('pb').onclick=e=>{const r=$('pb').getBoundingClientRect();au.currentTime=((e.clientX-r.left)/r.width)*au.duration};
