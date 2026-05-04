"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Account {
  id: string;
  platform: string;
  accountName: string;
}

interface PlatformSelectorProps {
  accounts: Account[];
  selectedAccountIds: string[];
  onChange: (ids: string[]) => void;
}

const platformIcons: Record<string, { icon: string; color: string }> = {
  instagram: { icon: "📸", color: "#e1306c" },
  youtube: { icon: "📺", color: "#ff0000" },
  facebook: { icon: "👤", color: "#1877f2" },
  linkedin: { icon: "💼", color: "#0a66c2" },
  pinterest: { icon: "📌", color: "#e60023" },
  discord: { icon: "💬", color: "#5865f2" },
  twitter: { icon: "🐦", color: "#000000" },
  slack: { icon: "🏘️", color: "#4a154b" },
};

export function PlatformSelector({ accounts, selectedAccountIds, onChange }: PlatformSelectorProps) {
  const toggleAccount = (id: string) => {
    if (selectedAccountIds.includes(id)) {
      onChange(selectedAccountIds.filter((i) => i !== id));
    } else {
      onChange([...selectedAccountIds, id]);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-[#111120] border border-[#1e1e2e] text-center">
        <p className="text-sm text-[#64748b]">No accounts connected yet. Please connect an account in the Accounts tab.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {accounts.map((account) => {
        const isSelected = selectedAccountIds.includes(account.id);
        const config = platformIcons[account.platform] || { icon: "🌐", color: "#6366f1" };

        return (
          <button
            key={account.id}
            type="button"
            onClick={() => toggleAccount(account.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all duration-200 cursor-pointer",
              isSelected
                ? "bg-[#1a1a2e] border-[#6366f1] text-[#a5b4fc]"
                : "bg-[#0d0d1a] border-[#1e1e2e] text-[#64748b] hover:border-[#2e2e3e]"
            )}
          >
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: config.color }} 
            />
            <span className="text-sm font-medium">
              {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} ({account.accountName})
            </span>
            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#6366f1]" />}
          </button>
        );
      })}
    </div>
  );
}
