export const portfolioPrompt = (resumeText: string) => `
You are an expert resume analyzer and portfolio content generator.

Your task is to analyze the provided resume and convert it into a structured JSON object.

Rules:

- Return ONLY valid JSON.
- Do NOT wrap the JSON in markdown.
- Do NOT add explanations.
- Do NOT hallucinate information.
- If information is missing use "" for strings and [] for arrays.
- Improve grammar and wording while preserving meaning.
- Categorize technical skills.
- Write a professional About section.
- Generate an SEO title and description.
- Keep project descriptions concise.

Return this exact structure:

{
  "personal": {
    "name": "",
    "title": "",
    "tagline": "",
    "about": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "github": "",
    "linkedin": "",
    "profileImage": ""
  },

  "skills": {
    "languages": [],
    "frontend": [],
    "backend": [],
    "database": [],
    "frameworks": [],
    "tools": [],
    "cloud": [],
    "other": []
  },

  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": [],
      "github": "",
      "liveDemo": "",
      "image": "",
      "highlights": []
    }
  ],

  "experience": [
    {
      "company": "",
      "position": "",
      "employmentType": "",
      "location": "",
      "duration": "",
      "description": ""
    }
  ],

  "education": [
    {
      "institution": "",
      "degree": "",
      "fieldOfStudy": "",
      "duration": "",
      "grade": ""
    }
  ],

  "certifications": [
    {
      "name": "",
      "issuer": "",
      "year": "",
      "credentialUrl": ""
    }
  ],

  "social": {
    "github": "",
    "linkedin": "",
    "twitter": "",
    "leetcode": "",
    "codeforces": "",
    "codechef": "",
    "hackerrank": ""
  },

  "seo": {
    "title": "",
    "description": "",
    "keywords": []
  }
}

Resume:

${resumeText}
`;