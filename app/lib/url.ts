// Ensure a link is absolute so templates never render relative hrefs like
// "github.com/x" (which the browser resolves against the portfolio URL).
// Resumes often list bare domains ("linkedin.com/in/udit").
export function ensureHttps(url: unknown): string {
  if (typeof url !== "string") return "";

  const trimmed = url.trim();

  if (!trimmed) return "";

  // Already absolute (https, http, mailto, tel, ...)
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;

  // Protocol-relative //example.com
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  return `https://${trimmed}`;
}

// The portfolio fields that hold links, by section
const PERSONAL_URL_FIELDS = ["website", "github", "linkedin"] as const;
const PROJECT_URL_FIELDS = ["github", "liveDemo"] as const;
const SOCIAL_URL_FIELDS = [
  "github",
  "linkedin",
  "twitter",
  "leetcode",
  "codeforces",
  "codechef",
  "hackerrank",
] as const;

type Loose = Record<string, any>;

// Normalize every link field of a portfolio-shaped object in place.
// Tolerates missing/partial sections (used on both AI output and
// editor PATCH bodies, which may contain only some sections).
export function normalizePortfolioUrls<T extends Loose>(data: T): T {
  if (data.personal) {
    for (const field of PERSONAL_URL_FIELDS) {
      if (data.personal[field] !== undefined) {
        data.personal[field] = ensureHttps(data.personal[field]);
      }
    }
  }

  if (Array.isArray(data.projects)) {
    for (const project of data.projects) {
      for (const field of PROJECT_URL_FIELDS) {
        if (project?.[field] !== undefined) {
          project[field] = ensureHttps(project[field]);
        }
      }
    }
  }

  if (Array.isArray(data.certifications)) {
    for (const cert of data.certifications) {
      if (cert?.credentialUrl !== undefined) {
        cert.credentialUrl = ensureHttps(cert.credentialUrl);
      }
    }
  }

  if (data.social) {
    for (const field of SOCIAL_URL_FIELDS) {
      if (data.social[field] !== undefined) {
        data.social[field] = ensureHttps(data.social[field]);
      }
    }
  }

  return data;
}
