import { useEffect } from "react";
import { ExternalLink, Download, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { CATEGORY_STYLES, DEFAULT_STYLE } from "@/lib/project-config";
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

  const narrativeKeys = ["problem", "solution", "result"] as const;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[92vh] overflow-hidden p-0 gap-0 [&>button]:hidden flex flex-col">
        {project && (() => {
          const style = CATEGORY_STYLES[project.category] ?? DEFAULT_STYLE;

          return (
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col flex-1 min-h-0"
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${style.accentBar} shrink-0`} />

                {/* Compact toolbar: nav + close */}
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border/60 bg-muted/30 shrink-0">
                  {projects.length > 1 ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={goPrev}
                        disabled={!hasPrev}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          hasPrev
                            ? "text-foreground/80 hover:bg-muted hover:text-foreground cursor-pointer"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Précédent
                      </button>

                      <span className="text-[11px] font-mono text-muted-foreground/70 px-1">
                        {currentIndex + 1} / {projects.length}
                      </span>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!hasNext}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          hasNext
                            ? "text-foreground/80 hover:bg-muted hover:text-foreground cursor-pointer"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        Suivant
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-colors shrink-0"
                    aria-label="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 min-h-0 overflow-y-auto p-6 pt-5 space-y-5">
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

                  {/* Narrative */}
                  <div className="space-y-3">
                    {narrativeKeys.map((key) => (
                      project[key] && (
                        <p key={key} className="text-sm text-foreground/80 leading-relaxed">
                          {project[key]}
                        </p>
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
