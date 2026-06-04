import { BarChart3, ExternalLink, Download, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/language-context";
import { CATEGORY_ICONS, CATEGORY_STYLES, DEFAULT_STYLE } from "@/lib/project-config";
import { DialogMediaCarousel } from "./dialog-media-carousel";
import type { Project } from "@shared/schema";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDialog({ project, onClose }: Props) {
  const { t } = useLanguage();

  const categoryLabels: Record<string, string> = {
    dashboard: t.projects.filters.dashboard,
    "app-web": t.projects.filters["app-web"],
    "app-mobile": t.projects.filters["app-mobile"],
    "site-web": t.projects.filters["site-web"],
    "excel-vba": t.projects.filters["excel-vba"],
    automatisation: t.projects.filters.automatisation,
  };

  const psrBlocks = [
    { key: "problem" as const, label: t.projects.problem, color: "border-border/60 bg-muted/40", labelColor: "text-muted-foreground", dot: "bg-muted-foreground" },
    { key: "solution" as const, label: t.projects.solution, color: "border-primary/20 bg-primary/5", labelColor: "text-primary", dot: "bg-primary" },
    { key: "result" as const, label: t.projects.result, color: "border-green-500/20 bg-green-500/5", labelColor: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
  ];

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0">
        {project && (() => {
          const Icon = CATEGORY_ICONS[project.category] ?? BarChart3;
          const style = CATEGORY_STYLES[project.category] ?? DEFAULT_STYLE;
          const media = project.media ?? [];
          return (
            <>
              <div className={`h-1 w-full bg-gradient-to-r ${style.accentBar} shrink-0`} />

              {/* Banner — toujours visible */}
              <div className={`w-full h-28 sm:h-36 bg-gradient-to-br ${style.gradient} flex items-center justify-center relative overflow-hidden shrink-0`}>
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/8 blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5 blur-2xl" />
                <Icon className={`w-14 h-14 ${style.iconColor} opacity-80`} />
              </div>

              <div className="p-6 pt-5 space-y-5">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg border ${style.badgeBg}`}>
                      {categoryLabels[project.category] ?? project.category}
                    </span>
                  </div>
                  <DialogTitle className="font-serif text-2xl lg:text-3xl tracking-tight leading-snug">
                    {project.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed text-foreground/80 mt-2">
                    {project.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  {psrBlocks.map(({ key, label, color, labelColor, dot }) => (
                    <div key={key} className={`p-4 rounded-xl border ${color}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                        <p className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>{label}</p>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{project[key]}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t.projects.technologiesUsed}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-xs bg-muted/80 text-foreground/80 px-3 py-1 rounded-md font-mono border border-border/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Galerie médias ───────────────────────────── */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Images className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Galerie
                    </p>
                    {media.length > 0 && (
                      <span className="text-xs text-muted-foreground/60 font-medium">
                        {media.length} fichier{media.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  {media.length > 0 ? (
                    <DialogMediaCarousel items={media} />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2.5 py-8 rounded-xl border border-dashed border-border/60 bg-muted/20 text-center">
                      <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center">
                        <Images className="w-5 h-5 text-muted-foreground/40" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Aucune capture disponible</p>
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">Les médias peuvent être ajoutés depuis l'administration.</p>
                      </div>
                    </div>
                  )}
                </div>

                {(project.demo_url || project.download_url) && (
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-border/60">
                    {project.demo_url && project.demo_url !== "#" && (
                      <Button size="sm" className="bg-nexalion hover:opacity-90 text-sm font-semibold shadow-sm" asChild>
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer" data-testid="link-demo">
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          {t.projects.viewDemo}
                        </a>
                      </Button>
                    )}
                    {project.download_url && (
                      <Button size="sm" variant="outline" className="text-sm font-medium border-border/60 hover:border-primary/40" asChild>
                        <a href={project.download_url} download data-testid="link-download">
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          {t.projects.download}
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}
