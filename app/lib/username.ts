import Portfolio from "@/models/Portfolio";

// Turn a full name into a URL-safe slug (e.g. "Udit Sharma" -> "udit-sharma")
export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Find a username that is not taken by another user's portfolio.
// If "udit-sharma" is taken, tries "udit-sharma-2", "udit-sharma-3", ...
export async function generateUniqueUsername(
  name: string,
  currentUserId: string
): Promise<string> {
  const base = slugifyName(name) || "portfolio";

  let candidate = base;
  let suffix = 2;

  // Loop until we find a slug that is free, or already belongs to this user
  while (true) {
    const existing = await Portfolio.findOne({ username: candidate })
      .select("userId")
      .lean();

    if (!existing || existing.userId.toString() === currentUserId) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix++;
  }
}
