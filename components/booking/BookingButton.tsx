"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import BookingModal from "./BookingModal";

import { cn } from "@/lib/utils";

interface BookingButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function BookingButton({ className, children }: BookingButtonProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      signIn("keycloak");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button 
        onClick={handleBooking} 
        className={cn("cursor-pointer", className)}
      >
        {children || (session ? "Book" : "Sign In")}
      </button>

      {isOpen && <BookingModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
