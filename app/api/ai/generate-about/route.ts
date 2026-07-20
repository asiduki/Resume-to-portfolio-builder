import {NextResponse , NextRequest} from "next/server";
import {generateWithGemini} from "@/app/lib/ai/ai.service";

export async function POST(request: NextRequest) {
    const { prompt } = await request.json();
    const result = await generateWithGemini(prompt);
    return NextResponse.json({
        about: result,
    });
}
