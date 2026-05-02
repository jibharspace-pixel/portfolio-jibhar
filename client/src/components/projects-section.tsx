import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3, Globe, Cog, Brain,
  ExternalLink, Download, ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import type { Project } from "@shared/schema";

const categoryIcons: Record<string, typeof BarChart3> = {
  data: BarChart3, web: Globe, automation: Cog, ai: Brain,
};

const categoryLabels: Record<string, string> = {
  data: "Data & BI", web: "Web App", automation: "Automatisation", ai: "IA & Chatbot",
};

const categoryStyles: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  data:       { bg: "bg-blue-50 dark:bg-blue-950/30",   text: "text-blue-600 dark:text-blue-400",   border: "border-blue-200/60 dark:border-blue-800/40",   icon: "text-blue-400" },
  web:        { bg: "bg-primary/5",                      text: "text-primary",                        border: "border-primary/20",                              icon: "text-primary/40" },
  automation: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200/60 dark:border-amber-800/40",   icon: "text-amber-400" },
  ai:         { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200/60 dark:border-purple-800/40", icon: "text-purple-400" },
};

const filters = [
  { key: "all", label: "Tous" },
  { key: "data", label: "Data & BI" },
  { key: "web", label: "Web" },
  { key: "automation", label: "Automatisation" },
  { key: "ai", label: "IA" },
];

function ProjectsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="border border-border/60 overflow-hidden">
          <Skeleton className="h-32" />
          <CardContent className="p-5">
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-3/4 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("all");

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filtered = filter === "all" ? projects : projects?.filter((p) => p.category === filter);

  return (
    <section id="projets" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-projects">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* Header */}
        <div className="mb-12">
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
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 border ${
                filter === key
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50"
              }`}
              data-testid={`filter-${key}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <ProjectsSkeleton />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Une erreur est survenue lors du chargement.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered?.map((project) => {
              const Icon = categoryIcons[project.category];
              const style = categoryStyles[project.category];
              return (
                <Card
                  key={project.id}
                  className="group cursor-pointer border border-border/60 overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5"
                  onClick={() => setSelectedProject(project)}
                  data-testid={`card-project-${project.id}`}
                >
                  {/* Thumbnail */}
                  <div className={`h-32 ${style.bg} ${style.border} border-b flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-grid opacity-40" />
                    <Icon className={`w-12 h-12 ${style.icon} relative`} />
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm leading-snug text-foreground">{project.title}</h3>
                      <Badge variant="outline" className={`shrink-0 text-xs rounded-md font-medium ${style.text} border-current/20`}>
                        {categoryLabels[project.category]}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                      <span>Voir détails</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (() => {
            const Icon = categoryIcons[selectedProject.category];
            const style = categoryStyles[selectedProject.category];
            return (
              <>
                <DialogHeader>
                  <div className="mb-2">
                    <Badge variant="outline" className={`text-xs rounded-md font-medium ${style.text}`}>
                      {categoryLabels[selectedProject.category]}
                    </Badge>
                  </div>
                  <DialogTitle className="font-serif text-2xl tracking-tight">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed">
                    {selectedProject.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-4">
                  {/* Thumbnail */}
                  <div className={`h-36 rounded-xl ${style.bg} flex items-center justify-center border ${style.border} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-grid opacity-30" />
                    <Icon className={`w-16 h-16 ${style.icon} relative`} />
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    {[
                      { label: "Problème", value: selectedProject.problem, color: "border-border/60 bg-muted/40", labelColor: "text-muted-foreground" },
                      { label: "Solution", value: selectedProject.solution, color: "border-primary/20 bg-primary/5", labelColor: "text-primary" },
                      { label: "Résultat", value: selectedProject.result, color: "border-green-500/20 bg-green-500/5", labelColor: "text-green-600 dark:text-green-400" },
                    ].map(({ label, value, color, labelColor }) => (
                      <div key={label} className={`p-4 rounded-xl border ${color}`}>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${labelColor}`}>{label}</p>
                        <p className="text-sm text-foreground leading-relaxed">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span key={tech} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-md font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2 border-t border-border/60">
                    {selectedProject.demoUrl && (
                      <Button size="sm" className="bg-nexalion hover:opacity-90 text-sm font-medium" asChild>
                        <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" data-testid="link-demo">
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          Voir la démo
                        </a>
                      </Button>
                    )}
                    {selectedProject.downloadUrl && (
                      <Button size="sm" variant="outline" className="text-sm font-medium border-border/60" asChild>
                        <a href={selectedProject.downloadUrl} download data-testid="link-download">
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          Télécharger
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </section>
  );
}
