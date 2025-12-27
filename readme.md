
```
# ⌨️ Steno Player & Exam Simulation Engine - Documentation

This project is a professional-grade stenography practice and examination suite. It is designed to bridge the gap between casual practice and the high-pressure environment of official shorthand exams.



---

## 📂 File Directory Overview

### 1. Core Files
* **`index.html`**: The UI entry point. Contains the layout for the Player, Transcribe Modal, and Exam Setup.
* **`style.css`**: Manages the "Steno-Dark" and "Steno-Light" themes, responsive layout, and the "Red-Yellow-Green" error highlighting system.

### 2. JavaScript Modules (`js/`)
* **`config.js`**: Stores the global state, registry URLs, and the Exam Rule Master-list.
* **`processor.js`**: Handles text cleaning, word counting logic, and text cropping.
* **`audio-engine.js`**: Manages the Web Audio API, real-time WPM calculation, and HQ audio exporting.
* **`ui-controller.js`**: Handles the Library (Gist) fetching, filtering, and theme toggling.
* **`mock-engine.js`**: The state machine that runs the automated Exam workflow.
* **`checker.js`**: The "Brain" of the app. It compares typed text vs. original text using a modified Diff algorithm.

---

## 📊 Data Format Schemas

To manage your own audio libraries or exams, follow these formats:

### A. Registry & Playlist (JSON)
The app fetches JSON from GitHub Gists. Each item should follow this structure:
```json
{
  "title": "80 WPM - Legal Matter - Case 101",
  "url": "[https://archive.org/details/audio_id](https://archive.org/details/audio_id)",
  "audio": "[https://direct-link-to-audio.mp3](https://direct-link-to-audio.mp3)",
  "matter": "[https://direct-link-to-text.txt](https://direct-link-to-text.txt)",
  "dur": 600, 
  "w": [800, 780, 810],
  "tags": ["LEGAL", "80WPM", "SSC"]
}

```

* **`w` array**: `[Standard Count, Space Count, Word Count]`. The app selects the correct one based on your logic settings.

### B. Exam Rule Schema (in `config.js`)

Exams are defined by their constraints:

```javascript
ssc_d: {
  name: 'SSC Gr D',
  wpm: 80,       // Target Speed
  dur: 10,       // Dictation minutes
  read: 10,      // Reading time minutes
  trans: 65,     // Transcription time minutes
  rules: {
    cap: 1,      // 1 = Full error for capitalization
    com: 1,      // 1 = Full error for comma
    pun: 1,      // 1 = Full error for punctuation
    spl: 1,      // 1 = Full error for spelling/half-mistake
    sub: 's',    // 's' = Single error for substitution, 'd' = Double
    wc: 's',     // 's' = Standard (5 chars), 'sp' = Space, 'p' = Punc
    max: 5       // Maximum error % allowed to pass
  }
}

```

---

## 🧠 Deep Dive: How the Checker Works

The `checker.js` uses a **Dynamic Programming (DP)** approach to find the **Longest Common Subsequence (LCS)** between the original text and your transcription.

### 1. Pre-Processing

Before comparing, the engine runs `bare()`:

* Converts all text to lowercase.
* Removes special symbols (`. ! ? ; : , |`).
* Normalizes Hindi characters (e.g., matching `में` and `मैं` as potential half-errors).

### 2. The DP Matrix

It creates a grid to find the most logical path between what you typed and what was said.

* **Match**: No error.
* **Substitution**: If words are different but in the same position.
* **Omission (Missing)**: If a word exists in source but not in user input.
* **Insertion (Extra)**: If the user typed a word not in the source.

### 3. Error Weightage

The final score isn't just `errors / total`. It applies the `exRules`:

* **Full Mistake (1.0)**: Omission, Substitution, or adding a word that wasn't there.
* **Half Mistake (0.5)**: Based on settings, things like "The" vs "the" or "comma" errors can be treated as 0.5.

---

## ⏱️ The Mock Test Workflow

When you select an exam and enter **Mock Mode**, the `mock-engine.js` takes control:

1. **Preparation**: The app automatically sets the WPM and Playback Rate to match the exam standard.
2. **Cropping**: If the audio file is 15 minutes but the exam is 10, the app asks if you want the *Start, Middle, or End*. It then crops the reference text to match exactly what you will hear.
3. **Phase 1: Dictation**: The screen locks. You only see a timer and the "Stop" button. Text is hidden.
4. **Phase 2: Reading Time**: Once audio ends, a countdown starts (e.g., 10 mins). This is for you to read your shorthand notes.
5. **Phase 3: Transcription**: The transcription modal opens automatically. The timer starts. You cannot paste text into this box.
6. **Phase 4: Auto-Submit**: When the timer hits `00:00`, the box locks and the result is calculated immediately.

---

## 🛠️ Advanced Functions Reference

| Function | File | Description |
| --- | --- | --- |
| `expA()` | `audio-engine.js` | Uses an `OfflineAudioContext` to render a new audio file at your current speed. Extremely useful for creating custom-speed practice sets. |
| `sync('w')` | `ui-controller.js` | Calculates the exact mathematical playback rate required to turn a 70 WPM audio into an 85 WPM audio. |
| `jump(k)` | `checker.js` | When you click an error in the result list, this function calculates the scroll offset to highlight the exact word in both the original and your typed version. |
| `beeps()` | `audio-engine.js` | Uses an `OscillatorNode` to generate 880Hz tones. Does not rely on external MP3 files for the countdown. |

---

## 🔧 Management & Customization

### Changing the Theme

Modify the CSS variables in `style.css` under `.light-mode`. You can change the highlight colors (e.g., making omissions Blue instead of Yellow).

### Adding New Exams

Simply add a new entry to the `exams` object in `js/config.js`. The UI will automatically detect the new entry and add it to the "Select Exam" dropdown.

### Deployment

This app is "Serverless." Simply push to GitHub Pages. It uses `fetch` to get data, so ensure your Gists are Public.

```

```
