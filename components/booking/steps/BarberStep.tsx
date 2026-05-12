"use client";

import Image from "next/image";
import { useBooking } from "../BookingContext";
import { useBarbers } from "@/hooks/use-booking";

export default function BarberStep() {
  const { state, setSelectedBarber, nextStep } = useBooking();
  const { barbers, loading } = useBarbers();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {barbers.map((b) => (
        <button
          key={b.id}
          onClick={() => {
            setSelectedBarber(b);
            nextStep();
          }}
          className={`group relative text-left border border-outline-variant bg-surface-container-low transition-all hover:border-primary ${
            state.selectedBarber?.id === b.id
              ? "border-primary ring-1 ring-primary"
              : ""
          }`}
        >
          <div className="aspect-video relative overflow-hidden bg-[#111]">
            {b.profileImageUrl ? (
              <Image
                src={b.profileImageUrl}
                alt={b.firstName}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-primary/20 text-4xl font-serif">
                {b.firstName[0]}
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="font-serif text-xl text-on-surface mb-1 group-hover:text-primary transition-colors">
              {b.firstName} {b.lastName}
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Master Barber
            </p>
            <p className="text-xs text-on-surface-variant italic line-clamp-2">
              &quot;{b.bio}&quot;
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
