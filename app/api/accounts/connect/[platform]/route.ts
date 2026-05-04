import { auth } from "@clerk/nextjs/server";
import { getPlatformClient } from "@/lib/platforms";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { userId } = await auth();
  const { platform } = await params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const client = getPlatformClient(platform);
    // In a real app, 'state' should be stored in a cookie/session to prevent CSRF
    const state = Math.random().toString(36).substring(7);
    const authUrl = client.getAuthUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error("Connect error:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
