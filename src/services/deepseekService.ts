import type { Message } from '../types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL_NAME = import.meta.env.VITE_DEEPSEEK_MODEL_NAME || 'deepseek-coder';

const SYSTEM_INSTRUCTION =
  import.meta.env.VITE_CLOUD_SYSTEM_INSTRUCTION ||
  `You are COUCOU AI, an expert coding assistant embedded in VS Code.
You help developers write, debug, refactor, and understand code.
When providing code solutions, clearly indicate what type of action you're performing:
- [CODE] when writing new code
- [DEBUG] when fixing bugs
- [SUGGEST] when recommending improvements
- [WRITE] when generating documentation or text
Always format code in proper markdown code blocks with language identifiers.
Be concise but thorough. Prioritize practical, working solutions.`;

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
