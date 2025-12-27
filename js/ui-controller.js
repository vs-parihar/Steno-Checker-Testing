function toggleTheme() { document.body.classList.toggle('light-mode', $('theme').checked); }

function updateStatus() {
    $('stWPM').textContent = $('wi').value + ' WPM';
    $('stRate').textContent = $('ri').value + 'x';
    $('stWC').textContent = $('wc').value + ' W';
    $('stMode').textContent = exMode === 'mock' ? 'Mock Mode' : 'Practice';
    $('stMode').style.color = exMode === 'mock' ? '#ef4444' : 'inherit';
}

function init() {
    // ... Initialization logic for regs, options, etc. ...
    window.onload = init;
}

// ... All modal openers and event listeners ...
