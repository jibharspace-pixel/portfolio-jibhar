import { ArrowRight, Mail, BarChart3, CheckCircle2, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { DevisDialog } from "@/components/devis-dialog";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

const DEFAULT_TECH_ITEMS = [
  "Excel", "VBA", "Power BI", "Power Apps", "React",
  "HTML", "CSS", "JS", "Python", "Rust",
  "Analyse et réalisation d'inventaire", "Analyse de données", "Analyste Supply Chain", "Solutions IA", "Site web", "App mobile", "App web", "Tableau de bord",
];

const defaultHighlights = [
  "Tableau de bord sur mesure",
  "Solutions IA & automatisation",
  "Solutions Excel & VBA",
  "Création d'applications & sites web",
  "Présence digitale & community management",
];

const defaultDescription =
  "Je transforme vos données en décisions|vos décisions en résultats|Dashboards, applications web et automatisations conçus sur mesure.";

interface SiteContent {
  hero_description: string;
  hero_highlights: string[];
  about_quote: string;
  stack_tags: string[];
}

export function HeroSection() {
  const { t } = useLanguage();
  const { data: content } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });

  const description = content?.hero_description ?? defaultDescription;
  const highlights  = content?.hero_highlights ?? defaultHighlights;
  const techItems   = (content?.stack_tags?.length ?? 0) > 0 ? content!.stack_tags : DEFAULT_TECH_ITEMS;

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden"
      data-testid="section-hero"
    >
      {/* ── Background — clean single gradient wash ──────────── */}
      <div className="absolute inset-0 bg-hero-aurora pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* ── Right: Content ────────────────────────────────── */}
          <div className="order-2 lg:order-2">

            {/* Role label */}
            <div className="animate-fade-in-up mb-4">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-primary tracking-[0.22em] uppercase">
                <span className="w-6 h-px bg-gradient-to-r from-primary to-primary/30" />
                {t.hero.role}
              </span>
            </div>

            {/* Name */}
            <div className="mb-6 animate-fade-in-up delay-100">
              <h1 className="font-serif text-[2rem] sm:text-[2.8rem] lg:text-[3.4rem] xl:text-[4rem] font-extrabold leading-[1.05] tracking-tight text-foreground">
                Kroman Jibhar
              </h1>
              <h1 className="font-serif text-[2rem] sm:text-[2.8rem] lg:text-[3.4rem] xl:text-[4rem] font-extrabold leading-[1.05] tracking-tight text-gradient">
                Samuel
              </h1>
            </div>

            {/* Description */}
            <div className="mb-5 max-w-[460px] animate-fade-in-up delay-200">
              {(() => {
                const [line1, line2, line3] = description.split("|");
                return (
                  <div className="space-y-2">
                    <div className="pl-3 border-l-[3px] border-primary/40 space-y-0.5">
                      <p className="text-[1.05rem] font-bold text-foreground leading-snug tracking-tight">{line1}</p>
                      {line2 && (
                        <p className="text-[1.05rem] font-bold leading-snug hero-shimmer-text">{line2}</p>
                      )}
                    </div>
                    {line3 && (
                      <p className="text-[0.875rem] text-muted-foreground leading-relaxed pt-1">{line3}</p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Highlights */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-7 animate-fade-in-up delay-300 max-w-[460px]">
              <div className="space-y-2">
                {highlights.slice(0, 3).map((h, idx) => (
                  <div key={h} className="flex items-center gap-2" style={{ animationDelay: `${300 + idx * 55}ms` }}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    <span className="text-[0.8rem] font-light text-foreground/60 leading-snug">{h}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 sm:flex sm:flex-col sm:justify-center">
                {highlights.slice(3).map((h, idx) => (
                  <div key={h} className="flex items-center gap-2" style={{ animationDelay: `${300 + (idx + 3) * 55}ms` }}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    <span className="text-[0.8rem] font-light text-foreground/60 leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-2.5 sm:gap-3 mb-5 animate-fade-in-up delay-400">
              <Link href="/projets">
                <Button
                  size="lg"
                  className="btn-primary-lift flex items-center gap-2 bg-nexalion shadow-[0_6px_28px_hsl(216,90%,40%,0.32)] font-semibold text-sm px-6 h-11"
                  data-testid="button-view-projects"
                >
                  <BarChart3 className="w-4 h-4" />
                  {t.hero.viewProjects}
                </Button>
              </Link>
              <DevisDialog trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-outline-lift flex items-center gap-2 font-semibold text-sm px-6 h-11 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
                  data-testid="button-devis"
                >
                  <FileText className="w-4 h-4" />
                  {t.hero.quoteTitle}
                </Button>
              } />
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="ghost"
                  className="flex items-center gap-2 font-medium text-sm px-5 h-11 text-muted-foreground hover:text-foreground"
                  data-testid="button-contact-me"
                >
                  <Mail className="w-4 h-4" />
                  {t.hero.contactMe}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-5 border-t border-border/40 animate-fade-in-up delay-500">
              {t.hero.stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-4">
                  {i > 0 && <div className="w-px h-8 bg-border/50" />}
                  <div className="cursor-default">
                    <p className="text-[1.6rem] font-extrabold text-gradient font-serif leading-none">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 tracking-wide">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Left: Profile photo ──────────────────────────── */}
          <div className="order-1 lg:order-1 flex justify-center lg:justify-start animate-scale-up-in delay-100">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-blue-400/10 to-transparent blur-2xl -z-10 animate-glow-pulse" />
              <div className="relative w-[260px] h-[338px] sm:w-[300px] sm:h-[390px] lg:w-[340px] lg:h-[440px] rounded-3xl overflow-hidden shadow-[0_32px_80px_hsl(216,50%,30%,0.22),0_8px_24px_hsl(216,50%,30%,0.12)] border border-white/60 dark:border-white/10">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top img-zoom"
                  data-testid="img-profile"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Tech marquee strip ─────────────────────────────── */}
        <div className="mt-20 pt-8 border-t border-border/40 animate-fade-in-up delay-700">
          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.22em] text-center mb-6">
            {t.hero.techStrip}
          </p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...techItems, ...techItems].map((tech, i) => (
                <span
                  key={i}
                  className="tech-badge inline-flex items-center gap-2 mx-7 text-[13px] font-medium text-muted-foreground/55 hover:text-muted-foreground whitespace-nowrap transition-colors duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary/40 to-blue-400/30 shrink-0" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
