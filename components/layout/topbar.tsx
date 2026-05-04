"use client";

import { usePathname } from "next/navigation";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Topbar() {
  const pathname = usePathname();
  
  // Map pathname to title
  const getTitle = (path: string) => {
    const parts = path.split("/");
    const lastPart = parts[parts.length - 1];
    if (!lastPart || lastPart === "dashboard") return "Dashboard";
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace("-", " ");
  };

  return (
    <header className="h-20 border-b border-[#1e1e2e] flex items-center justify-between px-8 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-10">
      <h1 className="text-xl font-bold">{getTitle(pathname)}</h1>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-lg border border-[#1e1e2e] bg-[#111120] flex items-center justify-center text-[#64748b] hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#6366f1] rounded-full border-2 border-[#111120]" />
        </button>

        <Link href="/dashboard/compose">
          <Button className="gradient-bg hover:opacity-90 transition-opacity font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>
    </header>
  );
}
