import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3, Globe, Cog, Brain,
  ExternalLink, Download, ArrowRight,
  Image, Video, Play, ChevronLeft, ChevronRight,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { Project, MediaItem } from "@shared/schema";

const categoryIcons: Record<string, typeof BarChart3> = {
  data: BarChart3, web: Globe, automation: Cog, ai: Brain,
};

const categoryLabels: Record<string, string> = {
  data: "Data & BI", web: "Web App", automation: "Automatisation", ai: "IA & Chatbot",
};

const categoryStyles: Record<string, {
  gradient: string; text: string; border: string; iconColor: string;
  badgeBg: string; glowHover: string;
}> = {
  data: {
    gradient: "from-blue-500/20 via-blue-400/10 to-blue-600/5",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200/60 dark:border-blue-800/40",
    iconColor: "text-blue-500/50",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60",
    glowHover: "hover:shadow-[0_12px_40px_hsl(216,80%,55%,0.18)]",
  },
  web: {
    gradient: "from-primary/15 via-primary/8 to-blue-400/5",
    text: "text-primary",
    border: "border-primary/25",
    iconColor: "text-primary/40",
    badgeBg: "bg-primary/8 text-primary border-primary/20",
    glowHover: "hover:shadow-[0_12px_40px_hsl(216,90%,40%,0.18)]",
  },
  automation: {
    gradient: "from-amber-500/15 via-amber-400/8 to-orange-500/5",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/60 dark:border-amber-800/40",
    iconColor: "text-amber-500/50",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60",
    glowHover: "hover:shadow-[0_12px_40px_hsl(38,90%,50%,0.16)]",
  },
  ai: {
    gradient: "from-purple-500/15 via-purple-400/8 to-indigo-500/5",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200/60 dark:border-purple-800/40",
    iconColor: "text-purple-500/50",
    badgeBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/60",
    glowHover: "hover:shadow-[0_12px_40px_hsl(270,70%,55%,0.16)]",
  },
};

const filters = [
  { key: "all", label: "Tous" },
  { key: "data", label: "Data & BI" },
  { key: "web", label: "Web" },
  { key: "automation", label: "Automatisation" },
  { key: "ai", label: "IA" },
];

// ─── Media carousel (dialog) ──────────────────────────────────────────────────

function MediaCarousel({ items }: { items: MediaItem[] }) {
  const [idx, setIdx] = useState(0);
  if (!items.length) return null;
  const current = items[idx];
  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-md">
        {current.media_type === "image" ? (
          <img src={current.url} alt="" className="w-full h-full object-contain" />
        ) : (
          <video src={current.url} controls className="w-full h-full object-contain" />
        )}
        {/* Type badge */}
        <span className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold shadow backdrop-blur-sm ${
          current.media_type === "image"
            ? "bg-white/90 text-blue-700"
            : "bg-white/90 text-purple-700"
        }`}>
          {current.media_type === "image" ? <Image className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {current.media_type === "image" ? "Photo" : "Vidéo"}
        </span>
        {/* Counter */}
        {items.length > 1 && (
          <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-black/50 text-white font-medium backdrop-blur-sm">
            {idx + 1} / {items.length}
          </span>
        )}
        {/* Nav arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => setIdx((i) => (i - 1 + items.length) % items.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/65 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % items.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/65 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      {/* Thumbnails strip */}
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIdx(i)}
              className={`shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx
                  ? "border-primary shadow-[0_0_0_2px_hsl(216,90%,40%,0.25)]"
                  : "border-transparent opacity-55 hover:opacity-90"
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

// ─── Card thumbnail (16:9, large) ─────────────────────────────────────────────

function CardThumbnail({ project }: { project: Project }) {
  const style = categoryStyles[project.category];
  const Icon = categoryIcons[project.category];
  const firstMedia = project.media?.[0];
  const mediaCount = project.media?.length ?? 0;

  if (!firstMedia) {
    return (
      <div className={`relative w-full aspect-video bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center overflow-hidden border-b border-border/40`}>
        {/* Soft decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10 blur-lg" />
        <Icon className={`w-14 h-14 ${style.iconColor} relative z-10`} />
        <div className="flex items-center gap-1.5 mt-3 relative z-10">
          <Layers className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-[11px] text-muted-foreground/60 font-medium tracking-wide">Aucun média · Ajoutez via l'admin</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden border-b border-border/40 bg-black">
      {firstMedia.media_type === "image" ? (
        <img
          src={firstMedia.url}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <>
          <video src={firstMedia.url} className="w-full h-full object-cover" muted playsInline />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
              <Play className="w-5 h-5 text-foreground ml-0.5" />
            </div>
          </div>
        </>
      )}
      {/* Media type + count pill */}
      {mediaCount > 1 && (
        <span className="absolute top-3 right-3 bg-black/55 text-white text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm flex items-center gap-1.5">
          {project.media?.some(m => m.media_type === "image") && <Image className="w-3 h-3" />}
          {project.media?.some(m => m.media_type === "video") && <Video className="w-3 h-3" />}
          {mediaCount} médias
        </span>
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("all");

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filtered = filter === "all" ? projects : projects?.filter((p) => p.category === filter);

  return (
    <section id="projets" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-projects">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-400/4 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* Header */}
        <ScrollReveal className="mb-12">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            Portfolio
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Mes Projets
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full mb-4" />
          <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
            Découvrez une sélection de projets réalisés dans différents domaines.
          </p>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={80} className="flex flex-wrap gap-2 mb-10">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 border ${
                filter === key
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50"
              }`}
              data-testid={`filter-${key}`}
            >
              {label}
            </button>
          ))}
        </ScrollReveal>

        {/* Grid */}
        {isLoading ? (
          <ProjectsSkeleton />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Une erreur est survenue lors du chargement.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((project, i) => {
              const style = categoryStyles[project.category];
              const hasMedia = (project.media?.length ?? 0) > 0;
              return (
                <ScrollReveal key={project.id} delay={i * 80}>
                  <div
                    className={`group cursor-pointer rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${style.glowHover} ${
                      hasMedia
                        ? `${style.border} hover:border-opacity-80`
                        : "border-border/60 hover:border-primary/25"
                    }`}
                    onClick={() => setSelectedProject(project)}
                    data-testid={`card-project-${project.id}`}
                  >
                    {/* Thumbnail — 16:9, large */}
                    <CardThumbnail project={project} />

                    <div className="p-5">
                      {/* Category badge + title */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border mb-2 ${style.badgeBg}`}>
                          {categoryLabels[project.category]}
                        </span>
                        <h3 className="font-serif font-bold text-base leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
                          {project.title}
                        </h3>
                      </div>

                      {/* Description — up to 3 lines */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="text-xs bg-muted/80 text-muted-foreground px-2 py-0.5 rounded font-mono border border-border/40">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-xs bg-muted/80 text-muted-foreground px-2 py-0.5 rounded font-mono border border-border/40">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <span>Voir le projet</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {hasMedia && (
                            <span className="flex items-center gap-1">
                              {project.media?.some(m => m.media_type === "image") && <Image className="w-3 h-3" />}
                              {project.media?.some(m => m.media_type === "video") && <Video className="w-3 h-3" />}
                              <span>{project.media?.length}</span>
                            </span>
                          )}
                          {(project.demoUrl && project.demoUrl !== "#") && (
                            <ExternalLink className="w-3 h-3" />
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

      {/* Detail dialog — full project view */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0">
          {selectedProject && (() => {
            const Icon = categoryIcons[selectedProject.category];
            const style = categoryStyles[selectedProject.category];
            const media = selectedProject.media ?? [];
            return (
              <>
                {/* Dialog hero: media or gradient placeholder */}
                {media.length > 0 ? (
                  <div className="p-5 pb-0">
                    <MediaCarousel items={media} />
                  </div>
                ) : (
                  <div className={`w-full aspect-video bg-gradient-to-br ${style.gradient} flex items-center justify-center relative overflow-hidden rounded-t-lg`}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                    <Icon className={`w-20 h-20 ${style.iconColor}`} />
                  </div>
                )}

                <div className="p-6 pt-5 space-y-5">
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg border ${style.badgeBg}`}>
                        {categoryLabels[selectedProject.category]}
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
                    {[
                      {
                        label: "Problème",
                        value: selectedProject.problem,
                        color: "border-border/60 bg-muted/40",
                        labelColor: "text-muted-foreground",
                        dot: "bg-muted-foreground",
                      },
                      {
                        label: "Solution",
                        value: selectedProject.solution,
                        color: "border-primary/20 bg-primary/5",
                        labelColor: "text-primary",
                        dot: "bg-primary",
                      },
                      {
                        label: "Résultat",
                        value: selectedProject.result,
                        color: "border-green-500/20 bg-green-500/5",
                        labelColor: "text-green-600 dark:text-green-400",
                        dot: "bg-green-500",
                      },
                    ].map(({ label, value, color, labelColor, dot }) => (
                      <div key={label} className={`p-4 rounded-xl border ${color}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                          <p className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>{label}</p>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Technologies utilisées</p>
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
                            Voir la démo
                          </a>
                        </Button>
                      )}
                      {selectedProject.downloadUrl && (
                        <Button size="sm" variant="outline" className="text-sm font-medium border-border/60 hover:border-primary/40" asChild>
                          <a href={selectedProject.downloadUrl} download data-testid="link-download">
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Télécharger
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
