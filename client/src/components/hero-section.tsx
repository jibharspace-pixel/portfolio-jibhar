import { ArrowRight, Mail, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

export function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center pt-20"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-60" />
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-[28rem] rounded-2xl overflow-hidden border-2 border-border shadow-xl">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel - Logisticien & Data Analyst"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-profile"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Disponible pour projets</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <Badge variant="secondary" className="text-sm font-medium">
              Freelance depuis Juin 2024
            </Badge>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
              Kroman Jibhar
              <span className="block text-primary">Samuel</span>
            </h1>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="px-4 py-2 text-base font-medium bg-primary/10 border-primary/20">
                <BarChart3 className="w-4 h-4 mr-2" />
                Logisticien & Data Analyst
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Solutions digitales et applications web pour optimiser les opérations.
              Je conçois des tableaux de bord personnalisés, des reportings automatisés
              et des solutions basées sur l'IA adaptés à votre environnement technologique.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              Diplômé de l'INPHB en Supply Chain et passionné de technologies,
              je transforme vos données en insights actionnables.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("#projets")}
                className="flex items-center gap-2"
                data-testid="button-view-projects"
              >
                <BarChart3 className="w-5 h-5" />
                Voir mes projets
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("#contact")}
                className="flex items-center gap-2"
                data-testid="button-contact-me"
              >
                <Mail className="w-5 h-5" />
                Me contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
