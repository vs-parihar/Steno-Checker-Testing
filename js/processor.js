const nrm=(s)=>s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g,(m)=>((m==='\u200D'||m==='\u200C')?m:'')).replace(/[०-९]/g,d=>'०१२३४५६७८९'.indexOf(d));
const getPhon=(s)=>{
let p=nrm(s).replace(/[\u093C]/g,'');
p=p.replace(/[\u0901\u0902]/g,'N').replace(/[\u0941\u0942]/g,'U').replace(/[\u093F\u0940]/g,'I').replace(/[\u0947\u0948]/g,'E').replace(/[\u094B\u094C]/g,'O');
p=p.replace(/(\u094B\u0902|\u094B\u0901|\u093E\u0901|\u090F\u0901|\u0947\u0902)$/,'');
return p.replace(/[\u094D]/g,'');
};
const tok=(t)=>{
let r=[],re=/([\u0900-\u097F][\u093C]?[\u094D]?)+|[^\s\u0900-\u097F]+/g,m;
while((m=re.exec(t))!==null){const s=nrm(m[0]);r.push({t:s,p:getPhon(s),s:m.index,e:re.lastIndex})}
return r;
};
const clean=(s)=>s.replace(/[\u2018\u2019\u201c\u201d]/g,"'").replace(/[\u2013\u2014]/g,"-").trim();
const bare=(s)=>clean(s).replace(/[.।!?;:,|]/g,'');
function upWC(f=0){
const t=$('tx').value.trim(),l=exRules.wc||$('lg').value;let w=0;
if(t){if(l==='s')w=t.replace(/\s/g,'').length/5;else if(l==='sp')w=(t.length-t.split(/\s+/).length+1)/5;
else if(l==='p'){const tk=t.split(/\s+/);let sm=0,lg=0;tk.forEach(x=>{if(x.match(/[,;]/))sm++;if(x.match(/[.?!|\u0964]/))lg++});w=tk.length+(sm*0.5)+(lg*1)}else w=t.split(/\s+/).length}
const v=Math.ceil(w);$('wc').value=v;$('st').textContent='W: '+v;if(f||v>0)sync('w');updateStatus();
}
function cropTxt(p,c){
if(!origTxt)origTxt=$('tx').value;const t=origTxt.split(/\s+/);if(t.length<=c){$('tx').value=origTxt;return}
let s=p===0?t.slice(0,c+20):p==='mid'?t.slice(Math.floor(t.length/2)-(c/2),Math.floor(t.length/2)+(c/2)+20):t.slice(t.length-c-20);
$('tx').value=s.join(' ')+' ...';upWC(true);
}
