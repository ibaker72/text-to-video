"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, LayoutGrid, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/studio", label: "Studio", icon: Zap },
  { href: "/vault",  label: "Vault",  icon: LayoutGrid },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-5">
        <Film className="h-5 w-5 text-violet-400" />
        <span className="text-sm font-semibold tracking-tight text-white">Motif Vault</span>
      </div>
      <nav className="flex flex-col gap-1 p-2 pt-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
