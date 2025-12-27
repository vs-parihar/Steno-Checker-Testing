function renCheckV(){const v=$('checkV'),sd=exRules.sub==='d';v.innerHTML='';algn.forEach((x,k)=>{let s=document.createElement('span');s.id=`mk-${x.id}`;
if(x.t==='k'){s.className='c-ok';s.textContent=x.o.t+' '}
else if(x.t==='m'){s.className='c-del';s.textContent=x.o.t+' ';s.onclick=()=>jump(x.id)}
else if(x.t==='f'){s.className='c-ins';s.textContent=x.u.t+' ';s.onclick=()=>jump(x.id)}
else{const ob=bare(x.o.t),ub=bare(x.u.t);if(ob===ub){let htm='';const ot=x.o.t,ut=x.u.t;for(let i=0;i<Math.max(ot.length,ut.length);i++){const oc=ot[i]||'',uc=ut[i]||'';if(oc===uc)htm+=oc;else if(!uc&&oc.match(/[^\w\u0900-\u097F]/))htm+=`<span class="c-del">${oc}</span>`;else if(!oc&&uc.match(/[^\w\u0900-\u097F]/))htm+=`<span class="c-ins">${uc}</span>`;else htm+=uc}s.innerHTML=htm+' '}
else if(sd&&x.val>=1&&x.w>=1){s.innerHTML=`<span class="c-del">${x.o.t}</span> <span class="c-ins">${x.u.t}</span> `}
else{s.className='c-grp';s.innerHTML=`<span class="${x.val>=1?'c-sub-f':'c-sub-h'}">${x.u.t}<span class="c-cor">(${x.o.t})</span></span> `}s.onclick=()=>jump(x.id)}
v.appendChild(s)})}
