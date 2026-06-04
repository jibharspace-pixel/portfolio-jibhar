import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen, ArrowDownToLine, Image as ImageIcon,
  TrendingUp, Briefcase, Package, MessageSquare, Trash2, Eye, Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard, API, SectionHeader } from "./shared";
import type { AdminStats, BlogPost, FreeFile, Project } from "@shared/schema";

interface ContactMessage {
  id: string; name: string; email: string; subject: string;
  message: string; created_at: string; read: boolean;
}

export function DashboardSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey:      ["/api/admin/stats"],
    queryFn:       () => API.get("/api/admin/stats", password),
    refetchInterval: 30000,
  });
  const { data: blog }     = useQuery<BlogPost[]>({ queryKey: ["/api/admin/blog"], queryFn: () => API.get("/api/admin/blog", password) });
  const { data: files }    = useQuery<FreeFile[]>({ queryKey: ["/api/files"] });
  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const { data: messages } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
    queryFn:  () => API.get("/api/admin/messages", password),
    refetchInterval: 15000,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => API.put(`/api/admin/messages/${id}/read`, password, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/messages"] }),
  });
  const deleteMsg = useMutation({
    mutationFn: (id: string) => API.del(`/api/admin/messages/${id}`, password),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/messages"] }),
  });

  const unread = messages?.filter(m => !m.read).length ?? 0;

  const topPages = Object.entries(stats?.page_views ?? {})
    .sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxVisit = topPages[0]?.[1] ?? 1;

  return (
    <div className="space-y-7">
      <SectionHeader title="Tableau de bord" description="Vue d'ensemble des performances du portfolio." />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Visites totales"
          value={isLoading ? "—" : stats?.total_page_views ?? 0}
          icon={TrendingUp}
          accent="from-primary to-blue-400"
        />
        <StatCard
          label="Vues blog"
          value={isLoading ? "—" : stats?.total_blog_views ?? 0}
          icon={BookOpen}
          color="text-purple-600"
          accent="from-purple-500 to-violet-400"
        />
        <StatCard
          label="Téléchargements"
          value={isLoading ? "—" : stats?.total_downloads ?? 0}
          icon={ArrowDownToLine}
          color="text-green-600"
          accent="from-green-500 to-emerald-400"
        />
        <StatCard
          label="Médias uploadés"
          value={isLoading ? "—" : stats?.media_count ?? 0}
          icon={ImageIcon}
          color="text-amber-600"
          accent="from-amber-500 to-orange-400"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="border border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />Articles récents
            </p>
            {!blog?.length ? (
              <p className="text-xs text-muted-foreground text-center py-4">Aucun article</p>
            ) : (
              <div className="space-y-0">
                {blog.slice(0, 5).map((p, i) => (
                  <div key={p.id} className={`flex items-center justify-between gap-3 py-2.5 ${i < blog.slice(0,5).length - 1 ? "border-b border-border/40" : ""}`}>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate leading-tight">{p.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.created_at} · {p.view_count ?? 0} vues</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 text-xs font-medium ${p.status === "published" ? "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30" : "text-muted-foreground border-border/60"}`}>
                      {p.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />Pages les plus visitées
            </p>
            {!topPages.length ? (
              <p className="text-xs text-muted-foreground text-center py-4">Aucune visite enregistrée</p>
            ) : (
              <div className="space-y-3">
                {topPages.map(([path, count]) => (
                  <div key={path}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-foreground/80 truncate">{path || "/"}</span>
                      <span className="text-xs font-bold text-primary ml-2 shrink-0">{count}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min((count / maxVisit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Messages panel */}
      <Card className="border border-border/60">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Messages reçus
            {unread > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">{unread}</span>
            )}
          </p>
          {!messages?.length ? (
            <p className="text-xs text-muted-foreground text-center py-6">Aucun message reçu</p>
          ) : (
            <div className="space-y-2">
              {messages.slice(0, 8).map(msg => (
                <div
                  key={msg.id}
                  className={`rounded-xl border p-3.5 transition-colors ${msg.read ? "border-border/40 bg-transparent" : "border-primary/20 bg-primary/[0.03]"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        <p className="text-sm font-semibold text-foreground truncate">{msg.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                      </div>
                      {msg.subject && (
                        <p className="text-xs font-medium text-muted-foreground mb-1">Sujet : {msg.subject}</p>
                      )}
                      <p className="text-xs text-foreground/70 leading-relaxed line-clamp-2">{msg.message}</p>
                      <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                        {new Date(msg.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!msg.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => markRead.mutate(msg.id)}
                          title="Marquer comme lu"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                        onClick={() => deleteMsg.mutate(msg.id)}
                        title="Supprimer"
                      >
                        {deleteMsg.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="border border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />Projets du portfolio
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([
                ["dashboard",     "Dashboard",      "text-blue-600 dark:text-blue-400"],
                ["app-web",       "App web",         "text-primary"],
                ["app-mobile",    "App mobile",      "text-green-600 dark:text-green-400"],
                ["site-web",      "Site web",        "text-cyan-600 dark:text-cyan-400"],
                ["excel-vba",     "Excel VBA",       "text-emerald-600 dark:text-emerald-400"],
                ["automatisation","Automatisation",  "text-amber-600 dark:text-amber-400"],
              ] as const).map(([cat, label, color]) => {
                const count = projects?.filter(p => p.category === cat).length ?? 0;
                return (
                  <div key={cat} className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
                    <p className={`text-2xl font-bold font-serif ${color}`}>{count}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />Ressources populaires
            </p>
            {!files?.length ? (
              <p className="text-xs text-muted-foreground text-center py-4">Aucune ressource</p>
            ) : (
              <div className="space-y-0">
                {files.slice(0, 4).map((f, i) => (
                  <div key={f.id} className={`flex items-center justify-between py-2.5 ${i < Math.min(files.length, 4) - 1 ? "border-b border-border/40" : ""}`}>
                    <p className="text-xs font-medium text-foreground truncate flex-1">{f.title}</p>
                    <p className="text-xs text-muted-foreground ml-3 shrink-0 flex items-center gap-1">
                      <ArrowDownToLine className="w-3 h-3" />{f.download_count}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
