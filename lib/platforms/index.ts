import { twitterClient } from "./twitter";
import { PlatformClient } from "./base";

export const platformRegistry: Record<string, PlatformClient> = {
  twitter: twitterClient,
  // Add other platforms here as they are implemented
};

export function getPlatformClient(platform: string): PlatformClient {
  const client = platformRegistry[platform];
  if (!client) {
    throw new Error(`Platform ${platform} not supported`);
  }
  return client;
}
