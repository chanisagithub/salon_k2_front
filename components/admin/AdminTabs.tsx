"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Appointments" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/barbers", label: "Barbers" },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-10 flex flex-wrap gap-2 border-b border-[#2a2a2a]">
      {TABS.map((tab) => {
        const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
              active
                ? "border-[#d4af37] text-[#f2ca50]"
                : "border-transparent text-[#d0c5af] hover:text-[#f2ca50]"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
