"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, Unlink, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PlatformCardProps {
  platform: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  connectedAccount?: {
    id: string;
    accountName: string;
    isActive: boolean;
  };
  onDisconnect: (id: string) => Promise<void>;
}

export function PlatformCard({ platform, connectedAccount, onDisconnect }: PlatformCardProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const router = useRouter();

  const handleConnect = () => {
    window.location.href = `/api/accounts/connect/${platform.id}`;
  };

  const handleDisconnect = async () => {
    if (!connectedAccount) return;
    
    setIsDisconnecting(true);
    try {
      await onDisconnect(connectedAccount.id);
      toast.success(`Disconnected from ${platform.name}`);
    } catch (error) {
      toast.error("Failed to disconnect account");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Card className="bg-[#111120] border-[#1e1e2e] hover:border-[#2e2e3e] transition-all group overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-lg"
            style={{ backgroundColor: platform.color }}
          >
            {platform.icon}
          </div>
          {connectedAccount ? (
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[#64748b] border-[#1e1e2e]">
              Not Connected
            </Badge>
          )}
        </div>
        <CardTitle className="mt-4 text-lg font-bold">{platform.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {connectedAccount ? (
          <div className="space-y-1">
            <p className="text-sm text-[#94a3b8] font-medium truncate">
              {connectedAccount.accountName}
            </p>
            <p className="text-xs text-[#3f3f5a]">
              ID: {connectedAccount.id.slice(0, 8)}...
            </p>
          </div>
        ) : (
          <p className="text-sm text-[#64748b]">
            Connect your {platform.name} account to schedule posts and track analytics.
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {connectedAccount ? (
          <Button 
            variant="outline" 
            className="w-full border-[#1e1e2e] text-red-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
          >
            <Unlink className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        ) : (
          <Button 
            className="w-full bg-[#1a1a2e] border-[#2e2e3e] text-[#a5b4fc] hover:bg-[#252545] hover:text-white"
            onClick={handleConnect}
          >
            <Link2 className="w-4 h-4 mr-2" />
            Connect Account
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
