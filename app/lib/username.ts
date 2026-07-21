import Portfolio from "@/models/Portfolio";
import User from "@/models/usermodel";

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

export const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;

// A username is taken if any OTHER user owns it — in either collection.
// Portfolio must be checked too: portfolios created before registration
// usernames existed carry AI-generated slugs with no matching User.username.
export async function isUsernameTaken(
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  const [user, portfolio] = await Promise.all([
    User.findOne({ username }).select("_id").lean(),
    Portfolio.findOne({ username }).select("userId").lean(),
  ]);

  if (user && user._id.toString() !== excludeUserId) return true;
  if (portfolio && portfolio.userId.toString() !== excludeUserId) return true;

  return false;
}

// Find a free username starting from `base`, trying "-2", "-3", ... suffixes.
async function findFreeUsername(
  base: string,
  currentUserId: string
): Promise<string> {
  let candidate = base;
  let suffix = 2;

  while (await isUsernameTaken(candidate, currentUserId)) {
    candidate = `${base}-${suffix}`;
    suffix++;
  }

  return candidate;
}

// Return the user's registered username, lazily backfilling legacy users
// (registered before usernames existed): prefer their existing portfolio
// username so the public URL never changes, else derive from name/email.
// Persists the backfilled username to the User document.
export async function ensureUserUsername(user: {
  _id: unknown;
  username?: string | null;
  name?: string;
  email?: string;
  save: () => Promise<unknown>;
}): Promise<string> {
  if (user.username) return user.username;

  const userId = String(user._id);

  const portfolio = await Portfolio.findOne({ userId })
    .select("username")
    .lean();

  let base =
    (portfolio?.username as string | undefined) ||
    slugifyName(user.name || "") ||
    slugifyName((user.email || "").split("@")[0]) ||
    "user";

  // Keep within the User schema's 3-30 char bounds
  base = base.slice(0, 30);
  if (base.length < 3) base = `user-${base}`.slice(0, 30);

  const username = await findFreeUsername(base, userId);

  user.username = username;
  await user.save();

  return username;
}

// Find a username that is not taken by another user's portfolio.
// If "udit-sharma" is taken, tries "udit-sharma-2", "udit-sharma-3", ...
export async function generateUniqueUsername(
  name: string,
  currentUserId: string
): Promise<string> {
  const base = slugifyName(name) || "portfolio";
  return findFreeUsername(base, currentUserId);
}
