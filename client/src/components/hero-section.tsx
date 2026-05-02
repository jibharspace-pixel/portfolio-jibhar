import { ArrowRight, Mail, BarChart3, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

const stats = [
  { value: "10+", label: "Projets réalisés" },
  { value: "5+", label: "Clients satisfaits" },
  { value: "3+", label: "Années d'expérience" },
];

export function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      data-testid="section-hero"
    >
      {/* Background: subtle grid + blue gradient */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      {/* Blue glow top-left */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left: Image */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 blur-lg" />
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-[300px] lg:h-[400px] rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-profile"
                />
                {/* Overlay gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Availability badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-card border border-border rounded-full px-4 py-2 shadow-lg whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-foreground">Disponible pour projets</span>
              </div>

              {/* Location badge */}
              <div className="absolute -top-3 -right-3 flex items-center gap-1.5 bg-white dark:bg-card border border-border rounded-full px-3 py-1.5 shadow-md">
                <MapPin className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Côte d'Ivoire</span>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-7">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase"
              >
                Freelance · Depuis Juin 2024
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[3.75rem] xl:text-7xl font-bold leading-[1.05] tracking-tight text-foreground">
                Kroman Jibhar
              </h1>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[3.75rem] xl:text-7xl font-bold leading-[1.05] tracking-tight text-gradient">
                Samuel
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-primary/40" />
              <p className="text-sm font-semibold text-primary tracking-widest uppercase">
                Logisticien & Data Analyst
              </p>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
              Je conçois des solutions digitales et des tableaux de bord sur mesure
              qui transforment vos données en décisions. IA, automatisation, web —
              adaptés à votre environnement technologique.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/projets">
                <Button
                  size="lg"
                  className="flex items-center gap-2 bg-nexalion hover:opacity-90 shadow-md font-semibold text-sm px-6 w-full sm:w-auto transition-all hover:-translate-y-0.5"
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
                  className="flex items-center gap-2 font-semibold text-sm px-6 w-full sm:w-auto border-border hover:border-primary/40 hover:bg-primary/5 transition-all hover:-translate-y-0.5"
                  data-testid="button-contact-me"
                >
                  <Mail className="w-4 h-4" />
                  Me contacter
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2 border-t border-border/60">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {i > 0 && <div className="w-px h-8 bg-border" />}
                  <div>
                    <p className="text-2xl font-bold text-gradient font-serif">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
