function toggleTheme(){document.body.classList.toggle('light-mode',$('theme').checked);}
function resetData(){$('tx').value='';$('trI').value='';$('resBox').style.display='none';$('rS').innerHTML='';$('checkV').innerHTML='';$('eL').innerHTML='';origTxt='';upWC();}
function upWC(force=false){const t=$('tx').value.trim(),l=exRules.wc||'std';let w=0;if(t){if(l==='s')w=t.replace(/\s/g,'').length/5;else if(l==='p'){const tk=t.split(/\s+/);w=tk.length+(t.split(/[।|?!]/).length-1);}else w=t.split(/\s+/).length;}
const val=Math.ceil(w);$('wc').value=val;$('st').textContent='W: '+val;updateStatus();}
function updateStatus(){$('stWPM').textContent=$('wi').value+' WPM';$('stMode').textContent=exMode==='mock'?'Mock Mode':'Practice';}
function init(){regs.forEach(r=>{$('rg').appendChild(new Option(r.t,r.u))});$('rg').onchange=e=>lG(e.target.value);
$('f').onchange=async e=>{resetData();for(const f of e.target.files){if(f.type.includes('audio')){au.src=URL.createObjectURL(f);$('stTitle').innerText=f.name;}else if(f.name.match(/\.(txt|md)$/i)){origTxt=await f.text();$('tx').value=origTxt;}}upWC(true);};lG(null);}
async function lG(u){let list=[];try{for(let r of (u?[regs.find(x=>x.u===u)]:regs)){const res=await fetch(`https://gist.githubusercontent.com/vs-parihar/${r.u}/raw?t=${Date.now()}`);const j=await res.json();if(Array.isArray(j))list=list.concat(j.map(i=>({...i,reg:r.t})));}}catch(e){}lD(list);renL();}
function lD(list){maxW=0;curL=list.map((i,idx)=>{const b=i.w?i.w[0]:0;if(b>maxW)maxW=b;return{...i,_id:idx,maxW:b,tags:(i.tags||[]).map(t=>t.toUpperCase())};});}
function renL(){$('ls').innerHTML='';curL.forEach((i,idx)=>{let d=document.createElement('div');d.className='list-item';d.innerHTML=`<b>${i.title}</b><br><small>${i.maxW} words</small>`;d.onclick=()=>lA(i,idx);$('ls').appendChild(d);});}
async function lA(i,idx){curI=idx;curO=i;const r=await fetch(i.matter||i.url);origTxt=await r.text();$('tx').value=origTxt;au.src=i.audio;upWC();if(exMode==='mock')opTr();}
window.onload=init;
