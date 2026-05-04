export interface PlatformPostOptions {
  scheduledAt?: Date;
  mediaUrls?: string[];
}

export interface PlatformAccountInfo {
  accountId: string;
  accountName: string;
  platform: string;
}

export interface PlatformClient {
  platform: string;
  
  /**
   * Returns the authorization URL to redirect the user to.
   */
  getAuthUrl(state: string): string;

  /**
   * Exchanges the authorization code for access and refresh tokens.
   */
  exchangeCode(code: string, redirectUri: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  }>;

  /**
   * Fetches the user's account information (ID, Name) using the access token.
   */
  getAccountInfo(accessToken: string): Promise<PlatformAccountInfo>;

  /**
   * Publishes a post to the platform.
   */
  publishPost(accessToken: string, content: string, options?: PlatformPostOptions): Promise<{
    platformPostId: string;
    url?: string;
  }>;

  /**
   * Refreshes the access token using the refresh token.
   */
  refreshToken?(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  }>;

  /**
   * Replies to a comment on the platform.
   */
  replyToComment(accessToken: string, commentId: string, replyText: string): Promise<{
    replyId: string;
  }>;
}

export abstract class BasePlatformClient implements PlatformClient {
  abstract platform: string;
  
  abstract getAuthUrl(state: string): string;
  abstract exchangeCode(code: string, redirectUri: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  }>;
  abstract getAccountInfo(accessToken: string): Promise<PlatformAccountInfo>;
  abstract publishPost(accessToken: string, content: string, options?: PlatformPostOptions): Promise<{
    platformPostId: string;
    url?: string;
  }>;
  abstract replyToComment(accessToken: string, commentId: string, replyText: string): Promise<{
    replyId: string;
  }>;
}
