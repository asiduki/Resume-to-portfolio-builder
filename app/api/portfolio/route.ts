import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import {connectToDatabase} from "@/app/lib/db";
import Portfolio from "@/models/Portfolio";
import { authOptions } from "@/app/lib/auth";
import { slugifyName } from "@/app/lib/username";
import cloudinary from "@/app/lib/cloudinary";


export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const portfolio = await Portfolio.findOne({
      userId: session.user.id,
    });

    if (!portfolio) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        portfolio,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const existingPortfolio = await Portfolio.findOne({
      userId: session.user.id,
    });

    if (existingPortfolio) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio already exists",
        },
        { status: 400 }
      );
    }

    const username = slugifyName(body.username || "");

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is required",
        },
        { status: 400 }
      );
    }

    const usernameTaken = await Portfolio.findOne({ username })
      .select("_id")
      .lean();

    if (usernameTaken) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is already taken. Please choose another one.",
        },
        { status: 409 }
      );
    }

    const portfolio = await Portfolio.create({
      userId: session.user.id,
      username: username,
      template: body.template || "modern",

      personal: body.personal,
      skills: body.skills,
      projects: body.projects,
      experience: body.experience,
      education: body.education,
      certifications: body.certifications,
      social: body.social,
      seo: body.seo,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio created successfully",
        portfolio,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    if ((error as { code?: number })?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is already taken. Please choose another one.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}



export async function DELETE() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const portfolio = await Portfolio.findOneAndDelete({
      userId: session.user.id,
    });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (portfolio.personal?.profileImage) {
      try {
        await cloudinary.uploader.destroy(
          `portfolio-profiles/${session.user.id}`
        );
      } catch (cloudinaryError) {
        console.error("Cloudinary cleanup failed:", cloudinaryError);
      }
    }

    return NextResponse.json(
      { success: true, message: "Portfolio deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}