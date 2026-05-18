import { ArrowRight, Mail, BarChart3, CheckCircle2, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

const techItems = [
  "Power BI", "React.js", "TypeScript", "Rust", "SQL", "Excel VBA",
  "Python", "Node.js", "Tailwind CSS", "Supply Chain",
  "DAX", "PostgreSQL", "Automatisation", "Power Query",
];

const defaultHighlights = [
  "Tableaux de bord Power BI",
  "Applications React / TypeScript",
  "Automatisation VBA & Python",
];

const defaultDescription =
  "Je conçois des solutions digitales et des tableaux de bord sur mesure qui transforment vos données en décisions. Données, automatisation, web — adaptés à votre contexte métier.";

interface SiteContent {
  hero_description: string;
  hero_highlights: string[];
  about_quote: string;
}

export function HeroSection() {
  const { t } = useLanguage();
  const { data: content } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });

  const description = content?.hero_description ?? defaultDescription;
  const highlights  = content?.hero_highlights ?? defaultHighlights;

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden"
      data-testid="section-hero"
    >
      {/* ── Background — clean single gradient wash ──────────── */}
      <div className="absolute inset-0 bg-hero-aurora pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left: Profile photo ────────────────────────────── */}
          <div className="order-1 lg:order-1 flex justify-center lg:justify-start animate-fade-in delay-200">
            <div className="relative">
              {/* Photo frame */}
              <div className="relative w-[268px] h-[348px] sm:w-[300px] sm:h-[390px] lg:w-[318px] lg:h-[413px] rounded-3xl overflow-hidden shadow-[0_32px_80px_hsl(216,40%,30%,0.18)] border border-white/70">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-profile"
                />
                {/* Subtle inner shadow at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
              </div>
              {/* Location pill */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-card dark:border-border/70 backdrop-blur-sm border border-border/50 shadow-[0_4px_20px_hsl(0,0%,0%,0.12)] dark:shadow-[0_4px_20px_hsl(0,0%,0%,0.40)] rounded-full px-4 py-1.5 flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 shadow-[0_0_6px_hsl(142,72%,45%,0.60)]" />
                <span className="text-[11.5px] font-semibold text-foreground/80 dark:text-foreground/90 tracking-tight">{t.hero.available}</span>
              </div>
              {/* Soft glow behind photo */}
              <div className="absolute inset-0 -z-10 rounded-3xl blur-2xl scale-95 opacity-30 bg-primary/20" />
            </div>
          </div>

          {/* ── Right: Content ────────────────────────────────── */}
          <div className="order-2 lg:order-2 space-y-7">

            {/* Role label */}
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-primary tracking-[0.18em] uppercase">
                <span className="w-6 h-px bg-primary/60" />
                {t.hero.role}
              </span>
            </div>

            {/* Name */}
            <div className="space-y-0 animate-fade-in-up delay-100">
              <h1 className="font-serif text-[2.1rem] sm:text-[3.2rem] lg:text-[3.4rem] xl:text-[4rem] font-extrabold leading-[1.08] sm:leading-[1.03] tracking-tight text-foreground">
                Kroman Jibhar
              </h1>
              <h1 className="font-serif text-[2.1rem] sm:text-[3.2rem] lg:text-[3.4rem] xl:text-[4rem] font-extrabold leading-[1.08] sm:leading-[1.03] tracking-tight text-gradient">
                Samuel
              </h1>
            </div>

            {/* Description */}
            <p className="text-[0.96rem] text-muted-foreground leading-[1.75] max-w-md animate-fade-in-up delay-200">
              {description}
            </p>

            {/* Highlights */}
            <ul className="space-y-2.5 animate-fade-in-up delay-300">
              {highlights.map(h => (
                <li key={h} className="flex items-center gap-2.5 text-sm text-foreground/80 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1 animate-fade-in-up delay-400">
              <Link href="/projets">
                <Button
                  size="lg"
                  className="flex items-center gap-2 bg-nexalion hover:opacity-90 shadow-[0_4px_24px_hsl(216,90%,40%,0.30)] font-semibold text-sm px-7 w-full sm:w-auto transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_hsl(216,90%,40%,0.38)]"
                  data-testid="button-view-projects"
                >
                  <BarChart3 className="w-4 h-4" />
                  {t.hero.viewProjects}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 font-semibold text-sm px-7 w-full sm:w-auto border-border/70 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200 hover:-translate-y-0.5"
                  data-testid="button-contact-me"
                >
                  <Mail className="w-4 h-4" />
                  {t.hero.contactMe}
                </Button>
              </Link>
            </div>

            {/* Devis CTA */}
            <div className="animate-fade-in-up delay-500">
              <Link href="/contact">
                <div
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-white/60 dark:bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-300 px-5 py-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_32px_hsl(216,90%,40%,0.10)]"
                  data-testid="button-devis"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <FileText className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground leading-snug">
                        {t.hero.quoteTitle}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 shrink-0" />
                        {t.hero.quoteSubtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 sm:gap-8 pt-5 border-t border-border/50 animate-fade-in-up delay-500">
              {t.hero.stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {i > 0 && <div className="w-px h-8 bg-border/60" />}
                  <div>
                    <p className="text-[1.6rem] font-extrabold text-gradient font-serif leading-none">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 tracking-wide">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tech marquee strip ─────────────────────────────── */}
        <div className="mt-20 pt-8 border-t border-border/40 animate-fade-in-up delay-700">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] text-center mb-6">
            {t.hero.techStrip}
          </p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...techItems, ...techItems].map((tech, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 mx-6 text-[13px] font-medium text-muted-foreground/60 whitespace-nowrap"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/30 shrink-0" />
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
