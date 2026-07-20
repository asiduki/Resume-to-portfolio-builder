import { GoogleGenAI } from "@google/genai";


async function generateWithGemini(prompt: string): Promise<string> {
    try{
        if (!process.env.GOOGLE_API_KEY) {
          throw new Error("Missing GOOGLE_API_KEY environment variable");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
        const result = await ai.interactions.create({
          model: "gemini-3.5-flash",
          input: prompt,
        });
        return result.output_text ?? "No response from Gemini model";
    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        throw error;
    }
}

export { generateWithGemini };
