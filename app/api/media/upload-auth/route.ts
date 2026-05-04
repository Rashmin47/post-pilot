import { imagekit } from "@/lib/imagekit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("[IMAGEKIT_AUTH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
