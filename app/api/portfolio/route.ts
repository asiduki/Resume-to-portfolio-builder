import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import {connectToDatabase} from "@/app/lib/db";
import Portfolio from "@/models/Portfolio";
import { authOptions } from "@/app/lib/auth"; // Change path if needed

// ============================
// GET Portfolio
// ============================

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

// ============================
// CREATE Portfolio
// ============================

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

    const portfolio = await Portfolio.create({
      userId: session.user.id,
      username: body.username,
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

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}