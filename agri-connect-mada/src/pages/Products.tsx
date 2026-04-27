import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApp, REGION_LIST } from "@/store/app";
import ListingCard from "@/components/ListingCard";

export default function Products() {
  const { listings } = useApp();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(listings.map(l => l.category))),
    [listings]
  );

  const filtered = listings.filter(l =>
    l.status === "active" &&
    (region === "all" || l.region === region) &&
    (category === "all" || l.category === category) &&
    (!q || l.productName.toLowerCase().includes(q.toLowerCase()) || l.producer.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="container-app py-8 md:py-12">
      <header className="mb-8 space-y-2">
        <h1 className="font-display text-3xl md:text-4xl">Produits frais</h1>
        <p className="text-muted-foreground">{filtered.length} récolte{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}.</p>
      </header>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-surface p-4 md:p-5 shadow-soft-sm mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Rechercher un produit, un producteur..."
            className="pl-10 h-11 bg-surface-alt border-transparent focus-visible:bg-surface"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <FilterPills label="Région" value={region} onChange={setRegion} options={[{ v: "all", l: "Toutes" }, ...REGION_LIST.map(r => ({ v: r, l: r }))]} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterPills label="Catégorie" value={category} onChange={setCategory} options={[{ v: "all", l: "Toutes" }, ...categories.map(c => ({ v: c, l: c }))]} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface-alt/50 py-20 text-center">
          <p className="font-display text-xl">Aucun produit trouvé</p>
          <p className="text-muted-foreground mt-2">Essayez d'élargir vos filtres ou changez de région.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
        </div>
      )}
    </div>
  );
}

function FilterPills({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`tap-press rounded-pill px-3.5 py-1.5 text-sm font-semibold transition-colors duration-150 ${
              value === o.v
                ? "bg-foreground text-background"
                : "bg-surface-alt text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </>
  );
}
