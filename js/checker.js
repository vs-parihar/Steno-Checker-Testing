let algn=[];
function opTr(){if(!$('tx').value.trim()&&exMode!=='mock'){alert('Load text first!');return}if(is){au.pause();is=0;updatePlBtn()}$('trM').classList.add('active');resTr();$('trA').disabled=0}
function tryClTr(){if(exMode==='mock'&&trIp){return}if($('rsV').style.display==='flex'){$('trM').classList.remove('active');return}if(trIp||$('trI').value.length>0){$('cfm').style.display='flex'}else{$('trM').classList.remove('active')}}
function cfmAct(a){$('cfm').style.display='none';if(a==='d'){$('trM').classList.remove('active');resTr()}else if(a==='s'){subTr()}}
function resTr(){trIp=0;clearInterval(trTi);$('trI').value='';$('trI').disabled=1;$('trA').disabled=0;$('trA').innerText='Start';$('trCD').textContent='00:00';$('trV').style.display='flex';$('rsV').style.display='none';$('trInf').textContent='Ready'}
function togTr(){if(trIp){subTr()}else{stTr(false)}}
function stTr(a=false){const v=parseFloat($('trT').value)||parseFloat($('trC').value)||0;trStopW=(v===0);trDur=v*60;trRem=v*60;trElap=0;trIp=1;$('trI').disabled=0;$('trI').value=$('trI').value||'';$('trI').focus();$('trA').innerText='Submit';if(exMode==='mock')$('trA').innerText='Submit (Early)';clearInterval(trTi);trTi=setInterval(()=>{if(trStopW)trElap++;else trRem--;let t=trStopW?trElap:trRem,m=Math.floor(t/60),s=t%60;$('trCD').textContent=`${m}:${s<10?'0':''}${s}`;if(!trStopW&&trRem<=0)subTr()},1000)}
function subTr(){clearInterval(trTi);trIp=0;$('trI').disabled=1;$('trA').innerText='Start';const srcT=$('chkFull').checked?origTxt:$('tx').value;oToks=tok(srcT);uToks=tok($('trI').value);const m=oToks.length,n=uToks.length,d=Array.from({length:m+1},()=>new Float32Array(n+1).fill(1e9)),p=Array.from({length:m+1},()=>new Int8Array(n+1).fill(0));d[0][0]=0;
for(let i=0;i<=m;i++)for(let j=0;j<=n;j++){
if(i<m&&d[i+1][j]>d[i][j]+1){d[i+1][j]=d[i][j]+1;p[i+1][j]=1}
if(j<n&&d[i][j+1]>d[i][j]+1){d[i][j+1]=d[i][j]+1;p[i][j+1]=2}
if(i<m&&j<n){const c=cmpW(oToks[i].t,uToks[j].t);const raw=oToks[i].t===uToks[j].t?0:0.1;if(d[i+1][j+1]>d[i][j]+c+raw){d[i+1][j+1]=d[i][j]+c+raw;p[i+1][j+1]=0}}
if(i<m&&j<n-1){const cm=cmpW(oToks[i].t,uToks[j].t+uToks[j+1].t);if(d[i+1][j+2]>d[i][j]+cm+2){d[i+1][j+2]=d[i][j]+cm+2;p[i+1][j+2]=3}}
if(i<m-1&&j<n){const cs=cmpW(oToks[i].t+oToks[i+1].t,uToks[j].t);if(d[i+2][j+1]>d[i][j]+cs+2){d[i+2][j+1]=d[i][j]+cs+2;p[i+2][j+1]=4}}}
algn=[];let i=m,j=n;while(i>0||j>0){const op=p[i][j];if(op===0){const c=cmpW(oToks[i-1].t,uToks[j-1].t),raw=oToks[i-1].t!==uToks[j-1].t;algn.unshift({t:(c===0&&!raw)?'k':(c===0?'w':'w'),o:oToks[i-1],u:uToks[j-1],i:i-1,j:j-1,w:c});i--;j--}
else if(op===1){algn.unshift({t:'m',o:oToks[i-1],i:i-1,j:-1});i--}
else if(op===2){algn.unshift({t:'f',u:uToks[j-1],j:j-1,i:-1});j--}
else if(op===3){algn.unshift({t:'h',o:oToks[i-1],u:{t:uToks[j-2].t+" "+uToks[j-1].t},i:i-1,j:j-2,msg:'Split',w:0.5});i--;j-=2}
else if(op===4){algn.unshift({t:'h',o:{t:oToks[i-2].t+" "+oToks[i-1].t},u:uToks[j-1],i:i-2,j:j-1,msg:'Merge',w:0.5});i-=2;j--}}
errs=algn.filter(x=>x.t!=='k').map((e,idx)=>({...e,id:idx}));$('trV').style.display='none';$('rsV').style.display='flex';$('tx').style.visibility='visible';reCalc()}
function reCalc(){let tE=0,tot=oToks.length;const r=exRules.max?exRules:{max:100,wc:'s',sub:'s',spl:0.5,cap:0,pun:0.5,com:0};
errs.forEach(e=>{let v=0;if(e.ovr!==undefined){v=e.ovr}else{if(e.t==='f'){v=r.sub==='d'?1:0.5}else if(e.t==='m'){v=1}
else if(e.t==='h'){v=parseFloat(r.spl)}
else if(e.t==='w'){if(e.w>=1){v=1}else{v=0;if(parseFloat(r.cap)>0&&e.o.t[0]!==e.u.t[0])v=Math.min(1,Math.max(v,parseFloat(r.cap)));if(e.o.t.match(/[.?!|\u0964]/)&&!e.u.t.match(/[.?!|\u0964]/))v=Math.min(1,Math.max(v,parseFloat(r.pun)))}}}
e.val=v;tE+=v});const acc=Math.max(0,100-(tE/tot*100)),pass=acc>=(100-parseFloat(r.max));$('resBox').style.display='flex';$('resBox').style.borderColor=pass?'var(--gr)':'var(--re)';$('resTit').innerHTML=`<span style="color:${pass?'var(--gr)':'var(--re)'}">${pass?'PASSED':'FAILED'}</span>`;$('resDet').innerHTML=`Errors: <b>${tE.toFixed(1)}</b> / ${tot} (${(tE/tot*100).toFixed(1)}%)<br>Accuracy: <b>${acc.toFixed(1)}%</b>`;renCheckV();renEL()}
function renCheckV(){const v=$('checkV'),splitPun=s=>{const m=s.match(/^(.*?)([^\w\u0900-\u097F\s\-]*)$/);return m?[m[1],m[2]]:[s,'']};v.innerHTML='';algn.forEach((x,k)=>{let s=document.createElement('span');s.id=`mk-${x.id}`;
if(x.t==='k'){s.className='c-ok';s.textContent=x.o.t+' '}
else if(x.t==='m'){const [w,p]=splitPun(x.o.t);s.innerHTML=`<span class="c-ok">${w}</span><span class="c-del">${p}</span> `;s.onclick=()=>jump(x.id)}
else if(x.t==='f'){s.className='c-ins';s.textContent=x.u.t+' ';s.onclick=()=>jump(x.id)}
else{if(x.val>=1&&x.w>=1){s.innerHTML=`<span class="c-del">${x.o.t}</span> <span class="c-ins">${x.u.t}</span> `}else{const [ow,op]=splitPun(x.o.t),[uw,up]=splitPun(x.u.t);let h=bare(ow)===bare(uw)?`<span class="c-ok">${uw}</span><span class="c-del">${op}</span>`:`<span class="c-sub-h">${uw}</span>`;s.className='c-grp';s.innerHTML=`${h}<span class="c-cor">(${x.o.t})</span> `}s.onclick=()=>jump(x.id)}
v.appendChild(s)})}
function renEL(){const l=$('eL');l.innerHTML='';errs.forEach(e=>{const it=document.createElement('div');it.className='e-it';it.id=`err-${e.id}`;it.onclick=()=>jump(e.id);
it.innerHTML=`<div class="row" style="margin:0"><span class="e-ctx">${getCtx(oToks,e.i,2,-1)}</span><span class="e-w ${e.val>=1?'m-err':(e.t==='f'?'c-ins':(e.t==='m'?'c-del':'m-h'))}">${e.t==='m'?e.o.t:e.u.t}</span><span class="e-ctx">${getCtx(oToks,e.i,2,1)}</span><span style="font-size:9px;opacity:0.7;margin-left:auto">(-${e.val})</span></div>
<div class="row" style="margin-top:2px;justify-content:flex-end">
<button class="op-btn ${e.val===1?'op-act':''}" onclick="upEr(event,${e.id},1)">F</button><button class="op-btn ${e.val===0.5?'op-act':''}" onclick="upEr(event,${e.id},0.5)">H</button><button class="op-btn ${e.ovr===2?'op-act':''}" onclick="upEr(event,${e.id},2)">D</button><button class="op-btn ${e.val===0?'op-act':''}" onclick="upEr(event,${e.id},0)">X</button></div>`;l.appendChild(it)})}
function getCtx(tk,idx,c,dir){if(idx<0)return"";let s=[],cnt=0,curr=idx+dir;while(cnt<c&&curr>=0&&curr<tk.length){if(dir<0)s.unshift(tk[curr].t);else s.push(tk[curr].t);curr+=dir;cnt++}return s.join(' ')}
function jump(id){if(id===undefined)return;const e=errs.find(x=>x.id===id);if(!e)return;clrHl();
const el=$(`mk-${id}`);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});
let p=el.previousElementSibling,n=el.nextElementSibling;for(let k=0;k<2;k++){if(p){p.classList.add('ctx-hl');p=p.previousElementSibling}if(n){n.classList.add('ctx-hl');n=n.nextElementSibling}}}
$(`err-${id}`)?.scrollIntoView({behavior:'smooth',block:'center'});[...$('eL').children].forEach(c=>c.classList.remove('active'));$(`err-${id}`)?.classList.add('active')}
function clrHl(){[...document.querySelectorAll('.ctx-hl')].forEach(e=>e.classList.remove('ctx-hl'))}
function upEr(ev,id,v){ev.stopPropagation();const e=errs.find(x=>x.id===id);if(e){e.ovr=v;reCalc();jump(id)}}
