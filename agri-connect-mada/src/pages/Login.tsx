import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sprout, ShoppingBasket, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, type Role } from "@/store/app";
import { toast } from "sonner";

const roles: { id: Role; label: string; icon: typeof Sprout }[] = [
  { id: "producteur", label: "Producteur", icon: Sprout },
  { id: "acheteur", label: "Acheteur", icon: ShoppingBasket },
  { id: "transporteur", label: "Transporteur", icon: Truck },
  { id: "admin", label: "Admin", icon: ShieldCheck },
];

export default function Login() {
  const location = useLocation() as { state?: { role?: Role } };
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>(location.state?.role ?? "producteur");
  const { login } = useApp();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const display = name.trim() || email.split("@")[0] || "Utilisateur";
    login(display, role);
    toast.success(`Bienvenue ${display} !`);
    navigate("/dashboard");
  };

  return (
    <div className="container-app py-10 md:py-16">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 max-w-5xl mx-auto items-start">
        <div className="space-y-5">
          <h1 className="font-display text-3xl md:text-4xl leading-tight">
            {mode === "signup" ? "Rejoignez la marketplace" : "Heureux de vous revoir"}
          </h1>
          <p className="text-muted-foreground text-pretty">
            Choisissez votre rôle, créez un compte en 30 secondes et commencez à connecter le champ au marché.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {roles.map(({ id, label, icon: Icon }) => {
              const active = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={`tap-press flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ease-settle ${
                    active
                      ? "border-primary bg-primary/5 shadow-soft-md"
                      : "border-border bg-surface hover:border-foreground/20"
                  }`}
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-surface-alt text-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-soft-md space-y-5">
          <div className="flex gap-1 p-1 bg-surface-alt rounded-lg">
            {(["signup", "login"] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md py-2 text-sm font-display font-semibold uppercase tracking-wide transition-colors ${
                  mode === m ? "bg-surface text-foreground shadow-soft-sm" : "text-muted-foreground"
                }`}
              >
                {m === "signup" ? "Inscription" : "Connexion"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Rakoto Andry" className="h-11" />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email ou téléphone</Label>
            <Input id="email" type="text" required value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.mg" className="h-11" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pwd">Mot de passe</Label>
            <Input id="pwd" type="password" required placeholder="••••••••" className="h-11" />
          </div>

          <Button type="submit" size="lg" className="w-full">
            {mode === "signup" ? "Créer mon compte" : "Se connecter"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            En continuant, vous acceptez nos conditions d'utilisation.
          </p>
        </form>
      </div>
    </div>
  );
}
