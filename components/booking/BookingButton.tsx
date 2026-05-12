"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import BookingModal from "./BookingModal";

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
      <button onClick={handleBooking} className={className}>
        {children || "Book Now"}
      </button>

      {isOpen && <BookingModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
