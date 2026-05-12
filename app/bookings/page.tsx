"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { clientFetch } from "@/lib/api-client";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

interface Appointment {
  id: string;
  barberName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetchAppointments();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const fetchAppointments = async () => {
    try {
      const response = await clientFetch("/booking/my-appointments");
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        setError("Failed to load your rituals.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this grooming ritual?")) return;

    try {
      const response = await clientFetch(`/booking/appointments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "CANCELLED" } : app
          )
        );
        gsap.to(`#app-${id}`, {
          opacity: 0.5,
          scale: 0.98,
          duration: 0.5,
        });
      } else {
        const data = await response.json();
        alert(data.message || "Could not cancel appointment.");
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-5 text-center">
        <h1 className="font-serif text-4xl text-[#eae1d4]">Identify Yourself</h1>
        <p className="mt-4 text-[#d0c5af]">Please log in to view your scheduled rituals.</p>
        <Link
          href="/"
          className="mt-8 border border-[#d4af37] px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-20 pt-32 text-[#eae1d4]">
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-[#d4af37]/60 bg-[#050505]/95 px-5 py-4 backdrop-blur md:px-20">
        <Link href="/" className="relative block h-12 w-12 md:h-16 md:w-16 overflow-hidden rounded-full">
          <Image
            src="/images/2kcut-logo.png"
            alt="2KCUT Salon logo"
            width={64}
            height={64}
            className="h-full w-full rounded-full object-cover"
            unoptimized
          />
        </Link>
        <h1 className="font-serif text-xl md:text-2xl tracking-widest text-[#f2ca50]">MY RITUALS</h1>
        <Link
          href="/"
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0c5af] hover:text-[#f2ca50]"
        >
          Back Home
        </Link>
      </nav>

      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f2ca50]">Scheduled Sessions</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">Your Grooming Timeline</h2>
        </div>

        {appointments.length === 0 ? (
          <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-12 text-center">
            <p className="text-lg text-[#d0c5af]">No rituals scheduled yet.</p>
            <Link
              href="/"
              className="mt-6 inline-block bg-[#d4af37] px-8 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#f2ca50] transition-all"
            >
              Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((app) => (
              <div
                key={app.id}
                id={`app-${app.id}`}
                className="group relative overflow-hidden border border-[#2a2a2a] bg-[#0a0a0a] p-6 transition-all hover:border-[#d4af37]/50 md:p-10"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${
                        app.status === 'PENDING' ? 'bg-yellow-500' : 
                        app.status === 'CONFIRMED' ? 'bg-green-500' : 
                        app.status === 'CANCELLED' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/70">
                        {app.status}
                      </p>
                    </div>
                    <h3 className="mt-2 font-serif text-2xl md:text-3xl text-[#eae1d4]">{app.serviceName}</h3>
                    <p className="mt-1 text-sm text-[#d0c5af]">with Master {app.barberName}</p>
                  </div>

                  <div className="flex flex-col gap-2 md:text-right">
                    <p className="font-serif text-xl text-[#f2ca50]">
                      {new Date(app.startTime).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-lg text-[#eae1d4]">
                      {new Date(app.startTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                </div>

                {app.notes && (
                  <div className="mt-6 border-t border-[#2a2a2a] pt-6">
                    <p className="text-[9px] uppercase tracking-widest text-[#d4af37]/40">Special Notes</p>
                    <p className="mt-2 text-sm italic text-[#d0c5af]">{app.notes}</p>
                  </div>
                )}

                {app.status !== 'CANCELLED' && app.status !== 'COMPLETED' && (
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => handleCancel(app.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      Cancel Ritual
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
