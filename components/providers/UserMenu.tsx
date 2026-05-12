"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const isAdmin = (session as any)?.roles?.includes("ADMIN");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-3 group">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
              {user.name}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
              {isAdmin ? "Master Admin" : "Client"}
            </span>
          </div>
          <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary transition-all duration-300">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel>Account Rituals</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <Link href="/bookings">
          <DropdownMenuItem>
            <span className="material-symbols-outlined mr-3 text-sm">calendar_today</span>
            My Rituals
          </DropdownMenuItem>
        </Link>

        {isAdmin && (
          <Link href="/admin">
            <DropdownMenuItem>
              <span className="material-symbols-outlined mr-3 text-sm">admin_panel_settings</span>
              Master Dashboard
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-red-400 focus:text-red-400"
        >
          <span className="material-symbols-outlined mr-3 text-sm">logout</span>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
