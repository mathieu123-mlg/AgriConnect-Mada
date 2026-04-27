// Mock in-memory data + role context (frontend-only MVP).
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import heroImg from "@/assets/hero-farmer.jpg";

export type Role = "producteur" | "acheteur" | "transporteur" | "admin";

export type ListingStatus = "active" | "reserved" | "in_transit" | "delivered" | "removed";
export type ReservationStatus = "pending" | "accepted" | "awaiting_transport" | "in_transit" | "delivered";

export interface Listing {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  region: string;
  availableOn: string;
  producer: string;
  imageUrl: string;
  description: string;
  status: ListingStatus;
  createdAt: string;
}

export interface Reservation {
  id: string;
  listingId: string;
  buyer: string;
  quantity: number;
  status: ReservationStatus;
  createdAt: string;
}

export interface Delivery {
  id: string;
  reservationId: string;
  pickup: string;
  dropoff: string;
  fee?: number;
  transporter?: string;
  status: "available" | "accepted" | "in_transit" | "delivered";
}

const REGIONS = ["Analamanga", "Atsinanana", "Vakinankaratra", "Boeny", "Sava", "Haute Matsiatra", "Diana"];

const seedListings: Listing[] = [
  {
    id: "l1",
    productName: "Litchis frais",
    category: "Fruits",
    quantity: 800,
    unit: "kg",
    pricePerUnit: 2500,
    region: "Atsinanana",
    availableOn: "2026-05-04",
    producer: "Coop. Toamasina",
    imageUrl: heroImg,
    description: "Litchis cueillis à la main, prêts pour livraison à Tamatave et Antananarivo.",
    status: "active",
    createdAt: "2026-04-26",
  },
  {
    id: "l2",
    productName: "Vanille Bourbon",
    category: "Épices",
    quantity: 35,
    unit: "kg",
    pricePerUnit: 380000,
    region: "Sava",
    availableOn: "2026-05-10",
    producer: "Famille Rakoto",
    imageUrl: heroImg,
    description: "Gousses de vanille noire, séchées 6 mois. Qualité export.",
    status: "active",
    createdAt: "2026-04-25",
  },
  {
    id: "l3",
    productName: "Riz rouge bio",
    category: "Céréales",
    quantity: 1200,
    unit: "kg",
    pricePerUnit: 3200,
    region: "Vakinankaratra",
    availableOn: "2026-05-02",
    producer: "Coop. Antsirabe",
    imageUrl: heroImg,
    description: "Riz rouge cultivé sur les hautes terres, sans pesticides.",
    status: "active",
    createdAt: "2026-04-24",
  },
  {
    id: "l4",
    productName: "Tomates fraîches",
    category: "Légumes",
    quantity: 450,
    unit: "kg",
    pricePerUnit: 1800,
    region: "Analamanga",
    availableOn: "2026-04-30",
    producer: "Jardin de Mahitsy",
    imageUrl: heroImg,
    description: "Tomates mûries au soleil, livraison express possible.",
    status: "active",
    createdAt: "2026-04-23",
  },
  {
    id: "l5",
    productName: "Café Arabica",
    category: "Boissons",
    quantity: 200,
    unit: "kg",
    pricePerUnit: 18000,
    region: "Haute Matsiatra",
    availableOn: "2026-05-15",
    producer: "Coop. Fianar",
    imageUrl: heroImg,
    description: "Grains d'altitude, torréfaction artisanale au choix.",
    status: "active",
    createdAt: "2026-04-22",
  },
  {
    id: "l6",
    productName: "Mangues Kent",
    category: "Fruits",
    quantity: 600,
    unit: "kg",
    pricePerUnit: 2200,
    region: "Boeny",
    availableOn: "2026-05-06",
    producer: "Verger Majunga",
    imageUrl: heroImg,
    description: "Mangues juteuses calibre 400-600g, palette de 600 kg.",
    status: "active",
    createdAt: "2026-04-21",
  },
];

interface AppState {
  role: Role | null;
  user: string | null;
  listings: Listing[];
  reservations: Reservation[];
  deliveries: Delivery[];
  login: (name: string, role: Role) => void;
  logout: () => void;
  addListing: (l: Omit<Listing, "id" | "status" | "createdAt" | "producer" | "imageUrl"> & { imageUrl?: string }) => void;
  removeListing: (id: string) => void;
  reserve: (listingId: string, quantity: number) => void;
  acceptDelivery: (deliveryId: string, fee: number) => void;
  advanceDelivery: (deliveryId: string) => void;
}

const AppCtx = createContext<AppState | null>(null);
export const REGION_LIST = REGIONS;

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(() => (localStorage.getItem("ac_role") as Role) || null);
  const [user, setUser] = useState<string | null>(() => localStorage.getItem("ac_user"));
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    if (role) localStorage.setItem("ac_role", role); else localStorage.removeItem("ac_role");
    if (user) localStorage.setItem("ac_user", user); else localStorage.removeItem("ac_user");
  }, [role, user]);

  const value = useMemo<AppState>(() => ({
    role, user, listings, reservations, deliveries,
    login: (name, r) => { setUser(name); setRole(r); },
    logout: () => { setUser(null); setRole(null); },
    addListing: (l) => {
      const newL: Listing = {
        ...l,
        id: `l${Date.now()}`,
        producer: user || "Producteur",
        imageUrl: l.imageUrl || heroImg,
        status: "active",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setListings(prev => [newL, ...prev]);
    },
    removeListing: (id) => setListings(prev => prev.map(l => l.id === id ? { ...l, status: "removed" } : l)),
    reserve: (listingId, quantity) => {
      const r: Reservation = {
        id: `r${Date.now()}`, listingId, buyer: user || "Acheteur",
        quantity, status: "pending", createdAt: new Date().toISOString().slice(0, 10),
      };
      setReservations(prev => [r, ...prev]);
      const listing = listings.find(l => l.id === listingId);
      if (listing) {
        const d: Delivery = {
          id: `d${Date.now()}`, reservationId: r.id,
          pickup: listing.region, dropoff: "À définir", status: "available",
        };
        setDeliveries(prev => [d, ...prev]);
      }
    },
    acceptDelivery: (deliveryId, fee) => {
      setDeliveries(prev => prev.map(d => d.id === deliveryId
        ? { ...d, status: "accepted", fee, transporter: user || "Transporteur" } : d));
      setReservations(prev => prev.map(r => {
        const d = deliveries.find(x => x.id === deliveryId);
        return d && r.id === d.reservationId ? { ...r, status: "awaiting_transport" } : r;
      }));
    },
    advanceDelivery: (deliveryId) => {
      setDeliveries(prev => prev.map(d => {
        if (d.id !== deliveryId) return d;
        if (d.status === "accepted") return { ...d, status: "in_transit" };
        if (d.status === "in_transit") return { ...d, status: "delivered" };
        return d;
      }));
    },
  }), [role, user, listings, reservations, deliveries]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside AppProvider");
  return ctx;
}

export const formatAr = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " Ar";
