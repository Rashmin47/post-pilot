"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold gradient-text">
        PostPilot
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94a3b8]">
        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
        <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        <Link href="#blog" className="hover:text-white transition-colors">Blog</Link>
        <Link href="#docs" className="hover:text-white transition-colors">Docs</Link>
      </div>

      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost" className="text-[#94a3b8] hover:text-white">
              Log in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="gradient-bg hover:opacity-90 transition-opacity font-semibold">
              Get Started Free
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link href="/dashboard">
            <Button className="gradient-bg hover:opacity-90 transition-opacity font-semibold">
              Dashboard
            </Button>
          </Link>
        </Show>
      </div>
    </nav>
  );
}
