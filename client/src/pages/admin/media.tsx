import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2, ImagePlus, Eye, Image, Video,
  BarChart3, Globe, Cog, Smartphone, Monitor, FileSpreadsheet, Trash2,
} from "lucide-react";
import { Badge }    from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { API, ConfirmDelete, SectionHeader } from "./shared";
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
  dashboard:      "bg-blue-50 text-blue-700 border-blue-200",
  "app-web":      "bg-primary/8 text-primary border-primary/20",
  "app-mobile":   "bg-green-50 text-green-700 border-green-200",
  "site-web":     "bg-cyan-50 text-cyan-700 border-cyan-200",
  "excel-vba":    "bg-emerald-50 text-emerald-700 border-emerald-200",
  automatisation: "bg-amber-50 text-amber-700 border-amber-200",
};
const CAT_LABELS: Record<string, string> = {
  dashboard:      "Dashboard",
  "app-web":      "App web",
  "app-mobile":   "App mobile",
  "site-web":     "Site web",
  "excel-vba":    "Excel VBA",
  automatisation: "Automatisation",
};

function UploadBtn({
  projectId, accept, label, icon: Icon, password, onDone,
}: {
  projectId: string; accept: string; label: string;
  icon: LucideIcon; password: string; onDone: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file, file.name);
    await fetch(`/api/admin/projects/${projectId}/upload`, {
      method: "POST",
      headers: { "x-admin-password": password },
      body: fd,
    });
    onDone();
    setUploading(false);
    if (ref.current) ref.current.value = "";
  };

  return (
    <>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      <button
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground font-medium transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5 disabled:opacity-50"
      >
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
        {uploading ? "Upload…" : label}
      </button>
    </>
  );
}

export function MediaSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);
  const { data: projects, isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const refresh = () => qc.invalidateQueries({ queryKey: ["/api/projects"] });

  const handleDelete = async (mediaId: string) => {
    setDeleting(mediaId);
    await API.del(`/api/admin/media/${mediaId}`, password);
    refresh();
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Médias projets" description="Ajoutez photos et vidéos à chaque projet de votre portfolio." />

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-44 rounded-2xl bg-muted/40 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects?.map(p => {
            const Icon  = CAT_ICONS[p.category] ?? BarChart3;
            const media = p.media ?? [];
            return (
              <Card key={p.id} className="border border-border/60">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/60 bg-muted/20">
                  <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-sm text-foreground flex-1 truncate">{p.title}</p>
                  <Badge variant="outline" className={`text-xs font-medium rounded-md border shrink-0 ${CAT_COLORS[p.category] ?? ""}`}>
                    {CAT_LABELS[p.category]}
                  </Badge>
                </div>

                <CardContent className="p-4 space-y-3">
                  {media.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1.5">
                      {media.map(item => (
                        <div key={item.id} className="group relative rounded-lg overflow-hidden aspect-video bg-muted/40 border border-border/60">
                          {item.media_type === "image"
                            ? <img src={item.url} alt="" className="w-full h-full object-cover" />
                            : <video src={item.url} className="w-full h-full object-cover" muted />}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ConfirmDelete
                              title="Supprimer ce média ?"
                              description="Ce fichier sera définitivement supprimé du projet."
                              loading={deleting === item.id}
                              onConfirm={() => handleDelete(item.id)}
                              trigger={
                                <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg transition-transform hover:scale-110">
                                  {deleting === item.id
                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                    : <Trash2 className="w-3 h-3" />}
                                </button>
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-border/60 bg-muted/20 py-6 flex flex-col items-center gap-1.5">
                      <ImagePlus className="w-6 h-6 text-muted-foreground/40" />
                      <p className="text-xs text-muted-foreground">Aucun média pour ce projet</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <UploadBtn projectId={p.id} accept="image/*"  label="Photo"  icon={Image} password={password} onDone={refresh} />
                    <UploadBtn projectId={p.id} accept="video/*"  label="Vidéo"  icon={Video} password={password} onDone={refresh} />
                    {media.length > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                        <Eye className="w-3.5 h-3.5" />{media.length} fichier{media.length > 1 ? "s" : ""}
                      </span>
                    )}
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
