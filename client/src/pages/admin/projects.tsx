import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, Loader2, X, Briefcase, Save,
  Tag, ExternalLink, ChevronDown, ChevronUp,
  BarChart3, Globe, Cog, Smartphone, Monitor, FileSpreadsheet,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge }    from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminSkeleton, API, ConfirmDelete, SectionHeader, Field } from "./shared";
import type { Project } from "@shared/schema";
import type { LucideIcon } from "lucide-react";

const CAT_ICONS: Record<string, LucideIcon> = {
  dashboard:    BarChart3,
  "app-web":    Globe,
  "app-mobile": Smartphone,
  "site-web":   Monitor,
  "excel-vba":  FileSpreadsheet,
  automatisation: Cog,
};
const CAT_COLORS: Record<string, string> = {
  dashboard:     "bg-blue-50 text-blue-700 border-blue-200",
  "app-web":     "bg-primary/8 text-primary border-primary/20",
  "app-mobile":  "bg-green-50 text-green-700 border-green-200",
  "site-web":    "bg-cyan-50 text-cyan-700 border-cyan-200",
  "excel-vba":   "bg-emerald-50 text-emerald-700 border-emerald-200",
  automatisation:"bg-amber-50 text-amber-700 border-amber-200",
};
const CAT_LABELS: Record<string, string> = {
  dashboard:     "Dashboard",
  "app-web":     "App web",
  "app-mobile":  "App mobile",
  "site-web":    "Site web",
  "excel-vba":   "Excel VBA",
  automatisation:"Automatisation",
};

type Form = {
  title: string; description: string; category: string;
  problem: string; solution: string; result: string;
  technologies: string; demo_url: string; download_url: string;
};
const EMPTY: Form = {
  title: "", description: "", category: "dashboard",
  problem: "", solution: "", result: "",
  technologies: "", demo_url: "", download_url: "",
};

export function ProjectsSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [creating,    setCreating]    = useState(false);
  const [editing,     setEditing]     = useState<Project | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [form,        setForm]        = useState<Form>(EMPTY);
  const [expandedId,  setExpandedId]  = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const startCreate = () => {
    setForm(EMPTY); setEditing(null); setCreating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const startEdit = (p: Project) => {
    setForm({
      title: p.title, description: p.description, category: p.category,
      problem: p.problem, solution: p.solution, result: p.result,
      technologies: p.technologies.join(", "),
      demo_url: (p as any).demo_url ?? "",
      download_url: (p as any).download_url ?? "",
    });
    setEditing(p); setCreating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const cancel = () => { setCreating(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean),
      demo_url:     form.demo_url.trim()     || null,
      download_url: form.download_url.trim() || null,
    };
    if (editing) await API.put(`/api/admin/projects/${editing.id}`, password, payload);
    else         await API.post("/api/admin/projects", password, payload);
    qc.invalidateQueries({ queryKey: ["/api/projects"] });
    cancel(); setSaving(false);
  };

  const del = async (id: string) => {
    setDeleting(id);
    await API.del(`/api/admin/projects/${id}`, password);
    qc.invalidateQueries({ queryKey: ["/api/projects"] });
    setDeleting(null);
  };

  const set = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeader title="Projets du portfolio" description="Gérez le contenu de vos projets — titres, descriptions, résultats." />
        {!creating && (
          <Button onClick={startCreate} className="bg-nexalion hover:opacity-90 font-medium text-sm" data-testid="button-new-project">
            <Plus className="w-4 h-4 mr-1.5" />Nouveau projet
          </Button>
        )}
      </div>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      {creating && (
        <Card className="border border-primary/25 bg-primary/[0.03] shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <p className="font-semibold text-sm">{editing ? "Modifier le projet" : "Nouveau projet"}</p>
              <button onClick={cancel} className="p-1 rounded hover:bg-muted/60 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Field label="Titre *">
                  <Input value={form.title} onChange={set("title")} placeholder="Dashboard RH Analytics" className="h-9 text-sm" data-testid="input-project-title" />
                </Field>
              </div>
              <Field label="Catégorie">
                <select value={form.category} onChange={set("category")} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" data-testid="select-project-category">
                  <option value="dashboard">Dashboard</option>
                  <option value="app-web">App web</option>
                  <option value="app-mobile">App mobile</option>
                  <option value="site-web">Site web</option>
                  <option value="excel-vba">Excel VBA app</option>
                  <option value="automatisation">Automatisation</option>
                </select>
              </Field>
              <Field label="Technologies (virgules)">
                <Input value={form.technologies} onChange={set("technologies")} placeholder="Power BI, DAX, SQL" className="h-9 text-sm" data-testid="input-project-technologies" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description courte *">
                  <Input value={form.description} onChange={set("description")} placeholder="Tableau de bord interactif pour le suivi des indicateurs RH" className="h-9 text-sm" data-testid="input-project-description" />
                </Field>
              </div>
              <Field label="Problème initial">
                <Textarea value={form.problem} onChange={set("problem")} placeholder="Décrivez le problème initial…" className="min-h-[90px] text-sm resize-none" data-testid="input-project-problem" />
              </Field>
              <Field label="Solution apportée">
                <Textarea value={form.solution} onChange={set("solution")} placeholder="Décrivez la solution apportée…" className="min-h-[90px] text-sm resize-none" data-testid="input-project-solution" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Résultat obtenu">
                  <Input value={form.result} onChange={set("result")} placeholder="Réduction de 60% du temps de reporting…" className="h-9 text-sm" data-testid="input-project-result" />
                </Field>
              </div>
              <Field label="URL démo">
                <div className="relative">
                  <ExternalLink className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input value={form.demo_url} onChange={set("demo_url")} placeholder="https://..." className="h-9 text-sm pl-8" data-testid="input-project-demo-url" />
                </div>
              </Field>
              <Field label="URL téléchargement">
                <div className="relative">
                  <ExternalLink className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <Input value={form.download_url} onChange={set("download_url")} placeholder="https://..." className="h-9 text-sm pl-8" data-testid="input-project-download-url" />
                </div>
              </Field>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-border/60">
              <Button variant="outline" onClick={cancel} size="sm">Annuler</Button>
              <Button
                onClick={save}
                disabled={!form.title || !form.description || saving}
                size="sm"
                className="bg-nexalion hover:opacity-90 font-medium"
                data-testid="button-save-project"
              >
                {saving
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Sauvegarde…</>
                  : <><Save className="w-3.5 h-3.5 mr-1.5" />{editing ? "Sauvegarder" : "Créer le projet"}</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── List ────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <AdminSkeleton rows={4} />
      ) : !projects?.length ? (
        <div className="text-center py-16 border-2 border-dashed border-border/60 rounded-2xl">
          <Briefcase className="w-10 h-10 text-muted-foreground/25 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Aucun projet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Créez votre premier projet avec le bouton ci-dessus.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {projects.map(p => {
            const Icon       = CAT_ICONS[p.category]  ?? BarChart3;
            const isExpanded = expandedId === p.id;
            return (
              <Card key={p.id} className="border border-border/60 overflow-hidden" data-testid={`card-admin-project-${p.id}`}>
                {/* Row */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={`text-xs font-medium rounded-md border hidden sm:inline-flex ${CAT_COLORS[p.category] ?? ""}`}>
                      {CAT_LABELS[p.category]}
                    </Badge>
                    <button
                      onClick={e => { e.stopPropagation(); startEdit(p); }}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                      data-testid={`button-edit-project-${p.id}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <ConfirmDelete
                      title="Supprimer le projet ?"
                      description={`"${p.title}" et tous ses médias seront définitivement supprimés.`}
                      loading={deleting === p.id}
                      onConfirm={() => del(p.id)}
                      trigger={
                        <button
                          onClick={e => e.stopPropagation()}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          data-testid={`button-delete-project-${p.id}`}
                        >
                          {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      }
                    />
                    {isExpanded
                      ? <ChevronUp  className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <CardContent className="px-4 pb-4 pt-3 border-t border-border/60 bg-muted/10">
                    <div className="grid sm:grid-cols-3 gap-4">
                      {([["Problème", p.problem], ["Solution", p.solution], ["Résultat", p.result]] as const).map(([label, val]) => (
                        <div key={label}>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{label}</p>
                          <p className="text-xs text-foreground leading-relaxed">{val || <span className="text-muted-foreground/50 italic">Non renseigné</span>}</p>
                        </div>
                      ))}
                    </div>
                    {p.technologies?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
                        {p.technologies.map(t => (
                          <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/8 text-primary border border-primary/20">
                            <Tag className="w-2.5 h-2.5" />{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
