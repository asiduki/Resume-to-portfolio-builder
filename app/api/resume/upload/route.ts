import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/db";

import Portfolio from "@/models/Portfolio";

import { parseResume } from "@/app/lib/ai/resume-parser";
import { portfolioPrompt } from "@/app/lib/ai/portfolio.prompt";
import { generatePortfolio } from "@/app/lib/ai/ai.service";
import { parseGeneratedPortfolio } from "@/app/lib/ai/portfolio-parser";
import { ensureUserUsername } from "@/app/lib/username";
import User from "@/models/usermodel";

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

    const formData = await req.formData();

    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume is required",
        },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF files are allowed",
        },
        { status: 400 }
      );
    }

    const resumeText = await parseResume(file);

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not extract any text from this PDF",
        },
        { status: 422 }
      );
    }

    const prompt = portfolioPrompt(resumeText);

    const rawResponse = await generatePortfolio(prompt);

    let portfolioData;

    try {
      portfolioData = parseGeneratedPortfolio(rawResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error(rawResponse);

      return NextResponse.json(
        {
          success: false,
          message:
            "The AI returned an invalid response. Please try again.",
        },
        { status: 422 }
      );
    }

    const existingPortfolio = await Portfolio.findOne({
      userId: session.user.id,
    });

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const accountImage = user.image?.startsWith("http") ? user.image : "";

    let portfolio;

    if (existingPortfolio) {
      existingPortfolio.personal = {
        ...portfolioData.personal,
        profileImage:
          existingPortfolio.personal?.profileImage || accountImage,
      };
      existingPortfolio.skills = portfolioData.skills;
      existingPortfolio.projects = portfolioData.projects;
      existingPortfolio.experience = portfolioData.experience;
      existingPortfolio.education = portfolioData.education;
      existingPortfolio.certifications = portfolioData.certifications;
      existingPortfolio.social = portfolioData.social;
      existingPortfolio.seo = portfolioData.seo;

      portfolio = await existingPortfolio.save();
    } else {
      const username = await ensureUserUsername(user);

      portfolio = await Portfolio.create({
        userId: session.user.id,
        username,

        template: "modern",
        published: false,

        personal: {
          ...portfolioData.personal,
          profileImage: accountImage,
        },
        skills: portfolioData.skills,
        projects: portfolioData.projects,
        experience: portfolioData.experience,
        education: portfolioData.education,
        certifications: portfolioData.certifications,
        social: portfolioData.social,
        seo: portfolioData.seo,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio generated successfully",
        portfolio,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Portfolio Generation Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate portfolio",
      },
      {
        status: 500,
      }
    );
  }
}