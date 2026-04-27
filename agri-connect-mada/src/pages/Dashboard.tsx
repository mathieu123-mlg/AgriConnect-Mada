import { Link, useNavigate } from "react-router-dom";
import { Plus, Sprout, ShoppingBasket, Truck, ShieldCheck, TrendingUp, Trash2, CheckCircle2, Clock } from "lucide-react";
import { useApp, formatAr, type Listing, type ReservationStatus } from "@/store/app";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, role } = useApp();
  const navigate = useNavigate();

  if (!user || !role) {
    return (
      <div className="container-app py-20 text-center max-w-md">
        <h1 className="font-display text-3xl">Connectez-vous</h1>
        <p className="text-muted-foreground mt-3">Accédez à votre tableau de bord pour gérer vos activités.</p>
        <Button size="lg" className="mt-6" onClick={() => navigate("/connexion")}>Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="container-app py-8 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-primary font-semibold">Tableau de bord · {role}</span>
          <h1 className="font-display text-3xl md:text-4xl mt-1">Bonjour, {user}</h1>
        </div>
        {role === "producteur" && (
          <Button size="lg" onClick={() => navigate("/annonces/nouveau")}>
            <Plus className="h-5 w-5" /> Publier une récolte
          </Button>
        )}
      </header>

      {role === "producteur" && <ProducerDash />}
      {role === "acheteur" && <BuyerDash />}
      {role === "transporteur" && <TransporterDash />}
      {role === "admin" && <AdminDash />}
    </div>
  );
}

/* ------------ Stat Card ------------ */
function Stat({ icon: Icon, label, value, tone = "primary" }: { icon: typeof Sprout; label: string; value: string | number; tone?: "primary" | "secondary" | "accent" }) {
  const toneCls = tone === "secondary" ? "bg-secondary text-secondary-foreground"
    : tone === "accent" ? "bg-accent text-accent-foreground"
    : "bg-gradient-warm text-primary-foreground";
  return (
    <div className="rounded-2xl bg-surface border border-border p-5 shadow-soft-sm">
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${toneCls}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="font-display text-2xl tabular-nums">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: ReservationStatus | Listing["status"] | "available" | "accepted" | "in_transit" | "delivered" }) {
  const map: Record<string, { label: string; cls: string }> = {
    active: { label: "Active", cls: "bg-secondary/15 text-secondary" },
    reserved: { label: "Réservée", cls: "bg-accent/30 text-foreground" },
    pending: { label: "En attente", cls: "bg-accent/30 text-foreground" },
    accepted: { label: "Acceptée", cls: "bg-secondary/15 text-secondary" },
    awaiting_transport: { label: "Attente transport", cls: "bg-accent/30 text-foreground" },
    in_transit: { label: "En transit", cls: "bg-primary/15 text-primary" },
    delivered: { label: "Livrée", cls: "bg-secondary/15 text-secondary" },
    available: { label: "Disponible", cls: "bg-accent/30 text-foreground" },
    removed: { label: "Retirée", cls: "bg-destructive/15 text-destructive" },
  };
  const m = map[status] ?? { label: status, cls: "bg-surface-alt text-muted-foreground" };
  return <span className={`inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold ${m.cls}`}>{m.label}</span>;
}

/* ------------ Producer ------------ */
function ProducerDash() {
  const { listings, reservations, user } = useApp();
  const mine = listings.filter(l => l.producer === user || l.status !== "removed");
  const newReservations = reservations.length;
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Sprout} label="Annonces actives" value={mine.filter(l => l.status === "active").length} />
        <Stat icon={ShoppingBasket} label="Réservations reçues" value={newReservations} tone="accent" />
        <Stat icon={TrendingUp} label="Vues totales" value="1.2k" tone="secondary" />
      </div>

      <Section title="Mes annonces" empty={
        <EmptyState title="Aucune annonce publiée" desc="Publiez votre première récolte pour atteindre des acheteurs."
          cta={<Link to="/annonces/nouveau"><Button><Plus className="h-4 w-4" />Publier</Button></Link>} />
      } items={mine}>
        {mine.map(l => (
          <ListingRow key={l.id} listing={l} />
        ))}
      </Section>
    </div>
  );
}

function ListingRow({ listing }: { listing: Listing }) {
  const { removeListing } = useApp();
  return (
    <Link to={`/produits/${listing.id}`} className="flex items-center gap-4 p-4 hover:bg-surface-alt/60 transition-colors">
      <img src={listing.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover border border-border shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-display text-base truncate">{listing.productName}</p>
        <p className="text-xs text-muted-foreground">{listing.quantity} {listing.unit} · {listing.region}</p>
      </div>
      <div className="text-right hidden sm:block">
        <p className="font-display text-base text-primary tabular-nums">{formatAr(listing.pricePerUnit)}</p>
        <StatusPill status={listing.status} />
      </div>
      <button onClick={(e) => { e.preventDefault(); removeListing(listing.id); toast("Annonce retirée"); }}
        className="text-muted-foreground hover:text-destructive p-2" aria-label="Retirer">
        <Trash2 className="h-4 w-4" />
      </button>
    </Link>
  );
}

/* ------------ Buyer ------------ */
function BuyerDash() {
  const { reservations, listings } = useApp();
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={ShoppingBasket} label="Réservations" value={reservations.length} />
        <Stat icon={Clock} label="En attente" value={reservations.filter(r => r.status === "pending").length} tone="accent" />
        <Stat icon={CheckCircle2} label="Livrées" value={reservations.filter(r => r.status === "delivered").length} tone="secondary" />
      </div>

      <Section title="Mes réservations" items={reservations} empty={
        <EmptyState title="Aucune réservation" desc="Parcourez les produits pour réserver votre première récolte."
          cta={<Link to="/produits"><Button>Voir les produits</Button></Link>} />
      }>
        {reservations.map(r => {
          const l = listings.find(x => x.id === r.listingId);
          if (!l) return null;
          return (
            <div key={r.id} className="flex items-center gap-4 p-4">
              <img src={l.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover border border-border shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-display text-base truncate">{l.productName}</p>
                <p className="text-xs text-muted-foreground">{r.quantity} {l.unit} · {formatAr(r.quantity * l.pricePerUnit)}</p>
              </div>
              <StatusPill status={r.status} />
            </div>
          );
        })}
      </Section>
    </div>
  );
}

/* ------------ Transporter ------------ */
function TransporterDash() {
  const { deliveries, reservations, listings, acceptDelivery, advanceDelivery } = useApp();
  const [fees, setFees] = useState<Record<string, number>>({});

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Truck} label="Missions disponibles" value={deliveries.filter(d => d.status === "available").length} />
        <Stat icon={Clock} label="En cours" value={deliveries.filter(d => d.status === "accepted" || d.status === "in_transit").length} tone="accent" />
        <Stat icon={CheckCircle2} label="Livrées" value={deliveries.filter(d => d.status === "delivered").length} tone="secondary" />
      </div>

      <Section title="Missions" items={deliveries} empty={
        <EmptyState title="Aucune mission disponible" desc="Les nouvelles missions apparaîtront dès qu'un acheteur réservera." />
      }>
        {deliveries.map(d => {
          const r = reservations.find(x => x.id === d.reservationId);
          const l = r && listings.find(x => x.id === r.listingId);
          if (!l || !r) return null;
          return (
            <div key={d.id} className="p-4 space-y-3">
              <div className="flex items-center gap-4">
                <img src={l.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover border border-border shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base truncate">{l.productName} · {r.quantity} {l.unit}</p>
                  <p className="text-xs text-muted-foreground">Départ: {d.pickup}</p>
                </div>
                <StatusPill status={d.status} />
              </div>
              {d.status === "available" && (
                <div className="flex gap-2 items-end pl-[4.5rem]">
                  <div className="flex-1 max-w-xs">
                    <label className="text-xs text-muted-foreground">Tarif proposé (Ar)</label>
                    <Input type="number" min={1000} placeholder="50000" className="h-10 mt-1"
                      value={fees[d.id] || ""} onChange={e => setFees({ ...fees, [d.id]: Number(e.target.value) })} />
                  </div>
                  <Button size="default" onClick={() => {
                    const f = fees[d.id]; if (!f) { toast.error("Indiquez un tarif"); return; }
                    acceptDelivery(d.id, f); toast.success("Mission acceptée !");
                  }}>Accepter</Button>
                </div>
              )}
              {(d.status === "accepted" || d.status === "in_transit") && (
                <div className="flex justify-end pl-[4.5rem]">
                  <Button size="sm" variant="outline" onClick={() => { advanceDelivery(d.id); toast.success("Statut mis à jour"); }}>
                    {d.status === "accepted" ? "Démarrer la livraison" : "Marquer livré"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </Section>
    </div>
  );
}

/* ------------ Admin ------------ */
function AdminDash() {
  const { listings, reservations, deliveries, removeListing } = useApp();
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-4 gap-4">
        <Stat icon={Sprout} label="Annonces" value={listings.filter(l => l.status !== "removed").length} />
        <Stat icon={ShoppingBasket} label="Réservations" value={reservations.length} tone="accent" />
        <Stat icon={Truck} label="Livraisons" value={deliveries.length} tone="secondary" />
        <Stat icon={ShieldCheck} label="Modération" value={listings.filter(l => l.status === "removed").length} />
      </div>

      <Section title="Toutes les annonces" items={listings}>
        {listings.map(l => (
          <div key={l.id} className="flex items-center gap-4 p-4">
            <img src={l.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover border border-border shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-display text-base truncate">{l.productName}</p>
              <p className="text-xs text-muted-foreground">{l.producer} · {l.region}</p>
            </div>
            <StatusPill status={l.status} />
            {l.status !== "removed" && (
              <Button size="sm" variant="outline" onClick={() => { removeListing(l.id); toast("Annonce supprimée"); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </Section>
    </div>
  );
}

/* ------------ Helpers ------------ */
function Section({ title, children, items, empty }: { title: string; children: React.ReactNode; items: unknown[]; empty?: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl mb-4">{title}</h2>
      <div className="rounded-2xl border border-border bg-surface shadow-soft-sm overflow-hidden divide-y divide-border">
        {items.length === 0 ? empty : children}
      </div>
    </section>
  );
}

function EmptyState({ title, desc, cta }: { title: string; desc: string; cta?: React.ReactNode }) {
  return (
    <div className="p-10 text-center">
      <p className="font-display text-lg">{title}</p>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">{desc}</p>
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}
