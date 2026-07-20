import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import Portfolio from "@/models/Portfolio";
import {connectToDatabase} from "@/app/lib/db";


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

    const { published } = await req.json();

    if (typeof published !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Published must be true or false",
        },
        {
          status: 400,
        }
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
        {
          status: 404,
        }
      );
    }

    portfolio.published = published;

    await portfolio.save();

    return NextResponse.json(
      {
        success: true,
        message: published
          ? "Portfolio Published Successfully"
          : "Portfolio Unpublished Successfully",
        portfolio,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Publish Error:", error);

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