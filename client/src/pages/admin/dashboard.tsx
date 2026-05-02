import { useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowDownToLine, Image as ImageIcon, TrendingUp, Briefcase, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard, API } from "./shared";
import type { AdminStats, BlogPost, FreeFile, Project } from "@shared/schema";

export function DashboardSection({ password }: { password: string }) {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: () => API.get("/api/admin/stats", password),
    refetchInterval: 30000,
  });
  const { data: blog } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: () => API.get("/api/admin/blog", password),
  });
  const { data: files } = useQuery<FreeFile[]>({ queryKey: ["/api/files"] });
  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const topPages = Object.entries(stats?.page_views ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-serif text-xl font-bold text-foreground mb-1">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">Vue d'ensemble des performances du portfolio.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Visites totales" value={isLoading ? "—" : stats?.total_page_views ?? 0} icon={TrendingUp} />
        <StatCard label="Vues blog" value={isLoading ? "—" : stats?.total_blog_views ?? 0} icon={BookOpen} color="text-purple-600" />
        <StatCard label="Téléchargements" value={isLoading ? "—" : stats?.total_downloads ?? 0} icon={ArrowDownToLine} color="text-green-600" />
        <StatCard label="Médias uploadés" value={isLoading ? "—" : stats?.media_count ?? 0} icon={ImageIcon} color="text-amber-600" />
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
              <div className="space-y-2">
                {blog.slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-center justify-between gap-2 py-2 border-b border-border/40 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.created_at} · {p.view_count ?? 0} vues</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 text-xs ${p.status === "published" ? "text-green-600 border-green-200 bg-green-50" : "text-muted-foreground border-border/60"}`}>
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
              <div className="space-y-2">
                {topPages.map(([path, count]) => (
                  <div key={path} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-foreground truncate">{path || "/"}</span>
                        <span className="text-xs font-semibold text-primary ml-2">{count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((count / Math.max(...topPages.map(p => p[1]))) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="border border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />Projets du portfolio
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["data","web","automation","ai"] as const).map(cat => {
                const count = projects?.filter(p => p.category === cat).length ?? 0;
                const labels: Record<string, string> = { data: "Data & BI", web: "Web", automation: "Auto.", ai: "IA" };
                return (
                  <div key={cat} className="rounded-lg border border-border/60 bg-muted/20 p-3 text-center">
                    <p className="text-2xl font-bold font-serif text-primary">{count}</p>
                    <p className="text-xs text-muted-foreground">{labels[cat]}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />Ressources gratuites
            </p>
            <div className="space-y-2">
              {files?.slice(0, 4).map(f => (
                <div key={f.id} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
                  <p className="text-xs font-medium text-foreground truncate flex-1">{f.title}</p>
                  <p className="text-xs text-muted-foreground ml-2 shrink-0 flex items-center gap-1">
                    <ArrowDownToLine className="w-3 h-3" />{f.download_count}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
