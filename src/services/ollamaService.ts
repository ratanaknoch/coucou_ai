import type { Message } from '../types';

const SYSTEM_INSTRUCTION = `You are COUCOU AI, an expert coding assistant embedded in VS Code.
You help developers write, debug, refactor, and understand code.

STRICT INSTRUCTIONS:
1. ONLY perform the specific task requested by the user. If they ask to "explain", DO NOT suggest fixes or changes unless they ask for them.
2. If you suggest code changes, provide ONLY the code that needs to be changed or added.
3. When providing code solutions, clearly indicate the action :
   - [CODE] for new code
   - [DEBUG] for bug fixes
   - [SUGGEST] for improvements
   - [WRITE] for documentation
4. Always format code in markdown blocks with language identifiers.
5. Be concise and prioritize practical solutions.`;

export async function* streamOllamaResponse(
  messages: Message[],
  endpoint: string,
  modelName: string
): AsyncGenerator<string> {
  const url = `${endpoint.replace(/\/$/, '')}/api/chat`;

  const payload = {
    model: modelName,
    messages: [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Ollama error: ${response.status} - ${err}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        const content = json.message?.content;
        if (content) yield content;
        if (json.done) return;
      } catch {
        // ignore
      }
    }
  }
}
