import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, X, Briefcase, Save, Tag, ExternalLink, ChevronDown, ChevronUp, BarChart3, Globe, Cog, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminSkeleton, API } from "./shared";
import type { Project } from "@shared/schema";
import type { LucideIcon } from "lucide-react";

const CAT_ICONS: Record<string, LucideIcon> = { data: BarChart3, web: Globe, automation: Cog, ai: Brain };
const CAT_COLORS: Record<string, string> = {
  data: "bg-blue-50 text-blue-700 border-blue-200",
  web: "bg-primary/8 text-primary border-primary/20",
  automation: "bg-amber-50 text-amber-700 border-amber-200",
  ai: "bg-purple-50 text-purple-700 border-purple-200",
};
const CAT_LABELS: Record<string, string> = { data: "Data & BI", web: "Web", automation: "Auto.", ai: "IA" };

type Form = { title: string; description: string; category: string; problem: string; solution: string; result: string; technologies: string; demo_url: string; download_url: string };
const emptyForm: Form = { title: "", description: "", category: "data", problem: "", solution: "", result: "", technologies: "", demo_url: "", download_url: "" };

export function ProjectsSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const startCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const startEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, category: p.category, problem: p.problem, solution: p.solution, result: p.result, technologies: p.technologies.join(", "), demo_url: (p as any).demo_url ?? "", download_url: (p as any).download_url ?? "" });
    setEditing(p); setCreating(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const cancel = () => { setCreating(false); setEditing(null); setForm(emptyForm); };

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    const payload = { ...form, technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean), demo_url: form.demo_url.trim() || null, download_url: form.download_url.trim() || null };
    if (editing) await API.put(`/api/admin/projects/${editing.id}`, password, payload);
    else await API.post("/api/admin/projects", password, payload);
    qc.invalidateQueries({ queryKey: ["/api/projects"] });
    cancel(); setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer ce projet ? Cette action est irréversible.")) return;
    setDeleting(id);
    await API.del(`/api/admin/projects/${id}`, password);
    qc.invalidateQueries({ queryKey: ["/api/projects"] });
    setDeleting(null);
  };

  const f = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-xl font-bold">Projets du portfolio</h2>
          <p className="text-sm text-muted-foreground">Gérez le contenu de vos projets — titres, descriptions, résultats.</p>
        </div>
        {!creating && (
          <Button onClick={startCreate} className="bg-nexalion hover:opacity-90 font-medium text-sm" data-testid="button-new-project">
            <Plus className="w-4 h-4 mr-1.5" />Nouveau projet
          </Button>
        )}
      </div>

      {creating && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">{editing ? "Modifier le projet" : "Nouveau projet"}</p>
              <button onClick={cancel}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Titre *</label>
                <Input value={form.title} onChange={f("title")} placeholder="Dashboard RH Analytics" className="h-9 text-sm" data-testid="input-project-title" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Catégorie</label>
                <select value={form.category} onChange={f("category")} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" data-testid="select-project-category">
                  <option value="data">Data & BI</option><option value="web">Web</option><option value="automation">Automatisation</option><option value="ai">IA</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Technologies (virgules)</label>
                <Input value={form.technologies} onChange={f("technologies")} placeholder="Power BI, DAX, SQL" className="h-9 text-sm" data-testid="input-project-technologies" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Description courte *</label>
                <Input value={form.description} onChange={f("description")} placeholder="Tableau de bord interactif pour le suivi des indicateurs RH" className="h-9 text-sm" data-testid="input-project-description" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Problème</label>
                <textarea value={form.problem} onChange={f("problem")} placeholder="Décrivez le problème initial…" rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" data-testid="input-project-problem" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Solution</label>
                <textarea value={form.solution} onChange={f("solution")} placeholder="Décrivez la solution apportée…" rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" data-testid="input-project-solution" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Résultat obtenu</label>
                <Input value={form.result} onChange={f("result")} placeholder="Réduction de 60% du temps de reporting…" className="h-9 text-sm" data-testid="input-project-result" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block flex items-center gap-1"><ExternalLink className="w-3 h-3" />URL démo</label>
                <Input value={form.demo_url} onChange={f("demo_url")} placeholder="https://..." className="h-9 text-sm" data-testid="input-project-demo-url" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block flex items-center gap-1"><ExternalLink className="w-3 h-3" />URL téléchargement</label>
                <Input value={form.download_url} onChange={f("download_url")} placeholder="https://..." className="h-9 text-sm" data-testid="input-project-download-url" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-border/60">
              <Button variant="outline" onClick={cancel} size="sm">Annuler</Button>
              <Button onClick={save} disabled={!form.title || !form.description || saving} size="sm" className="bg-nexalion hover:opacity-90 font-medium" data-testid="button-save-project">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                {editing ? "Sauvegarder" : "Créer le projet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <AdminSkeleton key={i} />)}</div>
      ) : !projects?.length ? (
        <div className="text-center py-14 border-2 border-dashed border-border/60 rounded-2xl">
          <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Aucun projet. Créez votre premier projet !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => {
            const Icon = CAT_ICONS[p.category] ?? BarChart3;
            const isExpanded = expandedId === p.id;
            return (
              <Card key={p.id} className="border border-border/60" data-testid={`card-admin-project-${p.id}`}>
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedId(isExpanded ? null : p.id)}>
                  <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={`text-xs font-medium rounded-md border ${CAT_COLORS[p.category] ?? ""}`}>{CAT_LABELS[p.category]}</Badge>
                    <button onClick={e => { e.stopPropagation(); startEdit(p); }} className="p-1.5 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors" data-testid={`button-edit-project-${p.id}`}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); del(p.id); }} disabled={deleting === p.id} className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors" data-testid={`button-delete-project-${p.id}`}>
                      {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                </div>
                {isExpanded && (
                  <CardContent className="px-4 pb-4 pt-0 border-t border-border/60">
                    <div className="grid sm:grid-cols-3 gap-3 mt-3">
                      {[["Problème", p.problem], ["Solution", p.solution], ["Résultat", p.result]].map(([label, val]) => (
                        <div key={label}>
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{label}</p>
                          <p className="text-xs text-foreground leading-relaxed">{val || "—"}</p>
                        </div>
                      ))}
                    </div>
                    {p.technologies?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
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
