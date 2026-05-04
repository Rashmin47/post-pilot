import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateCaption } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { prompt, imageUrl } = await req.json();

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const caption = await generateCaption(prompt, imageUrl);

    return NextResponse.json({ caption });
  } catch (error) {
    console.error("[AI_GENERATE_CAPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
