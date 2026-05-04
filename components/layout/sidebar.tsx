"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PenSquare,
  History,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Link2,
  CreditCard,
  Settings,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "Main" },
  { name: "Compose", href: "/dashboard/compose", icon: PenSquare, section: "Main" },
  { name: "Scheduled Posts", href: "/dashboard/posts", icon: History, section: "Main" },
  { name: "Media Library", href: "/dashboard/media", icon: ImageIcon, section: "Main" },
  { name: "Auto-Reply Rules", href: "/dashboard/auto-reply", icon: MessageSquare, section: "Automation" },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, section: "Automation" },
  { name: "Connected Accounts", href: "/dashboard/accounts", icon: Link2, section: "Account" },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard, section: "Account" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, section: "Account" },
];

const sections = ["Main", "Automation", "Account"];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="w-64 bg-[#0d0d1a] border-r border-[#1e1e2e] flex flex-col h-screen sticky top-0 hidden md:flex">
      <div className="p-6">
        <Link href="/dashboard" className="text-2xl font-bold gradient-text">
          PostPilot
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-8">
        {sections.map((section) => (
          <div key={section} className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-[#3f3f5a] uppercase tracking-wider">
              {section}
            </h3>
            {navigation
              .filter((item) => item.section === section)
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      isActive
                        ? "bg-[#1a1a2e] text-[#a5b4fc]"
                        : "text-[#64748b] hover:bg-[#111120] hover:text-[#94a3b8]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-[#6366f1]" : "text-[#2e2e4e] group-hover:text-[#64748b]"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1e1e2e] mt-auto">
        <div className="flex items-center gap-3 px-3 py-2">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8",
              },
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress}
            </span>
            <span className="text-xs text-[#6366f1] font-medium">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
