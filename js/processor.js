const nrm=s=>{if(!s)return'';return s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\u093C/g,'').replace(/[\u0902\u0901]/g,'\u0902').replace(/[०-९]/g,d=>'0123456789'[d.charCodeAt(0)-2406]).replace(/^मै$/,'में').replace(/^में$/,'मै').trim()};
const bare=s=>nrm(s).replace(/[^\w\u0900-\u097F]/g,'').toLowerCase();
const punc=s=>s.replace(/[\w\u0900-\u097F]/g,'');
const tok=t=>{let r=[],re=/\S+/g,m;while((m=re.exec(t)))r.push({t:m[0],s:m.index,e:re.lastIndex});return r};
const stm=w=>{let s=nrm(w);if(s.length<4)return s;return s.replace(/(?:ओं|ियों|ों|एं|ाएं|िया|ि|ी|ा|े|ू|\u094d)$/,'')};
const lev=(a,b)=>{const m=a.length,n=b.length,d=Array(n+1).fill(0).map((_,i)=>i);for(let i=1;i<=m;i++){let p=d[0];d[0]=i;for(let j=1;j<=n;j++){const t=d[j];d[j]=Math.min(d[j]+1,d[j-1]+1,p+(a[i-1]===b[j-1]?0:1));p=t}}return d[n]};
const cmpW=(o,u)=>{const O=bare(o),U=bare(u),pO=punc(o),pU=punc(u);if(o===u)return 0;if(O===U&&pO!==pU)return 0.5;const l=Math.max(O.length,U.length),d=lev(O,U);if(stm(O)===stm(U))return 0.5;if(l>=3&&d===1)return 0.5;
const ph=s=>s.replace(/[इई]/g,'इ').replace(/[उऊ]/g,'उ').replace(/[शषस]/g,'स').replace(/[बव]/g,'ब').replace(/[ऋृ]/g,'र').replace(/[-]/g,'');
if(ph(O)===ph(U))return 0.5;return 1};
function upWC(f=0){const t=document.getElementById('tx').value.trim(),l=exRules.wc||document.getElementById('lg').value;let w=0;if(t){if(l==='s')w=t.replace(/\s/g,'').length/5;else if(l==='sp')w=(t.length-t.split(/\s+/).length+1)/5;else w=t.split(/\s+/).length}const v=Math.ceil(w);document.getElementById('wc').value=v;document.getElementById('st').textContent='W: '+v}
