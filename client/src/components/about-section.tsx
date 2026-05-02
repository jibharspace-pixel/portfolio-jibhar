import { GraduationCap, Quote, ExternalLink, Code2, Database, Cpu, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

const skills = [
  { icon: Code2, label: "Développement Web", items: ["React.js", "TypeScript", "Tailwind CSS"] },
  { icon: Database, label: "Data & BI", items: ["Power BI", "SQL", "Excel DAX"] },
  { icon: Cpu, label: "IA & Automatisation", items: ["ChatGPT API", "VBA", "Vibe Coding"] },
  { icon: Truck, label: "Supply Chain", items: ["Gestion stocks", "KPI logistique"] },
];

export function AboutSection() {
  return (
    <section id="apropos" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-about">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* Header */}
        <div className="mb-14">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            À propos
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Qui suis-je ?
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* Left: Text */}
          <div className="space-y-8">
            {/* Quote card */}
            <div className="relative pl-6 border-l-2 border-primary/40">
              <Quote className="absolute -left-3 -top-1 w-5 h-5 text-primary bg-background p-0.5" />
              <p className="text-lg font-medium text-foreground leading-relaxed italic">
                "Autodidacte déterminé, je transforme la complexité en solutions simples et efficaces."
              </p>
            </div>

            <div className="space-y-5 text-muted-foreground leading-relaxed text-[0.95rem]">
              <p>
                Diplômé de l'Institut National Polytechnique Félix Houphouët-Boigny (INPHB),
                titulaire d'une licence en Supply Chain. Cette formation ne m'a pas empêché
                d'explorer et de développer ma passion pour la technologie.
              </p>
              <p>
                Je conçois des solutions digitales basées sur l'IA, l'automatisation, ainsi que
                la création d'applications web et mobiles et de sites web professionnels.
              </p>
              <p>
                J'interviens dans l'analyse de données à l'aide de Power BI, SQL, Excel et Power
                Pivot — avec des tableaux de bord sur mesure adaptés à votre stack technologique.
              </p>
              <p>
                Je travaille en équipe à travers{" "}
                <span className="text-primary font-semibold">Nexalion Digital Store</span>,
                notre boutique digitale en ligne, pour rendre vos projets plus fluides et performants.
              </p>
            </div>

            <Button
              variant="outline"
              className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 font-medium text-sm transition-all"
              asChild
            >
              <a
                href="https://nexalion.store"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-nexalion"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                Nexalion Digital Store
              </a>
            </Button>
          </div>

          {/* Right: Photo + cards */}
          <div className="space-y-6">
            {/* Profile photo */}
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 blur-lg" />
              <div className="relative rounded-xl overflow-hidden border border-border/60 shadow-xl aspect-[4/3]">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-about-profile"
                />
              </div>
            </div>

            {/* Formation card */}
            <Card className="border border-border/60 shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">Formation</h3>
                    <Badge variant="secondary" className="text-xs rounded-full">Juin 2024</Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground">INPHB — Licence Supply Chain</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Institut National Polytechnique Félix Houphouët-Boigny</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "10+", label: "Projets" },
                { value: "5+", label: "Clients" },
                { value: "3+", label: "Années" },
              ].map((stat) => (
                <Card key={stat.label} className="border border-border/60 shadow-sm text-center">
                  <CardContent className="p-4">
                    <p className="text-xl font-bold text-gradient font-serif">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-2 gap-3">
              {skills.map(({ icon: Icon, label, items }) => (
                <Card key={label} className="border border-border/60 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-foreground">{label}</span>
                    </div>
                    <ul className="space-y-0.5">
                      {items.map((item) => (
                        <li key={item} className="text-xs text-muted-foreground">· {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
