"use client";

import { useBooking } from "../BookingContext";
import { useServices } from "@/hooks/use-booking";

export default function ServiceStep() {
  const { state, setSelectedService, nextStep } = useBooking();
  const { services, loading } = useServices();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            setSelectedService(s);
            nextStep();
          }}
          className={`group text-left border border-outline-variant bg-surface-container-low transition-all hover:border-primary p-6 ${
            state.selectedService?.id === s.id
              ? "border-primary ring-1 ring-primary"
              : ""
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              content_cut
            </span>
            <div className="text-right">
              <p className="font-serif text-lg text-primary">Rs. {s.price}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                {s.durationMinutes} MIN
              </p>
            </div>
          </div>
          <h3 className="font-serif text-xl text-on-surface mb-2 group-hover:text-primary transition-colors">
            {s.name}
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
            {s.description}
          </p>
        </button>
      ))}
    </div>
  );
}
