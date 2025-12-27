const $ = (i) => document.getElementById(i);
const au = $('au');

const regs = [
    { u: "d82c26e4cb069d8f5b9d1f2a5cf42e24", t: "Eng" },
    { u: "363e6ce7f8e1b41be69bba7623c7c320", t: "Hin" }
];

const exams = {
    ssc_d: { name: 'SSC Gr D', wpm: 80, dur: 10, read: 10, trans: 65, lg: 'ssc', rules: { cap: 1, com: 1, pun: 1, spl: 1, sub: 's', wc: 's', max: 5 } },
    ssc_c: { name: 'SSC Gr C', wpm: 100, dur: 10, read: 10, trans: 40, lg: 'ssc', rules: { cap: 1, com: 1, pun: 1, spl: 1, sub: 's', wc: 's', max: 5 } },
    custom: { name: 'Custom', wpm: 80, dur: 10, read: 0, trans: 0, lg: 'std', rules: { cap: 0, com: 0, pun: 0.5, spl: 1, sub: 's', wc: 's', max: 100 } }
};

let curL = [], filtL = [], curI = -1, curO = {}, curS = 1, curT = 14, maxW = 0;
let exMode = 'practice', curEx = 'custom', exRules = {}, crpS = 0, crpE = 0, origTxt = '';