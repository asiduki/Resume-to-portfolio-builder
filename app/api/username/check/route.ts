import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/db";
import { isUsernameTaken, USERNAME_REGEX } from "@/app/lib/username";

export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get("username") || "";
    const username = raw.trim().toLowerCase();

    if (!username) {
      return NextResponse.json(
        { available: false, message: "Username is required" },
        { status: 200 }
      );
    }

    if (!USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        {
          available: false,
          message:
            "3-30 characters; letters, numbers, hyphens and underscores only",
        },
        { status: 200 }
      );
    }

    await connectToDatabase();

    const session = await getServerSession(authOptions);

    const taken = await isUsernameTaken(username, session?.user?.id);

    return NextResponse.json(
      {
        available: !taken,
        message: taken ? "Username already taken" : "Username available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Username check error:", error);

    return NextResponse.json(
      { available: false, message: "Could not check username" },
      { status: 500 }
    );
  }
}
