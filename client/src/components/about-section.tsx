import { GraduationCap, Quote, ExternalLink, MapPin, Calendar, Award, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

const timeline = [
  {
    period: "2024 — Présent",
    title: "Freelance Logisticien & Data Analyst",
    org: "Nexalion Digital Store",
    desc: "Conception de solutions digitales sur mesure : dashboards Power BI, applications React, automatisation VBA et intégration IA.",
    color: "bg-primary",
  },
  {
    period: "2024",
    title: "Licence Supply Chain",
    org: "INPHB — Institut National Polytechnique",
    desc: "Félix Houphouët-Boigny, Côte d'Ivoire. Spécialisation en gestion des flux logistiques, optimisation des stocks et analyse de performance.",
    color: "bg-blue-400",
  },
  {
    period: "2021 — 2024",
    title: "Formation autodidacte",
    org: "Développement & Data",
    desc: "Apprentissage intensif de React, TypeScript, Power BI, SQL, Python et des outils d'IA. Construction de projets concrets pour des clients réels.",
    color: "bg-purple-400",
  },
];

const values = [
  { label: "Rigueur", desc: "Chaque détail compte pour un résultat irréprochable." },
  { label: "Adaptabilité", desc: "Je m'adapte à votre stack et vos contraintes." },
  { label: "Livraison rapide", desc: "Des solutions opérationnelles sans délais inutiles." },
  { label: "Communication", desc: "Transparent sur l'avancement à chaque étape." },
];

export function AboutSection() {
  return (
    <section id="apropos" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-about">
      <div className="section-blob w-96 h-96 bg-primary/6 top-0 right-0 animate-glow-pulse" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* ── Section header ─────────────────────── */}
        <div className="mb-14">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            À propos
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Qui suis-je ?
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full" />
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* ── Left: Text + timeline ──────────────── */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quote */}
            <div className="relative">
              <div className="absolute -left-2 -top-2 text-6xl text-primary/10 font-serif leading-none select-none">"</div>
              <blockquote className="relative pl-6 border-l-2 border-primary/40">
                <p className="text-lg font-medium text-foreground leading-relaxed italic">
                  Autodidacte déterminé, je transforme la complexité en solutions simples et efficaces.
                </p>
              </blockquote>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed text-[0.95rem]">
              <p>
                Diplômé de l'<span className="text-foreground font-semibold">Institut National Polytechnique Félix Houphouët-Boigny</span> (INPHB),
                titulaire d'une licence en Supply Chain. Cette formation solide en logistique ne m'a pas empêché
                d'explorer et de développer ma passion pour la technologie.
              </p>
              <p>
                Je conçois des solutions digitales basées sur l'IA, l'automatisation et le développement
                d'applications web. J'interviens aussi dans l'<span className="text-foreground font-semibold">analyse de données</span> à
                l'aide de Power BI, SQL, Excel et Power Pivot.
              </p>
              <p>
                Je travaille en équipe à travers{" "}
                <span className="text-primary font-semibold">Nexalion Digital Store</span>,
                notre boutique digitale pour rendre vos projets plus fluides et performants.
              </p>
            </div>

            <Button variant="outline" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 font-medium text-sm transition-all" asChild>
              <a href="https://nexalion.store" target="_blank" rel="noopener noreferrer" data-testid="link-nexalion">
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                Nexalion Digital Store
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </a>
            </Button>

            {/* Timeline */}
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-6">Parcours</h3>
              <div className="space-y-0">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Left timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mt-1.5 shrink-0 shadow-sm`} />
                      {i < timeline.length - 1 && <div className="w-px flex-1 bg-border/60 mt-2 mb-0" />}
                    </div>
                    {/* Content */}
                    <div className={`pb-6 ${i === timeline.length - 1 ? "pb-0" : ""}`}>
                      <span className="text-xs font-semibold text-primary/70 tracking-wide">{item.period}</span>
                      <h4 className="font-semibold text-sm text-foreground mt-0.5">{item.title}</h4>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">{item.org}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Photo + values ──────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Profile photo */}
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/15 to-blue-400/8 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-xl aspect-[3/4]">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-about-profile"
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { value: "10+", label: "Projets" },
                { value: "5+", label: "Clients" },
                { value: "3+", label: "Années" },
              ].map((stat) => (
                <Card key={stat.label} className="border border-border/60 text-center">
                  <CardContent className="p-3.5">
                    <p className="text-xl font-bold text-gradient font-serif leading-none">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Formation card */}
            <Card className="border border-border/60 shadow-sm">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm">Formation académique</h3>
                    <Badge variant="secondary" className="text-[10px] rounded-full px-2">Juin 2024</Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground">INPHB — Licence Supply Chain</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Institut Félix Houphouët-Boigny</p>
                </div>
              </CardContent>
            </Card>

            {/* Values */}
            <div className="grid grid-cols-2 gap-2.5">
              {values.map(({ label, desc }) => (
                <div key={label} className="rounded-xl border border-border/60 bg-card p-3.5 hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-bold text-foreground">{label}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
