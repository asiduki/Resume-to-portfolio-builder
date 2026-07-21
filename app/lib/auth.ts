import type { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/usermodel";
import { rateLimit } from "./rate-limit";
import bcrypt from "bcryptjs";

function ipFromHeaders(headers: Record<string, unknown> | undefined): string {
  const forwarded = headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.length > 0) return realIp;
  return "unknown";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const ip = ipFromHeaders(req?.headers);
        const email = credentials.email.trim().toLowerCase();

        const ipCheck = rateLimit(`login:ip:${ip}`, 10, 15 * 60 * 1000);
        const emailCheck = rateLimit(`login:email:${email}`, 5, 15 * 60 * 1000);

        if (!ipCheck.success || !emailCheck.success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            throw new Error("invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            // May be null for legacy users until ensureUserUsername backfills
            username: user.username ?? null,
          };
        } catch (error) {
          console.error("Auth error: ", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    // NOTE: username in the JWT/session is a convenience only (greetings,
    // fallbacks). It goes stale if the user renames themselves — pages must
    // render usernames/links from /api/profile or /api/portfolio (DB is the
    // source of truth), never from the session.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string | null }).username ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = (token.username as string | null) ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};