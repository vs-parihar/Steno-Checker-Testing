let algn=[];
function subTr(){clearInterval(trTi);trIp=0;$('trI').disabled=1;$('trA').innerText='Start';const srcT=$('chkFull').checked?origTxt:$('tx').value;oToks=tok(srcT);uToks=tok($('trI').value);const m=oToks.length,n=uToks.length,d=Array.from({length:m+1},()=>new Float32Array(n+1).fill(1e9)),p=Array.from({length:m+1},()=>new Int8Array(n+1).fill(0));d[0][0]=0;
for(let i=0;i<=m;i++)for(let j=0;j<=n;j++){
if(i<m&&d[i+1][j]>d[i][j]+1){d[i+1][j]=d[i][j]+1;p[i+1][j]=1}
if(j<n&&d[i][j+1]>d[i][j]+1){d[i][j+1]=d[i][j]+1;p[i][j+1]=2}
if(i<m&&j<n){const c=cmpW(oToks[i].t,uToks[j].t);let raw=(oToks[i].t===uToks[j].t)?0:0.1;if(bare(oToks[i].t)===bare(uToks[j].t)&&oToks[i].t!==uToks[j].t)raw=0.05;if(d[i+1][j+1]>d[i][j]+c+raw){d[i+1][j+1]=d[i][j]+c+raw;p[i+1][j+1]=0}}
if(i<m&&j<n-1){const cm=cmpW(oToks[i].t,uToks[j].t+uToks[j+1].t);if(d[i+1][j+2]>d[i][j]+cm+2){d[i+1][j+2]=d[i][j]+cm+2;p[i+1][j+2]=3}}
if(i<m-1&&j<n){const cs=cmpW(oToks[i].t+oToks[i+1].t,uToks[j].t);if(d[i+2][j+1]>d[i][j]+cs+2){d[i+2][j+1]=d[i][j]+cs+2;p[i+2][j+1]=4}}}
algn=[];let i=m,j=n;while(i>0||j>0){const op=p[i][j];if(op===0){const c=cmpW(oToks[i-1].t,uToks[j-1].t),raw=oToks[i-1].t!==uToks[j-1].t;algn.unshift({t:(c===0&&!raw)?'k':(c===0?'p':'w'),o:oToks[i-1],u:uToks[j-1],i:i-1,j:j-1,w:c});i--;j--}
else if(op===1){algn.unshift({t:'m',o:oToks[i-1],i:i-1,j:-1});i--}
else if(op===2){algn.unshift({t:'f',u:uToks[j-1],j:j-1,i:-1});j--}
else if(op===3){algn.unshift({t:'h',o:oToks[i-1],u:{t:uToks[j-2].t+" "+uToks[j-1].t},i:i-1,j:j-2,msg:'Split',w:0.5});i--;j-=2}
else if(op===4){algn.unshift({t:'h',o:{t:oToks[i-2].t+" "+oToks[i-1].t},u:uToks[j-1],i:i-2,j:j-1,msg:'Merge',w:0.5});i-=2;j--}}
errs=algn.filter(x=>x.t!=='k').map((e,idx)=>({...e,id:idx}));$('trV').style.display='none';$('rsV').style.display='flex';$('tx').style.visibility='visible';reCalc()}
function reCalc(){let tE=0,tot=oToks.length;const r=exRules.max?exRules:{max:100,wc:'s',sub:'s',spl:0.5,cap:0,pun:0.5,com:0};
errs.forEach(e=>{let v=0;if(e.ovr!==undefined)v=e.ovr;else{if(e.t==='f')v=r.sub==='d'?1:0.5;else if(e.t==='m')v=1;else if(e.t==='h')v=parseFloat(r.spl);else if(e.t==='p')v=parseFloat(r.pun);else if(e.t==='w'){if(e.w>=1)v=1;else{v=0;if(parseFloat(r.cap)>0&&e.o.t[0]!==e.u.t[0])v=Math.min(1,Math.max(v,parseFloat(r.cap)));if(e.o.t.match(/[.?!|\u0964]/)&&!e.u.t.match(/[.?!|\u0964]/))v=Math.min(1,Math.max(v,parseFloat(r.pun)))}}}
e.val=v;tE+=v});const acc=Math.max(0,100-(tE/tot*100)),pass=acc>=(100-parseFloat(r.max));$('resBox').style.display='flex';$('resBox').style.borderColor=pass?'var(--gr)':'var(--re)';$('resTit').innerHTML=`<span style="color:${pass?'var(--gr)':'var(--re)'}">${pass?'PASSED':'FAILED'}</span>`;$('resDet').innerHTML=`Errors: <b>${tE.toFixed(1)}</b> / ${tot} (${(tE/tot*100).toFixed(1)}%)<br>Accuracy: <b>${acc.toFixed(1)}%</b>`;renCheckV();renEL()}
function renCheckV(){const v=$('checkV');v.innerHTML='';algn.forEach((x,k)=>{let s=document.createElement('span');s.id=`mk-${x.id}`;if(x.t==='k'){s.className='c-ok';s.textContent=x.o.t+' '}else if(x.t==='p'){const bo=bare(x.o.t);s.innerHTML=`${bo}<span class="c-del">${x.o.t.replace(bo,'')}</span> `;s.onclick=()=>jump(x.id)}else if(x.t==='m'){s.className='c-del';s.textContent=x.o.t+' ';s.onclick=()=>jump(x.id)}else if(x.t==='f'){s.className='c-ins';s.textContent=x.u.t+' ';s.onclick=()=>jump(x.id)}else{s.className='c-grp';s.innerHTML=`<span class="${x.val>=1?'c-sub-f':'c-sub-h'}">${x.u.t}<span class="c-cor">(${x.o.t})</span></span> `;s.onclick=()=>jump(x.id)}v.appendChild(s)})}
