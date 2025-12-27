function opTr(){if(!('trM').classList.add('active');resTr();('rsV').style.display==='flex'){('trI').value.length>0){('trM').classList.remove('active')}}
function cfmAct(a){('trM').classList.remove('active');resTr()}else if(a==='s'){subTr()}}
function resTr(){trIp=0;clearInterval(trTi);('trI').disabled=1;('trA').innerText='Start';('trV').style.display='flex';('trInf').textContent='Ready'}
function togTr(){if(trIp){subTr()}else{stTr(false)}}
function stTr(a=false){const v=parseFloat(('trC').value)||0;trStopW=(v===0);trDur=v*60;trRem=v*60;trElap=0;trIp=1;('trI').value=('trI').focus();('trA').innerText='Submit (Early)';clearInterval(trTi);trTi=setInterval(()=>{if(trStopW)trElap++;else trRem--;let t=trStopW?trElap:trRem,m=Math.floor(t/60),s=t%60;$('trCD').textContent=`${m}:${s<10?'0':''}${s}\`;if(!trStopW&&trRem<=0)subTr()},1000)}

function subTr(){clearInterval(trTi);trIp=0;('trA').innerText='Start';const srcT=('tx').value;oToks=tok(srcT);uToks=tok(('trV').style.display='none';('tx').style.visibility='visible';reCalc()}

function reCalc(){let tE=0,tot=oToks.length;const r=exRules.max?exRules:{max:100,wc:'s',sub:'s',spl:0.5,cap:0,pun:0.5,com:0};
errs.forEach(e=>{let v=0;e.warn=false;
if(e.ovr!==undefined){v=e.ovr}else{
if(e.t==='f'){v=r.sub==='d'?1:0.5}else if(e.t==='m'){v=1}
else if(e.t==='h'){v=parseFloat(r.spl)}
else if(e.t==='w'){if(e.w>=1){v=1}else{v=0;if(parseFloat(r.cap)>0&&e.o.t[0]!==e.u.t[0])v=Math.min(1,Math.max(v,parseFloat(r.cap)));if(e.o.t.includes(',')!==e.u.t.includes(','))v=Math.max(v,parseFloat(https://www.google.com/search?q=r.com));if(e.o.t.match(/[.?!|-\u0964]/)&&!e.u.t.match(/[.?!|-\u0964]/))v=Math.min(1,Math.max(v,parseFloat(r.pun)));if(v===0)e.warn=true}}}
e.val=v;tE+=v});const acc=Math.max(0,100-(tE/tot*100)),pass=acc>=(100-parseFloat(r.max));('resBox').style.borderColor=pass?'var(--gr)':'var(--re)';('resDet').innerHTML=`Errors: <b>${tE.toFixed(1)}</b> / ${tot} (${(tE/tot*100).toFixed(1)}%)<br>Accuracy: <b>${acc.toFixed(1)}%</b>`;renCheckV();renEL()}

function renCheckV(){const v=$('checkV'),sd=exRules.sub==='d';v.innerHTML='';algn.forEach((x,k)=>{let s=document.createElement('span');s.id=`mk-${x.id}`; if(x.t==='k'){s.className='c-ok';s.textContent=x.o.t+' '} else if(x.t==='m'){s.className='c-del';s.textContent=x.o.t+' ';s.onclick=()=>jump(x.id)} else if(x.t==='f'){s.className='c-ins';s.textContent=x.u.t+' ';s.onclick=()=>jump(x.id)} else{if(x.warn){s.className='c-warn';s.textContent=x.u.t+' ';s.onclick=()=>jump(x.id)}else if(sd&&x.val>=1&&x.w>=1){s.innerHTML=`\<span class="c-del"\>${x.o.t}</span> <span class="c-ins">${x.u.t}\</span\> `}else{s.className='c-grp';s.innerHTML=`\<span class="${x.val&gt;=1?&#39;c-sub-f&#39;:&#39;c-sub-h&#39;}&quot;&gt;${x.u.t}<span class="c-cor">(${x.o.t})\</span\>\</span\> \`}s.onclick=()=>jump(x.id)}
v.appendChild(s)})}

function renEL(){const l={getCtx(oToks,e.i,2,-1)}</span><span class="e-w {e.t==='m'?e.o.t:e.u.t}{e.val})</span></div>

<div class="row" style="margin-top:2px;justify-content:flex-end">
<button class="op-btn {e.id},1)">F</button><button class="op-btn {e.id},0.5)">H</button><button class="op-btn {e.id},2)">D</button><button class="op-btn {e.id},0)">X</button></div>`;l.appendChild(it)})}

function getCtx(tk,idx,c,dir){if(idx<0)return"";let s=[],cnt=0,curr=idx+dir;while(cnt<c&&curr>=0&&curr<tk.length){if(dir<0)s.unshift(tk[curr].t);else s.push(tk[curr].t);curr+=dir;cnt++}return s.join(' ')}

function jump(id){if(id===undefined)return;const e=errs.find(x=>x.id===id);if(!e)return;clrHl();
const el=(`err-${id}\`)?.classList.add('active')}

function clrHl(){[...document.querySelectorAll('.ctx-hl')].forEach(e=>e.classList.remove('ctx-hl'))}
function upEr(ev,id,v){ev.stopPropagation();const e=errs.find(x=>x.id===id);if(e){e.ovr=v;reCalc();jump(id)}}
