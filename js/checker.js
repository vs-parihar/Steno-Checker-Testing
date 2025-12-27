let algn=[];
function opTr(){if(!('trM').classList.add('active');resTr();('rsV').style.display==='flex'){('trI').value.length>0){('trM').classList.remove('active')}}
function cfmAct(a){('trM').classList.remove('active');resTr()}else if(a==='s'){subTr()}}
function resTr(){trIp=0;clearInterval(trTi);('trI').disabled=1;('trA').innerText='Start';('trV').style.display='flex';('trInf').textContent='Ready'}
function togTr(){if(trIp){subTr()}else{stTr(false)}}
function stTr(a=false){const v=parseFloat(('trC').value)||0;trStopW=(v===0);trDur=v*60;trRem=v*60;trElap=0;trIp=1;('trI').value=('trI').focus();('trA').innerText='Submit (Early)';clearInterval(trTi);trTi=setInterval(()=>{if(trStopW)trElap++;else trRem--;let t=trStopW?trElap:trRem,m=Math.floor(t/60),s=t%60;$('trCD').textContent=`${m}:${s<10?'0':''}${s}\`;if(!trStopW&&trRem<=0)subTr()},1000)}

function subTr(){clearInterval(trTi);trIp=0;('trA').innerText='Start';const srcT=(('tx').value;oToks=tok(srcT);uToks=tok(('tx').style.visibility='visible';('tx').value.length+20)?'flex':'none';reCalc()}

function reCalc(){let tE=0,tot=oToks.length;const r=exRules.max?exRules:{max:100,wc:'s',sub:'s',spl:0.5,cap:0,pun:0.5,com:0};
errs.forEach(e=>{let v=0;if(e.ovr!==undefined){v=e.ovr}else{if(e.t==='f'){v=r.sub==='d'?1:0.5}else if(e.t==='m'){v=1}else if(e.t==='h'){v=parseFloat(r.spl)}else if(e.t==='w'){if(e.w>=1){v=1}else{v=0;if(parseFloat(r.cap)>0&&e.o.w[0]!==e.u.w[0])v=Math.min(1,Math.max(v,parseFloat(r.cap)))}}}
if(e.o&&e.u&&(e.o.p1!==e.u.p1||e.o.p2!==e.u.p2)){let pv=0;if(e.o.p1.match(/[.?!|-]/)||e.o.p2.match(/[.?!|-]/))pv=parseFloat(r.pun);else if(e.o.p1.includes(',')||e.o.p2.includes(','))pv=parseFloat(https://www.google.com/search?q=r.com);if(pv>0&&v===0){e.punErr=1;v=pv}}e.val=v;tE+=v});const acc=Math.max(0,100-(tE/tot*100)),pass=acc>=(100-parseFloat(r.max));('resBox').style.borderColor=pass?'var(--gr)':'var(--re)';('resDet').innerHTML=`Errors: <b>${tE.toFixed(1)}</b> / ${tot} (${(tE/tot*100).toFixed(1)}%)<br>Accuracy: <b>${acc.toFixed(1)}%</b>`;renCheckV();renEL()}

function renCheckV(){const v=$('checkV'),sd=exRules.sub==='d';v.innerHTML='';algn.forEach((x,k)=>{let s=document.createElement('span');s.id=`mk-${x.id}`; const subT=x.id!==undefined?`\<sup class="c-id"\>${x.id}</sup>`:'';
if(x.t==='k'){s.className='c-ok';s.innerHTML=x.o.p1+x.o.w+x.o.p2+' ';s.onclick=()=>clkW(x)}
else if(x.t==='m'){s.className='c-del';s.innerHTML=x.o.p1+x.o.w+x.o.p2+subT+' ';s.onclick=()=>jump(x.id)}
else if(x.t==='f'){s.className='c-ins';s.innerHTML=x.u.p1+x.u.w+x.u.p2+subT+' ';s.onclick=()=>jump(x.id)}
else{if(x.punErr){s.className='c-pun';s.innerHTML=x.u.p1+x.u.w+x.u.p2+subT+' '}else{if((sd&&x.val>=1&&x.w>=1)||(x.ovr===2)){s.innerHTML=`<span class="c-sub-d">${x.u.w}\</span\> `}else{s.innerHTML=`\<span class="${(x.val&gt;=1||x.w&gt;=1)?&#39;c-sub-s&#39;:&#39;c-sub-h&#39;}&quot;&gt;${x.u.w}</span><span class="c-cor">(${x.o.w})\</span\> \`}}s.innerHTML+=subT;s.onclick=()=>jump(x.id)}v.appendChild(s)})}

function clkW(x){if(confirm("Mark as error?")){const id=errs.length;errs.push({...x,id:id,t:'w',w:1,val:1,ovr:1});algn[algn.indexOf(x)]={...x,id:id,t:'w',w:1,val:1,ovr:1};reCalc()}}

function renEL(){const l={getCtx(oToks,e.i,2,-1)}<span style="font-weight:bold" class="{e.t==='m'?e.o.w:e.u.w}{e.val})</span></div>

<div class="row" style="margin-top:2px;justify-content:flex-end">
${(e.id>0&&errs[e.id-1])?'<button class="op-btn" onclick="upEr(event,'+e.id+',&#39;m&#39;)">M</button>':''}
<button class="op-btn {e.id},1)">F</button><button class="op-btn {e.id},0.5)">H</button><button class="op-btn {e.id},2)">D</button><button class="op-btn {e.id},0)">X</button></div>`;l.appendChild(it)})}

function getCtx(tk,idx,c,dir){if(idx<0)return"";let s=[],cnt=0,curr=idx+dir;while(cnt<c&&curr>=0&&curr<tk.length){if(dir<0)s.unshift(tk[curr].w);else s.push(tk[curr].w);curr+=dir;cnt++}return s.join(' ')}

function jump(id){if(id===undefined)return;const e=errs.find(x=>x.id===id);if(!e)return;clrHl();
const el=(`err-${id}\`)?.classList.add('active')}

function clrHl(){[...document.querySelectorAll('.ctx-hl')].forEach(e=>e.classList.remove('ctx-hl'))}
function upEr(ev,id,v){ev.stopPropagation();const e=errs.find(x=>x.id===id);if(e){if(v==='m'){/*Merge logic placeholder*/}else{e.ovr=v;reCalc();jump(id)}}}
