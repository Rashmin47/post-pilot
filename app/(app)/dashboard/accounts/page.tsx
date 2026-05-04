"use client";

import { useEffect, useState } from "react";
import { PlatformCard } from "@/components/accounts/platform-card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const platforms = [
  { id: "instagram", name: "Instagram", icon: "📸", color: "#e1306c" },
  { id: "youtube", name: "YouTube", icon: "📺", color: "#ff0000" },
  { id: "facebook", name: "Facebook", icon: "👤", color: "#1877f2" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "#0a66c2" },
  { id: "pinterest", name: "Pinterest", icon: "📌", color: "#e60023" },
  { id: "discord", name: "Discord", icon: "💬", color: "#5865f2" },
  { id: "twitter", name: "Twitter / X", icon: "🐦", color: "#000000" },
  { id: "slack", name: "Slack", icon: "🏘️", color: "#4a154b" },
];

interface ConnectedAccount {
  id: string;
  platform: string;
  accountName: string;
  isActive: boolean;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      toast.error("Failed to load connected accounts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDisconnect = async (id: string) => {
    const response = await fetch(`/api/accounts/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setAccounts(accounts.filter((a) => a.id !== id));
    } else {
      throw new Error("Failed to disconnect");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Connected Accounts</h1>
        <p className="text-[#64748b] mt-2">
          Connect and manage your social media accounts to start scheduling posts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[240px] bg-[#111120] border border-[#1e1e2e] rounded-xl animate-pulse" />
            ))
          : platforms.map((platform) => {
              const connectedAccounts = accounts.filter((a) => a.platform === platform.id);
              
              // Handle multiple accounts per platform
              if (connectedAccounts.length > 0) {
                return connectedAccounts.map((account) => (
                  <PlatformCard
                    key={account.id}
                    platform={platform}
                    connectedAccount={account}
                    onDisconnect={handleDisconnect}
                  />
                ));
              }

              return (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  onDisconnect={handleDisconnect}
                />
              );
            })}
      </div>
    </div>
  );
}
