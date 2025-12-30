{
type: uploaded file
fileName: checker.js
fullContent:
function opTr(){
    // 1. Sync Source Text: If origTxt is empty (manual typing), grab it from the main textarea
    if((!origTxt || origTxt.length < $('tx').value.length) && $('tx').value.length > 0){
        origTxt = $('tx').value;
    }

    // 2. Validate
    if(!origTxt || $('tx').value.length < 5){
        alert('Please load or type some text first!');
        return;
    }

    // 3. Open Modal
    $('trM').classList.add('active');
    resTr();

    // 4. Show Config (Safety check if element exists)
    if($('checkCfg')) $('checkCfg').style.display = 'flex';
}

function cfmAct(a){
    $('cfm').style.display='none';
    if(a==='d'){
        $('trM').classList.remove('active');
        resTr();
    } else if(a==='s'){
        subTr();
    }
}

function resTr(){
    trIp=0;
    clearInterval(trTi);
    if($('trI')) {
        $('trI').value='';
        $('trI').disabled=1;
    }
    if($('trA')) $('trA').innerText='Start';
    if($('trV')) $('trV').style.display='flex';
    if($('rsV')) $('rsV').style.display='none';
    if($('trInf')) $('trInf').textContent='Ready';
}

function tryClTr(){
    if(trIp && $('trI') && $('trI').value.length > 10){
        $('cfm').style.display='flex';
    } else {
        $('trM').classList.remove('active');
        resTr();
    }
}

function togTr(){
    if(trIp){
        subTr();
    } else {
        stTr(false);
    }
}

function stTr(a=false){
    const v = parseFloat($('trC').value)||0;
    trStopW = (v===0);
    trDur = v*60;
    trRem = v*60;
    trElap = 0;
    trIp = 1;
    
    $('trI').disabled = 0;
    $('trI').focus();
    $('trA').innerText = 'Submit (Early)';
    
    clearInterval(trTi);
    trTi = setInterval(()=>{
        if(trStopW) trElap++; else trRem--;
        let t = trStopW ? trElap : trRem, m = Math.floor(t/60), s = t%60;
        if($('trCD')) $('trCD').innerText = `${m}:${s<10?'0':''}${s}`;
        
        if(!trStopW && trRem <= 0) subTr();
    }, 1000);
}

function subTr(){
    clearInterval(trTi);
    trIp = 0;
    
    // Safely update config from UI if elements exist
    if($('v_spell')) checkConfig.spell = parseFloat($('v_spell').value);
    if($('v_plur')) checkConfig.plur = parseFloat($('v_plur').value);
    if($('v_sub')) checkConfig.sub = parseFloat($('v_sub').value);
    if($('v_comma')) checkConfig.comma = parseFloat($('v_comma').value);
    if($('v_punc')) checkConfig.punc = parseFloat($('v_punc').value);
    if($('v_ins')) checkConfig.ins = parseFloat($('v_ins').value);
    if($('v_mis')) checkConfig.mis = parseFloat($('v_mis').value);

    $('trV').style.display='none';
    $('rsV').style.display='flex';
    if($('checkCfg')) $('checkCfg').style.display='none';

    // Ensure we have source text
    if(!origTxt && $('tx').value.length > 0) origTxt = $('tx').value;
    
    srcWords = splitT(origTxt);
    resW = runDiff(origTxt, $('trI').value);
    renderResult();
}

const getCost=(p)=>{
    if(!isP(p)) return checkConfig.mis;
    if(p===',') return checkConfig.comma;
    if(/^[।?.]$/.test(p)) return checkConfig.punc;
    return 0;
};

function runDiff(sT,tT){
    let s=splitT(sT), t=splitT(tT), n=s.length, m=t.length;
    let dp=Array.from({length:n+1},()=>Array(m+1).fill(0));
    
    for(let i=1;i<=n;i++) dp[i][0] = dp[i-1][0] + getCost(s[i-1]);
    for(let j=1;j<=m;j++) dp[0][j] = dp[0][j-1] + checkConfig.ins;
    
    for(let i=1;i<=n;i++) for(let j=1;j<=m;j++){
        const same = (isP(s[i-1]) === isP(t[j-1]));
        let c = classify(s[i-1], t[j-1], checkConfig);
        
        let costs = [
            dp[i-1][j-1] + (same ? c.p : 99), // Match/Sub
            dp[i-1][j] + getCost(s[i-1]),     // Deletion (Missing in User)
            dp[i][j-1] + checkConfig.ins      // Insertion (Extra in User)
        ];
        
        dp[i][j] = Math.min(...costs);

        // Advanced: Transposition (Swap) check
        if(same && i>1 && j>1 && !isP(s[i-1]) && !isP(s[i-2]) && 
           pNorm(s[i-1])===pNorm(t[j-2]) && pNorm(s[i-2])===pNorm(t[j-1])) {
            dp[i][j] = Math.min(dp[i][j], dp[i-2][j-2] + checkConfig.split*2);
        }
        
        // Advanced: Split/Merge
        if(i>0 && j>1 && !isP(s[i-1]) && pNorm(s[i-1])===pNorm(t[j-2]+t[j-1])) {
            dp[i][j] = Math.min(dp[i][j], dp[i-1][j-2] + checkConfig.split);
        }
        if(i>1 && j>0 && !isP(t[j-1]) && pNorm(s[i-2]+s[i-1])===pNorm(t[j-1])) {
            dp[i][j] = Math.min(dp[i][j], dp[i-2][j-1] + checkConfig.split);
        }
    }
    
    // Backtrack
    let i=n, j=m, r=[];
    while(i>0 || j>0){
        let cur = dp[i][j], s1 = i>0?s[i-1]:'', t1 = j>0?t[j-1]:'';
        const same = (i>0 && j>0 && isP(s1)===isP(t1));
        
        if(same && i>1 && j>1 && !isP(s1) && !isP(s[i-2]) && 
           pNorm(s1)===pNorm(t[j-2]) && pNorm(s[i-2])===pNorm(t1) && 
           cur===dp[i-2][j-2] + checkConfig.split*2){
            r.push({t:'half', w:t1, ex:s[i-2], si:i-2, p:checkConfig.split, desc:'Trans'});
            r.push({t:'half', w:t[j-2], ex:s1, si:i-1, p:checkConfig.split, desc:'Trans'});
            i-=2; j-=2;
        } 
        else if(i>0 && j>1 && !isP(s1) && pNorm(s1)===pNorm(t[j-2]+t1) && cur===dp[i-1][j-2] + checkConfig.split){
            r.push({t:'half', w:t[j-2]+' '+t1, ex:s1, si:i-1, p:checkConfig.split, desc:'Split'});
            i--; j-=2;
        }
        else if(i>1 && j>0 && !isP(t1) && pNorm(s[i-2]+s1)===pNorm(t1) && cur===dp[i-2][j-1] + checkConfig.split){
            r.push({t:'half', w:t1, ex:s[i-2]+' '+s1, si:i-2, p:checkConfig.split, desc:'Join'});
            i-=2; j--;
        }
        else if(same && cur===dp[i-1][j-1] + classify(s1,t1,checkConfig).p){
            let c = classify(s1,t1,checkConfig);
            if(c.p >= 2.0){ // Treat super-high cost as separate Ins+Del
                 r.push({t:'ins', w:t1, si:i, p:checkConfig.ins, desc:'Sub-Ins'});
                 r.push({t:'mis', w:s1, si:i-1, p:getCost(s1), desc:'Sub-Mis'});
            } else {
                 r.push({...c, w:t1, ex:c.norm?c.ex:(pNorm(s1)===pNorm(t1)?'':s1), si:i-1});
            }
            i--; j--;
        }
        else if(i>0 && (j===0 || cur===dp[i-1][j] + getCost(s1))){
            r.push({t:'mis', w:s1, si:i-1, p:getCost(s1), desc:isP(s1)?'Punc':'Omis'});
            i--;
        }
        else {
            r.push({t:'ins', w:t1, si:i, p:checkConfig.ins, desc:isP(t1)?'Punc':'Ins'});
            j--;
        }
    }
    return r.reverse();
}

function renderResult(force=false){
    errs=[]; let h='', tt=0, showNorm=$('chkNorm') ? $('chkNorm').checked : false;
    
    resW.forEach((m,idx)=>{
        let py = m.p || 0; tt += py;
        let cl = m.t==='mis' ? 'w-missing' : (m.t==='ins' ? 'w-insert' : (py===0 ? (m.norm||m.ex||m.desc==='Plural'?'w-x':'w-correct') : (py<=0.5?'w-single':'w-double')));
        let sp = (idx < resW.length-1 && !isP(resW[idx+1].w)) ? ' ' : '';
        
        if(!m.norm && !m.ex && py===0 && m.desc!=='Plural'){
             h += `<span id="t-${idx}" class="w-correct" onclick="opMe(event,${idx})">${m.w}</span>${sp}`;
        } else {
             if(m.norm && !showNorm){
                 h += `<span id="t-${idx}" class="w-correct">${m.w}</span>${sp}`;
             } else {
                 let ei = errs.length;
                 errs.push({...m, idx});
                 h += `<span class="${cl}" id="t-${idx}" onclick="hiE(${ei})">${m.w}${m.ex ? `<span class="${py===0?'fix-x':'fix-text'}">(${m.ex})</span>` : ''}<span class="sup-mark">${py>0?py:''}</span></span>${sp}`;
             }
        }
    });
    
    $('checkV').innerHTML = h;
    renderErrList(tt);
}

function renderErrList(tt){
    let h=''; $('eL').innerHTML='';
    errs.forEach((e,i)=>{
        let pre = srcWords.slice(Math.max(0, e.si-2), e.si).join(' ');
        let post = srcWords.slice(e.si+1, e.si+3).join(' ');
        
        h += `<div class="e-it" id="li-${i}" onclick="hiE(${i})" style="border-left:3px solid ${e.p===0?'#444':'var(--in)'}">
        <div style="display:flex;justify-content:space-between;gap:4px">
            <span style="font-weight:bold;color:var(--${e.p===0?'dim':'in'})">${e.p===0?'X':(e.desc||e.t)}</span>
            <span class="e-ctx" style="flex:1;text-align:right">${pre} <b>${e.w}</b> ${post}</span>
        </div>
        <div class="row" style="margin-top:2px;justify-content:flex-end">
        <button class="op-btn ${e.p===0.5?'op-act':''}" onclick="upEr(event,${i},0.5)">H</button>
        <button class="op-btn ${e.p===1?'op-act':''}" onclick="upEr(event,${i},1)">F</button>
        <button class="op-btn ${e.p===0?'op-act':''}" onclick="upEr(event,${i},0)">X</button>
        </div></div>`;
    });
    $('eL').innerHTML = h;
    $('resTit').innerHTML = `<span style="color:${tt<=0?'var(--gr)':'var(--re)'}">${tt<=0?'PERFECT':tt.toFixed(1)+' ERR'}</span>`;
    $('resDet').innerText = `Acc: ${Math.max(0,100-(tt/srcWords.length*100)).toFixed(2)}%`;
}

function hiE(i){
    [...document.querySelectorAll('.ctx-hl')].forEach(e=>e.classList.remove('ctx-hl'));
    [...document.querySelectorAll('.e-it')].forEach(e=>e.classList.remove('active'));
    
    const e=errs[i];
    if(!e) return;
    
    const li = $('li-'+i);
    if(li) {
        li.classList.add('active');
        li.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
    
    const tk = $('t-'+e.idx);
    if(tk) {
        tk.classList.add('ctx-hl');
        tk.scrollIntoView({behavior:'smooth',block:'center'});
    }
}

function opMe(ev,idx){
    ev.stopPropagation();
    activeIdx=idx;
    const m=$('ctxMenu');
    m.style.display='flex';
    m.innerHTML=`<button class="op-btn" onclick="fMe(0.5)">H</button><button class="op-btn" onclick="fMe(1)">F</button><button class="op-btn" onclick="fMe(0)">X</button><button class="op-btn" onclick="$('ctxMenu').style.display='none'">C</button>`;
    
    let x=ev.pageX, y=ev.pageY-35;
    m.style.left=(x+m.offsetWidth > window.innerWidth ? window.innerWidth-m.offsetWidth-10 : x)+'px';
    m.style.top=y+'px';
}

function fMe(v){
    const w=resW[activeIdx];
    resW[activeIdx]={...w, t:'sub', p:v, desc:'Man'};
    $('ctxMenu').style.display='none';
    renderResult();
}

function upEr(ev,i,v){
    ev.stopPropagation();
    const e=errs[i];
    if(e){
        resW[e.idx].p=v;
        resW[e.idx].desc='Man';
        renderResult();
        hiE(i);
    }
}
}
