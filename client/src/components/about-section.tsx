import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, ExternalLink, ArrowRight, Music2 } from "lucide-react";
import remoxLogo   from "@assets/remox-logo.png";
import capchinaLogo from "@assets/capchina.png";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/components/theme-provider";
import profileImageMain   from "@assets/Jibhar-photo.jpeg";
import profileImagePro    from "@assets/Jibhar-pro.jpeg";
import profileImageStreet from "@assets/Jibhar-street.jpeg";

interface SiteContent { hero_description: string; hero_highlights: string[]; about_quote: string; }

const TIMELINE_COLORS = ["bg-primary", "bg-blue-400", "bg-purple-400", "bg-emerald-400", "bg-amber-400"];

export function AboutSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: siteContent } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });
  const quote = siteContent?.about_quote || t.about.quote;
  const photos = [
    { src: profileImageMain,   caption: "" },
    { src: profileImagePro,    caption: "" },
    { src: profileImageStreet, caption: "Décontracté" },
  ];
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPhotoIdx((i) => (i + 1) % photos.length), 4000);
    return () => clearInterval(timer);
  }, [photos.length]);

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

                {/* Deux fronts d'intervention */}
                <div className="grid gap-2.5 mt-1">
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3.5">
                    <span className="text-base shrink-0 mt-0.5">🔧</span>
                    <div>
                      <p className="text-xs font-bold text-foreground mb-0.5">Tech &amp; Digital</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        Sites web, solutions data, IA &amp; automatisation Excel/VBA. Prototypage rapide, chatbots, tableaux de bord — si ça peut se coder pour simplifier ta vie, je le fais.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3.5">
                    <span className="text-base shrink-0 mt-0.5">📦</span>
                    <div>
                      <p className="text-xs font-bold text-foreground mb-0.5">Logistique</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        Inventaire, planification &amp; mise en relation pour le stockage temporaire. Du stock à placer, un entrepôt à remplir ? Je connecte à la bonne solution.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-[0.9rem]">
                  {t.about.bio3.split("RemoX")[0]}
                  <a href="https://remox-landing.onrender.com" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">RemoX</a>
                  {t.about.bio3.split("RemoX")[1]}
                </p>
              </div>

              {/* Project cards */}
              <div className="grid gap-3 mt-4">
                {/* RemoX */}
                <a
                  href="https://remox-landing.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-remox"
                  className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3.5 hover:border-primary/30 hover:shadow-[0_6px_24px_hsl(216,90%,40%,0.10)] transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-border/40 bg-white shrink-0 flex items-center justify-center p-1">
                    <img
                      src={remoxLogo}
                      alt="RemoX"
                      className="w-full h-full object-contain"
                      draggable={false}
                      onContextMenu={e => e.preventDefault()}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">RemoX</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Dépannage en temps réel · Voir la plateforme</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                </a>

                {/* Capchina */}
                <div className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3.5 transition-all duration-200 hover:border-border">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-border/40 bg-white shrink-0 flex items-center justify-center p-1">
                    <img
                      src={capchinaLogo}
                      alt="Capchina"
                      className="w-full h-full object-contain"
                      draggable={false}
                      onContextMenu={e => e.preventDefault()}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">Capchina</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Projet en cours</p>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                    Bientôt
                  </span>
                </div>
              </div>
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
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${TIMELINE_COLORS[i % TIMELINE_COLORS.length]} mt-1.5 shrink-0 shadow-sm`} />
                        {i < t.about.timeline.length - 1 && <div className="w-px flex-1 bg-border/60 mt-2 mb-0 min-h-[40px]" />}
                      </div>
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
              {/* Auto-carousel photo */}
              <div className="relative max-w-xs mx-auto lg:max-w-none">
                {/* Editorial circle accent */}
                <div className={`about-photo-circle absolute -right-6 top-6 w-[72%] h-[72%] rounded-full pointer-events-none ${isDark ? "bg-primary/10" : "bg-primary/12"}`} />
                <div className={`absolute -left-3 bottom-12 w-8 h-8 rounded-full pointer-events-none ${isDark ? "bg-blue-400/20" : "bg-blue-400/25"}`} />

                {/* Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-xl aspect-[4/5] z-10">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={photoIdx}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      src={photos[photoIdx].src}
                      alt="Kroman Jibhar Samuel"
                      className="w-full h-full object-cover object-top"
                      data-testid="img-about-profile"
                      draggable={false}
                      onContextMenu={e => e.preventDefault()}
                      onDragStart={e => e.preventDefault()}
                      style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
                    />
                  {/* Overlay anti-téléchargement */}
                  <div className="absolute inset-0 z-20 select-none" style={{ WebkitTouchCallout: "none" } as React.CSSProperties} />
                  </AnimatePresence>

                  {/* Gradient + caption subtle */}
                  {photos[photoIdx].caption && (
                    <div className="absolute bottom-0 left-0 right-0 pt-10 pb-3 px-4 bg-gradient-to-t from-black/55 to-transparent pointer-events-none">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={photoIdx}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="text-[11px] font-semibold tracking-widest uppercase text-emerald-400"
                        >
                          {photos[photoIdx].caption}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Top accent line */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary to-blue-400 pointer-events-none" />

                  {/* Dot indicators */}
                  <div className="absolute bottom-3 right-3 flex gap-1.5 pointer-events-none">
                    {photos.map((_, i) => (
                      <span
                        key={i}
                        className={`block rounded-full transition-all duration-400 ${
                          i === photoIdx ? "w-4 h-1.5 bg-white/90" : "w-1.5 h-1.5 bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
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

            {/* RAP note */}
            <ScrollReveal direction="right" delay={300}>
              <div className="flex items-start gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <div className="p-2 rounded-lg bg-purple-500/10 shrink-0">
                  <Music2 className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Passionné de RAP 🎤</span> — musique 🎵, logistique fiable &amp; digital 🚀, tout ça dans le même univers 🌍.{" "}
                  <span className="text-purple-400 font-medium">Tu veux écouter du bon rap ? 😂 Reste ici, on s'amusera aussi 😎🎶</span>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
