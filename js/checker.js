let algn=[];
const cln=s=>s.replace(/[^\w\u0900-\u097F]/g,'');
const isPen=s=>/[|.?!\u0964]/.test(s);
function opTr(){if($('trI').value.length>0)$('cfm').style.display='flex';else{$('trM').classList.remove('active');$('mockOV').style.display='none'}}
function cfmAct(a){$('cfm').style.display='none';if(a==='d'){$('trI').value='';$('trM').classList.remove('active');$('mockOV').style.display='none'}else if(a==='s')subTr()}
function resTr(){trIp=0;clearInterval(trTi);$('trI').disabled=1;$('trA').innerText='Start';$('trV').style.display='none';$('rsV').style.display='flex';$('trInf').textContent='Ready'}
function togTr(){if(trIp)subTr();else stTr(false)}
function stTr(a=false){const v=parseFloat($('trC').value)||0;trStopW=(v===0);trDur=v*60;trRem=v*60;trElap=0;trIp=1;$('trI').value='';$('trI').disabled=0;$('trI').focus();$('trA').innerText='Submit';$('trV').style.display='flex';$('rsV').style.display='none';clearInterval(trTi);trTi=setInterval(()=>{if(trStopW)trElap++;else trRem--;let t=trStopW?trElap:trRem,m=Math.floor(t/60),s=t%60;$('trCD').innerText=`${m}:${s<10?'0':''}${s}`;if(!trStopW&&trRem<=0)subTr()},1000)}
function subTr(){clearInterval(trTi);trIp=0;$('trI').disabled=1;$('trA').innerText='Start';reCalc()}
function reCalc(){const ot=origTxt,ut=$('trI').value;oToks=tok(ot);uToks=tok(ut);
const m=oToks.length,n=uToks.length,d=Array.from({length:m+1},()=>new Float32Array(n+1).fill(1e9)),p=Array.from({length:m+1},()=>new Int8Array(n+1).fill(0));d[0][0]=0;
for(let i=0;i<=m;i++)for(let j=0;j<=n;j++){
if(i<m&&d[i+1][j]>d[i][j]+1){d[i+1][j]=d[i][j]+1;p[i+1][j]=1}
if(j<n&&d[i][j+1]>d[i][j]+1){d[i][j+1]=d[i][j]+1;p[i][j+1]=2}
if(i<m&&j<n){const c=cmpW(oToks[i].t,uToks[j].t),raw=oToks[i].t===uToks[j].t?0:0.1;
if(d[i+1][j+1]>d[i][j]+c+raw){d[i+1][j+1]=d[i][j]+c+raw;p[i+1][j+1]=0}}
if(i<m&&j<n-1){const cm=cmpW(oToks[i].t,uToks[j].t+uToks[j+1].t);if(d[i+1][j+2]>d[i][j]+cm+2){d[i+1][j+2]=d[i][j]+cm+2;p[i+1][j+2]=3}}
if(i<m-1&&j<n){const cs=cmpW(oToks[i].t+oToks[i+1].t,uToks[j].t);if(d[i+2][j+1]>d[i][j]+cs+2){d[i+2][j+1]=d[i][j]+cs+2;p[i+2][j+1]=4}}}
algn=[];let i=m,j=n;while(i>0||j>0){const op=p[i][j];
if(op===0){const o=oToks[i-1],u=uToks[j-1],bc=cln(o.t)===cln(u.t),exact=o.t===u.t;
algn.unshift({t:exact?'k':(bc?'p':'w'),o,u,i:i-1,j:j-1});i--;j--}
else if(op===1){algn.unshift({t:'m',o:oToks[i-1],i:i-1,j:-1});i--}
else if(op===2){algn.unshift({t:'f',u:uToks[j-1],j:j-1,i:-1});j--}
else if(op===3){algn.unshift({t:'h',o:oToks[i-1],u:{t:uToks[j-2].t+" "+uToks[j-1].t},i:i-1,j:j-2,msg:'Split'});i--;j-=2}
else if(op===4){algn.unshift({t:'h',o:{t:oToks[i-2].t+" "+oToks[i-1].t},u:uToks[j-1],i:i-2,j:j-1,msg:'Merge'});i-=2;j--}}
errs=[];let eTot=0;
algn.forEach((x,k)=>{x.id=k;x.val=0;
if(x.t==='m')x.val=1;else if(x.t==='f')x.val=1;else if(x.t==='w')x.val=1;
else if(x.t==='p'){const df=x.o.t.replace(x.u.t,'')||x.u.t.replace(x.o.t,'');x.val=isPen(df)?(exRules.pun||1):(df.includes(',')?(exRules.com||0):0)}
else if(x.t==='h'){const cleanO=cln(x.o.t),cleanU=cln(x.u.t);x.val=(cleanO===cleanU)?0.5:1}
if(x.t!=='k')errs.push(x);eTot+=x.val});
$('resTit').innerHTML=`<span style="color:${eTot/m*100<=exRules.max?'var(--gr)':'var(--re)'}">${(100-(eTot/m*100)).toFixed(2)}% Acc</span>`;
$('resDet').innerText=`Err: ${eTot} / ${m} (${(eTot/m*100).toFixed(2)}%)`;
$('rsV').style.display='flex';const v=$('checkV');v.innerHTML='';
algn.forEach(x=>{let s=document.createElement('span');s.id=`mk-${x.id}`;
if(x.t==='k'){s.className='c-ok';s.textContent=x.o.t+' '}
else if(x.t==='m'){s.className='c-del';s.textContent=x.o.t+' ';s.onclick=()=>jump(x.id)}
else if(x.t==='f'){s.className='c-ins';s.textContent=x.u.t+' ';s.onclick=()=>jump(x.id)}
else if(x.t==='p'){
let o=x.o.t,u=x.u.t,i=0;while(i<o.length&&i<u.length&&o[i]===u[i])i++;
s.innerHTML=o.slice(0,i)+`<span style="color:${x.val>0?'var(--re)':'var(--ye)'}">${o.length>u.length?o.slice(i):u.slice(i)}</span> `;
s.onclick=()=>jump(x.id)}
else if(x.t==='h'){s.innerHTML=`<span class="${x.val>=1?'c-sub-f':'c-sub-h'}">${x.u.t}</span> <span class="c-cor">(${x.o.t})</span> `;s.onclick=()=>jump(x.id)}
else{s.innerHTML=`<span class="c-sub-f">${x.u.t}<span class="c-cor">(${x.o.t})</span></span> `;s.onclick=()=>jump(x.id)}
v.appendChild(s)});renEL()}
function renEL(){const l=$('eL');l.innerHTML='';errs.forEach(e=>{let it=document.createElement('div');it.className='e-it';it.id=`err-${e.id}`;it.onclick=()=>jump(e.id);
it.innerHTML=`<div class="row" style="margin:0"><span class="m-err">${e.t==='m'?e.o.t:(e.t==='p'?e.u.t:e.u.t)}</span><span class="m-h">${e.val}</span></div><div style="font-size:10px;opacity:0.7">${getCtx(oToks,e.i,2,-1)} <span class="e-ctx">${e.o.t}</span> ${getCtx(oToks,e.i,2,1)}</div>`;l.appendChild(it)})}
function getCtx(tk,idx,c,dir){if(idx<0)return"";let s=[],cnt=0,curr=idx+dir;while(cnt<c&&curr>=0&&curr<tk.length){if(dir<0)s.unshift(tk[curr].t);else s.push(tk[curr].t);curr+=dir;cnt++}return s.join(' ')}
function jump(id){if(id===undefined)return;clrHl();$(`mk-${id}`)?.scrollIntoView({behavior:'smooth',block:'center'});[...$('eL').children].forEach(c=>c.classList.remove('active'));$(`err-${id}`)?.classList.add('active')}
function clrHl(){[...document.querySelectorAll('.ctx-hl')].forEach(e=>e.classList.remove('ctx-hl'))}
function upEr(ev,id,v){ev.stopPropagation();const e=errs.find(x=>x.id===id);if(e){e.val=parseFloat(v);reCalc()}}
