import type { Message } from '../types';

const SYSTEM_INSTRUCTION = `You are BLAST AI, an expert coding assistant embedded in VS Code.
You help developers write, debug, refactor, and understand code.
When providing code solutions, clearly indicate what type of action you're performing:
- [CODE] when writing new code
- [DEBUG] when fixing bugs
- [SUGGEST] when recommending improvements
- [WRITE] when generating documentation or text
Always format code in proper markdown code blocks with language identifiers.
Be concise but thorough. Prioritize practical, working solutions.`;

export async function* streamLMStudioResponse(
  messages: Message[],
  endpoint: string,
  modelName: string
): AsyncGenerator<string> {
  const url = `${endpoint.replace(/\/$/, '')}/v1/chat/completions`;

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
    throw new Error(`LM Studio error: ${response.status} - ${err}`);
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
          // ignore
        }
      }
    }
  }
}
