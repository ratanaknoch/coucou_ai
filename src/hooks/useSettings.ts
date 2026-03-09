import { useState, useCallback } from 'react';
import type { Settings } from '../types';

const STORAGE_KEY = 'COUCOU-ai-settings';

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return {
    provider: 'cloud-gemini',
    localEndpoint: 'http://localhost:11434',
    localModelName: 'deepseek-coder',
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    deepseekApiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
