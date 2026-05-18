import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  ExternalLink, Download, ArrowRight,
  Image as ImageIcon, Video, Play, ChevronLeft, ChevronRight,
  Layers, Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";
import {
  CATEGORY_ICONS, CATEGORY_STYLES,
  DEFAULT_STYLE, PROJECT_FILTERS,
} from "@/lib/project-config";
import type { Project, MediaItem } from "@shared/schema";

// ─── In-card media carousel with nav buttons ──────────────────────────────────

function CardMediaCarousel({ project, onOpenDialog, viewLabel }: { project: Project; onOpenDialog: () => void; viewLabel: string }) {
  const [idx, setIdx] = useState(0);
  const [slideClass, setSlideClass] = useState("");
  const style = CATEGORY_STYLES[project.category] ?? DEFAULT_STYLE;
  const Icon = CATEGORY_ICONS[project.category] ?? BarChart3;
  const media = project.media ?? [];
  const count = media.length;

  const navigate = useCallback((dir: 1 | -1, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideClass(dir === 1 ? "media-slide-right" : "media-slide-left");
    setIdx((i) => (i + dir + count) % count);
    setTimeout(() => setSlideClass(""), 300);
  }, [count]);

  const goTo = useCallback((i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideClass(i > idx ? "media-slide-right" : "media-slide-left");
    setIdx(i);
    setTimeout(() => setSlideClass(""), 300);
  }, [idx]);

  // ── Empty placeholder ──
  if (count === 0) {
    return (
      <div
        className={`relative w-full aspect-video bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center overflow-hidden border-b border-border/40 cursor-pointer`}
        onClick={onOpenDialog}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/8 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/8 blur-xl" />
        <Icon className={`w-14 h-14 ${style.iconColor} relative z-10 transition-transform duration-300 group-hover:scale-110`} />
        <div className="flex items-center gap-1.5 mt-3 relative z-10">
          <Layers className="w-3 h-3 text-muted-foreground/40" />
          <span className="text-[11px] text-muted-foreground/50 font-medium">Aucun média · Ajoutez via l'admin</span>
        </div>
        {/* View hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 flex items-center justify-center transition-all duration-200">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2 bg-black/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Eye className="w-3 h-3" /> {viewLabel}
          </div>
        </div>
      </div>
    );
  }

  const current = media[idx];

  return (
    <div
      className="relative w-full aspect-video overflow-hidden bg-black border-b border-border/40 group/carousel cursor-pointer"
      onClick={onOpenDialog}
    >
      {/* ── Current media ── */}
      <div key={`${project.id}-${idx}`} className={`w-full h-full ${slideClass}`}>
        {current.media_type === "image" ? (
          <img
            src={current.url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/carousel:scale-[1.03]"
          />
        ) : (
          <>
            <video src={current.url} className="w-full h-full object-cover" muted playsInline />
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover/carousel:scale-110">
                <Play className="w-5 h-5 text-foreground ml-0.5" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Gradient overlay bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* ── Prev / Next buttons ── */}
      {count > 1 && (
        <>
          <button
            onClick={(e) => navigate(-1, e)}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-150 opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-95 z-20"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => navigate(1, e)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-150 opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-95 z-20"
            aria-label="Suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {count > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={(e) => goTo(i, e)}
              className={`h-1.5 rounded-full transition-all duration-250 ${
                i === idx
                  ? "bg-white dot-active shadow-md"
                  : "bg-white/50 w-1.5 hover:bg-white/80"
              }`}
              style={i === idx ? { width: "1.5rem" } : { width: "0.375rem" }}
              aria-label={`Média ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Type badge top-left ── */}
      <span className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm shadow-sm z-10 ${
        current.media_type === "image" ? "bg-white/88 text-blue-700" : "bg-white/88 text-purple-700"
      }`}>
        {current.media_type === "image" ? <ImageIcon className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
        {count > 1 ? `${idx + 1} / ${count}` : (current.media_type === "image" ? "Photo" : "Vidéo")}
      </span>

      {/* ── View overlay hint ── */}
      <div className="absolute inset-0 bg-black/0 group-hover/carousel:bg-black/10 transition-all duration-200 pointer-events-none z-10" />
    </div>
  );
}

// ─── Dialog media carousel ────────────────────────────────────────────────────

function DialogMediaCarousel({ items }: { items: MediaItem[] }) {
  const [idx, setIdx] = useState(0);
  const [slideClass, setSlideClass] = useState("");
  if (!items.length) return null;
  const current = items[idx];
  const count = items.length;

  const navigate = (dir: 1 | -1) => {
    setSlideClass(dir === 1 ? "media-slide-right" : "media-slide-left");
    setIdx((i) => (i + dir + count) % count);
    setTimeout(() => setSlideClass(""), 300);
  };

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-md">
        <div key={`dialog-${idx}`} className={`w-full h-full ${slideClass}`}>
          {current.media_type === "image" ? (
            <img src={current.url} alt="" className="w-full h-full object-contain" />
          ) : (
            <video src={current.url} controls className="w-full h-full object-contain" />
          )}
        </div>
        <span className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold shadow backdrop-blur-sm z-10 ${
          current.media_type === "image" ? "bg-white/90 text-blue-700" : "bg-white/90 text-purple-700"
        }`}>
          {current.media_type === "image" ? <ImageIcon className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {current.media_type === "image" ? "Photo" : "Vidéo"}
        </span>
        {count > 1 && (
          <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-black/55 text-white font-medium backdrop-blur-sm">
            {idx + 1} / {count}
          </span>
        )}
        {count > 1 && (
          <>
            <button onClick={() => navigate(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/45 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm hover:scale-110 active:scale-95">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => navigate(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/45 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm hover:scale-110 active:scale-95">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  style={i === idx ? { width: "1.5rem" } : { width: "0.5rem" }}
                  className={`h-2 rounded-full transition-all duration-250 ${i === idx ? "bg-white shadow" : "bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {/* Thumbnails strip */}
      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIdx(i)}
              className={`shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx ? "border-primary shadow-[0_0_0_2px_hsl(216,90%,40%,0.2)]" : "border-transparent opacity-50 hover:opacity-90"
              }`}
            >
              {item.media_type === "image" ? (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProjectsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-2xl border border-border/60 overflow-hidden bg-card">
          <Skeleton className="w-full aspect-video" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-2/3" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-5 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("all");

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Build translated filter buttons from PROJECT_FILTERS keys + i18n labels
  const filterButtons = PROJECT_FILTERS.map(({ key }) => ({
    key,
    label: (t.projects.filters as Record<string, string>)[key] ?? key,
  }));

  // Build CATEGORY_LABELS from i18n
  const categoryLabels: Record<string, string> = {
    data: t.projects.filters.data,
    web: t.projects.filters.web,
    automation: t.projects.filters.automation,
    logistique: t.projects.filters.logistique,
  };

  const filtered = filter === "all" ? projects : projects?.filter((p) => p.category === filter);

  // PSR block definitions (translated)
  const psrBlocks = [
    { key: "problem" as const, label: t.projects.problem, color: "border-border/60 bg-muted/40", labelColor: "text-muted-foreground", dot: "bg-muted-foreground" },
    { key: "solution" as const, label: t.projects.solution, color: "border-primary/20 bg-primary/5", labelColor: "text-primary", dot: "bg-primary" },
    { key: "result" as const, label: t.projects.result, color: "border-green-500/20 bg-green-500/5", labelColor: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
  ];

  return (
    <section id="projets" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-projects">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-purple-400/4 rounded-full blur-[80px] pointer-events-none animate-glow-pulse delay-400" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* Header */}
        <ScrollReveal className="mb-12">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            {t.projects.badge}
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t.projects.title}
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full mb-4" />
          <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
            {t.projects.subtitle}
          </p>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={80} className="mb-10">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {filterButtons.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border whitespace-nowrap shrink-0 ${
                  filter === key
                    ? "bg-primary text-white border-primary shadow-sm scale-[1.02]"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50"
                }`}
                data-testid={`filter-${key}`}
              >
                {label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Grid */}
        {isLoading ? (
          <ProjectsSkeleton />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">{t.projects.errorLoading}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((project, i) => {
              const style = CATEGORY_STYLES[project.category] ?? DEFAULT_STYLE;
              const hasMedia = (project.media?.length ?? 0) > 0;
              return (
                <ScrollReveal key={project.id} delay={i * 80} className="h-full">
                  <div
                    className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-2 card-shine h-full ${style.glowHover} ${
                      hasMedia ? `${style.border}` : "border-border/60 hover:border-primary/25"
                    }`}
                    data-testid={`card-project-${project.id}`}
                  >
                    {/* Gradient top accent line */}
                    <div className={`h-[3px] w-full bg-gradient-to-r ${style.accentBar} shrink-0`} />

                    {/* ── In-card media carousel ── */}
                    <CardMediaCarousel
                      project={project}
                      onOpenDialog={() => setSelectedProject(project)}
                      viewLabel={t.projects.viewProject}
                    />

                    {/* ── Card body ── */}
                    <div
                      className="flex flex-col flex-1 p-5 cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      {/* Category + title */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border mb-2 ${style.badgeBg}`}>
                          {categoryLabels[project.category] ?? project.category}
                        </span>
                        <h3 className="font-serif font-bold text-base leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
                          {project.title}
                        </h3>
                      </div>

                      {/* Description — 3 lines max in card */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="text-xs bg-muted/80 text-muted-foreground px-2 py-0.5 rounded font-mono border border-border/40 transition-colors group-hover:border-primary/20">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-xs bg-muted/80 text-muted-foreground px-2 py-0.5 rounded font-mono border border-border/40">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Footer row */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all duration-200">
                          <span>{t.projects.viewProject}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {hasMedia && (
                            <span className="flex items-center gap-1">
                              {project.media?.some(m => m.media_type === "image") && <ImageIcon className="w-3 h-3" />}
                              {project.media?.some(m => m.media_type === "video") && <Video className="w-3 h-3" />}
                              <span className="text-muted-foreground/70">{project.media?.length}</span>
                            </span>
                          )}
                          {project.demoUrl && project.demoUrl !== "#" && (
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail dialog ── */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0">
          {selectedProject && (() => {
            const Icon = CATEGORY_ICONS[selectedProject.category] ?? BarChart3;
            const style = CATEGORY_STYLES[selectedProject.category] ?? DEFAULT_STYLE;
            const media = selectedProject.media ?? [];
            return (
              <>
                {/* Accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${style.accentBar} shrink-0`} />

                {/* Media or placeholder */}
                {media.length > 0 ? (
                  <div className="p-5 pb-0">
                    <DialogMediaCarousel items={media} />
                  </div>
                ) : (
                  <div className={`w-full aspect-video bg-gradient-to-br ${style.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/8 blur-3xl" />
                    <Icon className={`w-20 h-20 ${style.iconColor}`} />
                  </div>
                )}

                <div className="p-6 pt-5 space-y-5">
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg border ${style.badgeBg}`}>
                        {categoryLabels[selectedProject.category] ?? selectedProject.category}
                      </span>
                    </div>
                    <DialogTitle className="font-serif text-2xl lg:text-3xl tracking-tight leading-snug">
                      {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed text-foreground/80 mt-2">
                      {selectedProject.description}
                    </DialogDescription>
                  </DialogHeader>

                  {/* PSR blocks */}
                  <div className="space-y-3">
                    {psrBlocks.map(({ key, label, color, labelColor, dot }) => (
                      <div key={key} className={`p-4 rounded-xl border ${color}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                          <p className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>{label}</p>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{(selectedProject as any)[key]}</p>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t.projects.technologiesUsed}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span key={tech} className="text-xs bg-muted/80 text-foreground/80 px-3 py-1 rounded-md font-mono border border-border/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {(selectedProject.demoUrl || selectedProject.downloadUrl) && (
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-border/60">
                      {selectedProject.demoUrl && selectedProject.demoUrl !== "#" && (
                        <Button size="sm" className="bg-nexalion hover:opacity-90 text-sm font-semibold shadow-sm" asChild>
                          <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" data-testid="link-demo">
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            {t.projects.viewDemo}
                          </a>
                        </Button>
                      )}
                      {selectedProject.downloadUrl && (
                        <Button size="sm" variant="outline" className="text-sm font-medium border-border/60 hover:border-primary/40" asChild>
                          <a href={selectedProject.downloadUrl} download data-testid="link-download">
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
    </section>
  );
}
