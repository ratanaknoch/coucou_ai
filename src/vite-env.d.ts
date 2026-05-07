/// <reference types="vite/client" />

declare function acquireVsCodeApi(): any;

interface ImportMetaEnv {
  readonly VITE_CLOUD_MODEL_NAME: string;
  readonly VITE_CLOUD_SYSTEM_INSTRUCTION: string;
  readonly VITE_DEEPSEEK_MODEL_NAME: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_DEEPSEEK_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
