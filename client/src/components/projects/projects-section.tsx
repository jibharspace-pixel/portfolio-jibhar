import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";
import { PROJECT_FILTERS } from "@/lib/project-config";
import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";
import { ProjectsSkeleton } from "./projects-skeleton";
import type { Project } from "@shared/schema";

export function ProjectsSection() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("all");

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filterButtons = PROJECT_FILTERS.map(({ key }) => ({
    key,
    label: (t.projects.filters as Record<string, string>)[key] ?? key,
  }));

  const categoryLabels: Record<string, string> = {
    dashboard: t.projects.filters.dashboard,
    "app-web": t.projects.filters["app-web"],
    "app-mobile": t.projects.filters["app-mobile"],
    "site-web": t.projects.filters["site-web"],
    "excel-vba": t.projects.filters["excel-vba"],
    automatisation: t.projects.filters.automatisation,
  };

  const filtered = filter === "all" ? projects : projects?.filter((p) => p.category === filter);

  return (
    <section id="projets" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-projects">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-purple-400/4 rounded-full blur-[80px] pointer-events-none animate-glow-pulse delay-400" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
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

        <ScrollReveal delay={80} className="mb-10">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {filterButtons.map(({ key, label }) => (
              <button
                key={key}
                type="button"
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

        {isLoading ? (
          <ProjectsSkeleton />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">{t.projects.errorLoading}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onSelect={setSelectedProject}
                categoryLabels={categoryLabels}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
