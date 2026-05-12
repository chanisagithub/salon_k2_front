"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Service, Barber } from "@/hooks/use-booking";

interface BookingState {
  step: number;
  selectedService: Service | null;
  selectedBarber: Barber | null;
  date: string;
  selectedTime: string;
  notes: string;
}

interface BookingContextType {
  state: BookingState;
  setStep: (step: number) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedBarber: (barber: Barber | null) => void;
  setDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setNotes: (notes: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>({
    step: 1,
    selectedService: null,
    selectedBarber: null,
    date: "",
    selectedTime: "",
    notes: "",
  });

  const setStep = (step: number) => setState((prev) => ({ ...prev, step }));
  const setSelectedService = (selectedService: Service | null) => 
    setState((prev) => ({ ...prev, selectedService }));
  const setSelectedBarber = (selectedBarber: Barber | null) => 
    setState((prev) => ({ ...prev, selectedBarber }));
  const setDate = (date: string) => setState((prev) => ({ ...prev, date }));
  const setSelectedTime = (selectedTime: string) => 
    setState((prev) => ({ ...prev, selectedTime }));
  const setNotes = (notes: string) => setState((prev) => ({ ...prev, notes }));

  const nextStep = () => setStep(state.step + 1);
  const prevStep = () => setStep(Math.max(1, state.step - 1));

  return (
    <BookingContext.Provider
      value={{
        state,
        setStep,
        setSelectedService,
        setSelectedBarber,
        setDate,
        setSelectedTime,
        setNotes,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
