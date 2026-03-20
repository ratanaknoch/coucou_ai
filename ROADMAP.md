# Coucou AI Roadmap

This document outlines the planned improvements, new features, and technical enhancements for the Coucou AI extension.

## Phase 1: Core VS Code Integration
*Goal: Bridge the gap between the AI chat and the active editor.*

- [ ] **Direct Code Application**: Implement "Apply to Editor" buttons on code blocks to modify the active file.
- [ ] **Insert at Cursor**: Add a button to quickly insert AI-generated code at the current cursor position.
- [ ] **Context Awareness**: 
    - Automatically include selected text in AI prompts.
    - Allow the AI to "Read Current File" to provide contextually relevant answers.
- [ ] **Persistent State**: Migrate from `localStorage` to VS Code's `globalState` and `workspaceState` for more robust persistence of settings and chat history.

## Phase 2: AI Intelligence & Intent
*Goal: Make the AI more proactive and helpful.*

- [ ] **Intent Detection**: Improve the "Agent Mode" to automatically suggest actions like:
    - `[TERMINAL]`: Suggesting a command to run.
    - `[FILE]`: Proposing to create a new file.
- [ ] **Project Indexing**: Basic searching of the project structure so the AI can answer questions about the whole codebase.
- [ ] **Streaming Polish**: Improve the UX during long streaming responses with incremental markdown rendering.

## Phase 3: UI/UX & Polish
*Goal: Create a premium, seamless experience.*

- [ ] **Conversation History**: Add a "History" tab to view and restore past conversations.
- [ ] **Local Model Discovery**: Auto-detect available models for Ollama and LM Studio instead of manual text input.
- [ ] **Service Health Indicators**: Show real-time connection status for local and cloud providers in the sidebar header.
- [ ] **Theme Syncing**: Deepen integration with VS Code's color palette for a "built-in" feel.

## Phase 4: Technical Excellence
*Goal: Ensure reliability and maintainability.*

- [ ] **Automated Testing**: Implement unit tests for AI service wrappers and React hooks.
- [ ] **Error Handling**: More descriptive error messages for API rate limits and connection timeouts.
- [ ] **VSIX Packaging**: Set up a CI/CD workflow to automatically build and package the extension for the marketplace.
- [ ] **TypeScript Strict Mode**: Enable stricter TypeScript checks to catch potential bugs early.
