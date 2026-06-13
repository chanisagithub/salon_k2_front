"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { clientFetch } from "@/lib/api-client";
import AdminShell from "@/components/admin/AdminShell";

interface ServiceItem {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

interface FormState {
  id: string | null;
  name: string;
  description: string;
  durationMinutes: string;
  price: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  description: "",
  durationMinutes: "30",
  price: "0",
  isActive: true,
};

export default function AdminServicesPage() {
  const { status } = useSession();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientFetch("/admin/services");
      if (res.ok) setServices(await res.json());
    } catch {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (status === "authenticated") fetchServices();
  }, [status, fetchServices]);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        description: form.description,
        durationMinutes: Number(form.durationMinutes),
        price: Number(form.price),
        isActive: form.isActive,
      };
      const res = await clientFetch(
        form.id ? `/admin/services/${form.id}` : "/admin/services",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        setForm(null);
        await fetchServices();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Could not save service.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (id: string) => {
    if (!confirm("Deactivate this service? It will be hidden from booking but kept for history.")) return;
    const res = await clientFetch(`/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) fetchServices();
  };

  return (
    <AdminShell title="MANAGE SERVICES">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
          {services.length} service{services.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => { setError(""); setForm({ ...EMPTY_FORM }); }}
          className="bg-[#d4af37] px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-[#f2ca50] transition-colors"
        >
          + New Service
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center border border-[#2a2a2a] bg-[#0a0a0a]">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#d4af37]"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-20 text-center text-[#d0c5af]">
          No services yet. Add your first service.
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#2a2a2a] bg-[#0a0a0a]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-[#050505] text-[10px] font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
                <th className="p-5">Service</th>
                <th className="p-5">Duration</th>
                <th className="p-5">Price</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-[#111] transition-colors">
                  <td className="p-5">
                    <p className="font-bold text-[#eae1d4]">{s.name}</p>
                    {s.description && <p className="mt-1 text-xs text-[#d0c5af] line-clamp-1">{s.description}</p>}
                  </td>
                  <td className="p-5 text-sm text-[#d0c5af]">{s.durationMinutes} min</td>
                  <td className="p-5 font-serif text-[#f2ca50]">Rs. {s.price}</td>
                  <td className="p-5">
                    <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${
                      s.isActive ? "bg-green-900/20 text-green-400 border border-green-400/20" : "bg-red-900/20 text-red-400 border border-red-400/20"
                    }`}>
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setError("");
                          setForm({
                            id: s.id,
                            name: s.name,
                            description: s.description ?? "",
                            durationMinutes: String(s.durationMinutes),
                            price: String(s.price),
                            isActive: s.isActive,
                          });
                        }}
                        className="text-[10px] font-bold uppercase text-[#d4af37] hover:text-[#f2ca50]"
                      >
                        Edit
                      </button>
                      {s.isActive && (
                        <button onClick={() => deactivate(s.id)} className="text-[10px] font-bold uppercase text-red-500 hover:text-red-400">
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setForm(null)} />
          <div className="relative w-full max-w-lg border border-[#d4af37]/30 bg-[#0a0a0a] p-8 shadow-2xl">
            <h2 className="font-serif text-2xl text-[#f2ca50]">{form.id ? "Edit Service" : "New Service"}</h2>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <div className="mt-6 space-y-4">
              <Field label="Name">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Duration (min)">
                  <input type="number" min={1} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Price (Rs.)">
                  <input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
                </Field>
              </div>
              <label className="flex items-center gap-3 text-sm text-[#d0c5af]">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#d4af37]" />
                Active (visible for booking)
              </label>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => setForm(null)} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] hover:text-[#eae1d4]">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !form.name.trim()}
                className="bg-[#d4af37] px-8 py-2 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-[#f2ca50] disabled:opacity-40 transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

const inputClass =
  "w-full bg-[#050505] border border-[#2a2a2a] p-3 text-sm text-[#eae1d4] outline-none focus:border-[#d4af37] transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/60">{label}</label>
      {children}
    </div>
  );
}
