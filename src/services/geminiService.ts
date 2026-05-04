import { GoogleGenAI } from '@google/genai';
import type { Message } from '../types';

const MODEL_NAME = import.meta.env.VITE_CLOUD_MODEL_NAME || 'gemini-2.0-flash';
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

export async function* streamGeminiResponse(
  messages: Message[],
  apiKey: string
): AsyncGenerator<string> {
  const ai = new GoogleGenAI({ apiKey });
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1];
  const chat = ai.chats.create({
    model: MODEL_NAME,
    config: { systemInstruction: SYSTEM_INSTRUCTION },
    history,
  });

  const stream = await chat.sendMessageStream({ message: lastMessage.content });

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) yield text;
  }
}
