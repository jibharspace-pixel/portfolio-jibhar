import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, BookOpen, Save,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge }    from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminSkeleton, API, ConfirmDelete, SectionHeader, Field } from "./shared";
import type { BlogPost } from "@shared/schema";

const CATEGORIES = ["data", "logistique", "automatisation", "ia", "web"];

type Form = {
  title: string; slug: string; excerpt: string; content: string;
  category: string; tags: string; cover_url: string;
  status: "published" | "draft"; read_time: string;
};
const EMPTY: Form = {
  title: "", slug: "", excerpt: "", content: "",
  category: "data", tags: "", cover_url: "",
  status: "published", read_time: "5",
};

export function BlogSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [filter,   setFilter]   = useState<"all" | "published" | "draft">("all");
  const [editing,  setEditing]  = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving,   setSaving]   = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form,     setForm]     = useState<Form>(EMPTY);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn:  () => API.get("/api/admin/blog", password),
  });

  const filtered = filter === "all" ? posts : posts?.filter(p => p.status === filter);

  const slugify = (s: string) =>
    s.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-").trim();

  const startCreate = () => { setForm(EMPTY); setEditing(null); setCreating(true); };
  const startEdit   = (p: BlogPost) => {
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content,
      category: p.category, tags: p.tags.join(", "), cover_url: p.cover_url ?? "",
      status: p.status as "published" | "draft", read_time: String(p.read_time ?? 5),
    });
    setEditing(p); setCreating(true);
  };
  const cancel = () => { setCreating(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    setSaving("form");
    const payload = {
      ...form,
      read_time: parseInt(form.read_time) || 5,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      cover_url: form.cover_url || undefined,
    };
    if (editing) await API.put(`/api/admin/blog/${editing.id}`, password, payload);
    else         await API.post("/api/admin/blog", password, payload);
    qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    qc.invalidateQueries({ queryKey: ["/api/blog"] });
    cancel(); setSaving(null);
  };

  const toggle = async (p: BlogPost) => {
    setSaving(p.id);
    await API.put(`/api/admin/blog/${p.id}`, password, {
      ...p, tags: p.tags, status: p.status === "published" ? "draft" : "published",
    });
    qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    qc.invalidateQueries({ queryKey: ["/api/blog"] });
    setSaving(null);
  };

  const del = async (id: string) => {
    setDeleting(id);
    await API.del(`/api/admin/blog/${id}`, password);
    qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    qc.invalidateQueries({ queryKey: ["/api/blog"] });
    setDeleting(null);
  };

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({
      ...f, [k]: e.target.value,
      ...(k === "title" && !editing ? { slug: slugify(e.target.value) } : {}),
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeader title="Blog" description="Gérez vos articles et publications." />
        {!creating && (
          <Button onClick={startCreate} className="bg-nexalion hover:opacity-90 font-medium text-sm" data-testid="button-new-post">
            <Plus className="w-4 h-4 mr-1.5" />Nouvel article
          </Button>
        )}
      </div>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      {creating && (
        <Card className="border border-primary/25 bg-primary/[0.03] shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <p className="font-semibold text-sm text-foreground">
                {editing ? "Modifier l'article" : "Nouvel article"}
              </p>
              <button onClick={cancel} className="p-1 rounded hover:bg-muted/60 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Titre *">
                <Input value={form.title} onChange={set("title")} placeholder="Titre de l'article" className="h-9 text-sm" data-testid="input-post-title" />
              </Field>
              <Field label="Slug">
                <Input value={form.slug} onChange={set("slug")} placeholder="slug-de-larticle" className="h-9 text-sm font-mono" data-testid="input-post-slug" />
              </Field>
              <Field label="Catégorie">
                <select value={form.category} onChange={set("category")} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Statut">
                <select value={form.status} onChange={set("status")} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </Field>
              <Field label="Temps de lecture (min)">
                <Input type="number" min={1} max={60} value={form.read_time} onChange={set("read_time")} className="h-9 text-sm" />
              </Field>
              <Field label="URL couverture (optionnel)">
                <Input value={form.cover_url} onChange={set("cover_url")} placeholder="https://..." className="h-9 text-sm" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Résumé">
                  <Input value={form.excerpt} onChange={set("excerpt")} placeholder="Courte description affichée en liste" className="h-9 text-sm" data-testid="input-post-excerpt" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Tags (virgules)">
                  <Input value={form.tags} onChange={set("tags")} placeholder="KPI, Supply Chain, Logistique" className="h-9 text-sm" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Contenu (## pour titres, **gras**)">
                  <Textarea
                    value={form.content} onChange={set("content")}
                    placeholder="Rédigez votre article ici…"
                    className="min-h-[220px] text-sm font-mono leading-relaxed resize-y"
                    data-testid="input-post-content"
                  />
                </Field>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-border/60">
              <Button variant="outline" onClick={cancel} size="sm">Annuler</Button>
              <Button
                onClick={save}
                disabled={!form.title || !form.content || saving === "form"}
                size="sm"
                className="bg-nexalion hover:opacity-90 font-medium"
                data-testid="button-save-post"
              >
                {saving === "form"
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Sauvegarde…</>
                  : <><Save className="w-3.5 h-3.5 mr-1.5" />{editing ? "Sauvegarder" : "Publier"}</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "published", "draft"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              filter === f
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50"
            }`}
          >
            {f === "all" ? "Tous" : f === "published" ? "Publiés" : "Brouillons"}
            <span className="ml-1.5 text-xs opacity-70">
              {f === "all" ? posts?.length : posts?.filter(p => p.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── List ────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <AdminSkeleton rows={3} />
      ) : !filtered?.length ? (
        <div className="text-center py-16 border-2 border-dashed border-border/60 rounded-2xl">
          <BookOpen className="w-10 h-10 text-muted-foreground/25 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Aucun article</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Créez votre premier article avec le bouton ci-dessus.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(p => (
            <Card key={p.id} className="border border-border/60 hover:border-border transition-colors" data-testid={`card-admin-post-${p.id}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-semibold text-sm text-foreground truncate">{p.title}</p>
                    <Badge variant="outline" className={`shrink-0 text-xs font-medium ${p.status === "published" ? "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30" : "text-muted-foreground border-border/60"}`}>
                      {p.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.created_at} · {p.view_count ?? 0} vues · {p.read_time ?? 1} min</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggle(p)}
                    disabled={saving === p.id}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    title={p.status === "published" ? "Dépublier" : "Publier"}
                  >
                    {saving === p.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : p.status === "published" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => startEdit(p)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    data-testid={`button-edit-post-${p.id}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <ConfirmDelete
                    title="Supprimer l'article ?"
                    description={`"${p.title}" sera définitivement supprimé.`}
                    loading={deleting === p.id}
                    onConfirm={() => del(p.id)}
                    trigger={
                      <button
                        className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        data-testid={`button-delete-post-${p.id}`}
                      >
                        {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
