import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Calendar, BarChart3, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/components/theme-provider";
import type { Project, BlogPost } from "@shared/schema";

const categoryGradients: Record<string, string> = {
  logistique:     "from-blue-500 to-blue-600",
  automatisation: "from-amber-500 to-orange-500",
  data:           "from-primary to-blue-500",
  ia:             "from-purple-500 to-violet-600",
  web:            "from-green-500 to-emerald-600",
};

const categoryColors: Record<string, string> = {
  logistique:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  automatisation: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  data:           "bg-primary/10 text-primary border-primary/20",
  ia:             "bg-purple-500/10 text-purple-400 border-purple-500/20",
  web:            "bg-green-500/10 text-green-400 border-green-500/20",
};

// ── Section header ─────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  num: string;
  label: string;
  title: string;
  href: string;
  linkLabel?: string;
}

function SectionHeader({ num, label, title, href, linkLabel = "Voir tous" }: SectionHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ScrollReveal>
      {/* Ghost number — same pattern as hero "01" */}
      <div
        aria-hidden
        className={`section-ghost-num absolute top-0 right-0 select-none pointer-events-none font-serif font-black leading-none ${isDark ? "text-white/[0.022]" : "text-black/[0.028]"}`}
      >
        {num}
      </div>

      {/* Label row */}
      <div className="flex items-center gap-3 mb-5">
        <span className="font-mono text-[11px] font-bold text-primary tracking-[0.25em] uppercase">{num}</span>
        <div className="w-6 h-px bg-gradient-to-r from-primary to-transparent" />
        <span className="font-mono text-[11px] text-primary/70 tracking-[0.22em] uppercase">{label}</span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <h2 className="font-serif font-black text-[2.2rem] sm:text-[2.8rem] lg:text-[3.5rem] tracking-tight leading-[1.0] text-foreground">
          {title}
        </h2>
        <Link href={href}>
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary shrink-0 cursor-pointer group"
          >
            {linkLabel}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.div>
        </Link>
      </div>
      <div className="divider-glow mt-6 mb-10" />
    </ScrollReveal>
  );
}

// ── Portfolio preview ──────────────────────────────────────────────────────────
export function ProjectsPreviewSection() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Project | null>(null);
  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const preview = projects?.slice(0, 3) ?? [];

  const categoryLabels: Record<string, string> = {
    dashboard:      t.projects.filters.dashboard,
    "app-web":      t.projects.filters["app-web"],
    "app-mobile":   t.projects.filters["app-mobile"],
    "site-web":     t.projects.filters["site-web"],
    "excel-vba":    t.projects.filters["excel-vba"],
    automatisation: t.projects.filters.automatisation,
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.04] orb-blue" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          num="02"
          label="Portfolio"
          title={t.projects.title}
          href="/projets"
        />

        {preview.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {preview.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                onSelect={setSelected}
                categoryLabels={categoryLabels}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border/40 bg-muted/20">
            <BarChart3 className="w-10 h-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">Aucun projet pour l'instant</p>
          </div>
        )}

        <div className="flex justify-center mt-10 sm:hidden">
          <Link href="/projets">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Voir tous les projets <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>

      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

// ── Blog preview ───────────────────────────────────────────────────────────────
export function BlogPreviewSection() {
  const { t } = useLanguage();
  const { data: posts } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });

  const published = posts?.filter(p => p.status === "published").slice(0, 3) ?? [];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.04] orb-purple" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          num="03"
          label="Blog"
          title={t.blog.title}
          href="/blog"
        />

        {published.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {published.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 80} className="h-full">
                <Link href={`/blog/${post.slug}`}>
                  <motion.article
                    whileHover={{ y: -8, transition: { type: "spring", stiffness: 320, damping: 20 } }}
                    className="group relative flex flex-col rounded-2xl bg-card border border-border/50 overflow-hidden cursor-pointer h-full card-premium-hover gradient-border"
                  >
                    {post.cover_url ? (
                      <div className="h-40 overflow-hidden shrink-0">
                        <img
                          src={post.cover_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className={`h-[2px] w-full bg-gradient-to-r ${categoryGradients[post.category] ?? "from-primary to-blue-500"} shrink-0`} />
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      <div className="mb-3">
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mb-2.5 capitalize ${categoryColors[post.category] ?? "bg-muted/60 text-muted-foreground border-border/40"}`}>
                          {post.category}
                        </span>
                        <h3 className="font-serif font-bold text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                          {post.title}
                        </h3>
                      </div>

                      <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground/60">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          {post.read_time ? (
                            <>
                              <Clock className="w-3 h-3" />
                              {post.read_time} min
                            </>
                          ) : (
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border/40">
            <p className="text-sm text-muted-foreground">Aucun article publié pour l'instant</p>
          </div>
        )}

        <div className="flex justify-center mt-10 sm:hidden">
          <Link href="/blog">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Voir tous les articles <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
