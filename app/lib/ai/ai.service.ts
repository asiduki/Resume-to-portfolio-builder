import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    // Optional but recommended by OpenRouter for their analytics/rankings.
    // Replace with your actual site info, or remove these two lines.
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
    "X-Title": process.env.SITE_NAME || "Portfolio Generator",
  },
});

export async function generatePortfolio(prompt: string) {
  try {
    const response = await client.chat.completions.create({
      // OpenRouter model IDs are prefixed with the provider,
      // e.g. "anthropic/claude-opus-4.8" or "google/gemini-3.5-flash"
      // Note: OpenRouter uses a dot in the version (4.8), not a dash like the raw Anthropic API (4-8)
      model: process.env.OPENROUTER_MODEL || "anthropic/claude-opus-4.8",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume parser. Return ONLY valid JSON. Do not wrap the response in markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content ?? "";

    return content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Failed to generate portfolio.");
  }
}
// import { GoogleGenAI } from "@google/genai";


// async function generateWithGemini(prompt: string): Promise<string> {
//     try{
//         if (!process.env.GOOGLE_API_KEY) {
//           throw new Error("Missing GOOGLE_API_KEY environment variable");
//         }
//         const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
//         const result = await ai.interactions.create({
//           model: "gemini-3.5-flash",
//           input: prompt,
//         });
//         return result.output_text ?? "No response from Gemini model";
//     } catch (error) {
//         console.error("Error generating content with Gemini:", error);
//         throw error;
//     }
// }

// export { generateWithGemini };

// import Anthropic from "@anthropic-ai/sdk";
// import { GoogleGenAI } from "@google/genai";

// /**
//  * Generate text using Claude Opus 4.8 via the official Anthropic API.
//  * Requires ANTHROPIC_API_KEY (from https://console.anthropic.com) in your env.
//  */
// async function generateWithClaude(prompt: string): Promise<string> {
//   try {
//     if (!process.env.ANTHROPIC_API_KEY) {
//       throw new Error("Missing ANTHROPIC_API_KEY environment variable");
//     }

//     const anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     });

//     const message = await anthropic.messages.create({
//       model: "claude-opus-4-8",
//       max_tokens: 1024,
//       messages: [{ role: "user", content: prompt }],
//     });

//     const textBlock = message.content.find((block) => block.type === "text");
//     return textBlock && "text" in textBlock
//       ? textBlock.text
//       : "No response from Claude model";
//   } catch (error) {
//     console.error("Error generating content with Claude:", error);
//     throw error;
//   }
// }

// /**
//  * Generate text using Gemini via the official Google GenAI SDK.
//  * Requires GOOGLE_API_KEY in your env.
//  */
// async function generateWithGemini(prompt: string): Promise<string> {
//   try {
//     if (!process.env.GOOGLE_API_KEY) {
//       throw new Error("Missing GOOGLE_API_KEY environment variable");
//     }
//     const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
//     const result = await ai.interactions.create({
//       model: "gemini-3.5-flash",
//       input: prompt,
//     });
//     return result.output_text ?? "No response from Gemini model";
//   } catch (error) {
//     console.error("Error generating content with Gemini:", error);
//     throw error;
//   }
// }

// /**
//  * Try Claude first, fall back to Gemini if Claude fails.
//  * Swap the order or make it configurable via an env var if you prefer.
//  */
// async function generateWithFallback(prompt: string): Promise<string> {
//   try {
//     return await generateWithClaude(prompt);
//   } catch (claudeError) {
//     console.warn("Claude generation failed, falling back to Gemini:", claudeError);
//     return await generateWithGemini(prompt);
//   }
// }

// export { generateWithClaude, generateWithGemini, generateWithFallback };