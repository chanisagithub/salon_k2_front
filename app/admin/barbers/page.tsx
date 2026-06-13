"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { clientFetch } from "@/lib/api-client";
import AdminShell from "@/components/admin/AdminShell";

interface BarberItem {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profileImageUrl: string | null;
  isActive: boolean;
}

interface BarberForm {
  id: string | null;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profileImageUrl: string;
  isActive: boolean;
}

interface ScheduleRow {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const EMPTY_FORM: BarberForm = {
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  bio: "",
  profileImageUrl: "",
  isActive: true,
};

const DEFAULT_SCHEDULE = (): ScheduleRow[] =>
  DAYS.map((_, i) => ({ dayOfWeek: i + 1, startTime: "09:00", endTime: "20:00", isWorkingDay: i < 6 }));

const inputClass =
  "w-full bg-[#050505] border border-[#2a2a2a] p-3 text-sm text-[#eae1d4] outline-none focus:border-[#d4af37] transition-colors";

export default function AdminBarbersPage() {
  const { status } = useSession();
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<BarberForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Schedule editor state
  const [scheduleBarber, setScheduleBarber] = useState<BarberItem | null>(null);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  const fetchBarbers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientFetch("/admin/barbers");
      if (res.ok) setBarbers(await res.json());
    } catch {
      setError("Failed to load barbers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (status === "authenticated") fetchBarbers();
  }, [status, fetchBarbers]);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email || null,
        bio: form.bio,
        profileImageUrl: form.profileImageUrl,
        isActive: form.isActive,
      };
      const res = await clientFetch(form.id ? `/admin/barbers/${form.id}` : "/admin/barbers", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm(null);
        await fetchBarbers();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Could not save barber.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (id: string) => {
    if (!confirm("Deactivate this barber? They will be hidden from booking but kept for history.")) return;
    const res = await clientFetch(`/admin/barbers/${id}`, { method: "DELETE" });
    if (res.ok) fetchBarbers();
  };

  const openSchedule = async (barber: BarberItem) => {
    setScheduleBarber(barber);
    setScheduleError("");
    setScheduleLoading(true);
    try {
      const res = await clientFetch(`/admin/barbers/${barber.id}/schedules`);
      if (res.ok) {
        const data: { dayOfWeek: number; startTime: string; endTime: string; isWorkingDay: boolean }[] = await res.json();
        const byDay = new Map(data.map((d) => [d.dayOfWeek, d]));
        setSchedule(
          DAYS.map((_, i) => {
            const existing = byDay.get(i + 1);
            return existing
              ? {
                  dayOfWeek: i + 1,
                  startTime: existing.startTime.slice(0, 5),
                  endTime: existing.endTime.slice(0, 5),
                  isWorkingDay: existing.isWorkingDay,
                }
              : { dayOfWeek: i + 1, startTime: "09:00", endTime: "20:00", isWorkingDay: false };
          })
        );
      } else {
        setSchedule(DEFAULT_SCHEDULE());
      }
    } catch {
      setSchedule(DEFAULT_SCHEDULE());
    } finally {
      setScheduleLoading(false);
    }
  };

  const saveSchedule = async () => {
    if (!scheduleBarber) return;
    setScheduleSaving(true);
    setScheduleError("");
    try {
      // Only send days that are flagged as working; end must be after start.
      const payload = schedule
        .filter((row) => row.isWorkingDay)
        .map((row) => ({ ...row, startTime: `${row.startTime}:00`, endTime: `${row.endTime}:00` }));

      const invalid = payload.find((row) => row.endTime <= row.startTime);
      if (invalid) {
        setScheduleError(`End time must be after start time for ${DAYS[invalid.dayOfWeek - 1]}.`);
        setScheduleSaving(false);
        return;
      }

      const res = await clientFetch(`/admin/barbers/${scheduleBarber.id}/schedules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setScheduleBarber(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setScheduleError(data.message || "Could not save schedule.");
      }
    } catch {
      setScheduleError("An unexpected error occurred.");
    } finally {
      setScheduleSaving(false);
    }
  };

  return (
    <AdminShell title="MANAGE BARBERS">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
          {barbers.length} barber{barbers.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => { setError(""); setForm({ ...EMPTY_FORM }); }}
          className="bg-[#d4af37] px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-[#f2ca50] transition-colors"
        >
          + New Barber
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center border border-[#2a2a2a] bg-[#0a0a0a]">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#d4af37]"></div>
        </div>
      ) : barbers.length === 0 ? (
        <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-20 text-center text-[#d0c5af]">
          No barbers yet. Add your first barber.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {barbers.map((b) => (
            <div key={b.id} className="border border-[#2a2a2a] bg-[#0a0a0a] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl text-[#eae1d4]">{b.firstName} {b.lastName}</h3>
                  <span className={`mt-2 inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${
                    b.isActive ? "bg-green-900/20 text-green-400 border border-green-400/20" : "bg-red-900/20 text-red-400 border border-red-400/20"
                  }`}>
                    {b.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              {b.bio && <p className="mt-4 text-sm text-[#d0c5af] line-clamp-2">{b.bio}</p>}
              <div className="mt-6 flex flex-wrap gap-4 border-t border-[#2a2a2a] pt-4">
                <button onClick={() => openSchedule(b)} className="text-[10px] font-bold uppercase text-[#f2ca50] hover:text-[#d4af37]">
                  Schedule
                </button>
                <button
                  onClick={() => {
                    setError("");
                    setForm({
                      id: b.id,
                      firstName: b.firstName,
                      lastName: b.lastName,
                      email: "",
                      bio: b.bio ?? "",
                      profileImageUrl: b.profileImageUrl ?? "",
                      isActive: b.isActive,
                    });
                  }}
                  className="text-[10px] font-bold uppercase text-[#d4af37] hover:text-[#f2ca50]"
                >
                  Edit
                </button>
                {b.isActive && (
                  <button onClick={() => deactivate(b.id)} className="text-[10px] font-bold uppercase text-red-500 hover:text-red-400">
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Barber form modal */}
      {form && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setForm(null)} />
          <div className="relative w-full max-w-lg border border-[#d4af37]/30 bg-[#0a0a0a] p-8 shadow-2xl">
            <h2 className="font-serif text-2xl text-[#f2ca50]">{form.id ? "Edit Barber" : "New Barber"}</h2>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name">
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Last Name">
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
                </Field>
              </div>
              <Field label="Email (optional)">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Bio">
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className={inputClass} />
              </Field>
              <Field label="Profile Image URL">
                <input value={form.profileImageUrl} onChange={(e) => setForm({ ...form, profileImageUrl: e.target.value })} className={inputClass} />
              </Field>
              <label className="flex items-center gap-3 text-sm text-[#d0c5af]">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#d4af37]" />
                Active (available for booking)
              </label>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => setForm(null)} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] hover:text-[#eae1d4]">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !form.firstName.trim() || !form.lastName.trim()}
                className="bg-[#d4af37] px-8 py-2 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-[#f2ca50] disabled:opacity-40 transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule editor modal */}
      {scheduleBarber && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setScheduleBarber(null)} />
          <div className="relative w-full max-w-xl border border-[#d4af37]/30 bg-[#0a0a0a] p-8 shadow-2xl">
            <h2 className="font-serif text-2xl text-[#f2ca50]">
              Weekly Schedule — {scheduleBarber.firstName}
            </h2>
            {scheduleError && <p className="mt-3 text-sm text-red-400">{scheduleError}</p>}
            {scheduleLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#d4af37]"></div>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                {schedule.map((row, idx) => (
                  <div key={row.dayOfWeek} className="flex items-center gap-3 border-b border-[#2a2a2a] py-2">
                    <label className="flex w-32 items-center gap-2 text-sm text-[#eae1d4]">
                      <input
                        type="checkbox"
                        checked={row.isWorkingDay}
                        onChange={(e) => {
                          const next = [...schedule];
                          next[idx] = { ...row, isWorkingDay: e.target.checked };
                          setSchedule(next);
                        }}
                        className="accent-[#d4af37]"
                      />
                      {DAYS[row.dayOfWeek - 1]}
                    </label>
                    <input
                      type="time"
                      value={row.startTime}
                      disabled={!row.isWorkingDay}
                      onChange={(e) => {
                        const next = [...schedule];
                        next[idx] = { ...row, startTime: e.target.value };
                        setSchedule(next);
                      }}
                      className="bg-[#050505] border border-[#2a2a2a] p-2 text-sm text-[#eae1d4] outline-none focus:border-[#d4af37] disabled:opacity-30"
                    />
                    <span className="text-[#d0c5af]">to</span>
                    <input
                      type="time"
                      value={row.endTime}
                      disabled={!row.isWorkingDay}
                      onChange={(e) => {
                        const next = [...schedule];
                        next[idx] = { ...row, endTime: e.target.value };
                        setSchedule(next);
                      }}
                      className="bg-[#050505] border border-[#2a2a2a] p-2 text-sm text-[#eae1d4] outline-none focus:border-[#d4af37] disabled:opacity-30"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => setScheduleBarber(null)} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] hover:text-[#eae1d4]">
                Cancel
              </button>
              <button
                onClick={saveSchedule}
                disabled={scheduleSaving || scheduleLoading}
                className="bg-[#d4af37] px-8 py-2 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-[#f2ca50] disabled:opacity-40 transition-colors"
              >
                {scheduleSaving ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/60">{label}</label>
      {children}
    </div>
  );
}
