function clnAu() { if (lastAuSrc) { URL.revokeObjectURL(lastAuSrc); lastAuSrc = null; } }

async function beeps(sig) {
    for (let i = 0; i < 3; i++) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        g.gain.value = 0.05; o.frequency.value = 880;
        o.start(); o.stop(ac.currentTime + 0.1);
        await new Promise(r => setTimeout(r, 500));
    }
}

function upV() { if (gn) gn.gain.value = $('vl').value; }

function sk(s) { au.currentTime += s; }

au.ontimeupdate = () => {
    if (!au.duration) return;
    const d = au.duration, c = au.currentTime, p = (c / d) * 100;
    const w = parseFloat($('wi').value) || 150, lagS = (20 / w) * 60, effD = d - lagS * 2, relC = Math.max(0, c - lagS), relP = effD > 0 ? Math.min(100, relC / effD * 100) : p;
    $('pf').style.width = p + '%';
    $('tm').textContent = `${fT(c / au.playbackRate)}/${fT(d / au.playbackRate)}`;
    if ($('as').checked) {
        const m = $('tx').scrollHeight - $('tx').clientHeight;
        $('tx').scrollTop = (relP / 100) * m;
    }
};

// ... Include expA and toWav functions here as per original code ...
