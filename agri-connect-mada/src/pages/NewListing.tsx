import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp, REGION_LIST } from "@/store/app";
import { toast } from "sonner";

export default function NewListing() {
  const { addListing, role } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productName: "", category: "Fruits", quantity: 100, unit: "kg",
    pricePerUnit: 1000, region: REGION_LIST[0], availableOn: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role && role !== "producteur") {
      toast.error("Seuls les producteurs peuvent publier.");
      return;
    }
    addListing(form);
    toast.success("Annonce publiée !");
    navigate("/dashboard");
  };

  return (
    <div className="container-app py-6 md:py-10 max-w-3xl">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>
      <h1 className="font-display text-3xl md:text-4xl">Publier une récolte</h1>
      <p className="text-muted-foreground mt-2">Quelques infos suffisent. Vous pourrez modifier plus tard.</p>

      <form onSubmit={submit} className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-soft-md space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="productName">Nom du produit *</Label>
          <Input id="productName" required value={form.productName}
            onChange={e => setForm({ ...form, productName: e.target.value })}
            placeholder="Ex. Litchis frais" className="h-11" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Catégorie</Label>
            <select className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm"
              value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {["Fruits", "Légumes", "Céréales", "Épices", "Boissons", "Autres"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Région</Label>
            <select className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm"
              value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
              {REGION_LIST.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Quantité *</Label>
            <Input type="number" required min={1} value={form.quantity}
              onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} className="h-11 tabular-nums" />
          </div>
          <div className="space-y-1.5">
            <Label>Unité</Label>
            <select className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm"
              value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
              {["kg", "g", "L", "pièce", "sac"].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Prix / unité (Ar) *</Label>
            <Input type="number" required min={1} value={form.pricePerUnit}
              onChange={e => setForm({ ...form, pricePerUnit: Number(e.target.value) })} className="h-11 tabular-nums" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Date de disponibilité *</Label>
          <Input type="date" required value={form.availableOn}
            onChange={e => setForm({ ...form, availableOn: e.target.value })} className="h-11" />
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea rows={4} value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Qualité, conditions de récolte, conditionnement..." />
        </div>

        <div className="space-y-1.5">
          <Label>Photo (optionnel)</Label>
          <div className="rounded-xl border-2 border-dashed border-border bg-surface-alt/50 p-6 text-center text-muted-foreground">
            <ImagePlus className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Téléversement de photo bientôt disponible.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" size="lg" className="flex-1">Publier l'annonce</Button>
          <Button type="button" size="lg" variant="outline" onClick={() => navigate(-1)}>Annuler</Button>
        </div>
      </form>
    </div>
  );
}
