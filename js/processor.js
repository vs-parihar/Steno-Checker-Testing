const nrm = s => {
    if (!s) return '';
    let r = s.normalize('NFC')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\u093C/g, '')
        .replace(/[\u0902\u0901]/g, '\u0902')
        .replace(/[०-९]/g, d => "0123456789"["०१२३४५६७८९".indexOf(d)])
        .trim();
    return r.replace(/^मै$/, 'में').replace(/^में$/, 'मै');
};

const pNorm = s => nrm(s || '').replace(/ई/g, 'यी').replace(/ए/g, 'ये').replace(/ओ/g, 'वो');

const bare = s => nrm(s).replace(/[^\w\u0900-\u097F\u0964|\-]/g, '').toLowerCase();

const getAk = s => s.match(/[\u0900-\u097F][\u093C]?[\u094D\u0900-\u0902\u093E-\u094C\u0962\u0963]*/g) || [];

const isP = s => /^[।?.,\-!:;()"'\[\]{}]$/.test(s);

const lev = (a, b) => {
    const d = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) d[i][0] = i;
    for (let j = 0; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
        for (let j = 1; j <= b.length; j++)
            d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] : Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]) + 1;
    return d[a.length][b.length];
};

const splitT = t => t.replace(/([।?.,\-!:;()"'\[\]{}])/g, ' $1 ').split(/\s+/).filter(x => x);

function upWC() {
    const t = $('tx').value;
    $('wc').value = t ? splitT(t).length : 0;
}
