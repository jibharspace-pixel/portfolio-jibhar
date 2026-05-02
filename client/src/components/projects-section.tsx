import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Globe,
  Cog,
  Brain,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Project } from "@shared/schema";

const categoryIcons: Record<string, typeof BarChart3> = {
  data: BarChart3,
  web: Globe,
  automation: Cog,
  ai: Brain,
};

const categoryLabels: Record<string, string> = {
  data: "Data & BI",
  web: "Web App",
  automation: "Automatisation",
  ai: "IA & Chatbot",
};

const categoryGradients: Record<string, string> = {
  data: "from-blue-500/25 to-indigo-500/15",
  web: "from-emerald-500/25 to-teal-500/15",
  automation: "from-orange-500/25 to-amber-500/15",
  ai: "from-purple-500/25 to-pink-500/15",
};

const categoryIconColors: Record<string, string> = {
  data: "text-blue-500",
  web: "text-emerald-500",
  automation: "text-orange-500",
  ai: "text-purple-500",
};

const categoryBadgeStyles: Record<string, string> = {
  data: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  web: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  automation: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  ai: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

function ProjectsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video rounded-none" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex gap-1.5">
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
  const [filter, setFilter] = useState<string>("all");

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = filter === "all"
    ? projects
    : projects?.filter((p) => p.category === filter);

  return (
    <section
      id="projets"
      className="py-16 lg:py-24 relative overflow-hidden"
      data-testid="section-projects"
    >
      {/* Fun bg blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary font-semibold"
          >
            <Sparkles className="w-3 h-3 mr-1.5" />
            Portfolio
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Mes <span className="gradient-text">Projets</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez une sélection de projets réalisés dans différents domaines
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              filter === "all"
                ? "text-white border-transparent shadow-md"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
            style={filter === "all" ? {
              background: "linear-gradient(135deg, hsl(258,80%,58%), hsl(200,80%,55%))",
              boxShadow: "0 4px 14px hsl(258,80%,58%,0.35)",
            } : {}}
            data-testid="filter-all"
          >
            Tous
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key];
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  filter === key
                    ? "text-white border-transparent shadow-md"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
                style={filter === key ? {
                  background: "linear-gradient(135deg, hsl(258,80%,58%), hsl(200,80%,55%))",
                  boxShadow: "0 4px 14px hsl(258,80%,58%,0.35)",
                } : {}}
                data-testid={`filter-${key}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <ProjectsSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Une erreur est survenue lors du chargement des projets.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects?.map((project) => {
              const Icon = categoryIcons[project.category];
              return (
                <Card
                  key={project.id}
                  className="group cursor-pointer overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 border border-border/60 hover:border-primary/30 hover:shadow-xl"
                  style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease" }}
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  data-testid={`card-project-${project.id}`}
                >
                  <div className={`aspect-video bg-gradient-to-br ${categoryGradients[project.category]} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: "20px 20px",
                      }}
                    />
                    <Icon className={`w-14 h-14 ${categoryIconColors[project.category]} opacity-70 group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-lg leading-tight">
                        {project.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`shrink-0 rounded-full text-xs font-semibold ${categoryBadgeStyles[project.category]}`}
                      >
                        {categoryLabels[project.category]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs rounded-full">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs rounded-full">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      <span>Voir détails</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedProject && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant="outline"
                      className={`rounded-full ${categoryBadgeStyles[selectedProject.category]}`}
                    >
                      {categoryLabels[selectedProject.category]}
                    </Badge>
                  </div>
                  <DialogTitle className="font-serif text-2xl">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {selectedProject.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  <div className={`aspect-video bg-gradient-to-br ${categoryGradients[selectedProject.category]} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const Icon = categoryIcons[selectedProject.category];
                      return <Icon className={`w-20 h-20 ${categoryIconColors[selectedProject.category]} opacity-60`} />;
                    })()}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
                        Problème
                      </h4>
                      <p className="text-foreground">{selectedProject.problem}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-primary mb-2">
                        Solution
                      </h4>
                      <p className="text-foreground">{selectedProject.solution}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">
                        Résultat
                      </h4>
                      <p className="text-foreground">{selectedProject.result}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                      Technologies utilisées
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="rounded-full">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {selectedProject.demoUrl && (
                      <Button asChild className="rounded-full">
                        <a
                          href={selectedProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid="link-demo"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Voir la démo
                        </a>
                      </Button>
                    )}
                    {selectedProject.downloadUrl && (
                      <Button variant="outline" asChild className="rounded-full">
                        <a
                          href={selectedProject.downloadUrl}
                          download
                          data-testid="link-download"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
