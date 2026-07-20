import { NextResponse, NextRequest } from "next/server";
import { generatePortfolio } from "@/app/lib/ai/ai.service";

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  const result = await generatePortfolio(prompt);

  return NextResponse.json({
    about: result,
  });
}