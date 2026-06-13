import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, Loader2, X, Briefcase, Save,
  Tag, ExternalLink, ChevronDown, ChevronUp,
  BarChart3, Globe, Cog, Smartphone, Monitor, FileSpreadsheet,
  Upload, ImageIcon, Video, Images,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge }    from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminSkeleton, API, ConfirmDelete, SectionHeader, Field } from "./shared";
import type { Project, MediaItem } from "@shared/schema";
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
  technologies: string[]; demo_url: string; download_url: string;
};
const EMPTY: Form = {
  title: "", description: "", category: "dashboard",
  problem: "", solution: "", result: "",
  technologies: [], demo_url: "", download_url: "",
};

const MAX_PHOTOS = 6;
const MAX_VIDEOS = 2;

export function ProjectsSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [creating,    setCreating]    = useState(false);
  const [editing,     setEditing]     = useState<Project | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [form,        setForm]        = useState<Form>(EMPTY);
  const [expandedId,  setExpandedId]  = useState<string | null>(null);
  const [techInput,   setTechInput]   = useState("");
  const [mediaItems,  setMediaItems]  = useState<MediaItem[]>([]);
  const [uploading,   setUploading]   = useState(false);
  const [deletingMedia, setDeletingMedia] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const { data: projects, isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const startCreate = () => {
    setForm(EMPTY); setTechInput(""); setEditing(null); setCreating(true);
    setMediaItems([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const startEdit = (p: Project) => {
    setForm({
      title: p.title, description: p.description, category: p.category,
      problem: p.problem, solution: p.solution, result: p.result,
      technologies: p.technologies ?? [],
      demo_url: p.demo_url ?? "",
      download_url: p.download_url ?? "",
    });
    setTechInput(""); setEditing(p); setCreating(true);
    setMediaItems(p.media ?? []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const cancel = () => {
    setCreating(false); setEditing(null); setForm(EMPTY);
    setTechInput(""); setMediaItems([]);
  };

  const addTech = (raw: string) => {
    const tags = raw.split(",").map(t => t.trim()).filter(Boolean);
    const next = [...new Set([...form.technologies, ...tags])];
    setForm(f => ({ ...f, technologies: next }));
    setTechInput("");
  };
  const removeTech = (t: string) =>
    setForm(f => ({ ...f, technologies: f.technologies.filter(x => x !== t) }));

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      technologies: form.technologies,
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

  const uploadFile = async (file: File) => {
    if (!editing) return;
    const photos = mediaItems.filter(m => m.media_type === "image").length;
    const videos = mediaItems.filter(m => m.media_type === "video").length;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (isImage && photos >= MAX_PHOTOS) return alert(`Maximum ${MAX_PHOTOS} photos.`);
    if (isVideo && videos >= MAX_VIDEOS) return alert(`Maximum ${MAX_VIDEOS} vidéos.`);
    if (!isImage && !isVideo) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/admin/projects/${editing.id}/upload`, {
      method: "POST",
      headers: { "x-admin-password": password },
      body: fd,
    });
    if (res.ok) {
      const item: MediaItem = await res.json();
      setMediaItems(prev => [...prev, item]);
      qc.invalidateQueries({ queryKey: ["/api/projects"] });
    }
    setUploading(false);
  };

  const deleteMedia = async (mediaId: string) => {
    setDeletingMedia(mediaId);
    await fetch(`/api/admin/media/${mediaId}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    setMediaItems(prev => prev.filter(m => m.id !== mediaId));
    qc.invalidateQueries({ queryKey: ["/api/projects"] });
    setDeletingMedia(null);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const f of files) await uploadFile(f);
    e.target.value = "";
  };

  const set = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const photos = mediaItems.filter(m => m.media_type === "image");
  const videos = mediaItems.filter(m => m.media_type === "video");

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

      {creating && (
        <Card className="border border-primary/25 bg-primary/[0.03] shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <p className="font-semibold text-sm">{editing ? "Modifier le projet" : "Nouveau projet"}</p>
              <button onClick={cancel} aria-label="Fermer" className="p-1 rounded hover:bg-muted/60 transition-colors">
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
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Technologies</label>
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                  {form.technologies.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/8 text-primary border border-primary/20">
                      <Tag className="w-2.5 h-2.5 shrink-0" />
                      {t}
                      <button type="button" onClick={() => removeTech(t)} className="ml-0.5 hover:text-red-500 transition-colors" aria-label={`Supprimer ${t}`}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {form.technologies.length === 0 && (
                    <span className="text-xs text-muted-foreground/50 italic self-center">Aucune technologie ajoutée</span>
                  )}
                </div>
                <Input
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && techInput.trim()) {
                      e.preventDefault();
                      addTech(techInput);
                    }
                  }}
                  onBlur={() => { if (techInput.trim()) addTech(techInput); }}
                  placeholder="Power BI… (Entrée pour valider)"
                  className="h-8 text-sm"
                  data-testid="input-project-technologies"
                />
              </div>
              <div className="sm:col-span-2">
                <Field label="Description courte *">
                  <Input value={form.description} onChange={set("description")} placeholder="Tableau de bord interactif pour le suivi des indicateurs RH" className="h-9 text-sm" data-testid="input-project-description" />
                </Field>
              </div>
              <Field label="Problème initial">
                <Textarea value={form.problem} onChange={set("problem")} placeholder="Décrivez le problème initial…" className="min-h-[90px] text-sm resize-none" data-testid="input-project-problem" />
              </Field>
              <Field label="Solution apportée">
                <Textarea value={form.solution} onChange={set("solution")} placeholder="Décrivez la solution apportée…" className="min-h-[90px] max-h-[180px] text-sm resize-none overflow-y-auto" data-testid="input-project-solution" />
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

            {/* ── Médias (visible uniquement en édition) ──────── */}
            {editing && (
              <div className="pt-2 border-t border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Images className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Médias du projet</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={photos.length >= MAX_PHOTOS ? "text-amber-600 font-semibold" : ""}>
                      <ImageIcon className="w-3 h-3 inline mr-0.5" />{photos.length}/{MAX_PHOTOS}
                    </span>
                    <span className="text-border">·</span>
                    <span className={videos.length >= MAX_VIDEOS ? "text-amber-600 font-semibold" : ""}>
                      <Video className="w-3 h-3 inline mr-0.5" />{videos.length}/{MAX_VIDEOS}
                    </span>
                  </div>
                </div>

                {/* Boutons d'upload */}
                <div className="flex gap-2">
                  <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} aria-label="Ajouter des photos" title="Ajouter des photos" />
                  <input ref={videoRef} type="file" accept="video/*" multiple className="hidden" onChange={handleFileInput} aria-label="Ajouter des vidéos" title="Ajouter des vidéos" />
                  <button
                    type="button"
                    disabled={uploading || photos.length >= MAX_PHOTOS}
                    onClick={() => photoRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Ajouter photos
                  </button>
                  <button
                    type="button"
                    disabled={uploading || videos.length >= MAX_VIDEOS}
                    onClick={() => videoRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Ajouter vidéo
                  </button>
                  {uploading && <Loader2 className="w-4 h-4 animate-spin text-primary self-center" />}
                </div>

                {/* Grille des médias */}
                {mediaItems.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {mediaItems.map(m => (
                      <div key={m.id} className="relative group rounded-lg overflow-hidden border border-border/60 bg-muted/30 aspect-video">
                        {m.media_type === "image" ? (
                          <img src={m.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                            <Video className="w-5 h-5" />
                            <span className="text-[10px]">Vidéo</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteMedia(m.id)}
                          disabled={deletingMedia === m.id}
                          aria-label="Supprimer le média"
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          {deletingMedia === m.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <X className="w-3 h-3" />}
                        </button>
                        <span className="absolute bottom-1 left-1 text-[9px] font-semibold px-1 rounded bg-black/50 text-white uppercase">
                          {m.media_type === "image" ? "img" : "vid"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-border/60 cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all"
                    onClick={() => photoRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground/60">Cliquez pour ajouter des médias</p>
                  </div>
                )}
              </div>
            )}

            {!editing && (
              <p className="text-xs text-muted-foreground/60 bg-muted/30 rounded-lg px-3 py-2 border border-border/40">
                Les médias (photos et vidéos) peuvent être ajoutés après la création du projet.
              </p>
            )}

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
                    {(p.media?.length ?? 0) > 0 && (
                      <span className="hidden sm:flex items-center gap-0.5 text-xs text-muted-foreground/60">
                        <Images className="w-3 h-3" />{p.media?.length}
                      </span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); startEdit(p); }}
                      aria-label="Modifier le projet"
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
                          aria-label="Supprimer le projet"
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
                    {(p.media?.length ?? 0) > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/40">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Médias</p>
                        <div className="flex flex-wrap gap-2">
                          {p.media?.map(m => (
                            <div key={m.id} className="w-16 h-16 rounded-lg overflow-hidden border border-border/60 bg-muted/30 flex items-center justify-center">
                              {m.media_type === "image"
                                ? <img src={m.url} alt="" className="w-full h-full object-cover" />
                                : <Video className="w-5 h-5 text-muted-foreground" />}
                            </div>
                          ))}
                        </div>
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
