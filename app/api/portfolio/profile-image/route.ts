import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/db";
import Portfolio from "@/models/Portfolio";
import cloudinary from "@/app/lib/cloudinary";

// ============================
// Upload / Replace profile image
// ============================

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Must be an image under 2MB" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const portfolio = await Portfolio.findOne({ userId: session.user.id });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Fixed public_id per user: re-upload overwrites, so replace is free
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `portfolio-profiles/${session.user.id}`,
              overwrite: true,
              invalidate: true,
              transformation: [
                { width: 512, height: 512, crop: "fill", gravity: "face" },
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            (err, res) => (err || !res ? reject(err) : resolve(res))
          )
          .end(buffer);
      }
    );

    portfolio.personal.profileImage = result.secure_url;
    await portfolio.save();

    return NextResponse.json(
      {
        success: true,
        message: "Profile image updated",
        image: result.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile image upload error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ============================
// Delete profile image
// ============================

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const portfolio = await Portfolio.findOne({ userId: session.user.id });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (!portfolio.personal.profileImage) {
      return NextResponse.json(
        { success: false, message: "No profile image to delete" },
        { status: 400 }
      );
    }

    try {
      await cloudinary.uploader.destroy(
        `portfolio-profiles/${session.user.id}`,
        { invalidate: true }
      );
    } catch (cloudinaryError) {
      console.error("Cloudinary delete failed:", cloudinaryError);
    }

    portfolio.personal.profileImage = "";
    await portfolio.save();

    return NextResponse.json(
      { success: true, message: "Profile image removed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile image delete error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
