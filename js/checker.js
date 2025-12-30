let resW = [], activeIdx = -1, showNorm = false;

function classify(s, t) {
    let ns = nrm(s), nt = nrm(t);
    let nsP = pNorm(ns), ntP = pNorm(nt);
    const sameType = (isP(ns) === isP(nt));
    if (!sameType) return { t: 'sub', p: 99, desc: 'TypeMismatch' };

    if (isP(ns)) return ns === nt ? { t: 'ok', p: 0 } : { t: 'ok', p: 0, norm: true, ex: s };
    if (ns === nt || isPlural(ns, nt)) return { t: 'ok', p: isPlural(ns, nt) ? (exRules.plur || 0.5) : 0, desc: isPlural(ns, nt) ? 'Plural' : '' };
    if (nsP === ntP) return { t: 'ok', p: 0, norm: true, ex: s };

    if (ns.replace(/[ोोंाेीुू]/g, '') === nt.replace(/[ोोंाेीुू]/g, '')) return { t: 'half', p: exRules.spl || 0.5, desc: 'Spell' };

    let sB = ns.split('(')[0], sO = ns.match(/\((.*?)\)/)?.[1] || '';
    let akB = getAk(sB), akO = sO ? getAk(sB.slice(0, -1) + sO) : [], akT = getAk(nt);
    let d = Math.min(lev(akB, akT), sO ? lev(akO, akT) : Infinity);
    let py = (akB.length && akT.length && d === 1) ? (exRules.spl || 0.5) : (exRules.sub || 1);
    return { t: py >= 1.0 ? 'sub' : 'half', p: py, desc: py >= 1.0 ? 'Sub' : 'Spell' };
}

function isPlural(s, t) {
    let ns = nrm(s);
    if (ns.includes('(')) {
        let b = ns.split('(')[0], pl = ns.match(/\((.*?)\)/)?.[1];
        return t === b || t === (b + pl);
    }
    return false;
}

function getCost(p) {
    if (!isP(p)) return exRules.mis || 1;
    if (p === ',') return exRules.com || 0;
    if (p === '-') return 0;
    if (/^[।?.]$/.test(p)) return exRules.pun || 0.5;
    return 0;
}

function diff(sT, tT) {
    let s = splitT(sT), t = splitT(tT), n = s.length, m = t.length;
    let dp = Array.from({ length: n + 1 }, () => new Float32Array(m + 1).fill(0));
    const insCost = exRules.ins || 1;
    const splitCost = 0.5;

    for (let i = 1; i <= n; i++) dp[i][0] = dp[i - 1][0] + getCost(s[i - 1]);
    for (let j = 1; j <= m; j++) dp[0][j] = dp[0][j - 1] + insCost;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const same = (isP(s[i - 1]) === isP(t[j - 1]));
            let c = classify(s[i - 1], t[j - 1]);
            dp[i][j] = Math.min(dp[i - 1][j - 1] + (same ? c.p : 99), dp[i - 1][j] + getCost(s[i - 1]), dp[i][j - 1] + insCost);
            
            if (same && i > 1 && j > 1 && !isP(s[i - 1]) && !isP(s[i - 2]) && pNorm(s[i - 1]) === pNorm(t[j - 2]) && pNorm(s[i - 2]) === pNorm(t[j - 1]))
                dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + splitCost * 2);
            if (i > 0 && j > 1 && !isP(s[i - 1]) && pNorm(s[i - 1]) === pNorm(t[j - 2] + t[j - 1]))
                dp[i][j] = Math.min(dp[i][j], dp[i - 1][j - 2] + splitCost);
            if (i > 1 && j > 0 && !isP(t[j - 1]) && pNorm(s[i - 2] + s[i - 1]) === pNorm(t[j - 1]))
                dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 1] + splitCost);
        }
    }

    let i = n, j = m, r = [];
    while (i > 0 || j > 0) {
        let cur = dp[i][j], s1 = s[i - 1], t1 = t[j - 1];
        const same = (i > 0 && j > 0 && isP(s[i - 1]) === isP(t[j - 1]));
        if (same && i > 1 && j > 1 && !isP(s1) && !isP(s[i - 2]) && pNorm(s1) === pNorm(t[j - 2]) && pNorm(s[i - 2]) === pNorm(t1) && cur === dp[i - 2][j - 2] + splitCost * 2) {
            r.push({ t: 'half', w: t1, ex: s[i - 2], si: i - 2, p: splitCost, desc: 'Trans' }, { t: 'half', w: t[j - 2], ex: s1, si: i - 1, p: splitCost, desc: 'Trans' });
            i -= 2; j -= 2;
        } else if (i > 0 && j > 1 && !isP(s1) && pNorm(s1) === pNorm(t[j - 2] + t1) && cur === dp[i - 1][j - 2] + splitCost) {
            r.push({ t: 'half', w: t[j - 2] + ' ' + t1, ex: s1, si: i - 1, p: splitCost, desc: 'Split' }); i--; j -= 2;
        } else if (i > 1 && j > 0 && !isP(t1) && pNorm(s[i - 2] + s1) === pNorm(t1) && cur === dp[i - 2][j - 1] + splitCost) {
            r.push({ t: 'half', w: t1, ex: s[i - 2] + ' ' + s1, si: i - 2, p: splitCost, desc: 'Join' }); i -= 2; j--;
        } else if (same && cur === dp[i - 1][j - 1] + classify(s1, t1).p) {
            let c = classify(s1, t1);
            r.push({ ...c, w: t1, ex: c.norm ? c.ex : (pNorm(s1) === pNorm(t1) ? '' : s1), si: i - 1 });
            i--; j--;
        } else if (i > 0 && (j === 0 || cur === dp[i - 1][j] + getCost(s1))) {
            r.push({ t: 'mis', w: s1, si: i - 1, p: getCost(s1), desc: isP(s1) ? 'Punc' : 'Omission' }); i--;
        } else {
            r.push({ t: 'ins', w: t1, si: i, p: insCost, desc: isP(t1) ? 'Punc' : 'Insertion' }); j--;
        }
    }
    return r.reverse();
}

function subTr() {
    const srcVal = origTxt || $('tx').value;
    const userVal = $('trI').value;
    resW = diff(srcVal, userVal);
    errs = [];
    let h = '';
    const srcWords = splitT(srcVal);

    resW.forEach((m, idx) => {
        let py = m.p || 0;
        let cl = m.t === 'mis' ? 'c-sub-f' : (m.t === 'ins' ? 'c-ins' : (py === 0 ? 'c-ok' : (py <= 0.5 ? 'c-sub-h' : 'c-sub-f')));
        if (py > 0 || m.ex) {
            let ei = errs.length;
            errs.push({ ...m, idx });
            h += `<span class="${cl}" onclick="hiE(${ei})">${m.w}${m.ex ? `<span class="c-cor">(${m.ex})</span>` : ''}</span> `;
        } else {
            h += `<span class="c-ok">${m.w}</span> `;
        }
    });

    $('checkV').innerHTML = h;
    renEL(srcWords);
    $('resBox').style.display = 'block';
    if (trM) trM.classList.remove('active');
}

function renEL(srcWords) {
    let h = '', tt = 0;
    errs.forEach((e, i) => {
        tt += e.p || 0;
        let pre = srcWords.slice(Math.max(0, e.si - 2), e.si).join(' ');
        let post = srcWords.slice(e.si + 1, e.si + 3).join(' ');
        h += `<div class="e-row" onclick="hiE(${i})">
            <div class="e-ctx">${pre} <b>${e.w}</b> ${post}</div>
            <div class="e-info">${e.desc || e.t} (${e.p})</div>
        </div>`;
    });
    $('eL').innerHTML = h;
    $('st').innerText = `Penalty: ${tt.toFixed(1)} | Acc: ${Math.max(0, 100 - (tt / srcWords.length * 100)).toFixed(2)}%`;
}
