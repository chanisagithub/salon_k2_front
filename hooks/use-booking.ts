import { useState, useEffect } from "react";
import { clientFetch } from "@/lib/api-client";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface Barber {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  profileImageUrl: string;
}

export interface Slot {
  startTime: string;
  isAvailable: boolean;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientFetch("/booking/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { services, loading };
}

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientFetch("/booking/barbers")
      .then((res) => res.json())
      .then((data) => {
        setBarbers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { barbers, loading };
}

export function useSlots(barberId?: string, serviceId?: string, date?: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!barberId || !serviceId || !date) {
      setSlots([]);
      return;
    }

    setLoading(true);
    clientFetch(`/booking/slots?barberId=${barberId}&serviceId=${serviceId}&date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [barberId, serviceId, date]);

  return { slots, loading };
}
