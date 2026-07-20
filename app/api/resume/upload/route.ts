import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import {connectToDatabase} from "@/app/lib/db";

import Portfolio from "@/models/Portfolio";

import { parseResume } from "@/app/lib/ai/resume-parser";
import { portfolioPrompt } from "@/app/lib/ai/portfolio.prompt";
import { generateWithGemini } from "@/app/lib/ai/ai.service";

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

    // Extract Resume Text
    const resumeText = await parseResume(file);

    // Create Prompt
    const prompt = portfolioPrompt(resumeText);

    // Generate Portfolio JSON
    const portfolioData = await generateWithGemini(prompt);

    // Check if portfolio already exists
    const existingPortfolio = await Portfolio.findOne({
      userId: session.user.id,
    });

    let portfolio;

    if (existingPortfolio) {
      existingPortfolio.personal = portfolioData.personal;
      existingPortfolio.skills = portfolioData.skills;
      existingPortfolio.projects = portfolioData.projects;
      existingPortfolio.experience = portfolioData.experience;
      existingPortfolio.education = portfolioData.education;
      existingPortfolio.certifications = portfolioData.certifications;
      existingPortfolio.social = portfolioData.social;
      existingPortfolio.seo = portfolioData.seo;

      portfolio = await existingPortfolio.save();
    } else {
      portfolio = await Portfolio.create({
        userId: session.user.id,
        username: portfolioData.personal.name
          .toLowerCase()
          .replace(/\s+/g, "-"),

        template: "modern",

        personal: portfolioData.personal,
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
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate portfolio",
      },
      { status: 500 }
    );
  }
}


// frontend req

// const formData = new FormData();

// formData.append("resume", file);

// const res = await fetch("/api/resume/upload", {
//   method: "POST",
//   body: formData,
// });

// const data = await res.json();