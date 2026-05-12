"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  if (!session) {
    return (
      <button
        onClick={() => signIn("keycloak")}
        className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#d0c5af] transition-colors hover:text-[#f2ca50]"
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#f2ca50] transition-colors hover:text-[#eae1d4]"
      >
        <span className="hidden md:inline">Account</span>
        <div className="h-6 w-6 rounded-full border border-[#d4af37] bg-[#1a1a1a] flex items-center justify-center text-[10px]">
          {session.user?.name?.[0] || "U"}
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-4 w-48 border border-[#d4af37]/30 bg-[#0a0a0a] p-2 shadow-xl z-20"
          >
            <div className="px-4 py-3 border-b border-[#2a2a2a] mb-2">
              <p className="text-[10px] text-[#d4af37]/60 uppercase tracking-widest">Signed in as</p>
              <p className="text-xs font-bold text-[#eae1d4] truncate">{session.user?.name || session.user?.email}</p>
            </div>
            <Link
              href="/bookings"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] hover:bg-[#1a1a1a] hover:text-[#f2ca50] transition-colors"
            >
              My Bookings
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-[#1a1a1a] transition-colors"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
