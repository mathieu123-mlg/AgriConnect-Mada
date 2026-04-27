import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sprout, ShoppingBasket, Truck, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-farmer.jpg";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/ListingCard";
import { useApp } from "@/store/app";

const roleCards = [
  { role: "producteur", title: "Producteur", desc: "Publiez vos récoltes et vendez en direct.", icon: Sprout },
  { role: "acheteur", title: "Acheteur", desc: "Trouvez des produits frais près de chez vous.", icon: ShoppingBasket },
  { role: "transporteur", title: "Transporteur", desc: "Acceptez des missions de livraison.", icon: Truck },
  { role: "admin", title: "Admin", desc: "Modérez et suivez l'activité.", icon: ShieldCheck },
] as const;

export default function Home() {
  const navigate = useNavigate();
  const { listings } = useApp();
  const featured = listings.filter(l => l.status === "active").slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-app grid lg:grid-cols-2 gap-10 lg:gap-16 py-12 md:py-20 items-center">
          <div className="space-y-7 animate-settle-up">
            <span className="inline-flex items-center gap-2 rounded-pill bg-surface-alt px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Marketplace agricole · Madagascar
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Du champ au marché,{" "}
              <span className="text-primary">directement</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl text-pretty">
              AgriConnect Mada relie producteurs, acheteurs et transporteurs locaux. Moins d'intermédiaires, des prix justes, une logistique simple.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="xl" onClick={() => navigate("/produits")}>
                Voir les produits <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline" onClick={() => navigate("/connexion")}>
                Vendre ma récolte
              </Button>
            </div>
            <dl className="grid grid-cols-3 gap-6 pt-6 border-t border-border max-w-md">
              {[
                ["120+", "Producteurs"],
                ["7", "Régions"],
                ["48h", "Livraison"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl text-foreground tabular-nums">{n}</dt>
                  <dd className="text-xs uppercase tracking-wider text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute -inset-4 bg-gradient-warm opacity-20 blur-3xl rounded-full" aria-hidden />
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-soft-lg bg-surface">
              <img src={heroImg} alt="Productrice malgache avec un panier de litchis" width={1600} height={1200} className="w-full h-auto object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 sm:bottom-6 sm:left-[-1.5rem] rounded-2xl bg-surface border border-border shadow-soft-md p-4 max-w-[220px] animate-settle-up" style={{ animationDelay: "400ms" }}>
              <p className="text-xs uppercase tracking-wider text-secondary font-semibold">Récolte du jour</p>
              <p className="font-display text-base mt-1">800 kg de litchis frais — Toamasina</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="surface-alt border-y border-border">
        <div className="container-app py-16">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display text-3xl md:text-4xl">Une plateforme, quatre rôles</h2>
            <p className="text-muted-foreground mt-3">Choisissez votre rôle pour commencer en quelques secondes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleCards.map(({ role, title, desc, icon: Icon }, i) => (
              <Link
                key={role}
                to="/connexion"
                state={{ role }}
                className="group rounded-2xl bg-surface border border-border p-6 shadow-soft-sm hover:shadow-soft-md hover:-translate-y-1 transition-[transform,box-shadow] duration-250 ease-settle animate-settle-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-warm text-primary-foreground shadow-soft-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl mt-4">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{desc}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary">
                  Commencer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-app py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Récoltes en vedette</h2>
            <p className="text-muted-foreground mt-2">Sélection fraîche, directement des producteurs.</p>
          </div>
          <Link to="/produits" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
        </div>
      </section>
    </>
  );
}
