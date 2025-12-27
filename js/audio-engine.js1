let ac, sr, gn, is = 0, lastAuSrc = null, bpAb = null;

function clnAu() { if (lastAuSrc) { URL.revokeObjectURL(lastAuSrc); lastAuSrc = null; } }

function upV() { if (gn) gn.gain.value = $('vl').value; }

function updatePlBtn() {
    $('pl').innerHTML = is ? '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    if (is) $('pl').classList.add('pausing'); else $('pl').classList.remove('pausing');
}

$('pl').onclick = async () => {
    if (!ac) {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        sr = ac.createMediaElementSource(au);
        gn = ac.createGain();
        sr.connect(gn);
        gn.connect(ac.destination);
        upV();
    }
    if (is) {
        au.pause(); is = 0; updatePlBtn();
    } else {
        if ($('bp').checked && au.currentTime < 0.5) {
            bpAb = new AbortController();
            try { await beeps(bpAb.signal); } catch (e) { return; }
        }
        await ac.resume();
        au.play(); is = 1; updatePlBtn();
    }
};

$('sb').onclick = async () => {
    if (bpAb) bpAb.abort();
    au.pause(); au.currentTime = 0; is = 0; updatePlBtn();
};

async function beeps(sig) {
    for (let i = 0; i < 3; i++) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        g.gain.value = 0.05; o.frequency.value = 880;
        o.start(); o.stop(ac.currentTime + 0.1);
        await new Promise(r => setTimeout(r, 500));
    }
}

function sk(s) { au.currentTime += s; }

au.ontimeupdate = () => {
    if (!au.duration) return;
    const d = au.duration, c = au.currentTime, p = (c / d) * 100;
    const w = parseFloat($('wi').value) || 150, lagS = (20 / w) * 60, effD = d - lagS * 2;
    const relC = Math.max(0, c - lagS), relP = effD > 0 ? Math.min(100, relC / effD * 100) : p;
    $('pf').style.width = p + '%';
    $('tm').textContent = `${fT(c / au.playbackRate)}/${fT(d / au.playbackRate)}`;
    if ($('as').checked) {
        const m = $('tx').scrollHeight - $('tx').clientHeight;
        $('tx').scrollTop = (relP / 100) * m;
    }
};

function fT(s) {
    const m = Math.floor(s / 60), x = Math.floor(s % 60);
    return `${m}:${x < 10 ? '0' : ''}${x}`;
}

$('pb').onclick = e => {
    const r = $('pb').getBoundingClientRect();
    au.currentTime = ((e.clientX - r.left) / r.width) * au.duration;
};

async function expA() {
    const b = $('exB'), r = parseFloat($('ri').value), id = curO.url?.split('details/')[1], dl = `https://archive.org/download/${id}/`;
    let srcU = au.src; b.classList.add('exporting'); b.innerText = '⌛';
    if (id) {
        try {
            const mr = await fetch(`https://archive.org/metadata/${id}`), md = await mr.json(), fs = md.files || [];
            const bf = fs.find(f => f.name.endsWith('.wav')) || fs.find(f => f.name.endsWith('.flac')) || fs.find(f => f.name.endsWith('.m4a')) || fs.find(f => f.name.endsWith('.mp3'));
            if (bf) srcU = dl + bf.name;
        } catch (e) { }
    }
    try {
        const res = await fetch(srcU), buf = await res.arrayBuffer(), ctx = new OfflineAudioContext(2, buf.byteLength / r, 44100), sBuf = await ctx.decodeAudioData(buf), src = ctx.createBufferSource();
        src.buffer = sBuf; src.playbackRate.value = r; src.connect(ctx.destination); src.start();
        const ren = await ctx.startRendering(), blob = new Blob([toWav(ren)], { type: 'audio/wav' }), name = `${(curO.title || 'audio').replace(/WPM\d+/i, '')}WPM${Math.round($('wi').value)}`;
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name + '.wav'; a.click();
        const tBlob = new Blob([$('tx').value], { type: 'text/plain' }), tA = document.createElement('a'); tA.href = URL.createObjectURL(tBlob); tA.download = name + '.txt'; tA.click();
    } catch (e) { } finally { b.classList.remove('exporting'); b.innerText = '⬇️'; }
}

function toWav(b) {
    let n = b.numberOfChannels, len = b.length * n * 2 + 44, buf = new ArrayBuffer(len), v = new DataView(buf), pos = 0, s = (st, s) => { for (let i = 0; i < s.length; i++) v.setUint8(st + i, s.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, len - 8, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, n, true); v.setUint32(24, b.sampleRate, true); v.setUint32(28, b.sampleRate * n * 2, true); v.setUint16(32, n * 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, len - 44, true); pos = 44;
    for (let i = 0; i < b.length; i++) for (let c = 0; c < n; c++) { let x = Math.max(-1, Math.min(1, b.getChannelData(c)[i])); v.setInt16(pos, x < 0 ? x * 0x8000 : x * 0x7FFF, true); pos += 2; } return buf;
}
