import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, X, Package, Save, FileSpreadsheet, FileText, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { API } from "./shared";
import type { FreeFile } from "@shared/schema";
import type { LucideIcon } from "lucide-react";

const FILE_ICONS: Record<string, LucideIcon> = { xlsx: FileSpreadsheet, xlsm: FileSpreadsheet, pdf: FileText, pbix: Database };

const empty = { title: "", description: "", file_url: "", file_type: "pdf", category: "formation", tags: "" };

export function FilesSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const { data: files, isLoading } = useQuery<FreeFile[]>({ queryKey: ["/api/files"] });

  const save = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    await API.post("/api/admin/files", password, payload);
    qc.invalidateQueries({ queryKey: ["/api/files"] });
    setCreating(false); setForm(empty); setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer cette ressource ?")) return;
    setDeleting(id);
    await API.del(`/api/admin/files/${id}`, password);
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
              <button onClick={() => { setCreating(false); setForm(empty); }}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Titre</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nom du fichier" className="h-9 text-sm" data-testid="input-file-title" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Type</label>
                <select value={form.file_type} onChange={e => setForm(f => ({ ...f, file_type: e.target.value }))} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                  {["pdf","xlsx","xlsm","pbix","zip"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
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
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Tags (virgules)</label>
              <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Excel, Power BI, KPI" className="h-9 text-sm" />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-border/60">
              <Button variant="outline" onClick={() => { setCreating(false); setForm(empty); }} size="sm">Annuler</Button>
              <Button onClick={save} disabled={!form.title || !form.file_url || saving} size="sm" className="bg-nexalion hover:opacity-90" data-testid="button-save-file">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-muted/40 animate-pulse" />)}</div>
      ) : !files?.length ? (
        <div className="text-center py-14 border-2 border-dashed border-border/60 rounded-2xl">
          <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Aucune ressource. Ajoutez votre premier fichier !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map(f => {
            const Icon = FILE_ICONS[f.file_type] ?? Package;
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
                  <button onClick={() => del(f.id)} disabled={deleting === f.id}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors shrink-0" data-testid={`button-delete-file-${f.id}`}>
                    {deleting === f.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
