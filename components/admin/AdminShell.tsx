"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { sessionHasRole } from "@/lib/session-claims";
import AdminTabs from "./AdminTabs";

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const isAdmin = sessionHasRole(session, "ADMIN");

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-5 text-center">
        <h1 className="font-serif text-4xl text-red-500">Access Denied</h1>
        <p className="mt-4 text-[#d0c5af]">You do not have the master credentials required to view this area.</p>
        <Link
          href="/"
          className="mt-8 border border-[#d4af37] px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-20 pt-32 text-[#eae1d4]">
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-[#d4af37]/60 bg-[#050505]/95 px-5 py-4 backdrop-blur md:px-20">
        <Link href="/" className="relative block h-12 w-12 md:h-16 md:w-16 overflow-hidden rounded-full">
          <Image src="/images/2kcut-logo.png" alt="2KCUT Salon logo" width={64} height={64} className="h-full w-full rounded-full object-cover" unoptimized />
        </Link>
        <h1 className="font-serif text-xl md:text-2xl tracking-widest text-[#f2ca50]">{title}</h1>
        <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0c5af] hover:text-[#f2ca50]">
          Exit
        </Link>
      </nav>

      <div className="mx-auto max-w-7xl px-5">
        <AdminTabs />
        {children}
      </div>
    </main>
  );
}
