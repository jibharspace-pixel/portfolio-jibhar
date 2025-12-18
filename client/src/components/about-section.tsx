import { GraduationCap, Quote, Users, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

const aboutText = {
  intro: `Je suis diplômé de l'Institut National Polytechnique Félix Houphouët-Boigny (INPHB), titulaire d'une licence en Supply Chain. Cette formation ne m'a cependant pas empêché d'explorer et de développer ma passion pour la technologie.`,
  autodidact: `Autodidacte déterminé — certains nous appellent aussi des geeks — je conçois des solutions digitales basées sur l'IA, l'automatisation, ainsi que la création d'applications web et mobiles et de sites web professionnels.`,
  expertise: `J'interviens également dans l'analyse de données à l'aide de Power BI, SQL, Excel, Power Pivot, avec la conception de tableaux de bord sur mesure, adaptés à la stack technologique de votre choix.`,
  team: `Suis-je seul ? Non. Je travaille en équipe afin de rendre vos projets plus fluides, structurés et performants, notamment à travers Nexalion Digital Store, notre boutique digitale en ligne.`,
};

export function AboutSection() {
  return (
    <section
      id="apropos"
      className="py-16 lg:py-24 bg-muted/30"
      data-testid="section-about"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-8">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Users className="w-3 h-3 mr-1" />
                À propos
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Qui suis-je ?
              </h2>
            </div>

            <Card className="border-primary/20 bg-primary/5 overflow-visible">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Quote className="w-8 h-8 text-primary shrink-0 mt-1" />
                  <p className="text-lg font-medium italic text-foreground">
                    "Autodidacte déterminé — certains nous appellent aussi des geeks —
                    je transforme la complexité en solutions simples et efficaces."
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{aboutText.intro}</p>
              <p>{aboutText.autodidact}</p>
              <p>{aboutText.expertise}</p>
              <p>{aboutText.team}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <a
                  href="https://nexalion.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-nexalion"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Nexalion Digital Store
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-2xl opacity-60" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-border shadow-xl">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-auto object-cover"
                  data-testid="img-about-profile"
                />
              </div>
            </div>

            <Card className="overflow-visible">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Formation</h3>
                    <p className="text-sm text-muted-foreground">Diplômé Juin 2024</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">
                    Institut National Polytechnique Félix Houphouët-Boigny (INPHB)
                  </p>
                  <p className="text-muted-foreground">
                    Licence en Supply Chain
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="overflow-visible text-center">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-primary">10+</p>
                  <p className="text-xs text-muted-foreground">Projets réalisés</p>
                </CardContent>
              </Card>
              <Card className="overflow-visible text-center">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-primary">5+</p>
                  <p className="text-xs text-muted-foreground">Clients satisfaits</p>
                </CardContent>
              </Card>
              <Card className="overflow-visible text-center">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-primary">3+</p>
                  <p className="text-xs text-muted-foreground">Années exp.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
