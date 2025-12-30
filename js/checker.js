function subTr() {
    const srcIn = $('srcIn').value;
    const tyIn = $('tyIn').value;
    
    // Capture config from UI
    exRules = {
        spell: parseFloat($('v_spell').value),
        plur: parseFloat($('v_plur').value),
        sub: parseFloat($('v_sub').value),
        ins: parseFloat($('v_ins').value),
        mis: parseFloat($('v_mis').value),
        comma: parseFloat($('v_comma').value),
        punc: parseFloat($('v_punc').value),
        split: parseFloat($('v_split').value),
        hyphen: parseFloat($('v_hyphen').value),
        miscp: parseFloat($('v_miscp').value)
    };

    const resW = diff(srcIn, tyIn);
    const srcWords = srcIn.replace(/([।?.,\-!:;()"'\[\]{}])/g, ' $1 ').split(/\s+/).filter(x => x);
    errs = [];
    let h = '';

    resW.forEach((m, idx) => {
        let py = m.p || 0;
        let cl = m.t === 'mis' ? 'w-missing' : (m.t === 'ins' ? 'w-insert' : (py === 0 ? (m.norm || m.ex || m.desc === 'Plural' ? 'w-x' : 'w-correct') : (py <= 0.5 ? 'w-single' : 'w-double')));
        let space = (idx < resW.length - 1 && !isP(resW[idx + 1].w)) ? ' ' : '';

        if (!m.norm && !m.ex && py === 0 && m.desc !== 'Plural') {
            h += `<span id="t-${idx}" class="w-correct" onclick="opMe(event, ${idx})">${m.w}</span>${space}`;
        } else {
            let skip = (m.norm && !showNorm);
            if (!skip) {
                let ei = errs.length;
                errs.push({ idx, tp: m.t, w: m.w, ex: m.ex || '', py, desc: m.desc || (m.norm ? 'Norm' : ''), si: m.si });
                h += `<span class="${cl}" id="t-${idx}" onclick="hiE(${ei})">${m.w}${m.ex ? `<span class="${py === 0 ? 'fix-x' : 'fix-text'}">(${m.ex})</span>` : ''}<span class="sup-mark">${py > 0 ? py : ''}</span></span>${space}`;
            } else {
                h += `<span id="t-${idx}" class="w-correct">${m.w}</span>${space}`;
            }
        }
    });

    $('chOut').innerHTML = h;
    reEr(srcWords);
    $('trMod').style.display = 'none';
    $('reMod').style.display = 'flex';
}

function reEr(srcWords) {
    let h = '', tt = 0;
    errs.forEach((e, i) => {
        tt += e.py;
        let pre = srcWords.slice(Math.max(0, e.si - 2), e.si).join(' ');
        let post = srcWords.slice(e.si + 1, e.si + 3).join(' ');
        let map = '';
        if (e.ex && e.w && !isP(e.ex)) {
            let a1 = getAk(e.ex), a2 = getAk(e.w);
            if (a1 && a2 && a1.length === a2.length) 
                for (let k = 0; k < a1.length; k++) if (a1[k] !== a2[k]) map += `${a1[k]}→${a2[k]} `;
        }
        h += `<li class="err-item" id="li-${i}" onclick="hiE(${i})" style="border-left-color:${e.py === 0 ? '#444' : 'var(--primary)'}">
            <div class="ctx-box">
                <span class="err-type">${e.py === 0 ? 'X' : (e.desc || e.tp)} ${map ? `(${map.trim()})` : ''}</span>
                <span class="ctx">${pre} <b style="color:#fff">${e.w}</b> ${post}</span>
            </div>
            <div class="btn-grp">
                <button class="${e.py === 0.5 ? 'active' : ''}" onclick="seE(${i},0.5);event.stopPropagation()">H</button>
                <button class="${e.py === 1.0 ? 'active' : ''}" onclick="seE(${i},1.0);event.stopPropagation()">F</button>
                <button class="${e.py === 2.0 ? 'active' : ''}" onclick="seE(${i},2.0);event.stopPropagation()">D</button>
                <button class="${e.py === 0 ? 'active' : ''}" onclick="seE(${i},0);event.stopPropagation()">X</button>
            </div></li>`;
    });
    $('errLi').innerHTML = h;
    $('stHe').innerHTML = `<span>Penalty: ${tt.toFixed(1)}</span><span style="font-weight:bold;color:var(--fix)">Acc: ${Math.max(0, 100 - (tt / srcWords.length * 100)).toFixed(2)}%</span>`;
}

function hiE(i) {
    document.querySelectorAll('.err-item').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('#chOut span').forEach(s => s.classList.remove('ctx-hi'));
    const e = errs[i], li = document.getElementById(`li-${i}`);
    if (li) {
        li.classList.add('active');
        li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    for (let k = 1; k <= 2; k++) {
        let p = document.getElementById(`t-${e.idx - k}`), n = document.getElementById(`t-${e.idx + k}`);
        if (p) p.classList.add('ctx-hi');
        if (n) n.classList.add('ctx-hi');
    }
    const cur = document.getElementById(`t-${e.idx}`);
    if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
