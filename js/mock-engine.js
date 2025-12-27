function upExD() {
    const s = $('exSel').value, m = $('exMode').value;
    if (s === 'custom') { $('custOpts').style.display = 'flex'; exams.custom.wpm = $('cWpm').value; exams.custom.dur = $('cDur').value }
    else { $('custOpts').style.display = 'none' }
    const e = exams[s]; $('exDesc').innerText = `${e.name} | ${e.dur}m @ ${e.wpm}wpm | Rules: ${e.rules.wc.toUpperCase()}`;
    if (s === 'custom') e.rules = { cap: $('cCap').value, com: $('cCom').value, pun: $('cPun').value, spl: $('cSpl').value, sub: $('cSub').value, wc: $('cLg').value, max: $('cMaxE').value }
}

function selEx() {
    curEx = $('exSel').value; exMode = $('exMode').value; exRules = { ...exams[curEx].rules };
    $('lg').value = exRules.wc; $('exM').classList.remove('active'); $('srcM').classList.add('active')
}

function prepMock() {
    const e = exams[curEx], wpm = parseInt(e.wpm), dur = parseInt(e.dur), tgW = wpm * dur;
    $('wi').value = wpm; sync('w'); const auD = au.duration; const exD = dur * 60;
    if (exMode === 'mock' && auD > exD + 30) { $('crpM').classList.add('active') } else { startMock() }
}

function setCrp(p) {
    const e = exams[curEx], wpm = parseInt(e.wpm), dur = parseInt(e.dur), tgW = wpm * dur;
    const auD = au.duration, reqD = dur * 60; $('crpM').classList.remove('active');
    if (p === 's') { crpS = 0; crpE = reqD + 15; cropTxt(0, tgW) }
    else if (p === 'm') { crpS = (auD / 2) - (reqD / 2) - 15; crpE = crpS + reqD + 30; cropTxt('mid', tgW) }
    else { crpE = auD; crpS = auD - reqD - 15; cropTxt('end', tgW) }
    startMock()
}

function startMock() {
    const e = exams[curEx];
    if (exMode === 'mock') { $('tx').style.visibility = 'hidden'; $('mockOV').style.display = 'flex'; mockState = 0; nextMockStep() }
    else { $('trT').value = e.trans > 0 ? e.trans : 0; $('trC').value = e.trans; updateStatus() }
}

function nextMockStep() {
    const e = exams[curEx]; clearInterval(mockTimer); mockState++; $('mSkipBtn').onclick = () => nextMockStep();
    if (mockState === 1) {
        $('mStT').innerText = 'Dictation'; $('mSub').innerText = 'Playing Audio...'; $('mSkipBtn').innerText = 'Finish Early'; au.currentTime = crpS; au.play(); is = 1; updatePlBtn();
        if (crpE > 0) { au.ontimeupdate = () => { if (au.currentTime >= crpE) { au.pause(); beeps(); nextMockStep() } } }
        else { au.onended = () => nextMockStep() }
        $('mTimer').innerText = '--:--'
    } else if (mockState === 2) { is = 0; updatePlBtn(); runMockTimer(15, 'Break / Gap', 'Prepare for reading...', () => nextMockStep()) }
    else if (mockState === 3) { runMockTimer(e.read * 60, 'Reading Time', 'Read your notes...', () => nextMockStep()) }
    else if (mockState === 4) {
        $('mockOV').style.display = 'none'; $('trM').classList.add('active'); resTr(); $('trT').value = e.trans; $('trC').value = e.trans; $('trA').disabled = 1; let cd = 10; $('trInf').innerText = `Auto-start in ${cd}s`;
        const cdt = setInterval(() => { cd--; $('trInf').innerText = `Auto-start in ${cd}s`; if (cd <= 0) { clearInterval(cdt); stTr(true) } }, 1000)
    }
}

function runMockTimer(sec, t, s, cb) {
    $('mStT').innerText = t; $('mSub').innerText = s; $('mSkipBtn').innerText = 'Skip'; let rem = sec;
    const upd = () => { const m = Math.floor(rem / 60), s = rem % 60; $('mTimer').innerText = `${m}:${s < 10 ? '0' : ''}${s}` };
    upd(); mockTimer = setInterval(() => { rem--; upd(); if (rem <= 0) { clearInterval(mockTimer); cb() } }, 1000)
}
