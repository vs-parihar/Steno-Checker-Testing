const nrm=(s)=>s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g,m=>(m==='\u200D'||m==='\u200C'?m:'')).replace(/[०-९]/g,d=>'०१२३४५६७८९'.indexOf(d));
const getRoot=(s)=>{
let r=nrm(s);const sufs=['ाओं','ओं','यों','ीयों','ा','ी','ु','ू','े','ै'];
for(let f of sufs)if(r.endsWith(f))return r.slice(0,-f.length);
return r;
};
const getPhon=(s)=>{
let p=nrm(s).replace(/[\u093C\u0901\u0902]/g,'');
p=p.replace(/[\u0941\u0942]/g,'U').replace(/[\u093F\u0940]/g,'I').replace(/[\u0947\u0948]/g,'E').replace(/[\u094B\u094C]/g,'O');
return p.replace(/[\u094D]/g,'');
};
const tok=(t)=>{
let r=[],re=/([\u0900-\u097F][\u093C]?[\u094D]?)+|[^\s\u0900-\u097F]+/g,m;
while((m=re.exec(t))!==null){const s=nrm(m[0]);r.push({t:s,p:getPhon(s),rt:getRoot(s),s:m.index,e:re.lastIndex})}
return r;
};
const clean=(s)=>s.replace(/[\u2018\u2019\u201c\u201d]/g,"'").replace(/[\u2013\u2014]/g,"-").trim();
const bare=(s)=>clean(s).replace(/[.।!?;:,|]/g,'');
