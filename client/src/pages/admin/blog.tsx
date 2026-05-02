import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, BookOpen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminSkeleton, API } from "./shared";
import type { BlogPost } from "@shared/schema";

const CATEGORIES = ["data", "logistique", "automatisation", "ia", "web"];

export function BlogSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const empty = { title: "", slug: "", excerpt: "", content: "", category: "data", tags: "", cover_url: "", status: "published" as const };
  const [form, setForm] = useState(empty);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: () => API.get("/api/admin/blog", password),
  });

  const filtered = filter === "all" ? posts : posts?.filter(p => p.status === filter);

  const slugify = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  const startCreate = () => { setForm(empty); setEditing(null); setCreating(true); };
  const startEdit = (p: BlogPost) => {
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, category: p.category, tags: p.tags.join(", "), cover_url: p.cover_url ?? "", status: p.status as "published" | "draft" });
    setEditing(p); setCreating(true);
  };
  const cancel = () => { setCreating(false); setEditing(null); setForm(empty); };

  const save = async () => {
    setSaving("form");
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), cover_url: form.cover_url || undefined };
    if (editing) await API.put(`/api/admin/blog/${editing.id}`, password, payload);
    else await API.post("/api/admin/blog", password, payload);
    qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    qc.invalidateQueries({ queryKey: ["/api/blog"] });
    cancel(); setSaving(null);
  };

  const toggle = async (p: BlogPost) => {
    setSaving(p.id);
    await API.put(`/api/admin/blog/${p.id}`, password, { ...p, tags: p.tags, status: p.status === "published" ? "draft" : "published" });
    qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    qc.invalidateQueries({ queryKey: ["/api/blog"] });
    setSaving(null);
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    setDeleting(id);
    await API.del(`/api/admin/blog/${id}`, password);
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

      {creating && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">{editing ? "Modifier l'article" : "Nouvel article"}</p>
              <button onClick={cancel}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
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
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
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
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Tags (virgules)</label>
              <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="KPI, Supply Chain, Logistique" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">URL couverture (optionnel)</label>
              <Input value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="https://..." className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Contenu (## pour titres)</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Rédigez votre article ici…" rows={10}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-post-content" />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-border/60">
              <Button variant="outline" onClick={cancel} size="sm">Annuler</Button>
              <Button onClick={save} disabled={!form.title || !form.content || saving === "form"} size="sm" className="bg-nexalion hover:opacity-90 font-medium" data-testid="button-save-post">
                {saving === "form" ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                {editing ? "Sauvegarder" : "Publier"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        {(["all","published","draft"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all border ${filter === f ? "bg-primary text-white border-primary" : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
            {f === "all" ? "Tous" : f === "published" ? "Publiés" : "Brouillons"}
            <span className="ml-1.5 text-xs opacity-70">{f === "all" ? posts?.length : posts?.filter(p => p.status === f).length}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <AdminSkeleton key={i} />)}</div>
      ) : !filtered?.length ? (
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
                  <button onClick={() => toggle(p)} disabled={saving === p.id}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors" title={p.status === "published" ? "Dépublier" : "Publier"}>
                    {saving === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : p.status === "published" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => startEdit(p)} className="p-1.5 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors" data-testid={`button-edit-post-${p.id}`}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => del(p.id)} disabled={deleting === p.id}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors" data-testid={`button-delete-post-${p.id}`}>
                    {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
