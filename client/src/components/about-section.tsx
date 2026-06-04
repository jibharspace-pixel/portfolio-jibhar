import { GraduationCap, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

interface SiteContent { hero_description: string; hero_highlights: string[]; about_quote: string; }

const TIMELINE_COLORS = ["bg-primary", "bg-blue-400", "bg-purple-400"];

export function AboutSection() {
  const { t } = useLanguage();
  const { data: siteContent } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });
  const quote = siteContent?.about_quote || t.about.quote;

  return (
    <section id="apropos" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-about">
      <div className="section-blob w-96 h-96 bg-primary/6 top-0 right-0 animate-glow-pulse" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* ── Section header ─────────────────────── */}
        <ScrollReveal className="mb-14">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            {t.about.badge}
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t.about.title}
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">

          {/* ── Left: Text + timeline ──────────────── */}
          <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            {/* Quote */}
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -left-2 -top-2 text-6xl text-primary/10 font-serif leading-none select-none">"</div>
                <blockquote className="relative pl-6 border-l-2 border-primary/40">
                  <p className="text-lg font-medium text-foreground leading-relaxed italic">
                    {quote}
                  </p>
                </blockquote>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={80}>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[0.95rem]">
                <p>
                  {t.about.bio1.split("Institut National Polytechnique Félix Houphouët-Boigny (INPHB)")[0]}
                  <span className="text-foreground font-semibold">Institut National Polytechnique Félix Houphouët-Boigny (INPHB)</span>
                  {t.about.bio1.split("Institut National Polytechnique Félix Houphouët-Boigny (INPHB)")[1]}
                </p>
                <p>
                  {t.about.bio2.split(t.about.bio2Bold)[0]}
                  <span className="text-foreground font-semibold">{t.about.bio2Bold}</span>
                  {t.about.bio2.split(t.about.bio2Bold)[1]}
                </p>
                <p>
                  {t.about.bio3.split("Nexalion Digital Store")[0]}
                  <a href="https://apdzoviz.mychariow.shop" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">Nexalion Digital Store</a>
                  {t.about.bio3.split("Nexalion Digital Store")[1]}
                </p>
              </div>

              <Button variant="outline" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 font-medium text-sm transition-all mt-4" asChild>
                <a href="https://apdzoviz.mychariow.shop" target="_blank" rel="noopener noreferrer" data-testid="link-nexalion">
                  <ExternalLink className="w-3.5 h-3.5 mr-2" />
                  Nexalion Digital Store
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </a>
              </Button>
            </ScrollReveal>

            {/* Timeline */}
            <div>
              <ScrollReveal delay={100}>
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">{t.about.journeyTitle}</h3>
              </ScrollReveal>
              <div className="space-y-0">
                {t.about.timeline.map((item, i) => (
                  <ScrollReveal key={i} delay={i * 120 + 150}>
                    <div className="flex gap-4">
                      {/* Left timeline */}
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${TIMELINE_COLORS[i]} mt-1.5 shrink-0 shadow-sm`} />
                        {i < t.about.timeline.length - 1 && <div className="w-px flex-1 bg-border/60 mt-2 mb-0 min-h-[40px]" />}
                      </div>
                      {/* Content */}
                      <div className={`pb-6 ${i === t.about.timeline.length - 1 ? "pb-0" : ""}`}>
                        <span className="text-xs font-semibold text-primary/70 tracking-wide">{item.period}</span>
                        <h4 className="font-semibold text-sm text-foreground mt-0.5">{item.title}</h4>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">{item.org}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Photo + values ──────────────── */}
          <div className="lg:col-span-2 space-y-5 order-1 lg:order-2">
            <ScrollReveal direction="right">
              {/* Profile photo */}
              <div className="relative max-w-xs mx-auto lg:max-w-none">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/15 to-blue-400/8 blur-xl" />
                <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-xl aspect-[4/3] sm:aspect-[3/4]">
                  <img
                    src={profileImage}
                    alt="Kroman Jibhar Samuel"
                    className="w-full h-full object-cover object-top"
                    data-testid="img-about-profile"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Stats row */}
            <ScrollReveal direction="right" delay={100}>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: "10+", label: t.about.statsLabels.projects },
                  { value: "5+",  label: t.about.statsLabels.clients },
                  { value: "3+",  label: t.about.statsLabels.years },
                ].map((stat) => (
                  <Card key={stat.label} className="border border-border/60 text-center">
                    <CardContent className="p-3.5">
                      <p className="text-xl font-bold text-gradient font-serif leading-none">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollReveal>

            {/* Formation card */}
            <ScrollReveal direction="right" delay={180}>
              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-sm">{t.about.academicTitle}</h3>
                      <Badge variant="secondary" className="text-[10px] rounded-full px-2">{t.about.academicDate}</Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground">{t.about.academicDegree}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.about.academicSchool}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Values */}
            <ScrollReveal direction="right" delay={240}>
              <div className="grid grid-cols-2 gap-2.5">
                {t.about.values.map(({ label, desc }) => (
                  <div key={label} className="rounded-xl border border-border/60 bg-card p-3.5 hover:border-primary/30 hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-xs font-bold text-foreground">{label}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
