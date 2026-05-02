import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Trash2, Loader2, X, Package, Save,
  FileSpreadsheet, FileText, Database, ArrowDownToLine,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge }    from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminSkeleton, API, ConfirmDelete, SectionHeader, Field } from "./shared";
import type { FreeFile } from "@shared/schema";
import type { LucideIcon } from "lucide-react";

const FILE_ICONS: Record<string, LucideIcon> = {
  xlsx: FileSpreadsheet, xlsm: FileSpreadsheet, pdf: FileText, pbix: Database,
};
const FILE_COLORS: Record<string, string> = {
  xlsx: "bg-green-50 text-green-700 border-green-200",
  xlsm: "bg-green-50 text-green-700 border-green-200",
  pdf:  "bg-red-50 text-red-700 border-red-200",
  pbix: "bg-amber-50 text-amber-700 border-amber-200",
};

const EMPTY = { title: "", description: "", file_url: "", file_type: "pdf", category: "formation", tags: "" };

export function FilesSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form,     setForm]     = useState(EMPTY);

  const { data: files, isLoading } = useQuery<FreeFile[]>({ queryKey: ["/api/files"] });

  const save = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    await API.post("/api/admin/files", password, payload);
    qc.invalidateQueries({ queryKey: ["/api/files"] });
    setCreating(false); setForm(EMPTY); setSaving(false);
  };

  const del = async (id: string) => {
    setDeleting(id);
    await API.del(`/api/admin/files/${id}`, password);
    qc.invalidateQueries({ queryKey: ["/api/files"] });
    setDeleting(null);
  };

  const set = (k: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeader title="Ressources Gratuites" description="Gérez vos fichiers et templates téléchargeables." />
        {!creating && (
          <Button onClick={() => setCreating(true)} className="bg-nexalion hover:opacity-90 font-medium text-sm" data-testid="button-add-file">
            <Plus className="w-4 h-4 mr-1.5" />Ajouter un fichier
          </Button>
        )}
      </div>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      {creating && (
        <Card className="border border-primary/25 bg-primary/[0.03] shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <p className="font-semibold text-sm">Nouveau fichier gratuit</p>
              <button onClick={() => { setCreating(false); setForm(EMPTY); }} className="p-1 rounded hover:bg-muted/60 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Titre">
                <Input value={form.title} onChange={set("title")} placeholder="Nom du fichier" className="h-9 text-sm" data-testid="input-file-title" />
              </Field>
              <Field label="Type">
                <select value={form.file_type} onChange={set("file_type")} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {["pdf","xlsx","xlsm","pbix","zip"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </Field>
              <Field label="Catégorie">
                <select value={form.category} onChange={set("category")} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="data">Data & BI</option>
                  <option value="automatisation">Automatisation</option>
                  <option value="formation">Formation</option>
                </select>
              </Field>
              <Field label="URL du fichier">
                <Input value={form.file_url} onChange={set("file_url")} placeholder="https://... ou #" className="h-9 text-sm" data-testid="input-file-url" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <Textarea value={form.description} onChange={set("description")} placeholder="Description du fichier…" className="min-h-[80px] text-sm resize-none" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Tags (virgules)">
                  <Input value={form.tags} onChange={set("tags")} placeholder="Excel, Power BI, KPI" className="h-9 text-sm" />
                </Field>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-border/60">
              <Button variant="outline" onClick={() => { setCreating(false); setForm(EMPTY); }} size="sm">Annuler</Button>
              <Button
                onClick={save}
                disabled={!form.title || !form.file_url || saving}
                size="sm"
                className="bg-nexalion hover:opacity-90 font-medium"
                data-testid="button-save-file"
              >
                {saving
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Ajout…</>
                  : <><Save className="w-3.5 h-3.5 mr-1.5" />Ajouter</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── List ────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <AdminSkeleton rows={3} />
      ) : !files?.length ? (
        <div className="text-center py-16 border-2 border-dashed border-border/60 rounded-2xl">
          <Package className="w-10 h-10 text-muted-foreground/25 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Aucune ressource</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Ajoutez votre premier fichier avec le bouton ci-dessus.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {files.map(f => {
            const Icon      = FILE_ICONS[f.file_type] ?? Package;
            const typeColor = FILE_COLORS[f.file_type] ?? "bg-muted text-muted-foreground border-border";
            return (
              <Card key={f.id} className="border border-border/60 hover:border-border transition-colors" data-testid={`card-admin-file-${f.id}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-foreground truncate">{f.title}</p>
                      <Badge variant="outline" className={`text-[10px] font-bold uppercase shrink-0 ${typeColor}`}>
                        .{f.file_type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      {f.category}
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40 inline-block" />
                      <ArrowDownToLine className="w-3 h-3" />
                      {f.download_count} téléchargements
                    </p>
                  </div>
                  <ConfirmDelete
                    title="Supprimer la ressource ?"
                    description={`"${f.title}" sera définitivement supprimée.`}
                    loading={deleting === f.id}
                    onConfirm={() => del(f.id)}
                    trigger={
                      <button
                        className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
                        data-testid={`button-delete-file-${f.id}`}
                      >
                        {deleting === f.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    }
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
