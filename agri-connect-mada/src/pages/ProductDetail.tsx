import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Package, User, ShieldCheck } from "lucide-react";
import { useApp, formatAr } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, reserve, user, role } = useApp();
  const listing = listings.find(l => l.id === id);
  const [qty, setQty] = useState(10);

  if (!listing) {
    return (
      <div className="container-app py-20 text-center">
        <p className="font-display text-2xl">Annonce introuvable</p>
        <Link to="/produits" className="text-primary hover:underline mt-4 inline-block">← Retour aux produits</Link>
      </div>
    );
  }

  const total = qty * listing.pricePerUnit;

  const onReserve = () => {
    if (!user) {
      toast.info("Connectez-vous pour réserver");
      navigate("/connexion", { state: { role: "acheteur" } });
      return;
    }
    if (qty < 1 || qty > listing.quantity) {
      toast.error("Quantité invalide");
      return;
    }
    reserve(listing.id, qty);
    toast.success("Réservation envoyée au producteur !");
    navigate("/dashboard");
  };

  return (
    <div className="container-app py-6 md:py-10">
      <Link to="/produits" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Tous les produits
      </Link>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-border bg-surface shadow-soft-md">
            <img src={listing.imageUrl} alt={listing.productName} className="w-full aspect-[4/3] object-cover" />
          </div>
          <div className="rounded-2xl bg-surface border border-border p-6 shadow-soft-sm">
            <h2 className="font-display text-xl mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-surface border border-border p-6 shadow-soft-md space-y-5">
            <div>
              <span className="inline-block rounded-pill bg-secondary/15 text-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-wider">
                {listing.category}
              </span>
              <h1 className="font-display text-3xl md:text-4xl mt-3 leading-tight">{listing.productName}</h1>
              <p className="font-display text-3xl text-primary mt-3 tabular-nums">
                {formatAr(listing.pricePerUnit)}
                <span className="text-base text-muted-foreground font-sans font-normal">/{listing.unit}</span>
              </p>
            </div>

            <dl className="space-y-3 text-sm border-y border-border py-4">
              <Row icon={MapPin} label="Région">{listing.region}</Row>
              <Row icon={Package} label="Disponible">{listing.quantity} {listing.unit}</Row>
              <Row icon={Calendar} label="À partir du">{listing.availableOn}</Row>
              <Row icon={User} label="Producteur">{listing.producer}</Row>
            </dl>

            {role !== "producteur" && role !== "admin" && (
              <div className="space-y-3">
                <Label htmlFor="qty">Quantité à réserver ({listing.unit})</Label>
                <Input
                  id="qty" type="number" min={1} max={listing.quantity}
                  value={qty} onChange={e => setQty(Number(e.target.value))}
                  className="h-11 tabular-nums"
                />
                <div className="flex justify-between items-baseline rounded-lg bg-surface-alt px-4 py-3">
                  <span className="text-sm text-muted-foreground">Total estimé</span>
                  <span className="font-display text-2xl tabular-nums">{formatAr(total)}</span>
                </div>
                <Button size="lg" className="w-full" onClick={onReserve}>
                  Réserver maintenant
                </Button>
              </div>
            )}
            {role === "producteur" && (
              <p className="text-sm text-muted-foreground italic text-center">Connecté en tant que producteur — réservation indisponible.</p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface-alt p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Paiement sécurisé à la livraison. Le transporteur est notifié dès l'acceptation.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  );
}
