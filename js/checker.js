let algn=[];
function opTr(){if(!document.getElementById('trM').classList.contains('active')){document.getElementById('trM').classList.add('active');resTr()}else if(document.getElementById('trI').value.length>0){document.getElementById('trM').classList.remove('active')}}
function cfmAct(a){document.getElementById('trM').classList.remove('active');resTr();if(a==='s')subTr()}
function resTr(){trIp=0;clearInterval(trTi);document.getElementById('trI').disabled=true;document.getElementById('trA').innerText='Start';document.getElementById('trV').style.display='flex';document.getElementById('trInf').textContent='Ready'}
function stTr(a=false){const v=parseFloat(document.getElementById('trC').value)||0;trStopW=(v===0);trDur=v*60;trRem=v*60;trElap=0;trIp=1;document.getElementById('trI').disabled=false;document.getElementById('trI').value='';document.getElementById('trI').focus();document.getElementById('trA').innerText='Submit (Early)';clearInterval(trTi);trTi=setInterval(()=>{if(trStopW)trElap++;else trRem--;let t=trStopW?trElap:trRem,m=Math.floor(t/60),s=t%60;document.getElementById('trT').textContent=`${m}:${s<10?'0':''}${s}`},1000)}
function subTr(){const uToks=tok(document.getElementById('trI').value),oToks=tok(document.getElementById('chkFull').checked?origTxt:document.getElementById('tx').value),m=oToks.length,n=uToks.length,d=Array.from({length:m+1},()=>new Float32Array(n+1).fill(1e9)),p=Array.from({length:m+1},()=>new Int8Array(n+1).fill(0));d[0][0]=0;
for(let i=0;i<=m;i++)for(let j=0;j<=n;j++){
if(i<m&&d[i+1][j]>d[i][j]+1){d[i+1][j]=d[i][j]+1;p[i+1][j]=1}
if(j<n&&d[i][j+1]>d[i][j]+1){d[i][j+1]=d[i][j]+1;p[i][j+1]=2}
if(i<m&&j<n){const c=cmpW(oToks[i].t,uToks[j].t),raw=oToks[i].t===uToks[j].t?0:0.1;if(d[i+1][j+1]>d[i][j]+c+raw){d[i+1][j+1]=d[i][j]+c+raw;p[i+1][j+1]=0}}
if(i<m&&j<n-1){const cm=cmpW(oToks[i].t,uToks[j].t+uToks[j+1].t);if(d[i+1][j+2]>d[i][j]+cm+0.4){d[i+1][j+2]=d[i][j]+cm+0.4;p[i+1][j+2]=3}}
if(i<m-1&&j<n){const cs=cmpW(oToks[i].t+oToks[i+1].t,uToks[j].t);if(d[i+2][j+1]>d[i][j]+cs+0.4){d[i+2][j+1]=d[i][j]+cs+0.4;p[i+2][j+1]=4}}}
algn=[];let i=m,j=n;while(i>0||j>0){const op=p[i][j];
if(op===0){const c=cmpW(oToks[i-1].t,uToks[j-1].t);algn.unshift({t:c===0?'k':'w',o:oToks[i-1],u:uToks[j-1],val:c});i--;j--}
else if(op===1){algn.unshift({t:'m',o:oToks[i-1]});i--}
else if(op===2){algn.unshift({t:'f',u:uToks[j-1]});j--}
else if(op===3){algn.unshift({t:'h',o:oToks[i-1],u:{t:uToks[j-2].t+uToks[j-1].t},msg:'Split',val:0.5});i--;j-=2}
else if(op===4){algn.unshift({t:'h',o:{t:oToks[i-2].t+oToks[i-1].t},u:uToks[j-1],msg:'Merge',val:0.5});i-=2;j--}}
const v=document.getElementById('checkV');v.innerHTML='';algn.forEach((x,k)=>{let s=document.createElement('span');
if(x.t==='k'){s.className='c-ok';s.textContent=x.o.t+' '}
else if(x.t==='m'){s.className='c-del';s.textContent=x.o.t+' '}
else if(x.t==='f'){s.className='c-ins';s.textContent=x.u.t+' '}
else {const bO=bare(x.o.t),bU=bare(x.u.t);if(bO===bU){s.className='c-grp';let o=x.o.t,u=x.u.t,idx=0;while(idx<o.length&&idx<u.length&&o[idx]===u[idx])idx++;s.innerHTML=`${o.slice(0,idx)}<span style="color:var(--ye)">${u.slice(idx)}</span> `}
else{s.className=x.val>=1?'c-sub-f':'c-sub-h';s.innerHTML=`${x.u.t}<span class="c-cor">(${x.o.t})</span> `}}
v.appendChild(s)})}
