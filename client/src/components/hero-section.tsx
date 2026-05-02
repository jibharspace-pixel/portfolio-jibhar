import { ArrowRight, Mail, BarChart3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

const stats = [
  { value: "10+", label: "Projets réalisés" },
  { value: "5+", label: "Clients satisfaits" },
  { value: "3+", label: "Années d'expérience" },
];

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
  const { data: content } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });

  const description = content?.hero_description ?? defaultDescription;
  const highlights = content?.hero_highlights ?? defaultHighlights;

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden"
      data-testid="section-hero"
    >
      {/* ── Background ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-blue-400/3 pointer-events-none" />
      <div className="section-blob w-[520px] h-[520px] bg-primary/10 -top-24 -right-24 animate-glow-pulse" />
      <div className="section-blob w-[380px] h-[380px] bg-blue-400/10 bottom-0 -left-24 animate-glow-pulse delay-500" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Left: Profile photo ────────────────────────────────── */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start animate-fade-in delay-200">
            <div className="relative">
              {/* Accent offset block — bottom-right */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-[22px] bg-gradient-to-br from-primary/15 to-blue-400/8 border border-primary/15" />
              {/* Corner accent — top-left */}
              <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-primary/40 rounded-tl-xl pointer-events-none" />
              {/* Photo frame */}
              <div className="relative w-[260px] h-[340px] sm:w-[295px] sm:h-[384px] lg:w-[310px] lg:h-[404px] rounded-[20px] overflow-hidden shadow-2xl border-2 border-white/60">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-profile"
                />
                {/* Bottom gradient overlay for depth */}
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              {/* Location pill — bottom of photo */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-border/60 shadow-md rounded-full px-3 py-1 flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-[11px] font-semibold text-foreground/80">Disponible · Côte d'Ivoire</span>
              </div>
            </div>
          </div>

          {/* ── Right: Content ────────────────────────────────────── */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Name */}
            <div className="space-y-0.5 animate-fade-in-up">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[3.7rem] xl:text-[4.1rem] font-bold leading-[1.04] tracking-tight text-foreground">
                Kroman Jibhar
              </h1>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[3.7rem] xl:text-[4.1rem] font-bold leading-[1.04] tracking-tight text-gradient">
                Samuel
              </h1>
            </div>

            {/* Role label */}
            <div className="flex items-center gap-3 animate-fade-in-up delay-200">
              <div className="h-px w-8 bg-primary/40 shrink-0" />
              <p className="text-sm font-bold text-primary tracking-widest uppercase">
                Logisticien & Data Analyst
              </p>
            </div>

            {/* Description */}
            <p className="text-[0.95rem] text-muted-foreground leading-relaxed max-w-lg animate-fade-in-up delay-300">
              {description}
            </p>

            {/* Highlights */}
            <ul className="space-y-2 animate-fade-in-up delay-400">
              {highlights.map(h => (
                <li key={h} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1 animate-fade-in-up delay-500">
              <Link href="/projets">
                <Button
                  size="lg"
                  className="flex items-center gap-2 bg-nexalion hover:opacity-90 shadow-[0_4px_20px_hsl(216,90%,40%,0.35)] font-semibold text-sm px-6 w-full sm:w-auto transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_hsl(216,90%,40%,0.40)]"
                  data-testid="button-view-projects"
                >
                  <BarChart3 className="w-4 h-4" />
                  Voir mes projets
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 font-semibold text-sm px-6 w-full sm:w-auto border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200 hover:-translate-y-0.5"
                  data-testid="button-contact-me"
                >
                  <Mail className="w-4 h-4" />
                  Me contacter
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4 border-t border-border/60 animate-fade-in-up delay-600">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {i > 0 && <div className="w-px h-9 bg-border" />}
                  <div>
                    <p className="text-2xl font-bold text-gradient font-serif leading-none">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tech marquee strip ─────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-border/60 animate-fade-in-up delay-700">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest text-center mb-5">
            Technologies maîtrisées
          </p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...techItems, ...techItems].map((tech, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 mx-5 text-sm font-semibold text-muted-foreground/70 whitespace-nowrap"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
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
