"use client";

import { useRef, useState, Suspense } from "react";
import gsap from "gsap";
import { clientFetch } from "@/lib/api-client";
import { BookingProvider, useBooking } from "@/components/booking/BookingContext";
import ServiceStep from "@/components/booking/steps/ServiceStep";
import BarberStep from "@/components/booking/steps/BarberStep";
import ScheduleStep from "@/components/booking/steps/ScheduleStep";
import ReviewStep from "@/components/booking/steps/ReviewStep";
import SuccessStep from "@/components/booking/steps/SuccessStep";

const STEPS = [
  { id: 1, label: "Services", icon: "content_cut" },
  { id: 2, label: "Barber", icon: "person" },
  { id: 3, label: "Schedule", icon: "calendar_today" },
  { id: 4, label: "Review", icon: "fact_check" },
];

function BookingFlowOrchestrator() {
  const { state, nextStep, prevStep } = useBooking();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    if (state.step === 4) {
      await handleSubmit();
      return;
    }

    gsap.to(contentRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.3,
      onComplete: () => {
        nextStep();
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
        );
      },
    });
  };

  const handleBack = () => {
    gsap.to(contentRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.3,
      onComplete: () => {
        prevStep();
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
        );
      },
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const startTime = `${state.date}T${state.selectedTime}+05:30`;
      const response = await clientFetch("/booking/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: state.selectedService?.id,
          barberId: state.selectedBarber?.id,
          startTime,
          notes: state.notes,
        }),
      });

      if (response.ok) {
        nextStep();
      } else {
        const data = await response.json();
        setError(data.message || "Booking failed. Please check availability.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-background font-sans antialiased min-h-screen">
      {/* Side Navigation (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant py-10 px-6 shrink-0 h-screen sticky top-0">
        <div className="mb-12">
          <h2 className="font-serif text-xl text-primary mb-1">Booking Flow</h2>
          <p className="text-xs text-on-surface-variant">Premium Grooming</p>
        </div>

        <nav className="flex flex-col gap-1">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 py-3 px-3 transition-all duration-300 ${
                state.step === s.id
                  ? "text-primary font-bold border-l-2 border-primary bg-surface-variant/10"
                  : "text-on-surface-variant"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  state.step === s.id ? "fill-1" : ""
                }`}
              >
                {s.icon}
              </span>
              <span className="text-sm">{s.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-background p-6 lg:p-12 overflow-x-hidden">
        <div ref={contentRef} className="max-w-4xl mx-auto flex flex-col h-full">
          {state.step < 5 && (
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-serif text-3xl md:text-4xl text-on-background mb-2 uppercase tracking-tight">
                {state.step === 1 && "Select Excellence"}
                {state.step === 2 && "The Master Craftsman"}
                {state.step === 3 && "Timing is Everything"}
                {state.step === 4 && "Review & Confirm"}
              </h1>
              <p className="text-on-surface-variant text-base">
                Step {state.step} of 4: {STEPS[state.step - 1].label}
              </p>
            </div>
          )}

          <div className="flex-1">
            {state.step === 1 && <ServiceStep />}
            {state.step === 2 && <BarberStep />}
            {state.step === 3 && <ScheduleStep />}
            {state.step === 4 && <ReviewStep />}
            {state.step === 5 && <SuccessStep />}
          </div>

          {/* Action Buttons */}
          {state.step < 5 && (
            <div className="mt-8 flex justify-between items-center border-t border-outline-variant pt-6">
              <button
                onClick={handleBack}
                className={`text-[9px] font-bold uppercase tracking-[0.3em] px-6 py-3 border border-outline-variant transition-all hover:border-primary hover:text-primary ${
                  state.step === 1 ? "opacity-0 pointer-events-none" : ""
                }`}
              >
                Back
              </button>

              <button
                disabled={
                  loading ||
                  (state.step === 1 && !state.selectedService) ||
                  (state.step === 2 && !state.selectedBarber) ||
                  (state.step === 3 && (!state.date || !state.selectedTime))
                }
                onClick={handleNext}
                className="bg-primary-container text-black px-10 py-3 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Confirming..." : state.step === 4 ? "Confirm Booking" : "Continue"}
              </button>
            </div>
          )}
          
          {error && <p className="text-center text-xs text-red-500 mt-4 font-bold">{error}</p>}
        </div>

        <style jsx global>{`
          .fill-1 {
            font-variation-settings: "FILL" 1;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #110e07;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4d4635;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #d4af37;
          }
        `}</style>
      </main>
    </div>
  );
}

export default function BookingFlowPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <BookingProvider>
        <BookingFlowOrchestrator />
      </BookingProvider>
    </Suspense>
  );
}
