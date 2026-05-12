"use client";

import { useBooking } from "../BookingContext";

export default function ReviewStep() {
  const { state, setNotes } = useBooking();

  return (
    <div className="w-full">
      <div className="bg-surface-container-low border border-outline-variant p-6 md:p-8 mb-8 flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              content_cut
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                SERVICE
              </p>
              <p className="font-serif text-lg text-on-surface">
                {state.selectedService?.name}
              </p>
            </div>
          </div>
          <span className="font-serif text-lg text-primary">
            Rs. {state.selectedService?.price}
          </span>
        </div>

        <div className="flex items-center gap-4 border-b border-outline-variant/20 pb-4">
          <span className="material-symbols-outlined text-primary text-2xl">
            person
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
              BARBER
            </p>
            <p className="font-serif text-lg text-on-surface">
              Master {state.selectedBarber?.firstName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-outline-variant/20 pb-4">
          <span className="material-symbols-outlined text-primary text-2xl">
            calendar_today
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
              DATE & TIME
            </p>
            <p className="font-serif text-lg text-on-surface uppercase">
              {state.date &&
                new Date(state.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
              at {state.selectedTime.substring(0, 5)}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-serif text-xl text-on-surface">Total</span>
          <span className="font-serif text-xl text-primary">
            Rs. {state.selectedService?.price}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <label
          className="block text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2"
          htmlFor="notes"
        >
          SPECIAL NOTES
        </label>
        <input
          id="notes"
          type="text"
          value={state.notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific requests?"
          className="w-full bg-transparent border-0 border-b border-outline-variant py-2 text-base text-on-surface outline-none focus:border-primary transition-all"
        />
      </div>
    </div>
  );
}
