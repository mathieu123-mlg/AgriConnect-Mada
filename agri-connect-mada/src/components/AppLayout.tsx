import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, ShoppingBasket, LayoutDashboard, LogOut, Sprout } from "lucide-react";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

const navItems = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/produits", label: "Produits", icon: ShoppingBasket },
  { to: "/dashboard", label: "Tableau", icon: LayoutDashboard },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, role, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container-app flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="AgriConnect Mada Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-150 ease-settle ${
                    isActive ? "bg-surface-alt text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface-alt"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-sm font-semibold">{user}</span>
                  <span className="text-[11px] uppercase tracking-wider text-primary">{role}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }} aria-label="Déconnexion">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => navigate("/connexion")}>Se connecter</Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-12">{children}</main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-border bg-surface-alt/60">
        <div className="container-app flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
          <p>© 2026 AgriConnect Mada — Du champ au marché, directement.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">À propos</a>
            <a href="#" className="hover:text-foreground">Aide</a>
            <a href="#" className="hover:text-foreground">CGU</a>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="grid grid-cols-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
