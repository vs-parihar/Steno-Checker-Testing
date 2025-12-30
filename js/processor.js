const norm = s => s.normalize('NFC').replace(/[\u200B-\u200D]/g, '').replace(/ँ/g, 'ं').replace(/[ङञणनम्]्/g, 'ं').replace(/फ़/g, 'फ+़').replace(/ज़/g, 'ज+़').replace(/ख़/g, 'ख+़').replace(/ग़/g, 'ग+़').replace(/ड़/g, 'ड+़').replace(/ढ़/g, 'ढ+़').replace(/[०-९]/g, d => "0123456789"["०१२३४५६७८९".indexOf(d)]).trim();
const pNorm = s => norm(s || '').replace(/ई/g, 'यी').replace(/ए/g, 'ये').replace(/ओ/g, 'वो');
const getAk = s => s.match(/[\u0900-\u097F][\u093C]?[\u094D\u0900-\u0902\u093E-\u094C\u0962\u0963]*/g) || [];
const isP = s => /^[।?.,\-!:;()"'\[\]{}]$/.test(s);

const getCost = (p) => {
    if (!isP(p)) return exRules.mis || 1;
    if (p === ',') return exRules.comma || 0;
    if (p === '-') return exRules.hyphen || 0;
    if (/^[।?.]$/.test(p)) return exRules.punc || 0.5;
    return exRules.miscp || 0;
};

const lev = (a, b) => {
    const d = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) d[i][0] = i;
    for (let j = 0; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
        for (let j = 1; j <= b.length; j++)
            d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] : Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]) + 1;
    return d[a.length][b.length];
};

function isPlural(s, t) {
    let ns = norm(s), nt = norm(t);
    if (ns.includes('(')) {
        let b = ns.split('(')[0], pl = ns.match(/\((.*?)\)/)?.[1];
        return nt === b || nt === (b + pl);
    }
    return false;
}

function classify(s, t) {
    let ns = norm(s), nt = norm(t);
    let nsP = pNorm(ns), ntP = pNorm(nt);
    const sameType = (isP(ns) === isP(nt));
    if (!sameType) return { t: 'sub', p: 99, desc: 'TypeMismatch' };
    if (isP(ns)) return ns === nt ? { t: 'ok', p: 0 } : { t: 'ok', p: 0, norm: true, ex: s };
    if (ns === nt || isPlural(ns, nt)) return { t: 'ok', p: isPlural(ns, nt) ? (exRules.plur || 0.5) : 0, desc: isPlural(ns, nt) ? 'Plural' : '' };
    if (nsP === ntP) return { t: 'ok', p: 0, norm: true, ex: s };
    if (ns.replace(/[ोोंाेीुू]/g, '') === nt.replace(/[ोोंाेीुू]/g, '')) return { t: 'half', p: exRules.spell || 0.5, desc: 'Spell' };

    let sB = ns.split('(')[0], sO = ns.match(/\((.*?)\)/)?.[1] || '';
    let akB = getAk(sB), akO = sO ? getAk(sB.slice(0, -1) + sO) : [], akT = getAk(nt);
    let d = Math.min(lev(akB, akT), sO ? lev(akO, akT) : Infinity);
    let py = (akB.length && akT.length && d === 1) ? (exRules.spell || 0.5) : (exRules.sub || 1);
    return { t: py >= 1.0 ? 'sub' : 'half', p: py, desc: py >= 1.0 ? 'Sub' : 'Spell' };
}

function diff(sT, tT) {
    const splitT = t => t.replace(/([।?.,\-!:;()"'\[\]{}])/g, ' $1 ').split(/\s+/).filter(x => x);
    let s = splitT(sT), t = splitT(tT), n = s.length, m = t.length, dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
    for (let i = 1; i <= n; i++) dp[i][0] = dp[i - 1][0] + getCost(s[i - 1]);
    for (let j = 1; j <= m; j++) dp[0][j] = dp[0][j - 1] + (exRules.ins || 1);
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= m; j++) {
            const same = (isP(s[i - 1]) === isP(t[j - 1]));
            let c = classify(s[i - 1], t[j - 1]);
            dp[i][j] = Math.min(dp[i - 1][j - 1] + (same ? c.p : 99), dp[i - 1][j] + getCost(s[i - 1]), dp[i][j - 1] + (exRules.ins || 1));
            if (same && i > 1 && j > 1 && !isP(s[i - 1]) && !isP(s[i - 2]) && pNorm(s[i - 1]) === pNorm(t[j - 2]) && pNorm(s[i - 2]) === pNorm(t[j - 1])) dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + (exRules.split || 0.5) * 2);
            if (i > 0 && j > 1 && !isP(s[i - 1]) && pNorm(s[i - 1]) === pNorm(t[j - 2] + t[j - 1])) dp[i][j] = Math.min(dp[i][j], dp[i - 1][j - 2] + (exRules.split || 0.5));
            if (i > 1 && j > 0 && !isP(t[j - 1]) && pNorm(s[i - 2] + s[i - 1]) === pNorm(t[j - 1])) dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 1] + (exRules.split || 0.5));
        }
    let i = n, j = m, r = [];
    while (i > 0 || j > 0) {
        let cur = dp[i][j], s1 = s[i - 1], t1 = t[j - 1];
        const same = (i > 0 && j > 0 && isP(s[i - 1]) === isP(t[j - 1]));
        if (same && i > 1 && j > 1 && !isP(s1) && !isP(s[i - 2]) && pNorm(s1) === pNorm(t[j - 2]) && pNorm(s[i - 2]) === pNorm(t1) && cur === dp[i - 2][j - 2] + (exRules.split || 0.5) * 2) {
            r.push({ t: 'half', w: t1, ex: s[i - 2], si: i - 2, p: (exRules.split || 0.5), desc: 'Trans' }, { t: 'half', w: t[j - 2], ex: s1, si: i - 1, p: (exRules.split || 0.5), desc: 'Trans' });
            i -= 2; j -= 2;
        } else if (i > 0 && j > 1 && !isP(s1) && pNorm(s1) === pNorm(t[j - 2] + t1) && cur === dp[i - 1][j - 2] + (exRules.split || 0.5)) {
            r.push({ t: 'half', w: t[j - 2] + ' ' + t1, ex: s1, si: i - 1, p: (exRules.split || 0.5), desc: 'Split' }); i--; j -= 2;
        } else if (i > 1 && j > 0 && !isP(t1) && pNorm(s[i - 2] + s1) === pNorm(t1) && cur === dp[i - 2][j - 1] + (exRules.split || 0.5)) {
            r.push({ t: 'half', w: t1, ex: s[i - 2] + ' ' + s1, si: i - 2, p: (exRules.split || 0.5), desc: 'Join' }); i -= 2; j--;
        } else if (same && cur === dp[i - 1][j - 1] + classify(s1, t1).p) {
            let c = classify(s1, t1);
            if (c.p >= 2.0) { r.push({ t: 'ins', w: t1, si: i, p: (exRules.ins || 1), desc: 'Sub-Ins' }, { t: 'mis', w: s1, si: i - 1, p: getCost(s1), desc: 'Sub-Mis' }); }
            else r.push({ ...c, w: t1, ex: c.norm ? c.ex : (pNorm(s1) === pNorm(t1) ? '' : s1), si: i - 1 });
            i--; j--;
        } else if (i > 0 && (j === 0 || cur === dp[i - 1][j] + getCost(s1))) {
            r.push({ t: 'mis', w: s1, si: i - 1, p: getCost(s1), desc: isP(s1) ? 'Punc' : 'Omission' }); i--;
        } else {
            r.push({ t: 'ins', w: t1, si: i, p: (exRules.ins || 1), desc: isP(t1) ? 'Punc' : 'Insertion' }); j--;
        }
    }
    return r.reverse();
}
