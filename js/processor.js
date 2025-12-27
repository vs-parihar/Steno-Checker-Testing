const nrm=(s)=>s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g,m=>((m==='\u200D'||m==='\u200C')?m:'')).replace(/[०-९]/g,d=>'०१२३४५६७८९'.indexOf(d));
const getPhon=(s)=>{
let p=nrm(s).replace(/[\u093C]/g,'');
p=p.replace(/[\u0901\u0902]/g,'N').replace(/[\u0941\u0942]/g,'U').replace(/[\u093F\u0940]/g,'I').replace(/[\u0947\u0948]/g,'E').replace(/[\u094B\u094C]/g,'O');
return p.replace(/[\u094D]/g,'');
};
const isSim=(a,b)=>{
if(!a||!b)return false;const s1=bare(a),s2=bare(b);if(s1===s2)return true;
const suff=['ओं','ों','ां','े','ी','ा','ू'];
const r1=suff.reduce((s,f)=>s.endsWith(f)?s.slice(0,-f.length):s,s1);
const r2=suff.reduce((s,f)=>s.endsWith(f)?s.slice(0,-f.length):s,s2);
if(r1===r2&&r1.length>1)return true;
let d=0,l=Math.max(s1.length,s2.length);for(let i=0;i<Math.min(s1.length,s2.length);i++)if(s1[i]!==s2[i])d++;
return (d+(l-Math.min(s1.length,s2.length)))<=2;
};
const tok=(t)=>{
let r=[],re=/([\u0900-\u097F][\u093C]?[\u094D]?)+|[^\s\u0900-\u097F]+/g,m;
while((m=re.exec(t))!==null){const s=nrm(m[0]);r.push({t:s,p:getPhon(s),s:m.index,e:re.lastIndex})}
return r;
};
const clean=(s)=>s.replace(/[\u2018\u2019\u201c\u201d]/g,"'").replace(/[\u2013\u2014]/g,"-").trim();
const bare=(s)=>clean(s).replace(/[.।!?;:,|]/g,'');
