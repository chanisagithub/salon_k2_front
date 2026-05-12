"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBooking } from "../BookingContext";
import { useSlots } from "@/hooks/use-booking";

export default function ScheduleStep() {
  const { state, setDate, setSelectedTime } = useBooking();
  const { slots, loading: fetchingSlots } = useSlots(
    state.selectedBarber?.id,
    state.selectedService?.id,
    state.date
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-surface-container-low border border-outline-variant p-6">
        <p className="font-bold uppercase tracking-widest text-primary text-[10px] mb-4">
          Select Date
        </p>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center justify-between bg-background border border-outline-variant p-4 text-sm font-medium transition-colors hover:border-primary text-left",
                !state.date && "text-on-surface-variant"
              )}
            >
              {state.date ? (
                format(new Date(state.date), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-2 h-4 w-4 text-primary" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={state.date ? new Date(state.date) : undefined}
              onSelect={(d) => {
                if (d) {
                  const formatted = format(d, "yyyy-MM-dd");
                  setDate(formatted);
                }
              }}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                date > new Date(new Date().setMonth(new Date().getMonth() + 2))
              }
            />
          </PopoverContent>
        </Popover>

        <p className="mt-6 text-[10px] text-on-surface-variant leading-relaxed italic">
          Choose your preferred date. Our master barbers are available during
          standard salon hours.
        </p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant p-6 flex flex-col">
        <p className="font-bold uppercase tracking-widest text-primary text-[10px] mb-4">
          Available Times
        </p>

        {!state.date ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-8">
            <span className="material-symbols-outlined text-3xl mb-2">
              calendar_month
            </span>
            <p className="text-[10px] uppercase tracking-widest">Select a date</p>
          </div>
        ) : fetchingSlots ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[250px] pr-1 custom-scrollbar">
            {slots.map((slot, i) => (
              <button
                key={i}
                disabled={!slot.isAvailable}
                onClick={() => setSelectedTime(slot.startTime)}
                className={`py-3 px-2 text-xs font-bold transition-all border ${
                  state.selectedTime === slot.startTime
                    ? "border-primary bg-primary-container text-on-primary-container"
                    : slot.isAvailable
                    ? "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                    : "border-outline-variant/10 text-outline-variant/30 cursor-not-allowed line-through"
                }`}
              >
                {slot.startTime.substring(0, 5)}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-red-400 py-8">
            <p className="text-[10px] uppercase tracking-widest">
              No availability
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
