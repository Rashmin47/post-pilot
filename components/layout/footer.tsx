import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] bg-[#050508] py-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <Link href="/" className="text-xl font-bold gradient-text">
            PostPilot
          </Link>
          <p className="text-sm text-[#64748b]">
            © 2026 PostPilot. All rights reserved.
          </p>
        </div>

        <div className="flex gap-8 text-sm text-[#64748b]">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/support" className="hover:text-white transition-colors">Support</Link>
          <Link href="/status" className="hover:text-white transition-colors">Status</Link>
        </div>
      </div>
    </footer>
  );
}
