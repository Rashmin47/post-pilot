import { BasePlatformClient, PlatformAccountInfo, PlatformPostOptions } from "./base";

export class TwitterClient extends BasePlatformClient {
  platform = "twitter";

  private clientId = process.env.TWITTER_CLIENT_ID;
  private clientSecret = process.env.TWITTER_CLIENT_SECRET;

  getAuthUrl(state: string): string {
    const rootUrl = "https://twitter.com/i/oauth2/authorize";
    const options = {
      response_type: "code",
      client_id: this.clientId!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/accounts/callback/twitter`,
      scope: "tweet.read tweet.write users.read offline.access",
      state,
      code_challenge: "challenge", // PKCE - in a real app, this should be generated
      code_challenge_method: "plain",
    };

    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
  }

  async exchangeCode(code: string, redirectUri: string) {
    const rootUrl = "https://api.twitter.com/2/oauth2/token";
    
    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");

    const response = await fetch(rootUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: "challenge", // Must match challenge
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twitter token exchange failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  async getAccountInfo(accessToken: string): Promise<PlatformAccountInfo> {
    const response = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Twitter account info");
    }

    const { data } = await response.json();
    return {
      accountId: data.id,
      accountName: data.username,
      platform: "twitter",
    };
  }

  async publishPost(accessToken: string, content: string, _options?: PlatformPostOptions) {
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: content,
        // media integration would go here
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twitter post failed: ${JSON.stringify(error)}`);
    }

    const { data } = await response.json();
    return {
      platformPostId: data.id,
    };
  }

  async replyToComment(accessToken: string, commentId: string, replyText: string) {
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: replyText,
        reply: {
          in_reply_to_tweet_id: commentId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twitter reply failed: ${JSON.stringify(error)}`);
    }

    const { data } = await response.json();
    return {
      replyId: data.id,
    };
  }
}

export const twitterClient = new TwitterClient();
