import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Globe,
  Cog,
  Brain,
  ExternalLink,
  ChevronRight,
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

const categoryColors: Record<string, string> = {
  data: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  web: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  automation: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  ai: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

function ProjectsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <Skeleton className="aspect-video rounded-t-lg" />
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
              <Skeleton className="h-5 w-12 rounded-full" />
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
      className="py-16 lg:py-24"
      data-testid="section-projects"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Portfolio
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Mes Projets
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez une sélection de projets réalisés dans différents domaines
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            data-testid="filter-all"
          >
            Tous
          </Button>
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key];
            return (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key)}
                className="flex items-center gap-2"
                data-testid={`filter-${key}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
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
                  className="group cursor-pointer overflow-visible hover-elevate active-elevate-2 transition-all duration-300"
                  onClick={() => setSelectedProject(project)}
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-t-lg flex items-center justify-center">
                    <Icon className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-lg leading-tight">
                        {project.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`shrink-0 ${categoryColors[project.category]}`}
                      >
                        {categoryLabels[project.category]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-4 text-sm text-primary font-medium">
                      <span>Voir détails</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
                      className={categoryColors[selectedProject.category]}
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
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                    {(() => {
                      const Icon = categoryIcons[selectedProject.category];
                      return <Icon className="w-20 h-20 text-muted-foreground/30" />;
                    })()}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
                        Problème
                      </h4>
                      <p className="text-foreground">{selectedProject.problem}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-primary mb-2">
                        Solution
                      </h4>
                      <p className="text-foreground">{selectedProject.solution}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">
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
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {selectedProject.demoUrl && (
                      <Button asChild>
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
                      <Button variant="outline" asChild>
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
