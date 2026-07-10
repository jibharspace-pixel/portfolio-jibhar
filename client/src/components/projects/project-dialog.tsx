import { useEffect } from "react";
import { BarChart3, ExternalLink, Download, Images, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { CATEGORY_ICONS, CATEGORY_STYLES, DEFAULT_STYLE } from "@/lib/project-config";
import { DialogMediaCarousel } from "./dialog-media-carousel";
import type { Project } from "@shared/schema";

interface Props {
  project: Project | null;
  projects: Project[];
  onClose: () => void;
  onSelect: (p: Project) => void;
}

export function ProjectDialog({ project, projects, onClose, onSelect }: Props) {
  const { t } = useLanguage();

  const categoryLabels: Record<string, string> = {
    dashboard: t.projects.filters.dashboard,
    "app-web": t.projects.filters["app-web"],
    "app-mobile": t.projects.filters["app-mobile"],
    "site-web": t.projects.filters["site-web"],
    "excel-vba": t.projects.filters["excel-vba"],
    automatisation: t.projects.filters.automatisation,
  };

  const currentIndex = project ? projects.findIndex((p) => p.id === project.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < projects.length - 1;

  const goPrev = () => { if (hasPrev) onSelect(projects[currentIndex - 1]); };
  const goNext = () => { if (hasNext) onSelect(projects[currentIndex + 1]); };

  // Keyboard navigation
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft"  && currentIndex > 0)                     onSelect(projects[currentIndex - 1]);
      if (e.key === "ArrowRight" && currentIndex < projects.length - 1)   onSelect(projects[currentIndex + 1]);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [project, currentIndex, projects, onSelect, onClose]);

  const psrBlocks = [
    { key: "problem" as const, label: t.projects.problem, color: "border-border/60 bg-muted/40", labelColor: "text-muted-foreground", dot: "bg-muted-foreground" },
    { key: "solution" as const, label: t.projects.solution, color: "border-primary/20 bg-primary/5", labelColor: "text-primary", dot: "bg-primary" },
    { key: "result" as const, label: t.projects.result, color: "border-green-500/20 bg-green-500/5", labelColor: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
  ];

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden p-0 gap-0 [&>button]:hidden">
        {project && (() => {
          const Icon = CATEGORY_ICONS[project.category] ?? BarChart3;
          const style = CATEGORY_STYLES[project.category] ?? DEFAULT_STYLE;
          const media = project.media ?? [];

          return (
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col h-full max-h-[92vh]"
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${style.accentBar} shrink-0`} />

                {/* Banner with close + nav overlay */}
                <div className={`w-full h-32 sm:h-40 bg-gradient-to-br ${style.gradient} flex items-center justify-center relative overflow-hidden shrink-0`}>
                  {/* Blur circles */}
                  <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/8 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5 blur-2xl pointer-events-none" />

                  {/* Category icon */}
                  <Icon className={`w-14 h-14 ${style.iconColor} opacity-80`} />

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm flex items-center justify-center transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Navigation prev/next */}
                  {projects.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
                      <button
                        type="button"
                        onClick={goPrev}
                        disabled={!hasPrev}
                        className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          hasPrev
                            ? "bg-black/25 hover:bg-black/45 text-white backdrop-blur-sm cursor-pointer"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Précédent
                      </button>

                      {/* Counter */}
                      <span className="pointer-events-none bg-black/20 backdrop-blur-sm text-white/80 text-[11px] font-mono px-2.5 py-1 rounded-full">
                        {currentIndex + 1} / {projects.length}
                      </span>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!hasNext}
                        className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          hasNext
                            ? "bg-black/25 hover:bg-black/45 text-white backdrop-blur-sm cursor-pointer"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        Suivant
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-6 pt-5 space-y-5">
                  {/* Title row */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg border ${style.badgeBg}`}>
                        {categoryLabels[project.category] ?? project.category}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl lg:text-3xl font-bold tracking-tight leading-snug text-foreground">
                      {project.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-foreground/75 mt-2">
                      {project.description}
                    </p>
                  </div>

                  {/* PSR blocks */}
                  <div className="space-y-3">
                    {psrBlocks.map(({ key, label, color, labelColor, dot }) => (
                      project[key] && (
                        <div key={key} className={`p-4 rounded-xl border ${color}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                            <p className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>{label}</p>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{project[key]}</p>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Tech stack */}
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

                  {/* Media gallery */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Images className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Galerie</p>
                      {media.length > 0 && (
                        <span className="text-xs text-muted-foreground/60 font-medium">{media.length} fichier{media.length > 1 ? "s" : ""}</span>
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

                  {/* Actions */}
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

                  {/* Keyboard hint */}
                  {projects.length > 1 && (
                    <p className="text-[11px] text-muted-foreground/40 text-center pt-1">
                      Utilise ← → pour naviguer entre les projets
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}
