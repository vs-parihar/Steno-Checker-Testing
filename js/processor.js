const norm=s=>s?s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/ँ/g,'ं').replace(/[ङञणनम्]्/g,'ं').replace(/फ़/g,'फ+़').replace(/ज़/g,'ज+़').replace(/ख़/g,'ख+़').replace(/ग़/g,'ग+़').replace(/ड़/g,'ड+़').replace(/ढ़/g,'ढ+़').replace(/[०-९]/g,d=>"0123456789"["०१२३४५६७८९".indexOf(d)]).trim():'';
const pNorm=s=>norm(s||'').replace(/ई/g,'यी').replace(/ए/g,'ये').replace(/ओ/g,'वो');
const getAk=s=>s.match(/[\u0900-\u097F][\u093C]?[\u094D\u0900-\u0902\u093E-\u094C\u0962\u0963]*/g)||[];
const isP=s=>/^[।?.,\-!:;()"'\[\]{}]$/.test(s);
const splitT=t=>t.replace(/([।?.,\-!:;()"'\[\]{}])/g,' $1 ').split(/\s+/).filter(x=>x);

const lev=(a,b)=>{const d=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));for(let i=0;i<=a.length;i++)d[i][0]=i;for(let j=0;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=a[i-1]===b[j-1]?d[i-1][j-1]:Math.min(d[i-1][j],d[i][j-1],d[i-1][j-1])+1;return d[a.length][b.length]};

function isPlural(s,t){let ns=norm(s),nt=norm(t);if(ns.includes('(')){let b=ns.split('(')[0],pl=ns.match(/\((.*?)\)/)?.[1];return nt===b||nt===(b+pl)}return false}

function classify(s,t,cfg){
    let ns=norm(s),nt=norm(t);
    let nsP=pNorm(ns),ntP=pNorm(nt);
    const sameType=(isP(ns)===isP(nt));
    if(!sameType)return{t:'sub',p:99,desc:'Type'};
    if(isP(ns))return ns===nt?{t:'ok',p:0}:{t:'ok',p:0,norm:true,ex:s};
    if(ns===nt||isPlural(ns,nt))return{t:'ok',p:isPlural(ns,nt)?cfg.plur:0,desc:isPlural(ns,nt)?'Plural':''};
    if(nsP===ntP)return{t:'ok',p:0,norm:true,ex:s};
    if(ns.replace(/[ोोंाेीुू]/g,'')===nt.replace(/[ोोंाेीुू]/g,''))return{t:'half',p:cfg.spell,desc:'Spell'};
    let sB=ns.split('(')[0],sO=ns.match(/\((.*?)\)/)?.[1]||'';
    let akB=getAk(sB),akO=sO?getAk(sB.slice(0,-1)+sO):[],akT=getAk(nt);
    let d=Math.min(lev(akB,akT),sO?lev(akO,akT):Infinity);
    let py=(akB.length&&akT.length&&d===1)?cfg.spell:cfg.sub;
    return{t:py>=1.0?'sub':'half',p:py,desc:py>=1.0?'Sub':'Spell'}
}

function upWC(f=0){const t=$('tx').value.trim(),l=exRules.wc||$('lg').value;let w=0;if(t){if(l==='s')w=t.replace(/\s/g,'').length/5;else if(l==='sp')w=(t.length-t.split(/\s+/).length+1)/5;else if(l==='p'){const tk=t.split(/\s+/);let sm=0,lg=0;tk.forEach(x=>{if(x.match(/[,;]/))sm++;if(x.match(/[.?!|\u0964]/))lg++});w=tk.length+(sm*0.5)+(lg*1)}else w=t.split(/\s+/).length}const v=Math.ceil(w);$('wc').value=v;$('st').textContent='W: '+v;if(f||v>0)sync('w');updateStatus()}
function cropTxt(pos,cnt){if(!origTxt)origTxt=$('tx').value;const t=origTxt.split(/\s+/);if(t.length<=cnt){$('tx').value=origTxt;return}let sl;if(pos===0)sl=t.slice(0,cnt+20);else if(pos==='mid'){const mid=Math.floor(t.length/2);sl=t.slice(mid-(cnt/2),mid+(cnt/2)+20)}else sl=t.slice(t.length-cnt-20);$('tx').value=sl.join(' ')+' ...';upWC(true)}
