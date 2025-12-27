function opTr(){if(!$('tx').value.trim()&&exMode!=='mock'){alert('Load text first!');return}if(is){au.pause();is=0;updatePlBtn()}$('trM').classList.add('active');resTr();$('trA').disabled=0}
function tryClTr(){if(exMode==='mock'&&trIp){return}if($('rsV').style.display==='flex'){$('trM').classList.remove('active');return}if(trIp||$('trI').value.length>0){$('cfm').style.display='flex'}else{$('trM').classList.remove('active')}}
function cfmAct(a){$('cfm').style.display='none';if(a==='d'){$('trM').classList.remove('active');resTr()}else if(a==='s'){subTr()}}
function resTr(){trIp=0;clearInterval(trTi);$('trI').value='';$('trI').disabled=1;$('trA').disabled=0;$('trA').innerText='Start';$('trCD').textContent='00:00';$('trV').style.display='flex';$('rsV').style.display='none';$('trInf').textContent='Ready'}
function togTr(){if(trIp){subTr()}else{stTr(false)}}
function stTr(auto=false){
const v=parseFloat($('trT').value)||parseFloat($('trC').value)||0;trStopW=(v===0);trDur=v*60;trRem=v*60;trElap=0;trIp=1;$('trI').disabled=0;$('trI').value='';$('trI').focus();$('trA').innerText='Submit';
if(exMode==='mock')$('trA').innerText='Submit (Early)';clearInterval(trTi);trTi=setInterval(()=>{if(trStopW)trElap++;else trRem--;let t=trStopW?trElap:trRem,m=Math.floor(t/60),s=t%60;$('trCD').textContent=`${m}:${s<10?'0':''}${s}`;if(!trStopW&&trRem<=0)subTr()},1000);
}
function subTr(){
clearInterval(trTi);trIp=0;$('trI').disabled=1;$('trA').innerText='Start';const srcT=$('chkFull').checked?origTxt:$('tx').value;oToks=tok(srcT);uToks=tok($('trI').value);
const m=oToks.length,n=uToks.length,dp=Array.from({length:m+1},()=>new Int32Array(n+1));
const hs={'में':'मैं','मैं':'में','की':'कि','कि':'की','ओर':'और','और':'ओर','है':'हैं','हैं':'है'};
for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
const bo=bare(oToks[i-1].t),bu=bare(uToks[j-1].t),po=oToks[i-1].p,pu=uToks[j-1].p;
dp[i][j]=(bo===bu||hs[bo]===bu||po===pu)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
}
let i=m,j=n;errs=[];while(i>0||j>0){
const bo=i>0?bare(oToks[i-1].t):'',bu=j>0?bare(uToks[j-1].t):'',po=i>0?oToks[i-1].p:'',pu=j>0?uToks[j-1].p:'';
if(i>0&&j>0&&(bo===bu||hs[bo]===bu||po===pu)){
const o=clean(oToks[i-1].t),u=clean(uToks[j-1].t);
let ty=(o===u)?'w':'h';errs.unshift({t:ty,o:oToks[i-1],u:uToks[j-1],i:i-1,j:j-1,ok:1});i--;j--;
}else if(j>0&&(i===0||dp[i][j-1]>=dp[i-1][j])){errs.unshift({t:'f',u:uToks[j-1],j:j-1,i:-1});j--}
else{errs.unshift({t:'m',o:oToks[i-1],i:i-1,j:-1});i--}
}$('trV').style.display='none';$('rsV').style.display='flex';$('tx').style.visibility='visible';renCheckV();reCalc();
}
function renCheckV(){
const v=$('checkV'),r=$('rS'),srcT=$('chkFull').checked?origTxt:$('tx').value;v.innerHTML='';r.innerHTML='';let sIdx=0;
oToks.forEach((tok,idx)=>{if(tok.s>sIdx)r.appendChild(document.createTextNode(srcT.slice(sIdx,tok.s)));
let sp=document.createElement('span');sp.textContent=tok.t;sp.className='w-n';sp.id=`o-${idx}`;sp.onclick=()=>revClick('o',idx);r.appendChild(sp);sIdx=tok.e});
errs.forEach((e,k)=>{let sp=document.createElement('span');sp.id=`u-${k}`;sp.onclick=()=>revClick('u',k);
if(e.t==='f'){sp.className='c-ins';sp.textContent=e.u.t+' '}else if(e.t==='m'){sp.className='c-mis';sp.textContent=e.o.t+' '}
else if(e.t==='h'){sp.className='c-sp';sp.textContent=e.u.t+' '}else{sp.className='w-n';sp.textContent=e.u.t+' '}v.appendChild(sp)});
}
function reCalc(){
let tE=0,tot=oToks.length;const r=exRules;errs.forEach(e=>{
let v=0;if(e.t==='f')v=r.sub==='d'?1:0.5;else if(e.t==='m')v=1;else if(e.t==='h')v=parseFloat(r.spl);
else if(e.t==='w'&&e.o.t!==e.u.t){
if(parseFloat(r.cap)>0&&e.o.t[0]!==e.u.t[0])v=Math.max(v,parseFloat(r.cap));
if(e.o.t.match(/[,]/)&&!e.u.t.match(/[,]/))v=Math.max(v,parseFloat(r.com));
if(e.o.t.match(/[.?!|]/)&&!e.u.t.match(/[.?!|]/))v=Math.max(v,parseFloat(r.pun));
}tE+=v;});
const acc=Math.max(0,100-(tE/tot*100)),pass=acc>=(100-parseFloat(r.max));
$('resBox').style.display='flex';$('resBox').style.borderColor=pass?'var(--gr)':'var(--re)';
$('resTit').innerHTML=`<span style="color:${pass?'var(--gr)':'var(--re)'}">${pass?'PASSED':'FAILED'}</span>`;
$('resDet').innerHTML=`Errors: <b>${tE.toFixed(1)}</b> / ${tot} (${(tE/tot*100).toFixed(1)}%)<br>Accuracy: <b>${acc.toFixed(1)}%</b>`;
const l=$('eL');l.innerHTML='';errs.forEach((e,k)=>{if(e.t==='w')return;
const it=document.createElement('div');it.className='e-it';it.id=`err-${k}`;
it.innerHTML=`<div class="row" style="margin:0"><span class="e-ctx">${getCtx(oToks,e.i,2,-1)}</span><span class="e-w ${e.t==='f'?'m-err':(e.t==='h'?'m-h':'m-mis')}" onclick="jump(${k})">${e.t==='m'?e.o.t:e.u.t}</span><span class="e-ctx">${getCtx(oToks,e.i,2,1)}</span></div>`;
l.appendChild(it);});
}
function getCtx(tk,idx,c,dir){if(idx<0)return"";let s=[],cnt=0,curr=idx+dir;while(cnt<c&&curr>=0&&curr<tk.length){if(dir<0)s.unshift(tk[curr].t);else s.push(tk[curr].t);curr+=dir;cnt++}return s.join(' ')}
function revClick(t,i){let k=t==='o'?errs.findIndex(e=>e.i===i):i;if(k!==-1)jump(k)}
function jump(k){
const e=errs[k];if(!e)return;clrHl();const hl=(id)=>{const el=$(id);if(el)el.classList.add('ctx-hl')};
if(e.i!==-1){[...Array(5).keys()].forEach(x=>hl(`o-${e.i-2+x}`));const el=$(`o-${e.i}`);if(el)el.scrollIntoView({behavior:'smooth',block:'center'})}
const uEl=$(`u-${k}`);if(uEl){uEl.scrollIntoView({behavior:'smooth',block:'center'});[...Array(5).keys()].forEach(x=>hl(`u-${k-2+x}`))}
const elItem=$(`err-${k}`);if(elItem){elItem.scrollIntoView({behavior:'smooth',block:'center'});[...$('eL').children].forEach(c=>c.classList.remove('active'));elItem.classList.add('active')}
}
function clrHl(){[...document.querySelectorAll('.ctx-hl')].forEach(e=>e.classList.remove('ctx-hl'))}
function upEr(k,t){errs[k].t=t;reCalc();renCheckV();jump(k)}
function refine(){$('rsV').style.display='none';$('trV').style.display='flex';$('trI').disabled=0;$('trI').focus();$('trA').innerText='Submit';$('trA').disabled=0;trIp=1}
