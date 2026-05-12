import { GoogleGenAI } from '@google/genai';
import type { Message } from '../types';

const MODEL_NAME = import.meta.env.VITE_CLOUD_MODEL_NAME || 'gemini-2.0-flash';
const SYSTEM_INSTRUCTION =
  import.meta.env.VITE_CLOUD_SYSTEM_INSTRUCTION ||
  `You are COUCOU AI, an expert coding assistant embedded in VS Code.
You help developers write, debug, refactor, and understand code.

STRICT INSTRUCTIONS:
1. ONLY perform the specific task requested by the user. If they ask to "explain", DO NOT suggest fixes or changes unless they ask for them.
2. If you suggest code changes, provide ONLY the code that needs to be changed or added.
3. When providing code solutions, clearly indicate the action:
   - [CODE] for new code
   - [DEBUG] for bug fixes
   - [SUGGEST] for improvements
   - [WRITE] for documentation
4. Always format code in markdown blocks with language identifiers.
5. Be concise and prioritize practical solutions.`;

export async function* streamGeminiresponse(
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
    config: { systemInstruction: SYUSW“Sî’ïP’S”àKBà\›‹ûKBàJN√BÉBà€€ú››ôX[HH]ÿZ]⁄]úŸ[ôY\‹ÿYŸT›ôX[J»Y\‹ÿYŸNà\›Y\‹ÿYŸKò€€ù[ùJN√BÉBàõ‹à]ÿZ]
€€ú›⁄[ö»Ÿà›ôX[JH√Bà€€ú›^H⁄[öÀù^√BàYà
^
HZY[^√BàCBü