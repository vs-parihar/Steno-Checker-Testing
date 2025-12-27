const nrm=(s)=>s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, (m)=>((m==='\u200D'||m==='\u200C')?m:'')).replace(/[०-९]/g,d=>'०१२३४५६७८९'.indexOf(d));
const getPhon=(s)=>{
let p=nrm(s).replace(/[\u093C]/g,'');
p=p.replace(/[\u0901\u0902]/g,'N').replace(/[\u0941\u0942]/g,'U').replace(/[\u093F\u0940]/g,'I').replace(/[\u0947\u0948]/g,'E').replace(/[\u094B\u094C]/g,'O');
return p.replace(/[\u094D]/g,'');
};
const tok=(t)=>{
let r=[],re=/([\u0900-\u097F][\u093C]?[\u094D]?)+|[^\s\u0900-\u097F]+/g,m;
while((m=re.exec(t))!==null){const s=nrm(m[0]);r.push({t:s,p:getPhon(s),s:m.index,e:re.lastIndex})}
return r;
};
const clean=(s)=>s.replace(/[\u2018\u2019\u201c\u201d]/g,"'").replace(/[\u2013\u2014]/g,"-").trim();
const bare=(s)=>clean(s).replace(/[.।!?;:,|]/g,'');
function upWC(force=false){
const t=$('tx').value.trim(),l=exRules.wc||$('lg').value;let w=0;
if(t){if(l==='s')w=t.replace(/\s/g,'').length/5;else if(l==='sp')w=(t.length-t.split(/\s+/).length+1)/5;
else if(l==='p'){const tk=t.split(/\s+/);let sm=0,lg=0;tk.forEach(x=>{if(x.match(/[,;]/))sm++;if(x.match(/[.?!|\u0964]/))lg++});w=tk.length+(sm*0.5)+(lg*1)}else w=t.split(/\s+/).length}
const val=Math.ceil(w);$('wc').value=val;$('st').textContent='W: '+val;if(force||val>0)sync('w');updateStatus();
}
function cropTxt(pos,cnt){
if(!origTxt)origTxt=$('tx').value;const t=origTxt.split(/\s+/);if(t.length<=cnt){$('tx').value=origTxt;return}
let sl;if(pos===0)sl=t.slice(0,cnt+20);else if(pos==='mid'){const mid=Math.floor(t.length/2);sl=t.slice(mid-(cnt/2),mid+(cnt/2)+20)}else sl=t.slice(t.length-cnt-20);
$('tx').value=sl.join(' ')+' ...';upWC(true);
}
