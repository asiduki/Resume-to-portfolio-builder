import {
  IPersonal,
  ISkills,
  IProject,
  IExperience,
  IEducation,
  ICertification,
  ISocial,
  ISEO,
} from "@/models/Portfolio/portfolio.types";

/** The JSON structure Gemini is instructed to return in portfolio.prompt.ts */
export interface GeneratedPortfolio {
  personal: IPersonal;
  skills: ISkills;
  projects: IProject[];
  experience: IExperience[];
  education: IEducation[];
  certifications: ICertification[];
  social: ISocial;
  seo: ISEO;
}

/**
 * Parses a Gemini response into a GeneratedPortfolio.
 *
 * Models sometimes wrap JSON in ```json fences or add stray text around it
 * despite instructions, so we extract the outermost JSON object first.
 *
 * Throws if the response contains no parseable JSON object or is missing
 * required top-level sections.
 */
export function parseGeneratedPortfolio(raw: string): GeneratedPortfolio {
  // Strip markdown code fences if present
  let text = raw.trim();

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    text = fenceMatch[1];
  }

  // Fall back to the outermost { ... } block
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response contains no JSON object");
  }

  let data: unknown;

  try {
    data = JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new Error("AI response is not valid JSON");
  }

  if (typeof data !== "object" || data === null) {
    throw new Error("AI response is not a JSON object");
  }

  const portfolio = data as Record<string, unknown>;

  // Ensure every section exists with the right shape so Mongoose
  // defaults don't silently swallow a malformed generation.
  for (const key of ["personal", "skills", "social", "seo"] as const) {
    if (typeof portfolio[key] !== "object" || portfolio[key] === null) {
      throw new Error(`AI response is missing the "${key}" section`);
    }
  }

  for (const key of [
    "projects",
    "experience",
    "education",
    "certifications",
  ] as const) {
    if (!Array.isArray(portfolio[key])) {
      // Tolerate a missing array — treat as empty rather than failing
      portfolio[key] = [];
    }
  }

  return portfolio as unknown as GeneratedPortfolio;
}
