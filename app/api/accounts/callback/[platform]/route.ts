import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { getPlatformClient } from "@/lib/platforms";
import { encrypt } from "@/lib/encryption";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { userId } = await auth();
  const { platform } = await params;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=${error}`);
  }

  if (!code) {
    return new NextResponse("Missing authorization code", { status: 400 });
  }

  try {
    const client = getPlatformClient(platform);
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/accounts/callback/${platform}`;
    
    // 1. Exchange code for tokens
    const { accessToken, refreshToken } = await client.exchangeCode(code, redirectUri);
    
    // 2. Get account info
    const accountInfo = await client.getAccountInfo(accessToken);
    
    // 3. Encrypt tokens
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;

    // 4. Save to DB
    await db.insert(socialAccounts).values({
      userId,
      platform: platform as any, // Cast to match enum
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      accountId: accountInfo.accountId,
      accountName: accountInfo.accountName,
      isActive: true,
    });

    // 5. Redirect back to accounts page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?success=true`);
  } catch (err: any) {
    console.error("Callback error:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=callback_failed`
    );
  }
}
