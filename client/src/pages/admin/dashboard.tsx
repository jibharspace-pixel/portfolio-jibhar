import { useQuery } from "@tanstack/react-query";
import {
  BookOpen, ArrowDownToLine, Image as ImageIcon,
  TrendingUp, Briefcase, Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard, API, SectionHeader } from "./shared";
import type { AdminStats, BlogPost, FreeFile, Project } from "@shared/schema";

export function DashboardSection({ password }: { password: string }) {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey:      ["/api/admin/stats"],
    queryFn:       () => API.get("/api/admin/stats", password),
    refetchInterval: 30000,
  });
  const { data: blog }     = useQuery<BlogPost[]>({ queryKey: ["/api/admin/blog"], queryFn: () => API.get("/api/admin/blog", password) });
  const { data: files }    = useQuery<FreeFile[]>({ queryKey: ["/api/files"] });
  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const topPages = Object.entries(stats?.page_views ?? {})
    .sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxVisit = topPages[0]?.[1] ?? 1;

  return (
    <div className="space-y-7">
      <SectionHeader title="Tableau de bord" description="Vue d'ensemble des performances du portfolio." />

      {/* Stats */}
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

      {/* Two-column */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Articles récents */}
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

        {/* Top pages */}
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

      {/* Bottom row */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Projets par catégorie */}
        <Card className="border border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />Projets du portfolio
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {(["data","web","automation","ai"] as const).map(cat => {
                const count = projects?.filter(p => p.category === cat).length ?? 0;
                const colors: Record<string, string> = {
                  data: "text-blue-600 dark:text-blue-400",
                  web: "text-primary",
                  automation: "text-amber-600 dark:text-amber-400",
                  ai: "text-purple-600 dark:text-purple-400",
                };
                const labels: Record<string, string> = { data: "Data & BI", web: "Web", automation: "Auto.", ai: "IA" };
                return (
                  <div key={cat} className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
                    <p className={`text-2xl font-bold font-serif ${colors[cat]}`}>{count}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{labels[cat]}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Ressources populaires */}
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
