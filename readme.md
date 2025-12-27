# Steno Player - Modular Deployment

A professional stenography practice and mock exam platform. This repository contains the refactored, modular version of the Steno Player for easier management and GitHub Pages deployment.

## 📂 Project Structure

- `index.html`: The main entry point and UI structure.
- `style.css`: Unified styling (Dark/Light mode support).
- `js/`
  - `config.js`: Global variables, Registry URLs, and Exam rules.
  - `audio-engine.js`: Handles Web Audio API, Playback, Pitch/Rate sync, and WAV exporting.
  - `checker.js`: The transcription engine using Diff-logic for error calculation.
  - `mock-exam.js`: Logic for strict Exam modes, timers, and audio cropping.
  - `ui-controller.js`: General interactions, Library fetching, and Theme management.

## 🚀 How to Deploy on GitHub

1. **Create a Repository**: Create a new repo on GitHub (e.g., `steno-player`).
2. **Upload Files**: Upload all the files maintaining the directory structure (keep JS files inside the `js` folder).
3. **Enable Pages**:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, set Source to **Deploy from a branch**.
   - Select `main` branch and `/ (root)` folder.
   - Click **Save**.
4. **Access**: Your app will be live at `https://your-username.github.io/steno-player/`.

## 🛠 Features

- **Practice Mode**: Flexible playback with real-time WPM calculation based on Audio Rate.
- **Mock Exam**: Strict mode following SSC (Grade C & D) guidelines including reading time and auto-starting transcription.
- **Transcription Checker**: Detailed error analysis including Full/Half error distinction (Capitalization, Punctuation, Spelling, etc.).
- **Library Integration**: Fetches audio and text directly from Archive.org/Gist registries.
- **WAV Export**: Export practiced audio at specific WPM/Rates for offline use.

## 📝 Customization

To add your own audio playlists, update the `regs` array in `js/config.js` with your GitHub Gist IDs.

```javascript
const regs = [
    { u: "YOUR_GIST_ID", t: "My Playlist" }
];