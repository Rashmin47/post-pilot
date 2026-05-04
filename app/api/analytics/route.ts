import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAnalyticsData } from "@/lib/analytics";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const data = await getAnalyticsData(userId, days);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
