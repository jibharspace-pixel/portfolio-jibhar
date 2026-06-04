import { ArrowRight, ExternalLink, Image as ImageIcon, Video } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";
import { CATEGORY_STYLES, DEFAULT_STYLE } from "@/lib/project-config";
import { CardMediaCarousel } from "./card-media-carousel";
import type { Project } from "@shared/schema";

interface Props {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
  categoryLabels: Record<string, string>;
}

export function ProjectCard({ project, index, onSelect, categoryLabels }: Props) {
  const { t } = useLanguage();
  const style = CATEGORY_STYLES[project.category as string] ?? DEFAULT_STYLE;
  const hasMedia = (project.media?.length ?? 0) > 0;

  return (
    <ScrollReveal delay={index * 80} className="h-full">
      <div
        className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-2 card-shine h-full ${style.glowHover} ${
          hasMedia ? `${style.border}` : "border-border/60 hover:border-primary/25"
        }`}
        data-testid={`card-project-${project.id}`}
      >
        <div className={`h-[3px] w-full bg-gradient-to-r ${style.accentBar} shrink-0`} />

        <CardMediaCarousel
          project={project}
          onOpenDialog={() => onSelect(project)}
          viewLabel={t.projects.viewProject}
        />

        <div
          className="flex flex-col flex-1 p-5 cursor-pointer"
          onClick={() => onSelect(project)}
        >
          <div className="mb-3">
            <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border mb-2 ${style.badgeBg}`}>
              {categoryLabels[project.category] ?? project.category}
            </span>
            <h3 className="font-serif font-bold text-base leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

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

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
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
              {project.demo_url && project.demo_url !== "#" && (
                <ExternalLink className="w-3 h-3 opacity-50" />
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
