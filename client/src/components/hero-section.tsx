import { ArrowRight, Mail, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

export function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      data-testid="section-hero"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-8 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 right-4 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        {/* Decorative floating shapes */}
        <div className="absolute top-32 right-16 w-12 h-12 rounded-2xl bg-primary/15 border border-primary/20 animate-float rotate-12" />
        <div className="absolute top-1/2 left-8 w-8 h-8 rounded-full bg-pink-400/25 animate-float-delayed" />
        <div className="absolute bottom-32 right-1/4 w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/20 animate-float rotate-45" />
        <div className="absolute top-40 left-1/3 w-6 h-6 rounded-full bg-primary/30 animate-bounce-gentle" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Profile image */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl animate-blob-morph"
                style={{
                  background: "linear-gradient(135deg, hsl(258,80%,68%,0.35), hsl(320,75%,65%,0.25), hsl(38,95%,65%,0.2))",
                  filter: "blur(16px)",
                }}
              />
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-[28rem] rounded-3xl overflow-hidden border-2 border-white/60 shadow-2xl dark:border-white/10"
                style={{ boxShadow: "0 25px 60px -10px hsl(258,80%,58%,0.3)" }}
              >
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel - Logisticien & Data Analyst"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-profile"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-white dark:bg-card border border-border rounded-2xl p-3.5 shadow-xl animate-bounce-gentle">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold whitespace-nowrap">Disponible pour projets</span>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white dark:bg-card border border-border rounded-2xl p-3 shadow-lg animate-float-delayed">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="order-1 lg:order-2 space-y-6">
            <Badge
              variant="secondary"
              className="text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary"
            >
              ✨ Freelance depuis Juin 2024
            </Badge>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
              Kroman Jibhar
              <span className="block gradient-text">Samuel</span>
            </h1>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="px-4 py-2 text-base font-semibold rounded-full border-2"
                style={{
                  borderColor: "hsl(258,80%,58%,0.4)",
                  background: "linear-gradient(135deg, hsl(258,80%,58%,0.1), hsl(200,80%,55%,0.08))",
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                Logisticien & Data Analyst
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Solutions digitales et applications web pour optimiser les opérations.
              Je conçois des tableaux de bord personnalisés, des reportings automatisés
              et des solutions basées sur l'IA adaptés à votre environnement technologique.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              Diplômé de l'INPHB en Supply Chain et passionné de technologies,
              je transforme vos données en insights actionnables.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/projets">
                <Button
                  size="lg"
                  className="flex items-center gap-2 w-full sm:w-auto rounded-full px-8 font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  style={{ boxShadow: "0 8px 24px hsl(258,80%,58%,0.4)" }}
                  data-testid="button-view-projects"
                >
                  <BarChart3 className="w-5 h-5" />
                  Voir mes projets
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto rounded-full px-8 font-semibold border-2 transition-all hover:scale-105"
                  data-testid="button-contact-me"
                >
                  <Mail className="w-5 h-5" />
                  Me contacter
                </Button>
              </Link>
            </div>

            {/* Fun stats row */}
            <div className="flex gap-6 pt-2">
              {[
                { value: "10+", label: "Projets" },
                { value: "5+", label: "Clients" },
                { value: "3+", label: "Ans d'exp." },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold gradient-text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
