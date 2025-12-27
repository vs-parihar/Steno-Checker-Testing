# 🎙️ Steno Professional: Technical Architecture & Documentation

A modular, high-performance web suite for Shorthand (Steno) training, evaluation, and exam simulation. This project is split into 7 specialized files to ensure easy management, scalability, and clean GitHub deployment.

---

## 📂 1. File Responsibilities

| File | Type | Primary Role |
| :--- | :--- | :--- |
| `index.html` | Structural | UI Shell, layout of controls, and all modal layers. |
| `style.css` | Design | Dynamic theming, UI scaling, and responsive constraints. |
| `config.js` | Data/State | Global variables, exam rule definitions, and library sources. |
| `audio-engine.js` | Audio | Web Audio API management, pitch/rate control, and WAV export. |
| `processor.js` | Logic | The "Brain". Handles text alignment and error grading algorithms. |
| `mock-engine.js` | Behavioral | Manages the sequence of strict Exam/Mock scenarios. |
| `ui-controller.js` | Bridge | Connects DOM events to logic; handles rendering and result navigation. |

---

## 🛠️ Detailed Function Reference

### 📁 `processor.js` (The Analysis Engine)
This file performs the complex task of aligning user-typed text with the original script to detect errors.

* **`clean(text)`**
    * **What**: Standardizes Unicode characters.
    * **How**: Uses Regex to replace "smart" quotes (`“”`), em-dashes (`—`), and unique Hindi symbols with standard ASCII equivalents to prevent invisible character-code mismatches.
* **`bare(text)`**
    * **What**: Creates a "Normal Form" for word comparison.
    * **How**: Lowercases text and strips all punctuation (`. , ! ? ।`). This allows the engine to verify if a word is correct even if the user missed a comma or full stop.
* **`tok(text)`**
    * **What**: A position-aware tokenizer.
    * **How**: Generates an array of objects `{t: word, s: start_index, e: end_index}`. This indexing is critical for the "Jump to Error" feature.
* **`subTr()` (The Alignment Logic)**
    * **What**: Implements the **Longest Common Subsequence (LCS)** algorithm via Dynamic Programming.
    * **How**: It builds a 2D matrix comparing the original passage (M) vs. user input (N). It identifies the optimal path of correct words, flagging gaps as "Omissions" and extra user words as "Additions."
    * **Context Logic**: Includes a "Hindi Homophone" map (e.g., `में` vs `मैं`) to prevent the algorithm from losing alignment on common phonetic spelling errors.
* **`reCalc()`**
    * **What**: Final Score Calculator.
    * **How**: Iterates through the detected differences and applies numerical weights (1.0 for Full, 0.5 for Half) defined in the chosen exam profile.



### 📁 `audio-engine.js` (Signal Processing)
Interacts with the Browser's Audio Context for high-fidelity control.

* **`beeps()`**: Synthesizes a 3-count 880Hz beep using a Web Audio `OscillatorNode` to signal the start of a timed test without needing external MP3 files.
* **`upV()`**: Updates the `GainNode` value. Supports "Boosting" (up to 200% volume) to help students hear low-quality dictation recordings.
* **`expA()` (The WAV Renderer)**:
    * **What**: Creates a speed-adjusted audio file for offline use.
    * **How**: Uses an `OfflineAudioContext` to re-sample the original buffer at a different `playbackRate` based on the user's target WPM. It then encodes this as a high-fidelity Blob.
* **`sk(val)`**: Directly modifies the `currentTime` of the audio element for seek operations (+5s, -10s, etc.).

### 📁 `mock-engine.js` (The Exam Controller)
Implements a strict state machine to simulate official exam conditions.

* **`startMock()`**: Disables the transcription area and triggers the full-screen Mock Overlay to prevent users from seeing the text during dictation.
* **`nextMockStep()`**: 
    * **State 1 (Dictation)**: Plays audio; hides text input.
    * **State 2 (Reading)**: Stops audio; triggers a countdown (usually 10 mins) for reading shorthand notes from paper.
    * **State 3 (Transcription)**: Opens the transcription UI and starts the hard-limit countdown. Auto-submits when time reaches zero.
* **`setCrp(pos)`**: Intelligent cropping. If a dictation file is 15 minutes long but the exam is only 10, it calculates the sample offset to play only the Start, Middle, or End segment.

### 📁 `ui-controller.js` (The UI Bridge)
* **`renL()`**: Uses `.filter()` and `.sort()` on the `regs` JSON library data to render the searchable library list.
* **`jump(k)`**: Calculates the scroll offset for the `k-th` error and uses `.setSelectionRange()` and `scrollIntoView()` to focus the user's cursor on the mistake in the text area.
* **`toggleTheme()`**: Swaps the CSS variable definitions by adding/removing the `.light-mode` class from the `<body>` element.

---

## 📊 Evaluation Mathematics (SSC Standard)

The system calculates accuracy based on the following standard weights:

1.  **Full Error (1.0 weight)**: Omissions, substitutions, or extra additions of words.
2.  **Half Error (0.5 weight)**: Capitalization, minor spelling mistakes, or punctuation errors.

**Formula:**
$$Accuracy \% = 100 - \left( \frac{\text{Full Errors} + (\text{Half Errors} \times 0.5)}{\text{Total Words in Passage}} \times 100 \right)$$

---

## 🚀 GitHub Deployment Guide

1.  **Initialize**: Create a new repository and upload all 7 files.
2.  **Configuration**: Open `config.js` and update the `regs` array with your own JSON audio library links.
3.  **Enable Pages**: Go to **Settings > Pages** and select the `main` branch to deploy.
4.  **CORS Security**: Ensure your audio hosting server allows `Access-Control-Allow-Origin: *` so the audio processor can read the file data for WAV rendering.

### Local Testing
Since browsers block the File API on `file://` protocols, run a local server:
```bash
# Using Python
python -m http.server 8000
