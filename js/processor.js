const clean = (s) => s.replace(/[\u2018\u2019\u201c\u201d]/g, "'").replace(/[\u2013\u2014]/g, "-").trim();
const bare = (s) => clean(s).toLowerCase().replace(/[.।!?;:,|]/g, '');
const tok = (t) => { let r = [], re = /\S+/g, m; while ((m = re.exec(t)) !== null) r.push({ t: m[0], s: m.index, e: re.lastIndex }); return r; };

function subTr() {
    clearInterval(trTi); trIp = 0; $('trI').disabled = 1; $('trA').innerText = 'Start';
    const srcT = $('chkFull').checked ? origTxt : $('tx').value;
    oToks = tok(srcT); uToks = tok($('trI').value);
    const m = oToks.length, n = uToks.length, dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
    const hs = { 'में': 'मैं', 'मैं': 'में', 'की': 'कि', 'कि': 'की', 'ओर': 'और', 'और': 'ओर', 'है': 'हैं', 'हैं': 'है' };
    
    // Core DP Alignment algorithm ... [Include the loop and reconstruction from source]
    for (let i = 1; i <= m; i++) 
        for (let j = 1; j <= n; j++) {
            const bo = bare(oToks[i - 1].t), bu = bare(uToks[j - 1].t);
            dp[i][j] = (bo === bu || hs[bo] === bu) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    
    // ... Include remainder of subTr and reCalc logic ...
}
