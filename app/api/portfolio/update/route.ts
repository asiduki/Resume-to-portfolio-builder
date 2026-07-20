import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import {connectToDatabase} from "@/app/lib/db";

import Portfolio from "@/models/Portfolio";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const portfolio = await Portfolio.findOne({
      userId: session.user.id,
    });

    if (!portfolio) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio not found",
        },
        {
          status: 404,
        }
      );
    }

    // Only update editable fields
    portfolio.personal = body.personal ?? portfolio.personal;
    portfolio.skills = body.skills ?? portfolio.skills;
    portfolio.projects = body.projects ?? portfolio.projects;
    portfolio.experience = body.experience ?? portfolio.experience;
    portfolio.education = body.education ?? portfolio.education;
    portfolio.certifications =
      body.certifications ?? portfolio.certifications;
    portfolio.social = body.social ?? portfolio.social;
    portfolio.seo = body.seo ?? portfolio.seo;

    if (body.template) {
      portfolio.template = body.template;
    }

    await portfolio.save();

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio updated successfully",
        portfolio,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Portfolio Update Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}