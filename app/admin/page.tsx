"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { clientFetch } from "@/lib/api-client";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { sessionHasRole } from "@/lib/session-claims";
import AdminTabs from "@/components/admin/AdminTabs";

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
  const { data: session, status: authStatus } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [date, setDate] = useState<string | undefined>(format(new Date(), "yyyy-MM-dd"));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    status: string;
    title: string;
    message: string;
  } | null>(null);

  const isAdmin = sessionHasRole(session, "ADMIN");

  const fetchAppointments = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (date) params.append("date", date);
      if (query) params.append("query", query);
      if (status) params.append("status", status);
      params.append("page", page.toString());
      params.append("size", "10");
      params.append("sort", "startTime,desc");

      const response = await clientFetch(`/admin/appointments?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch admin appointments", err);
    } finally {
      setLoading(false);
    }
  }, [date, query, status, page]);

  useEffect(() => {
    if (authStatus === "authenticated" && isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAppointments();
    }
  }, [authStatus, isAdmin, fetchAppointments]);

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
    } catch {
      alert("Failed to update status");
    }
  };

  if (authStatus === "loading" || (authStatus === "authenticated" && loading && appointments.length === 0)) {
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
           <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 bg-black border border-[#d4af37]/30 p-2 text-[10px] md:text-xs text-[#f2ca50] outline-none hover:border-[#f2ca50] transition-colors",
                  !date && "text-[#d0c5af]"
                )}
              >
                <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
                <span>{date ? format(new Date(date), "PPP") : "All Dates"}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-[#d4af37]/30 bg-[#0a0a0a]" align="end">
              <div className="flex flex-col">
                <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={(d) => {
                    if (d) {
                      setLoading(true);
                      const formatted = format(d, "yyyy-MM-dd");
                      setDate(formatted);
                      setPage(0);
                    }
                  }}
                />
                <button 
                  onClick={() => { setLoading(true); setDate(undefined); setPage(0); }}
                  className="border-t border-[#d4af37]/20 p-3 text-[10px] font-bold uppercase tracking-widest text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors"
                >
                  Clear Date
                </button>
              </div>
            </PopoverContent>
          </Popover>
           <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0c5af] hover:text-[#f2ca50]">Exit</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5">
        <AdminTabs />
        {/* Filters Bar */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/60">Search Rituals</label>
              <input 
                type="text"
                placeholder="Customer, Barber or Service..."
                value={query}
                onChange={(e) => { setLoading(true); setQuery(e.target.value); setPage(0); }}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] p-3 text-sm text-[#eae1d4] outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/60">Status</label>
              <select 
                value={status}
                onChange={(e) => { setLoading(true); setStatus(e.target.value); setPage(0); }}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] p-3 text-sm text-[#eae1d4] outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          
          {(query || status || date) && (
            <button 
              onClick={() => { setLoading(true); setQuery(""); setStatus(""); setDate(undefined); setPage(0); }}
              className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] hover:text-[#f2ca50] underline underline-offset-4"
            >
              Reset All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {loading && appointments.length === 0 ? (
             <div className="flex h-64 items-center justify-center border border-[#2a2a2a] bg-[#0a0a0a]">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#d4af37]"></div>
             </div>
          ) : appointments.length === 0 ? (
            <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-20 text-center">
              <p className="text-xl text-[#d0c5af]">No rituals found matching your criteria.</p>
              <button 
                onClick={() => { setLoading(true); setQuery(""); setStatus(""); setDate(undefined); setPage(0); }}
                className="mt-6 border border-[#d4af37]/30 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto border border-[#2a2a2a] bg-[#0a0a0a]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2a2a2a] text-[10px] font-bold uppercase tracking-[0.3em] text-[#f2ca50] bg-[#050505]">
                      <th className="p-6 pr-4">Time & Date</th>
                      <th className="p-6 pr-4">Customer</th>
                      <th className="p-6 pr-4">Service</th>
                      <th className="p-6 pr-4">Barber</th>
                      <th className="p-6 pr-4">Status</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a]">
                    {appointments.map((app) => (
                      <tr key={app.id} className="group hover:bg-[#111] transition-colors">
                        <td className="p-6 pr-4">
                          <p className="font-serif text-lg text-[#eae1d4]">{new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-[10px] uppercase tracking-widest text-[#d0c5af] mt-1">{format(new Date(app.startTime), "MMM dd, yyyy")}</p>
                        </td>
                        <td className="p-6 pr-4">
                          <p className="font-bold text-[#eae1d4]">{app.customerName}</p>
                        </td>
                        <td className="p-6 pr-4">
                          <p className="text-sm text-[#d0c5af]">{app.serviceName}</p>
                        </td>
                        <td className="p-6 pr-4">
                          <p className="text-sm text-[#d0c5af]">{app.barberName}</p>
                        </td>
                        <td className="p-6 pr-4">
                          <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${
                            app.status === 'CONFIRMED' ? 'bg-green-900/20 text-green-400 border border-green-400/20' :
                            app.status === 'PENDING' ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-400/20' :
                            app.status === 'CANCELLED' ? 'bg-red-900/20 text-red-400 border border-red-400/20' :
                            'bg-blue-900/20 text-blue-400 border border-blue-400/20'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {app.status === 'PENDING' && (
                              <button 
                                onClick={() => setConfirmModal({
                                  id: app.id,
                                  status: 'CONFIRMED',
                                  title: 'Confirm Ritual',
                                  message: `Are you sure you want to confirm the ritual for ${app.customerName}?`
                                })} 
                                className="text-[10px] font-bold uppercase text-green-500 hover:text-green-400"
                              >
                                Confirm
                              </button>
                            )}
                            {app.status === 'CONFIRMED' && (
                              <button 
                                onClick={() => setConfirmModal({
                                  id: app.id,
                                  status: 'COMPLETED',
                                  title: 'Complete Ritual',
                                  message: `Mark the ritual for ${app.customerName} as completed?`
                                })} 
                                className="text-[10px] font-bold uppercase text-blue-500 hover:text-blue-400"
                              >
                                Complete
                              </button>
                            )}
                            {app.status !== 'CANCELLED' && (
                              <button 
                                onClick={() => setConfirmModal({
                                  id: app.id,
                                  status: 'CANCELLED',
                                  title: 'Cancel Ritual',
                                  message: `Warning: This will cancel the ritual for ${app.customerName}. This action is logged.`
                                })} 
                                className="text-[10px] font-bold uppercase text-red-500 hover:text-red-400"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-8">
                  <p className="text-[10px] uppercase tracking-widest text-[#d0c5af]">
                    Page {page + 1} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      disabled={page === 0}
                      onClick={() => { setLoading(true); setPage(p => p - 1); }}
                      className="border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#eae1d4] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#d4af37] transition-colors"
                    >
                      Previous
                    </button>
                    <button 
                      disabled={page >= totalPages - 1}
                      onClick={() => { setLoading(true); setPage(p => p + 1); }}
                      className="border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#eae1d4] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#d4af37] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setConfirmModal(null)}
          />
          <div className="relative w-full max-w-md border border-[#d4af37]/30 bg-[#0a0a0a] p-8 shadow-2xl">
            <h2 className="font-serif text-2xl text-[#f2ca50]">{confirmModal.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#d0c5af]">
              {confirmModal.message}
            </p>
            <div className="mt-8 flex justify-end gap-4">
              <button 
                onClick={() => setConfirmModal(null)}
                className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] hover:text-[#eae1d4]"
              >
                Go Back
              </button>
              <button 
                onClick={() => {
                  updateStatus(confirmModal.id, confirmModal.status);
                  setConfirmModal(null);
                }}
                className={`px-8 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  confirmModal.status === 'CANCELLED' 
                    ? 'bg-red-900/20 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white' 
                    : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black'
                }`}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
