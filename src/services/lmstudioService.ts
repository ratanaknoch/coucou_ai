import type { Message } from '../types';

const SYSTEM_INSTRUCTION = `You are COUCOU AI, an expert coding assistant embedded in VS Code.
You help developers write, debug, refactor, and understand code.

STRICT INSTRUCTIONS:
1. ONLY perform the specific task requested by the user. If they ask to "explain", DO NOT suggest fixes or changes unless they ask for them.
2. If you suggest code changes, provide ONLY the code that needs to be changed or added.
3. When providing code solutions, clearly indicate the action*:
   - [CODE] for new code
   - [DEBUG] for bug fixes
   - [SUGGEST] for improvements
   - [WRITE] for documentation
4. Always format code in markdown blocks with language identifiers.
5. Be concise and prioritize practical solutions.`;

export async function* streamLMStudioResponse(
  messages: Message[],
  endpoint: string,
  modelName: string
): AsyncGenerator<string> {
  const url = `${endpoint.replace(/\/$/, '')}/v1/chat/completions`;

  const payload = {
    model: modelName,
    messages: [
      { role: 'system', content: SYSUSWÒS”Õ•PÕSÓˆKBˆ‹‹›Y\ÜØYÙ\Ë›X\

JHOˆ
È›ÛNˆKœ›ÛKÛÛ[ˆK˜ÛÛ[JJKBˆKBˆİ™X[NˆYKBˆNÃBƒBˆÛÛœİ™\ÜÛœÙHH]ØZ]™]Ú
\›ÃBˆY]Ùˆ	ÔÔÕ	ËBˆXY\œÎˆÈ	ĞÛÛ[U\IÎˆ	Ø\XØ][Û‹ÚœÛÛ‰ÈKBˆ›ÙNˆ”ÓÓ‹œİš[™ÚYJ^[ØY
KBˆJNÃBƒBˆYˆ
\™\ÜÛœÙK›ÚÊHÃBˆÛÛœİ\œˆH]ØZ]™\ÜÛœÙK^

NÃBˆ›İÈ™]È\œ›ÜŠWÔİY[È\œ›Üˆ	Ü™\ÜÛœÙKœİ]\ßHH	Ù\œŸX
NÃBˆCBƒBˆÛÛœİ™XY\ˆH™\ÜÛœÙK˜›ÙHK™Ù]™XY\Š
NÃBˆÛÛœİXÛÙ\ˆH™]È^XÛÙ\Š
NÃBˆ]Y™™\ˆH	ÉÎÃBƒBˆÚ[H
YJHÃBˆÛÛœİÈÛ™K˜[YHHH]ØZ]™XY\‹œ™XY

NÃBˆYˆ
Û™JHœ™XZÎÃBˆY™™\ˆ
ÏHXÛÙ\‹™XÛÙJ˜[YKÈİ™X[NˆYHJNÃBˆÛÛœİ[™\ÈHY™™\‹œÜ]
	×‰ÊNÃBˆY™™\ˆH[™\ËœÜ

H	ÉÎÃBƒBˆ›Üˆ
ÛÛœİ[™HÙˆ[™\ÊHÃBˆÛÛœİš[[YYH[™Kš[J
NÃBˆYˆ
]š[[YYš[[YYOOH	Ù]NˆÑÓ‘WIÊHÛÛ[YNÃBˆYˆ
š[[YYœİ\ÕÚ]
	Ù]Nˆ	ÊJHÃBˆHÃBˆÛÛœİœÛÛˆH”ÓÓ‹œ\œÙJš[[YYœÛXÙJŠJNÃBˆÛÛÛÛ[HœÛÛ‹˜ÚÚXÙ\ÏË–ÌOË™[OË˜ÛÛ[ÃBˆYˆ
ÛÛ[
HZY[ÛÛ[ÃBˆHØ]ÚÃBˆËÈYÛ›Ü™CBˆCBˆCBˆCBˆCBŸCB