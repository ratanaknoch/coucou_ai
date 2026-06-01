import type { Message } from '../types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL_NAME = import.meta.env.VITE_DEEPSEEK_MODEL_NAME || 'deepseek-coder';

const SYSTEM_INSTRUCTION =
  import.meta.env.VITE_CLOUD_SYSTEM_INSTRUCTION ||
  `You are COUCOU AI, an expert coding assistant embedded in VS Code.
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

export async function* streamDeepseekResponse(
  messages: Message[],
  apiKey: string
): AsyncGenerator<string> {
  const payload = {
    model: MODEL_NAME,
    messages: [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
  };

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Deepseek API error: ${response.status} - ${err}`);
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
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (trimmed.startsWith('data: ')) {
        try {
          const json = JSON.parse(trimmed.slice(6));
          const content = json.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // ignore parse errors
        }
      }
    }
  }
}
