"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { clientFetch } from "@/lib/api-client";
import Image from "next/image";
import Link from "next/link";

interface Appointment {
  id: string;
  customerName: string;
  barberName: string;
  serviceName: string;
  startTime: string;
  status: string;
  notes: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  const isAdmin = (session as any)?.roles?.includes("ADMIN");

  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      fetchAppointments();
    } else if (status === "unauthenticated" || (status === "authenticated" && !isAdmin)) {
      setLoading(false);
    }
  }, [status, date, isAdmin]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await clientFetch(`/admin/appointments?date=${date}`);
      if (response.ok) {
        setAppointments(await response.json());
      }
    } catch (err) {
      console.error("Failed to fetch admin appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await clientFetch(`/admin/appointments/${id}/status?status=${newStatus}`, {
        method: "PATCH",
      });
      if (response.ok) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-5 text-center">
        <h1 className="font-serif text-4xl text-red-500">Access Denied</h1>
        <p className="mt-4 text-[#d0c5af]">You do not have the master credentials required to view this ritual log.</p>
        <Link href="/" className="mt-8 border border-[#d4af37] px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-20 pt-32 text-[#eae1d4]">
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-[#d4af37]/60 bg-[#050505]/95 px-5 py-4 backdrop-blur md:px-20">
        <Link href="/" className="relative block h-12 w-12 md:h-16 md:w-16 overflow-hidden rounded-full">
          <Image src="/images/2kcut-logo.png" alt="2KCUT Salon logo" width={64} height={64} className="h-full w-full rounded-full object-cover" unoptimized />
        </Link>
        <h1 className="font-serif text-xl md:text-2xl tracking-widest text-[#f2ca50]">MASTER DASHBOARD</h1>
        <div className="flex items-center gap-6">
           <input
             type="date"
             value={date}
             onChange={(e) => setDate(e.target.value)}
             className="bg-black border border-[#d4af37]/30 p-2 text-xs text-[#f2ca50] outline-none focus:border-[#f2ca50]"
           />
           <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0c5af] hover:text-[#f2ca50]">Exit</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 gap-8">
          {appointments.length === 0 ? (
            <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-20 text-center">
              <p className="text-xl text-[#d0c5af]">The ritual log is empty for this date.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
                    <th className="pb-6 pr-4">Time</th>
                    <th className="pb-6 pr-4">Customer</th>
                    <th className="pb-6 pr-4">Service</th>
                    <th className="pb-6 pr-4">Barber</th>
                    <th className="pb-6 pr-4">Status</th>
                    <th className="pb-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {appointments.map((app) => (
                    <tr key={app.id} className="group hover:bg-[#111]">
                      <td className="py-8 pr-4">
                        <p className="font-serif text-lg">{new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="py-8 pr-4">
                        <p className="font-bold text-[#eae1d4]">{app.customerName}</p>
                      </td>
                      <td className="py-8 pr-4">
                        <p className="text-sm text-[#d0c5af]">{app.serviceName}</p>
                      </td>
                      <td className="py-8 pr-4">
                        <p className="text-sm text-[#d0c5af]">{app.barberName}</p>
                      </td>
                      <td className="py-8 pr-4">
                        <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${
                          app.status === 'CONFIRMED' ? 'bg-green-900/40 text-green-400 border border-green-400/30' :
                          app.status === 'PENDING' ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-400/30' :
                          app.status === 'CANCELLED' ? 'bg-red-900/40 text-red-400 border border-red-400/30' :
                          'bg-blue-900/40 text-blue-400 border border-blue-400/30'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-8 text-right">
                        <div className="flex justify-end gap-3">
                          {app.status === 'PENDING' && (
                            <button onClick={() => updateStatus(app.id, 'CONFIRMED')} className="text-[10px] font-bold uppercase text-green-500 hover:underline">Confirm</button>
                          )}
                          {app.status === 'CONFIRMED' && (
                            <button onClick={() => updateStatus(app.id, 'COMPLETED')} className="text-[10px] font-bold uppercase text-blue-500 hover:underline">Complete</button>
                          )}
                          {app.status !== 'CANCELLED' && (
                            <button onClick={() => updateStatus(app.id, 'CANCELLED')} className="text-[10px] font-bold uppercase text-red-500 hover:underline">Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
