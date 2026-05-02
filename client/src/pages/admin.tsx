import { useState } from "react";
import { Lock, LogOut, LayoutDashboard, BookOpen, FolderOpen, Image as ImageIcon, Briefcase, Settings, Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardSection } from "./admin/dashboard";
import { BlogSection } from "./admin/blog";
import { FilesSection } from "./admin/files";
import { ProjectsSection } from "./admin/projects";
import { MediaSection } from "./admin/media";
import { InfosSection } from "./admin/infos";

const ADMIN_KEY = "kjs_admin_password";
const PASSWORD = "nexalion2024";

type Section = "dashboard" | "blog" | "files" | "projects" | "media" | "infos";

const NAV: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "files", label: "Ressources", icon: FolderOpen },
  { id: "projects", label: "Projets", icon: Briefcase },
  { id: "media", label: "Médias", icon: ImageIcon },
  { id: "infos", label: "Informations", icon: Settings },
];

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (pw === PASSWORD) onLogin(pw);
    else setErr(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(216,20%,98%)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-nexalion shadow-lg mb-5">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Administration</h1>
          <p className="text-sm text-muted-foreground mt-1">Portfolio · Kroman Jibhar Samuel</p>
        </div>
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Mot de passe</label>
                <Input type="password" placeholder="••••••••••••" value={pw} onChange={e => { setPw(e.target.value); setErr(false); }}
                  className={`h-11 ${err ? "border-red-400" : ""}`} autoFocus data-testid="input-admin-password" />
                {err && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />Mot de passe incorrect</p>}
              </div>
              <Button type="submit" disabled={loading || !pw} className="w-full h-11 bg-nexalion hover:opacity-90 font-semibold" data-testid="button-login">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {loading ? "Vérification…" : "Accéder"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-5">Accès réservé à l'administrateur</p>
      </div>
    </div>
  );
}

function AdminLayout({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [section, setSection] = useState<Section>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const sectionContent = {
    dashboard: <DashboardSection password={password} />,
    blog: <BlogSection password={password} />,
    files: <FilesSection password={password} />,
    projects: <ProjectsSection password={password} />,
    media: <MediaSection password={password} />,
    infos: <InfosSection password={password} />,
  };

  return (
    <div className="min-h-screen bg-[hsl(216,20%,98%)] flex">
      <aside className="hidden lg:flex w-56 xl:w-60 shrink-0 bg-white border-r border-border/60 flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-nexalion flex items-center justify-center text-white font-bold text-sm font-serif shadow-sm">KJS</div>
            <div>
              <p className="font-semibold text-sm text-foreground">Administration</p>
              <p className="text-xs text-muted-foreground">Portfolio</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${section === item.id ? "bg-primary/8 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
              data-testid={`nav-admin-${item.id}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border/60">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all" data-testid="button-logout">
            <LogOut className="w-4 h-4" />Déconnexion
          </button>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/60 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-nexalion flex items-center justify-center text-white text-xs font-bold font-serif">KJS</div>
          <span className="font-semibold text-sm">{NAV.find(s => s.id === section)?.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onLogout} className="p-2 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4" /></button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60">
            {mobileOpen ? <X className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
          </button>
        </div>
      </header>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 top-14 bg-black/20" onClick={() => setMobileOpen(false)}>
          <nav className="bg-white w-56 h-full p-3 space-y-1">
            {NAV.map(item => (
              <button key={item.id} onClick={() => { setSection(item.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${section === item.id ? "bg-primary/8 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}>
                <item.icon className="w-4 h-4" />{item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <main className="flex-1 lg:ml-56 xl:ml-60 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-5 py-8">
          {sectionContent[section]}
        </div>
      </main>
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState<string | null>(() => sessionStorage.getItem(ADMIN_KEY));
  const handleLogin = (pw: string) => { sessionStorage.setItem(ADMIN_KEY, pw); setPassword(pw); };
  const handleLogout = () => { sessionStorage.removeItem(ADMIN_KEY); setPassword(null); };
  if (!password) return <LoginScreen onLogin={handleLogin} />;
  return <AdminLayout password={password} onLogout={handleLogout} />;
}
