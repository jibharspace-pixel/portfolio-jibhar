import { ArrowRight, ExternalLink, Image as ImageIcon, Video } from "lucide-react";
import { motion } from "framer-motion";
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
      <motion.div
        whileHover={{ y: -10, transition: { type: "spring", stiffness: 320, damping: 20 } }}
        className="group relative flex flex-col rounded-2xl bg-card overflow-hidden h-full card-premium-hover gradient-border border border-border/50"
        data-testid={`card-project-${project.id}`}
        onClick={() => onSelect(project)}
      >
        {/* Top accent gradient bar */}
        <div className={`h-[2px] w-full bg-gradient-to-r ${style.accentBar} shrink-0`} />

        {/* Shine sweep */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl">
          <motion.div
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute top-0 left-0 w-1/2 h-full"
            style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)" }}
          />
        </div>

        <CardMediaCarousel
          project={project}
          onOpenDialog={() => onSelect(project)}
          viewLabel={t.projects.viewProject}
        />

        <div className="flex flex-col flex-1 p-5 cursor-pointer">
          <div className="mb-3">
            <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mb-2.5 ${style.badgeBg}`}>
              {categoryLabels[project.category] ?? project.category}
            </span>
            <h3 className="font-serif font-bold text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>
          </div>

          <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="text-[11px] font-mono px-2 py-0.5 rounded-md border bg-muted/60 text-muted-foreground border-border/40 transition-colors duration-200 group-hover:border-primary/20">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border bg-muted/60 text-muted-foreground border-border/40">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-3 transition-all duration-300">
              <span>{t.projects.viewProject}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              {hasMedia && (
                <span className="flex items-center gap-1">
                  {project.media?.some(m => m.media_type === "image") && <ImageIcon className="w-3 h-3" />}
                  {project.media?.some(m => m.media_type === "video") && <Video className="w-3 h-3" />}
                  <span>{project.media?.length}</span>
                </span>
              )}
              {project.demo_url && project.demo_url !== "#" && (
                <ExternalLink className="w-3 h-3 opacity-40" />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}
