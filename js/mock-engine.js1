function startMock() {
    const e = exams[curEx];
    if (exMode === 'mock') {
        $('tx').style.visibility = 'hidden';
        $('mockOV').style.display = 'flex';
        mockState = 0; nextMockStep();
    } else {
        $('trT').value = e.trans > 0 ? e.trans : 0;
        $('trC').value = e.trans;
        updateStatus();
    }
}

function nextMockStep() {
    const e = exams[curEx];
    clearInterval(mockTimer);
    mockState++;
    $('mSkipBtn').onclick = () => nextMockStep();
    
    // Step logic for Dictation, Reading, Transcription ...
}
