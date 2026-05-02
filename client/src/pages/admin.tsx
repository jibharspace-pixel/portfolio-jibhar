import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Lock, LogOut, LayoutDashboard, BookOpen, FolderOpen, Image as ImageIcon,
  Plus, Pencil, Trash2, Eye, EyeOff, Upload, Download, CheckCircle,
  AlertCircle, Loader2, X, BarChart3, Users, Globe, Cog, Brain,
  FileSpreadsheet, FileText, Database, Package, ArrowDownToLine,
  TrendingUp, Image, Video, ImagePlus, ChevronDown, ChevronUp, Save,
  Settings, Mail, Phone, Link2, AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Project, BlogPost, FreeFile, AdminStats, MediaItem } from "@shared/schema";

const ADMIN_KEY = "kjs_admin_password";

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (pw === "nexalion2024") { onLogin(pw); }
    else { setErr(true); }
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
        <p className="text-center text-xs text-muted-foreground mt-5">Accès réservé à l'administrateur · Mot de passe : nexalion2024</p>
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color = "text-primary", sub }: { label: string; value: string | number; icon: typeof BarChart3; color?: string; sub?: string }) {
  return (
    <Card className="border border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
            <p className={`text-3xl font-bold font-serif ${color}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Dashboard Section ────────────────────────────────────────────────────────

function DashboardSection({ password }: { password: string }) {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: () => fetch("/api/admin/stats", { headers: { "x-admin-password": password } }).then(r => r.json()),
    refetchInterval: 30000,
  });
  const { data: blog } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: () => fetch("/api/admin/blog", { headers: { "x-admin-password": password } }).then(r => r.json()),
  });
  const { data: files } = useQuery<FreeFile[]>({ queryKey: ["/api/files"] });

  const topPages = Object.entries(stats?.page_views ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-serif text-xl font-bold text-foreground mb-1">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">Vue d'ensemble des performances du portfolio.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Visites totales" value={isLoading ? "—" : stats?.total_page_views ?? 0} icon={TrendingUp} />
        <StatCard label="Vues blog" value={isLoading ? "—" : stats?.total_blog_views ?? 0} icon={BookOpen} color="text-purple-600" />
        <StatCard label="Téléchargements" value={isLoading ? "—" : stats?.total_downloads ?? 0} icon={ArrowDownToLine} color="text-green-600" />
        <StatCard label="Médias uploadés" value={isLoading ? "—" : stats?.media_count ?? 0} icon={ImageIcon} color="text-amber-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent blog posts */}
        <Card className="border border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />Articles récents
            </p>
            {!blog?.length ? (
              <p className="text-xs text-muted-foreground text-center py-4">Aucun article</p>
            ) : (
              <div className="space-y-2">
                {blog.slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-center justify-between gap-2 py-2 border-b border-border/40 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.created_at} · {p.view_count ?? 0} vues</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 text-xs ${p.status === "published" ? "text-green-600 border-green-200 bg-green-50" : "text-muted-foreground border-border/60"}`}>
                      {p.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top pages */}
        <Card className="border border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />Pages les plus visitées
            </p>
            {!topPages.length ? (
              <p className="text-xs text-muted-foreground text-center py-4">Aucune visite enregistrée</p>
            ) : (
              <div className="space-y-2">
                {topPages.map(([path, count]) => (
                  <div key={path} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-foreground truncate">{path || "/"}</span>
                        <span className="text-xs font-semibold text-primary ml-2">{count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((count / Math.max(...topPages.map(p => p[1]))) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resources summary */}
      <Card className="border border-border/60">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />Ressources gratuites
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {files?.slice(0, 4).map(f => (
              <div key={f.id} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <p className="text-xs font-semibold text-foreground truncate mb-1">{f.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowDownToLine className="w-3 h-3" />{f.download_count} téléchargements
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Blog Section ─────────────────────────────────────────────────────────────

function BlogSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const emptyForm = { title: "", slug: "", excerpt: "", content: "", category: "data", tags: "", cover_url: "", status: "published" as const };
  const [form, setForm] = useState(emptyForm);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: () => fetch("/api/admin/blog", { headers: { "x-admin-password": password } }).then(r => r.json()),
  });

  const filtered = filter === "all" ? posts : posts?.filter(p => p.status === filter);

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  const startCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); };
  const startEdit = (p: BlogPost) => {
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, category: p.category, tags: p.tags.join(", "), cover_url: p.cover_url ?? "", status: p.status as "published" | "draft" });
    setEditing(p); setCreating(true);
  };
  const cancelForm = () => { setCreating(false); setEditing(null); setForm(emptyForm); };

  const savePost = async () => {
    setSaving("form");
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), cover_url: form.cover_url || undefined };
    try {
      if (editing) {
        await fetch(`/api/admin/blog/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(payload) });
      } else {
        await fetch("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(payload) });
      }
      qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      qc.invalidateQueries({ queryKey: ["/api/blog"] });
      cancelForm();
    } catch (_) {}
    setSaving(null);
  };

  const toggleStatus = async (p: BlogPost) => {
    setSaving(p.id);
    const payload = { title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, category: p.category, tags: p.tags, cover_url: p.cover_url, status: p.status === "published" ? "draft" : "published" };
    await fetch(`/api/admin/blog/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(payload) });
    qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    qc.invalidateQueries({ queryKey: ["/api/blog"] });
    setSaving(null);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    setDeleting(id);
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE", headers: { "x-admin-password": password } });
    qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    qc.invalidateQueries({ queryKey: ["/api/blog"] });
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-xl font-bold">Blog</h2>
          <p className="text-sm text-muted-foreground">Gérez vos articles et publications.</p>
        </div>
        {!creating && (
          <Button onClick={startCreate} className="bg-nexalion hover:opacity-90 font-medium text-sm" data-testid="button-new-post">
            <Plus className="w-4 h-4 mr-1.5" />Nouvel article
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {creating && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">{editing ? "Modifier l'article" : "Nouvel article"}</p>
              <button onClick={cancelForm}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Titre</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))} placeholder="Titre de l'article" className="h-9 text-sm" data-testid="input-post-title" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Slug</label>
                <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="slug-de-larticle" className="h-9 text-sm font-mono" data-testid="input-post-slug" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Catégorie</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="data">Data & BI</option>
                  <option value="logistique">Logistique</option>
                  <option value="automatisation">Automatisation</option>
                  <option value="ia">IA</option>
                  <option value="web">Web</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Statut</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as "published" | "draft" }))} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Résumé</label>
              <Input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Courte description affichée en liste" className="h-9 text-sm" data-testid="input-post-excerpt" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Tags (séparés par virgules)</label>
              <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="KPI, Supply Chain, Logistique" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Contenu (## pour titres)</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Rédigez votre article ici... Utilisez ## pour les titres de section." rows={10}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-post-content" />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-border/60">
              <Button variant="outline" onClick={cancelForm} size="sm" className="border-border/60">Annuler</Button>
              <Button onClick={savePost} disabled={!form.title || !form.content || saving === "form"} size="sm" className="bg-nexalion hover:opacity-90 font-medium" data-testid="button-save-post">
                {saving === "form" ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                {editing ? "Sauvegarder" : "Publier"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all","published","draft"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all border ${filter === f ? "bg-primary text-white border-primary" : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
            {f === "all" ? "Tous" : f === "published" ? "Publiés" : "Brouillons"}
            <span className="ml-1.5 text-xs opacity-70">{f === "all" ? posts?.length : posts?.filter(p => p.status === f).length}</span>
          </button>
        ))}
      </div>

      {/* Posts list */}
      {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} />)}</div> :
        !filtered?.length ? (
          <div className="text-center py-14 border-2 border-dashed border-border/60 rounded-2xl">
            <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucun article. Créez votre premier article !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(p => (
              <Card key={p.id} className="border border-border/60" data-testid={`card-admin-post-${p.id}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-foreground truncate">{p.title}</p>
                      <Badge variant="outline" className={`shrink-0 text-xs ${p.status === "published" ? "text-green-600 border-green-200 bg-green-50" : "text-muted-foreground border-border/60"}`}>
                        {p.status === "published" ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.created_at} · {p.view_count ?? 0} vues · {p.read_time ?? 1} min</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => toggleStatus(p)} disabled={saving === p.id}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors" title={p.status === "published" ? "Dépublier" : "Publier"}>
                      {saving === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : p.status === "published" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => startEdit(p)} className="p-1.5 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors" data-testid={`button-edit-post-${p.id}`}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deletePost(p.id)} disabled={deleting === p.id}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors" data-testid={`button-delete-post-${p.id}`}>
                      {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      }
    </div>
  );
}

function Skeleton() { return <div className="h-16 rounded-xl bg-muted/40 animate-pulse" />; }

// ─── Files Section ────────────────────────────────────────────────────────────

function FilesSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const emptyForm = { title: "", description: "", file_url: "", file_type: "pdf", category: "formation", tags: "" };
  const [form, setForm] = useState(emptyForm);

  const { data: files, isLoading } = useQuery<FreeFile[]>({ queryKey: ["/api/files"] });

  const fileTypeIcons: Record<string, typeof Package> = { xlsx: FileSpreadsheet, xlsm: FileSpreadsheet, pdf: FileText, pbix: Database };

  const saveFile = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      await fetch("/api/admin/files", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(payload) });
      qc.invalidateQueries({ queryKey: ["/api/files"] });
      setCreating(false); setForm(emptyForm);
    } catch (_) {}
    setSaving(false);
  };

  const deleteFile = async (id: string) => {
    if (!confirm("Supprimer cette ressource ?")) return;
    setDeleting(id);
    await fetch(`/api/admin/files/${id}`, { method: "DELETE", headers: { "x-admin-password": password } });
    qc.invalidateQueries({ queryKey: ["/api/files"] });
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-xl font-bold">Ressources Gratuites</h2>
          <p className="text-sm text-muted-foreground">Gérez vos fichiers et templates téléchargeables.</p>
        </div>
        {!creating && (
          <Button onClick={() => setCreating(true)} className="bg-nexalion hover:opacity-90 font-medium text-sm" data-testid="button-add-file">
            <Plus className="w-4 h-4 mr-1.5" />Ajouter un fichier
          </Button>
        )}
      </div>

      {creating && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">Nouveau fichier gratuit</p>
              <button onClick={() => { setCreating(false); setForm(emptyForm); }}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Titre</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nom du fichier" className="h-9 text-sm" data-testid="input-file-title" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Type de fichier</label>
                <select value={form.file_type} onChange={e => setForm(f => ({ ...f, file_type: e.target.value }))} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="pdf">PDF</option>
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="xlsm">Excel avec macros (.xlsm)</option>
                  <option value="pbix">Power BI (.pbix)</option>
                  <option value="zip">Archive (.zip)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Catégorie</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="data">Data & BI</option>
                  <option value="automatisation">Automatisation</option>
                  <option value="formation">Formation</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">URL du fichier</label>
                <Input value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} placeholder="https://... ou #" className="h-9 text-sm" data-testid="input-file-url" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description du fichier…" rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Tags (séparés par virgules)</label>
              <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Excel, Power BI, KPI" className="h-9 text-sm" />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-border/60">
              <Button variant="outline" onClick={() => { setCreating(false); setForm(emptyForm); }} size="sm">Annuler</Button>
              <Button onClick={saveFile} disabled={!form.title || !form.file_url || saving} size="sm" className="bg-nexalion hover:opacity-90" data-testid="button-save-file">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-muted/40 animate-pulse" />)}</div> :
        !files?.length ? (
          <div className="text-center py-14 border-2 border-dashed border-border/60 rounded-2xl">
            <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucune ressource. Ajoutez votre premier fichier !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map(f => {
              const Icon = fileTypeIcons[f.file_type] ?? Package;
              return (
                <Card key={f.id} className="border border-border/60" data-testid={`card-admin-file-${f.id}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{f.title}</p>
                      <p className="text-xs text-muted-foreground">.{f.file_type} · {f.category} · {f.download_count} téléchargements</p>
                    </div>
                    <button onClick={() => deleteFile(f.id)} disabled={deleting === f.id}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors shrink-0" data-testid={`button-delete-file-${f.id}`}>
                      {deleting === f.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      }
    </div>
  );
}

// ─── Media Section ────────────────────────────────────────────────────────────

const projectCategoryIcons: Record<string, typeof BarChart3> = { data: BarChart3, web: Globe, automation: Cog, ai: Brain };
const projectCategoryColors: Record<string, string> = { data: "bg-blue-50 text-blue-700 border-blue-200", web: "bg-primary/8 text-primary border-primary/20", automation: "bg-amber-50 text-amber-700 border-amber-200", ai: "bg-purple-50 text-purple-700 border-purple-200" };
const projectCategoryLabels: Record<string, string> = { data: "Data & BI", web: "Web", automation: "Auto.", ai: "IA" };

function MediaSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const { data: projects, isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const refresh = () => qc.invalidateQueries({ queryKey: ["/api/projects"] });

  const handleDelete = async (mediaId: string) => {
    await fetch(`/api/admin/media/${mediaId}`, { method: "DELETE", headers: { "x-admin-password": password } });
    refresh();
  };

  const UploadBtn = ({ projectId, accept, label, icon: Icon, variant }: { projectId: string; accept: string; label: string; icon: typeof Image; variant: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFile = async (file: File) => {
      setUploading(true);
      const form = new FormData();
      form.append("file", file, file.name);
      try {
        await fetch(`/api/admin/projects/${projectId}/upload`, { method: "POST", headers: { "x-admin-password": password }, body: form });
        refresh();
      } catch (_) {}
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    };

    return (
      <>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground font-medium transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5 disabled:opacity-50`}>
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
          {uploading ? "Upload…" : label}
        </button>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold">Médias projets</h2>
        <p className="text-sm text-muted-foreground">Ajoutez photos et vidéos à chaque projet de votre portfolio.</p>
      </div>
      {isLoading ? <div className="grid md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-40 rounded-2xl bg-muted/40 animate-pulse" />)}</div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects?.map(p => {
            const Icon = projectCategoryIcons[p.category] ?? BarChart3;
            const colorCls = projectCategoryColors[p.category] ?? "";
            const media = p.media ?? [];
            return (
              <Card key={p.id} className="border border-border/60">
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/60 bg-muted/20">
                  <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{p.title}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs font-medium rounded-md border ${colorCls}`}>{projectCategoryLabels[p.category]}</Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  {media.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1.5">
                      {media.map(item => (
                        <div key={item.id} className="group relative rounded-lg overflow-hidden aspect-video bg-muted/40 border border-border/60">
                          {item.media_type === "image" ? <img src={item.url} alt="" className="w-full h-full object-cover" /> : <video src={item.url} className="w-full h-full object-cover" muted />}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center">
                            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-border/60 bg-muted/20 py-4 flex flex-col items-center gap-1.5">
                      <ImagePlus className="w-6 h-6 text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground">Aucun média</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <UploadBtn projectId={p.id} accept="image/*" label="Photo" icon={Image} variant="image" />
                    <UploadBtn projectId={p.id} accept="video/*" label="Vidéo" icon={Video} variant="video" />
                    {media.length > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto"><Eye className="w-3.5 h-3.5" />{media.length}</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Infos Section ────────────────────────────────────────────────────────────

interface ContactInfo { email: string; linkedin: string; whatsapp: string; github: string; }
interface SiteContent { hero_description: string; hero_highlights: string[]; about_quote: string; }

function InfosSection({ password }: { password: string }) {
  const qc = useQueryClient();

  const { data: contact, isLoading: loadingContact } = useQuery<ContactInfo>({
    queryKey: ["/api/contact"],
  });
  const { data: content, isLoading: loadingContent } = useQuery<SiteContent>({
    queryKey: ["/api/site-content"],
  });

  const [contactForm, setContactForm] = useState<ContactInfo | null>(null);
  const [contentForm, setContentForm] = useState<SiteContent | null>(null);
  const [savingContact, setSavingContact] = useState(false);
  const [savedContact, setSavedContact] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [savedContent, setSavedContent] = useState(false);

  const cf = contactForm ?? contact ?? { email: "", linkedin: "", whatsapp: "", github: "" };
  const sf = contentForm ?? content ?? { hero_description: "", hero_highlights: ["", "", ""], about_quote: "" };

  const saveContact = async () => {
    setSavingContact(true);
    await fetch("/api/admin/contact", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(cf) });
    qc.invalidateQueries({ queryKey: ["/api/contact"] });
    setSavingContact(false); setSavedContact(true);
    setTimeout(() => setSavedContact(false), 2500);
  };

  const saveContent = async () => {
    setSavingContent(true);
    const payload = { ...sf, hero_highlights: sf.hero_highlights.filter(h => h.trim()) };
    await fetch("/api/admin/site-content", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(payload) });
    qc.invalidateQueries({ queryKey: ["/api/site-content"] });
    setSavingContent(false); setSavedContent(true);
    setTimeout(() => setSavedContent(false), 2500);
  };

  const updateHighlight = (i: number, val: string) => {
    const highlights = [...(sf.hero_highlights ?? ["", "", ""])];
    highlights[i] = val;
    setContentForm(prev => ({ ...(prev ?? sf), hero_highlights: highlights }));
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-serif text-xl font-bold text-foreground mb-1">Informations du site</h2>
        <p className="text-sm text-muted-foreground">Modifiez les coordonnées et les textes affichés sur votre portfolio.</p>
      </div>

      {/* Contact info */}
      <Card className="border border-border/60">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/60 bg-muted/20">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Coordonnées de contact</p>
            <p className="text-xs text-muted-foreground">Affichées dans la page Contact et le pied de page</p>
          </div>
        </div>
        <CardContent className="p-5 space-y-4">
          {loadingContact ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-9 bg-muted/40 rounded-md animate-pulse" />)}</div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />Email
                  </label>
                  <Input value={cf.email} onChange={e => setContactForm(p => ({ ...(p ?? cf), email: e.target.value }))} placeholder="votre@email.com" className="h-9 text-sm" data-testid="input-contact-email" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />WhatsApp
                  </label>
                  <Input value={cf.whatsapp} onChange={e => setContactForm(p => ({ ...(p ?? cf), whatsapp: e.target.value }))} placeholder="+225 07 00 00 00 00" className="h-9 text-sm" data-testid="input-contact-whatsapp" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block flex items-center gap-1.5">
                    <Link2 className="w-3 h-3" />LinkedIn (URL)
                  </label>
                  <Input value={cf.linkedin} onChange={e => setContactForm(p => ({ ...(p ?? cf), linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." className="h-9 text-sm" data-testid="input-contact-linkedin" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block flex items-center gap-1.5">
                    <Link2 className="w-3 h-3" />GitHub (URL)
                  </label>
                  <Input value={cf.github} onChange={e => setContactForm(p => ({ ...(p ?? cf), github: e.target.value }))} placeholder="https://github.com/..." className="h-9 text-sm" data-testid="input-contact-github" />
                </div>
              </div>
              <div className="flex justify-end pt-1 border-t border-border/60">
                <Button onClick={saveContact} disabled={savingContact} size="sm" className="bg-nexalion hover:opacity-90 font-medium" data-testid="button-save-contact">
                  {savingContact ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : savedContact ? <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-400" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                  {savedContact ? "Sauvegardé !" : "Enregistrer"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Site texts */}
      <Card className="border border-border/60">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/60 bg-muted/20">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <AlignLeft className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Textes de la page d'accueil</p>
            <p className="text-xs text-muted-foreground">Description principale et points forts affichés dans le hero</p>
          </div>
        </div>
        <CardContent className="p-5 space-y-4">
          {loadingContent ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-9 bg-muted/40 rounded-md animate-pulse" />)}</div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Description principale</label>
                <textarea
                  value={sf.hero_description}
                  onChange={e => setContentForm(p => ({ ...(p ?? sf), hero_description: e.target.value }))}
                  rows={3}
                  placeholder="Je conçois des solutions digitales..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="input-hero-description"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Points forts (3 lignes sous la description)</label>
                <div className="space-y-2">
                  {[0, 1, 2].map(i => (
                    <Input
                      key={i}
                      value={sf.hero_highlights?.[i] ?? ""}
                      onChange={e => updateHighlight(i, e.target.value)}
                      placeholder={`Point fort ${i + 1}`}
                      className="h-9 text-sm"
                      data-testid={`input-highlight-${i}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Citation (page À propos)</label>
                <Input
                  value={sf.about_quote}
                  onChange={e => setContentForm(p => ({ ...(p ?? sf), about_quote: e.target.value }))}
                  placeholder="Autodidacte déterminé..."
                  className="h-9 text-sm"
                  data-testid="input-about-quote"
                />
              </div>
              <div className="flex justify-end pt-1 border-t border-border/60">
                <Button onClick={saveContent} disabled={savingContent} size="sm" className="bg-nexalion hover:opacity-90 font-medium" data-testid="button-save-content">
                  {savingContent ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : savedContent ? <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-400" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                  {savedContent ? "Sauvegardé !" : "Enregistrer"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Admin Layout ─────────────────────────────────────────────────────────────

type Section = "dashboard" | "blog" | "files" | "media" | "infos";

const sidebarItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "files", label: "Ressources", icon: FolderOpen },
  { id: "media", label: "Médias", icon: ImageIcon },
  { id: "infos", label: "Informations", icon: Settings },
];

function AdminLayout({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [section, setSection] = useState<Section>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(216,20%,98%)] flex">
      {/* Sidebar */}
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
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${section === item.id ? "bg-primary/8 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
              data-testid={`nav-admin-${item.id}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border/60">
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"
            data-testid="button-logout">
            <LogOut className="w-4 h-4" />Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/60 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-nexalion flex items-center justify-center text-white text-xs font-bold font-serif">KJS</div>
          <span className="font-semibold text-sm">{sidebarItems.find(s => s.id === section)?.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onLogout} className="p-2 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" />
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60">
            {mobileOpen ? <X className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
          </button>
        </div>
      </header>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 top-14 bg-black/20" onClick={() => setMobileOpen(false)}>
          <nav className="bg-white w-56 h-full p-3 space-y-1">
            {sidebarItems.map(item => (
              <button key={item.id} onClick={() => { setSection(item.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${section === item.id ? "bg-primary/8 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}>
                <item.icon className="w-4 h-4" />{item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-56 xl:ml-60 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-5 py-8">
          {section === "dashboard" && <DashboardSection password={password} />}
          {section === "blog" && <BlogSection password={password} />}
          {section === "files" && <FilesSection password={password} />}
          {section === "media" && <MediaSection password={password} />}
          {section === "infos" && <InfosSection password={password} />}
        </div>
      </main>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [password, setPassword] = useState<string | null>(() => sessionStorage.getItem(ADMIN_KEY));
  const handleLogin = (pw: string) => { sessionStorage.setItem(ADMIN_KEY, pw); setPassword(pw); };
  const handleLogout = () => { sessionStorage.removeItem(ADMIN_KEY); setPassword(null); };
  if (!password) return <LoginScreen onLogin={handleLogin} />;
  return <AdminLayout password={password} onLogout={handleLogout} />;
}
