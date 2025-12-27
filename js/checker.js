let trTi=null,trRem=0,trElap=0,trStopW=0,trDur=0,trIp=0,errs=[],oToks=[],uToks=[];
const norm=(s)=>s.normalize('NFC').replace(/[\u200B-\u200D]/g, (m)=>m==='\u200C'||m==='\u200D'?m:'');
const hNum=(s)=>s.replace(/[०-९]/g, m=>H_MAP[m]);
const pAk=(s)=>s.replace(/[ङ्ञ्णम्]/g, m=>P_AK[m]||m);
const bare=(s)=>{
let t=norm(hNum(s)).toLowerCase().replace(/[.ред!?;:,|]/g,'');
t=t.replace(/([\u0900-\u094f])\u093c/g, '$1'); // Nukta tolerant
t=pAk(t).replace(/\u0902/g, '\u0901'); // Anusvara/Bindu
return t;
};
const tok=(t)=>{let r=[],re=/\S+/g,m,v=norm(t);while((m=re.exec(v))!==null)r.push({t:m[0],s:m.index,e:re.lastIndex});return r;};
function opTr(){if(!$('tx').value.trim()&&exMode!=='mock'){alert('Load text!');return;}if(is){au.pause();is=0;updatePlBtn();}$('trM').classList.add('active');resTr();$('trA').disabled=0;}
function resTr(){trIp=0;clearInterval(trTi);$('trI').value='';$('trI').disabled=1;$('trA').disabled=0;$('trA').innerText='Start';$('trCD').textContent='00:00';$('trV').style.display='flex';$('rsV').style.display='none';}
function stTr(auto=false){const v=parseFloat($('trT').value)||parseFloat($('trC').value)||0;trStopW=(v===0);trDur=v*60;trRem=v*60;trElap=0;trIp=1;$('trI').disabled=0;$('trI').focus();$('trA').innerText='Submit';clearInterval(trTi);trTi=setInterval(()=>{if(trStopW)trElap++;else trRem--;let t=trStopW?trElap:trRem,m=Math.floor(t/60),s=t%60;$('trCD').textContent=`${m}:${s<10?'0':''}${s}`;if(!trStopW&&trRem<=0)subTr();},1000);}
function lev(a,b){
if(a===b)return 0;const m=a.length,n=b.length,d=Array.from({length:m+1},()=>new Int32Array(n+1));
for(let i=0;i<=m;i++)d[i][0]=i;for(let j=0;j<=n;j++)d[0][j]=j;
for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
let cost=(a[i-1]===b[j-1])?0:([\u093c\u094d\u200d].includes(a[i-1])?0.2:1);
d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+cost);
}return d[m][n];
}
function subTr(){
clearInterval(trTi);trIp=0;$('trI').disabled=1;const srcT=$('chkFull').checked?origTxt:$('tx').value;
oToks=tok(srcT);uToks=tok($('trI').value);const m=oToks.length,n=uToks.length,dp=Array.from({length:m+1},()=>new Int32Array(n+1));
for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
const bo=bare(oToks[i-1].t),bu=bare(uToks[j-1].t);
dp[i][j]=(bo===bu||lev(bo,bu)<1.5)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
}
let i=m,j=n;errs=[];while(i>0||j>0){
const bo=i>0?bare(oToks[i-1].t):'',bu=j>0?bare(uToks[j-1].t):'';
if(i>0&&j>0&&(bo===bu||lev(bo,bu)<1.5)){errs.unshift({t:oToks[i-1].t===uToks[j-1].t?'w':'h',o:oToks[i-1],u:uToks[j-1],i:i-1,j:j-1});i--;j--;}
else if(j>0&&(i===0||dp[i][j-1]>=dp[i-1][j])){errs.unshift({t:'f',u:uToks[j-1],j:j-1,i:-1});j--;}
else{errs.unshift({t:'m',o:oToks[i-1],i:i-1,j:-1});i--;}}
$('trV').style.display='none';$('rsV').style.display='flex';renCheckV();reCalc();
}
function renCheckV(){const v=$('checkV'),r=$('rS'),srcT=$('chkFull').checked?origTxt:$('tx').value;v.innerHTML='';r.innerHTML='';let sIdx=0;oToks.forEach((t,idx)=>{if(t.s>sIdx)r.appendChild(document.createTextNode(srcT.slice(sIdx,t.s)));let sp=document.createElement('span');sp.textContent=t.t;sp.className='w-n';sp.id=`o-${idx}`;r.appendChild(sp);sIdx=t.e;});errs.forEach((e,k)=>{let sp=document.createElement('span');sp.className=e.t==='f'?'c-ins':(e.t==='m'?'c-mis':(e.t==='h'?'c-sp':'w-n'));sp.textContent=e.t==='m'?e.o.t+' ':e.u.t+' ';sp.id=`u-${k}`;v.appendChild(sp);});}
function reCalc(){let tE=0,tot=oToks.length,r=exRules;errs.forEach(e=>{let v=0;if(e.t==='f')v=r.sub==='d'?1:0.5;else if(e.t==='m')v=1;else if(e.t==='h')v=parseFloat(r.spl);tE+=v;});const acc=Math.max(0,100-(tE/tot*100)),pass=acc>=(100-parseFloat(r.max));$('resBox').style.display='flex';$('resBox').style.borderColor=pass?'var(--gr)':'var(--re)';$('resDet').innerHTML=`Errors: <b>${tE.toFixed(1)}</b> / ${tot}<br>Accuracy: <b>${acc.toFixed(1)}%</b>`;}
