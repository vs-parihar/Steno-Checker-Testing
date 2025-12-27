function subTr(){
clearInterval(trTi);trIp=0;$('trI').disabled=1;$('trA').innerText='Start';const srcT=$('chkFull').checked?origTxt:$('tx').value;
oToks=tok(srcT);uToks=tok($('trI').value);const m=oToks.length,n=uToks.length,dp=Array.from({length:m+1},()=>new Int32Array(n+1));
const hs={'में':'मै','मै':'में','में':'मैं','मैं':'में','की':'कि','कि':'की','है':'हैं','हैं':'है','उनकी':'उसकी','उसकी':'उनकी'};
for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
const bo=bare(oToks[i-1].t),bu=bare(uToks[j-1].t),po=oToks[i-1].p,pu=uToks[j-1].p;
dp[i][j]=(bo===bu||hs[bo]===bu||po===pu||isSim(bo,bu))?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
}
let i=m,j=n;errs=[];while(i>0||j>0){
const bo=i>0?bare(oToks[i-1].t):'',bu=j>0?bare(uToks[j-1].t):'';
if(i>0&&j>0&&(bo===bu||hs[bo]===bu||oToks[i-1].p===uToks[j-1].p||isSim(bo,bu))){
const o=clean(oToks[i-1].t),u=clean(uToks[j-1].t);
errs.unshift({t:(o===u)?'w':'h',o:oToks[i-1],u:uToks[j-1],i:i-1,j:j-1,ok:1});i--;j--;
}else if(i>1&&j>0&&bare(oToks[i-1].t+oToks[i-2].t)===bu){ // Handle Vivekananda case
errs.unshift({t:'h',o:oToks[i-1],u:uToks[j-1],i:i-1,j:j-1});i-=2;j--;
}else if(j>0&&(i===0||dp[i][j-1]>=dp[i-1][j])){errs.unshift({t:'f',u:uToks[j-1],j:j-1,i:-1});j--}
else{errs.unshift({t:'m',o:oToks[i-1],i:i-1,j:-1});i--}
}$('trV').style.display='none';$('rsV').style.display='flex';$('tx').style.visibility='visible';renCheckV();reCalc();
}
// Rest of the UI functions (renCheckV, reCalc, jump etc.) remain largely the same but use the updated errs array.
function renCheckV(){
const v=$('checkV'),r=$('rS'),srcT=$('chkFull').checked?origTxt:$('tx').value;v.innerHTML='';r.innerHTML='';let sIdx=0;
oToks.forEach((tok,idx)=>{if(tok.s>sIdx)r.appendChild(document.createTextNode(srcT.slice(sIdx,tok.s)));
let sp=document.createElement('span');sp.textContent=tok.t;sp.className='w-n';sp.id=`o-${idx}`;sp.onclick=()=>revClick('o',idx);r.appendChild(sp);sIdx=tok.e});
errs.forEach((e,k)=>{let sp=document.createElement('span');sp.id=`u-${k}`;sp.onclick=()=>revClick('u',k);
if(e.t==='f')sp.className='c-ins';else if(e.t==='m')sp.className='c-mis';else if(e.t==='h')sp.className='c-sp';else sp.className='w-n';
sp.textContent=(e.t==='m'?e.o.t:e.u.t)+' ';v.appendChild(sp)});
}
function reCalc(){
let tE=0,tot=oToks.length;const r=exRules;errs.forEach(e=>{
if(e.t==='f')tE+=(r.sub==='d'?1:0.5);else if(e.t==='m')tE+=1;else if(e.t==='h')tE+=parseFloat(r.spl);
});
const acc=Math.max(0,100-(tE/tot*100)),pass=acc>=(100-parseFloat(r.max));
$('resBox').style.display='flex';$('resBox').style.borderColor=pass?'var(--gr)':'var(--re)';
$('resTit').innerHTML=`<span style="color:${pass?'var(--gr)':'var(--re)'}">${pass?'PASSED':'FAILED'}</span>`;
$('resDet').innerHTML=`Errors: <b>${tE.toFixed(1)}</b> / ${tot}<br>Accuracy: <b>${acc.toFixed(1)}%</b>`;
const l=$('eL');l.innerHTML='';errs.forEach((e,k)=>{if(e.t==='w')return;
const it=document.createElement('div');it.className='e-it';it.id=`err-${k}`;
it.innerHTML=`<div class="row" style="margin:0"><span class="e-ctx">${getCtx(oToks,e.i,2,-1)}</span><span class="e-w ${e.t==='f'?'m-err':(e.t==='h'?'m-h':'m-mis')}" onclick="jump(${k})">${e.t==='m'?e.o.t:e.u.t}</span><span class="e-ctx">${getCtx(oToks,e.i,2,1)}</span></div>`;
l.appendChild(it);});
}
