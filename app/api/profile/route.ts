import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import { authOptions } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/db";
import User from "@/models/usermodel";
import Portfolio from "@/models/Portfolio";
import {
  ensureUserUsername,
  isUsernameTaken,
  USERNAME_REGEX,
} from "@/app/lib/username";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

async function profilePayload(user: {
  _id: Types.ObjectId;
  name: string;
  username?: string | null;
  email: string;
  image?: string;
  createdAt: Date;
}) {
  const portfolio = await Portfolio.findOne({ userId: user._id })
    .select("username published updatedAt template personal.profileImage")
    .lean();

  return {
    user: {
      name: user.name,
      username: user.username ?? null,
      email: user.email,
      image: user.image || "/avatar.png",
      createdAt: user.createdAt,
    },
    portfolio: portfolio
      ? {
          username: portfolio.username,
          published: portfolio.published,
          updatedAt: portfolio.updatedAt,
          template: portfolio.template,
          profileImage: portfolio.personal?.profileImage || "",
        }
      : null,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    await ensureUserUsername(user);

    return NextResponse.json(
      { success: true, ...(await profilePayload(user)) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, username, email, currentPassword } = body as {
      name?: string;
      username?: string;
      email?: string;
      currentPassword?: string;
    };

    await connectToDatabase();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (name !== undefined) {
      const trimmed = name.trim();

      if (!trimmed) {
        return NextResponse.json(
          { success: false, message: "Name cannot be empty", field: "name" },
          { status: 400 }
        );
      }

      user.name = trimmed;
    }

    const newUsername = username?.trim().toLowerCase();
    const usernameChanged = !!newUsername && newUsername !== user.username;

    if (usernameChanged) {
      if (!USERNAME_REGEX.test(newUsername)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Username must be 3-30 characters; letters, numbers, hyphens and underscores only",
            field: "username",
          },
          { status: 400 }
        );
      }

      if (await isUsernameTaken(newUsername, session.user.id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Username already taken",
            field: "username",
          },
          { status: 409 }
        );
      }

      user.username = newUsername;
    }

    const newEmail = email?.trim().toLowerCase();

    if (newEmail && newEmail !== user.email) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "Current password is required to change email",
            field: "currentPassword",
          },
          { status: 400 }
        );
      }

      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!validPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "Incorrect password",
            field: "currentPassword",
          },
          { status: 401 }
        );
      }

      if (!EMAIL_REGEX.test(newEmail)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email address",
            field: "email",
          },
          { status: 400 }
        );
      }

      const emailTaken = await User.findOne({
        email: newEmail,
        _id: { $ne: user._id },
      })
        .select("_id")
        .lean();

      if (emailTaken) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already in use",
            field: "email",
          },
          { status: 409 }
        );
      }

      user.email = newEmail;
    }

    await user.save();

    if (usernameChanged) {
      await Portfolio.updateOne(
        { userId: user._id },
        { $set: { username: user.username } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated",
        ...(await profilePayload(user)),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, message: "Username or email already taken" },
        { status: 409 }
      );
    }

    console.error("Profile update error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
