import { EditablePortfolio, ValidationErrors } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+\..+/;

function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

function invalidUrl(value: string | undefined | null): boolean {
  return !isBlank(value) && !URL_RE.test(value!.trim());
}

/**
 * Validates the whole portfolio before save.
 * Returns an empty object when everything is valid.
 */
export function validatePortfolio(
  portfolio: EditablePortfolio
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Personal
  if (isBlank(portfolio.personal.name)) {
    errors["personal.name"] = "Name is required";
  }

  if (isBlank(portfolio.personal.title)) {
    errors["personal.title"] = "Title is required";
  }

  if (
    !isBlank(portfolio.personal.email) &&
    !EMAIL_RE.test(portfolio.personal.email.trim())
  ) {
    errors["personal.email"] = "Enter a valid email address";
  }

  if (invalidUrl(portfolio.personal.website)) {
    errors["personal.website"] = "URL must start with http:// or https://";
  }

  // Projects
  portfolio.projects.forEach((project, i) => {
    if (isBlank(project.title)) {
      errors[`projects.${i}.title`] = "Title is required";
    }

    if (isBlank(project.description)) {
      errors[`projects.${i}.description`] = "Description is required";
    }

    if (invalidUrl(project.github)) {
      errors[`projects.${i}.github`] =
        "URL must start with http:// or https://";
    }

    if (invalidUrl(project.liveDemo)) {
      errors[`projects.${i}.liveDemo`] =
        "URL must start with http:// or https://";
    }
  });

  // Experience
  portfolio.experience.forEach((exp, i) => {
    if (isBlank(exp.company)) {
      errors[`experience.${i}.company`] = "Company is required";
    }

    if (isBlank(exp.position)) {
      errors[`experience.${i}.position`] = "Position is required";
    }
  });

  // Education
  portfolio.education.forEach((edu, i) => {
    if (isBlank(edu.institution)) {
      errors[`education.${i}.institution`] = "Institution is required";
    }

    if (isBlank(edu.degree)) {
      errors[`education.${i}.degree`] = "Degree is required";
    }
  });

  // Certifications
  portfolio.certifications.forEach((cert, i) => {
    if (isBlank(cert.name)) {
      errors[`certifications.${i}.name`] = "Name is required";
    }

    if (invalidUrl(cert.credentialUrl)) {
      errors[`certifications.${i}.credentialUrl`] =
        "URL must start with http:// or https://";
    }
  });

  // Social — all optional, but must be URLs when present
  (
    [
      "github",
      "linkedin",
      "twitter",
      "leetcode",
      "codeforces",
      "codechef",
      "hackerrank",
    ] as const
  ).forEach((key) => {
    if (invalidUrl(portfolio.social[key])) {
      errors[`social.${key}`] = "URL must start with http:// or https://";
    }
  });

  // SEO
  if (portfolio.seo.title && portfolio.seo.title.length > 60) {
    errors["seo.title"] = "SEO title should be 60 characters or fewer";
  }

  if (portfolio.seo.description && portfolio.seo.description.length > 160) {
    errors["seo.description"] =
      "SEO description should be 160 characters or fewer";
  }

  return errors;
}

/** Maps an error key ("projects.2.title") to the editor tab that owns it. */
export function errorTab(key: string): string {
  const section = key.split(".")[0];

  if (section === "personal") {
    // about lives on its own tab but is part of personal
    return key === "personal.about" ? "about" : "personal";
  }

  return section;
}
