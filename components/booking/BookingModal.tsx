"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { clientFetch } from "@/lib/api-client";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

interface Barber {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  profileImageUrl: string;
}

interface Slot {
  startTime: string; // e.g. "09:00:00"
  isAvailable: boolean;
}

const STEPS = [
  { id: 1, label: "Services", icon: "content_cut" },
  { id: 2, label: "Barber", icon: "person" },
  { id: 3, label: "Schedule", icon: "calendar_today" },
  { id: 4, label: "Review", icon: "fact_check" },
];

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Reveal full screen backdrop/modal
    gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    
    const fetchData = async () => {
      try {
        const sRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/services`);
        const bRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/barbers`);
        if (sRes.ok) setServices(await sRes.json());
        if (bRes.ok) setBarbers(await bRes.json());
      } catch (err) {
        console.error("Failed to fetch booking data", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (date && selectedBarber && selectedService) {
      fetchSlots();
    }
  }, [date, selectedBarber, selectedService]);

  const fetchSlots = async () => {
    setFetchingSlots(true);
    setSelectedTime("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/slots?barberId=${selectedBarber?.id}&serviceId=${selectedService?.id}&date=${date}`
      );
      if (response.ok) {
        setSlots(await response.json());
      }
    } catch (err) {
      console.error("Failed to fetch slots", err);
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleNext = () => {
    if (step === 4) {
      handleSubmit();
      return;
    }
    
    gsap.to(contentRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.3,
      onComplete: () => {
        setStep(prev => prev + 1);
        gsap.fromTo(contentRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
      },
    });
  };

  const handleBack = () => {
    if (step === 1) return;
    
    gsap.to(contentRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.3,
      onComplete: () => {
        setStep(prev => prev - 1);
        gsap.fromTo(contentRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
      },
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const startTime = `${date}T${selectedTime}+05:30`;
      
      const response = await clientFetch("/booking/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService?.id,
          barberId: selectedBarber?.id,
          startTime,
          notes
        }),
      });

      if (response.ok) {
        setStep(5);
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

  const closeWithAnim = () => {
    gsap.to(modalRef.current, { opacity: 0, duration: 0.4, onComplete: onClose });
  };

  return (
    <div ref={modalRef} className="fixed inset-0 z-[100] flex flex-col lg:flex-row bg-background font-sans antialiased overflow-hidden">
      {/* Top Header (Mobile) */}
      <header className="lg:hidden flex justify-between items-center h-20 px-5 border-b border-outline-variant bg-background shrink-0">
        <div className="font-serif text-xl uppercase tracking-widest text-primary">2KCUT SALON</div>
        <button onClick={closeWithAnim} className="text-primary hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
      </header>

      {/* Side Navigation (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-surface-container-low border-r border-outline-variant py-10 px-8 shrink-0">
        <div className="mb-12">
          <h2 className="font-serif text-2xl text-primary mb-1">Booking Flow</h2>
          <p className="text-sm text-on-surface-variant">Premium Grooming</p>
        </div>

        <nav className="flex flex-col gap-2">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-4 py-3 px-4 transition-all duration-300 ${
                step === s.id 
                  ? "text-primary font-bold border-l-4 border-primary bg-surface-variant/20" 
                  : "text-on-surface-variant"
              }`}
            >
              <span className={`material-symbols-outlined ${step === s.id ? "fill-1" : ""}`}>
                {s.icon}
              </span>
              <span className="text-base">{s.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-10">
          <button onClick={closeWithAnim} className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined">logout</span>
            Exit Booking
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-background">
        <div ref={contentRef} className="max-w-4xl mx-auto px-5 py-12 md:py-20 flex flex-col h-full">
          
          {step < 5 && (
            <div className="mb-12 text-center md:text-left">
              <h1 className="font-serif text-4xl md:text-5xl text-on-background mb-3">
                {step === 1 && "Select Excellence"}
                {step === 2 && "The Master Craftsman"}
                {step === 3 && "Timing is Everything"}
                {step === 4 && "Review & Confirm"}
              </h1>
              <p className="text-on-surface-variant text-lg">
                Step {step} of 4: {STEPS[step - 1].label} your appointment
              </p>
            </div>
          )}

          <div className="flex-1">
            {/* STEP 1: SERVICES */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s); handleNext(); }}
                    className={`group text-left border border-outline-variant bg-surface-container-low transition-all hover:border-primary hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col ${
                      selectedService?.id === s.id ? "border-primary ring-1 ring-primary" : ""
                    }`}
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <span className="material-symbols-outlined text-primary text-3xl">content_cut</span>
                        <div className="text-right">
                          <p className="font-serif text-2xl text-primary">Rs. {s.price}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{s.durationMinutes} MIN</p>
                        </div>
                      </div>
                      <h3 className="font-serif text-2xl text-on-surface mb-3 group-hover:text-primary transition-colors">{s.name}</h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">{s.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: BARBER */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {barbers.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBarber(b); handleNext(); }}
                    className={`group relative text-left border border-outline-variant bg-surface-container-low transition-all hover:border-primary hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col ${
                      selectedBarber?.id === b.id ? "border-primary ring-1 ring-primary" : ""
                    }`}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-[#111]">
                      {b.profileImageUrl ? (
                        <Image src={b.profileImageUrl} alt={b.firstName} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary/20 text-6xl font-serif">{b.firstName[0]}</div>
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="font-serif text-2xl text-on-surface mb-1 group-hover:text-primary transition-colors">{b.firstName} {b.lastName}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Master Barber</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed italic line-clamp-2">&quot;{b.bio}&quot;</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3: SCHEDULE */}
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar Side */}
                <div className="bg-surface-container-low border border-outline-variant p-8">
                  <div className="flex justify-between items-center mb-6">
                    <p className="font-bold uppercase tracking-widest text-primary text-xs">Select Date</p>
                  </div>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background border border-outline-variant p-4 text-on-surface outline-none focus:border-primary transition-colors"
                  />
                  <p className="mt-6 text-xs text-on-surface-variant leading-relaxed">
                    Choose your preferred date. Our master barbers are available during standard salon hours.
                  </p>
                </div>

                {/* Slots Side */}
                <div className="bg-surface-container-low border border-outline-variant p-8 flex flex-col">
                  <p className="font-bold uppercase tracking-widest text-primary text-xs mb-6">Available Times</p>
                  
                  {!date ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                      <span className="material-symbols-outlined text-4xl mb-3">calendar_month</span>
                      <p className="text-sm uppercase tracking-widest">Select a date first</p>
                    </div>
                  ) : fetchingSlots ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
                    </div>
                  ) : slots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                      {slots.map((slot, i) => (
                        <button
                          key={i}
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedTime(slot.startTime)}
                          className={`py-4 px-4 text-sm font-bold transition-all border ${
                            selectedTime === slot.startTime
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
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-red-400">
                      <p className="text-sm uppercase tracking-widest">No availability on this day</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW */}
            {step === 4 && (
              <div className="max-w-2xl mx-auto w-full">
                <div className="bg-[#1A1A1A] border border-outline-variant p-8 md:p-12 mb-10 flex flex-col gap-10">
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-6">
                    <div className="flex items-center gap-5">
                      <span className="material-symbols-outlined text-primary text-3xl">content_cut</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">SERVICE</p>
                        <p className="font-serif text-xl text-on-surface">{selectedService?.name}</p>
                      </div>
                    </div>
                    <span className="font-serif text-xl text-primary">Rs. {selectedService?.price}</span>
                  </div>

                  <div className="flex items-center gap-5 border-b border-outline-variant/30 pb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">person</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">BARBER</p>
                      <p className="font-serif text-xl text-on-surface">Master {selectedBarber?.firstName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 border-b border-outline-variant/30 pb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">calendar_today</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">DATE & TIME</p>
                      <p className="font-serif text-xl text-on-surface uppercase">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at {selectedTime.substring(0, 5)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-serif text-2xl text-on-surface">Total Due at Salon</span>
                    <span className="font-serif text-2xl text-primary">Rs. {selectedService?.price}</span>
                  </div>
                </div>

                <div className="mb-12">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-4" htmlFor="notes">
                    SPECIAL NOTES (OPTIONAL)
                  </label>
                  <input
                    id="notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific requests or requirements?"
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-4 text-lg text-on-surface outline-none focus:border-primary transition-all"
                  />
                </div>
                {error && <p className="text-center text-sm text-red-500 mb-6 font-bold">{error}</p>}
              </div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary text-primary mb-10">
                  <span className="material-symbols-outlined text-5xl">done_all</span>
                </div>
                <h2 className="font-serif text-4xl text-on-surface mb-6 uppercase tracking-wider">Your Ritual is Set</h2>
                <p className="text-lg leading-relaxed text-on-surface-variant mb-12 italic">
                  &quot;Grooming is the secret of real elegance.&quot; <br/>
                  We have secured your appointment with Master {selectedBarber?.firstName}. We look forward to seeing you at 2KCUT.
                </p>
                <button
                  onClick={closeWithAnim}
                  className="bg-primary-container px-16 py-5 text-xs font-bold uppercase tracking-[0.3em] text-black hover:bg-primary transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                >
                  Return to Salon
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {step < 5 && (
            <div className="mt-12 flex justify-between items-center border-t border-outline-variant pt-10">
              <button
                onClick={handleBack}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] px-8 py-4 border border-outline-variant transition-all hover:border-primary hover:text-primary ${
                  step === 1 ? "opacity-0 pointer-events-none" : ""
                }`}
              >
                Back
              </button>
              
              <button
                disabled={
                  loading || 
                  (step === 1 && !selectedService) || 
                  (step === 2 && !selectedBarber) || 
                  (step === 3 && (!date || !selectedTime))
                }
                onClick={handleNext}
                className="bg-primary-container text-black px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]"
              >
                {loading ? "Confirming..." : step === 4 ? "Confirm Booking" : "Continue"}
              </button>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .fill-1 {
          font-variation-settings: 'FILL' 1;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
    </div>
  );
}
