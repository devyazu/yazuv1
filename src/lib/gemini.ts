import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI generation will fail.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateWithGemini(
  systemPrompt: string,
  userInput: string,
  brandContext?: string
): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini API key is not configured.");
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const fullPrompt = brandContext
    ? `${systemPrompt}\n\n--- Marka bilgisi ---\n${brandContext}\n\n--- Kullanıcı girdisi ---\n${userInput}`
    : `${systemPrompt}\n\n--- Kullanıcı girdisi ---\n${userInput}`;
  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  const text = response.text();
  if (!text) {
    throw new Error("Gemini boş yanıt döndü.");
  }
  return text;
}
