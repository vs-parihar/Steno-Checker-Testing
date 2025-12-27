const clean=(s)=>s.replace(/[\u2018\u2019\u201c\u201d]/g,"'").replace(/[\u2013\u2014]/g,"-").trim();
const bare=(s)=>clean(s).toLowerCase().replace(/[.।!?;:,|]/g,'');
const tok=(t)=>{let r=[],re=/\S+/g,m;while((m=re.exec(t))!==null)r.push({t:m[0],s:m.index,e:re.lastIndex});return r};

function upWC(force=false){const t=$('tx').value.trim(),l=exRules.wc||$('lg').value;let w=0;if(t){if(l==='s')w=t.replace(/\s/g,'').length/5;else if(l==='sp')w=(t.length-t.split(/\s+/).length+1)/5;else if(l==='p'){const tk=t.split(/\s+/);let sm=0,lg=0;tk.forEach(x=>{if(x.match(/[,;]/))sm++;if(x.match(/[.?!|\u0964]/))lg++});w=tk.length+(sm*0.5)+(lg*1)}else w=t.split(/\s+/).length}const val=Math.ceil(w);$('wc').value=val;$('st').textContent='W: '+val;if(force||val>0)sync('w');updateStatus()}

function cropTxt(pos,cnt){if(!origTxt)origTxt=$('tx').value;const t=origTxt.split(/\s+/);if(t.length<=cnt){$('tx').value=origTxt;return}let sl;if(pos===0)sl=t.slice(0,cnt+20);else if(pos==='mid'){const mid=Math.floor(t.length/2);sl=t.slice(mid-(cnt/2),mid+(cnt/2)+20)}else sl=t.slice(t.length-cnt-20);$('tx').value=sl.join(' ')+' ...';upWC(true)}
