import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";
import { CATEGORY_STYLES, CATEGORY_ICONS, DEFAULT_STYLE } from "@/lib/project-config";
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
  const style   = CATEGORY_STYLES[project.category as string] ?? DEFAULT_STYLE;
  const Icon    = CATEGORY_ICONS[project.category as string];
  const hasMedia = (project.media?.length ?? 0) > 0;
  const hasDemo  = !!project.demo_url && project.demo_url !== "#";

  return (
    <ScrollReveal delay={index * 80} className="h-full">
      <motion.div
        whileHover={{ y: -8, transition: { type: "spring", stiffness: 340, damping: 22 } }}
        className={`group relative flex flex-col rounded-2xl bg-card overflow-hidden h-full cursor-pointer border border-border/50 ${style.glowHover} transition-all duration-300`}
        data-testid={`card-project-${project.id}`}
        onClick={() => onSelect(project)}
      >
        {/* ── Gradient border top line ─────────────────── */}
        <div className={`h-[3px] w-full bg-gradient-to-r ${style.accentBar} shrink-0`} />

        {/* ── Visual header ────────────────────────────── */}
        {hasMedia ? (
          <CardMediaCarousel
            project={project}
            onOpenDialog={() => onSelect(project)}
            viewLabel={t.projects.viewProject}
          />
        ) : (
          <div className={`relative h-[130px] bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden shrink-0`}>
            {/* Icon glow */}
            {Icon && (
              <>
                <div className={`absolute w-28 h-28 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${style.accentBar}`} />
                <div className={`relative z-10 p-4 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-lg ${style.border}`}>
                  <Icon className={`w-8 h-8 ${style.text}`} />
                </div>
              </>
            )}
            {/* Corner shimmer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute top-0 left-0 w-1/2 h-full"
                style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)" }}
              />
            </div>
          </div>
        )}

        {/* ── Content ──────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-5">

          {/* Badge + title */}
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mb-2.5 ${style.badgeBg}`}>
              {Icon && <Icon className="w-3 h-3" />}
              {categoryLabels[project.category] ?? project.category}
            </span>
            <h3 className="font-serif font-bold text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md border bg-muted/50 text-muted-foreground border-border/50 group-hover:border-primary/20 group-hover:text-foreground/70 transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border bg-muted/50 text-muted-foreground border-border/50">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-primary"
              tabIndex={-1}
            >
              <span>{t.projects.viewProject}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {hasDemo && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all duration-200 ${style.badgeBg} hover:opacity-80`}
              >
                <ExternalLink className="w-3 h-3" />
                Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}
