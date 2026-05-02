import { useState } from "react";
import {
  Lock, LogOut, LayoutDashboard, BookOpen, FolderOpen,
  Image as ImageIcon, Briefcase, Settings, Loader2, AlertCircle,
  X, Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardSection } from "./admin/dashboard";
import { BlogSection }      from "./admin/blog";
import { FilesSection }     from "./admin/files";
import { ProjectsSection }  from "./admin/projects";
import { MediaSection }     from "./admin/media";
import { InfosSection }     from "./admin/infos";

const ADMIN_KEY = "kjs_admin_password";
const PASSWORD  = "nexalion2024";

type Section = "dashboard" | "blog" | "files" | "projects" | "media" | "infos";

const NAV: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "blog",      label: "Blog",             icon: BookOpen },
  { id: "files",     label: "Ressources",        icon: FolderOpen },
  { id: "projects",  label: "Projets",           icon: Briefcase },
  { id: "media",     label: "Médias",            icon: ImageIcon },
  { id: "infos",     label: "Informations",      icon: Settings },
];

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw,      setPw]      = useState("");
  const [err,     setErr]     = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 380));
    if (pw === PASSWORD) onLogin(pw);
    else { setErr(true); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background bg-aurora-page flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-nexalion shadow-[0_8px_32px_hsl(216,90%,40%,0.35)] mb-5">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Administration</h1>
          <p className="text-sm text-muted-foreground mt-1">Portfolio · Kroman Jibhar Samuel</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 dark:bg-card/90 backdrop-blur-md border border-border/60 rounded-2xl shadow-[0_8px_40px_hsl(216,20%,60%,0.12)] p-6 space-y-4">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-1.5">
                Mot de passe
              </label>
              {/* Hidden username for accessibility / password managers */}
              <input type="text" name="username" autoComplete="username" className="hidden" readOnly value="admin" />
              <Input
                type="password"
                placeholder="••••••••••••"
                value={pw}
                autoComplete="current-password"
                onChange={e => { setPw(e.target.value); setErr(false); }}
                className={`h-11 transition-colors ${err ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                autoFocus
                data-testid="input-admin-password"
              />
              {err && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1.5 animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Mot de passe incorrect
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading || !pw}
              className="w-full h-11 bg-nexalion hover:opacity-90 font-semibold shadow-[0_4px_16px_hsl(216,90%,40%,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_hsl(216,90%,40%,0.32)]"
              data-testid="button-login"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Vérification…</>
                : <><Lock className="w-4 h-4 mr-2" />Accéder au CMS</>}
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-5">Accès réservé à l'administrateur</p>
      </div>
    </div>
  );
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────
function NavItem({
  item, active, onClick,
}: {
  item: typeof NAV[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      }`}
      data-testid={`nav-admin-${item.id}`}
    >
      {/* Active left bar */}
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-primary nav-active-line" />
      )}
      <item.icon className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground/70"}`} />
      <span>{item.label}</span>
    </button>
  );
}

// ── Admin layout ──────────────────────────────────────────────────────────────
function AdminLayout({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [section,    setSection]    = useState<Section>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevSection, setPrevSection] = useState<Section | null>(null);

  const navigate = (s: Section) => {
    if (s === section) return;
    setPrevSection(section);
    setSection(s);
    setMobileOpen(false);
  };

  const sectionContent: Record<Section, React.ReactNode> = {
    dashboard: <DashboardSection password={password} />,
    blog:      <BlogSection      password={password} />,
    files:     <FilesSection     password={password} />,
    projects:  <ProjectsSection  password={password} />,
    media:     <MediaSection     password={password} />,
    infos:     <InfosSection     password={password} />,
  };

  return (
    <div className="min-h-screen bg-[hsl(216,25%,97%)] dark:bg-background flex">

      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-56 xl:w-60 shrink-0 bg-white dark:bg-card border-r border-border/60 flex-col fixed inset-y-0 left-0 z-40 shadow-[1px_0_0_0_hsl(216,20%,90%)]">
        {/* Brand */}
        <div className="px-4 py-5 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-nexalion flex items-center justify-center text-white font-bold text-sm font-serif shadow-sm shrink-0">
              KJS
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground leading-tight truncate">Administration</p>
              <p className="text-xs text-muted-foreground">Portfolio</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(item => (
            <NavItem key={item.id} item={item} active={section === item.id} onClick={() => navigate(item.id)} />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-border/60">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-border/60 h-14 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-nexalion flex items-center justify-center text-white text-xs font-bold font-serif">KJS</div>
          <span className="font-semibold text-sm text-foreground">
            {NAV.find(s => s.id === section)?.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 top-14"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <nav
            className="absolute left-0 top-0 bottom-0 w-60 bg-white dark:bg-card border-r border-border/60 px-3 py-4 space-y-0.5 shadow-xl mobile-menu-enter"
            onClick={e => e.stopPropagation()}
          >
            {NAV.map((item, i) => (
              <div key={item.id} className="mobile-menu-item" style={{ animationDelay: `${i * 25}ms` }}>
                <NavItem item={item} active={section === item.id} onClick={() => navigate(item.id)} />
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-56 xl:ml-60 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-5 py-8">
          {/* Section transition */}
          <div key={section} className="page-enter">
            {sectionContent[section]}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [password, setPassword] = useState<string | null>(
    () => sessionStorage.getItem(ADMIN_KEY)
  );
  const handleLogin  = (pw: string) => { sessionStorage.setItem(ADMIN_KEY, pw); setPassword(pw); };
  const handleLogout = () => { sessionStorage.removeItem(ADMIN_KEY); setPassword(null); };

  if (!password) return <LoginScreen onLogin={handleLogin} />;
  return <AdminLayout password={password} onLogout={handleLogout} />;
}
