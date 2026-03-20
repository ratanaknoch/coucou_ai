# Coucou AI

Coucou AI is an extension that brings powerful AI assistance directly into your sidebar. It features a premium, theme-aware user interface built with React and Tailwind CSS, supporting both cloud-based and local AI models.

## Features

- **Multi-Provider Support**: Seamlessly switch between cloud and local AI backends:
  - **Cloud**: Google Gemini, DeepSeek
  - **Local**: Ollama, LM Studio
- **Premium UI/UX**: High-performance sidebar built with Vite and React.
- **Micro-animations**: Smooth transitions using Framer Motion.
- **VS Code Native**: Respects your editor's theme and color palette.
- **Smart Actions**: Interactive chat interface with real-time status indicators.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Visual Studio Code](https://code.visualstudio.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd coucou_ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run package
   ```

### Running the Extension

To run and debug the extension in VS Code:
1. Open the project folder in VS Code.
2. Go to the **Run and Debug** sidebar (`Ctrl+Shift+D`).
3. Select **Run Coucou AI Extension** from the dropdown.
4. Press **F5**.
5. A new **[Extension Development Host]** window will open with Coucou AI active in the sidebar.

---

## Usage Guide

### Configuring AI Providers
Open the sidebar and click the **Settings** icon to configure your AI backend:
- **Gemini/DeepSeek**: Provide your API key.
- **Ollama/LM Studio**: Ensure your local server is running and the URL is correctly configured (default: `http://localhost:11434` for Ollama).

### Chatting
Use the **Chat** tab to interact with your selected model. You can stop generation at any time using the stop button or clear the history using the clear button in the header.

---

## Troubleshooting

### F5 "Does Nothing" or Hangs
This often happens if you have the parent folder open as your primary workspace. 
- **Fix**: Select **Run Coucou AI Extension** from the Run/Debug dropdown. This uses our the custom configuration that targets the `coucou_ai` subdirectory.

### "Could not find dist/index.html"
This means the webview built hasn't been generated yet.
- **Fix**: Run `npm run build` or `npm run package` in the `coucou_ai` directory.

### Local LLM Connection Refused
- **Ollama**: Ensure Ollama is running (`ollama serve`). If running in Docker, make sure to set `OLLAMA_ORIGINS="*"` to allow VS Code to connect.
- **LM Studio**: Enable the "Local Server" option inside LM Studio.

---

## Project Structure

- `ext-src/`: VS Code extension entry point and backend logic (TypeScript).
- `src/`: React frontend webview (Vite, Tailwind CSS, motion).
- `dist/`: Compiled webview assets (automatically generated).
- `out/`: Compiled extension code (automatically generated).

---

## License
[MIT](LICENSE)
