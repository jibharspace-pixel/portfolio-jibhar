import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, ArrowRight, Database, Brain, FileSpreadsheet, Globe, Package } from "lucide-react";
import remoxLogo from "@assets/remox-logo.png";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/components/theme-provider";
import { PROFILE_PHOTOS, PHOTO_ROTATION_MS } from "@/lib/profile-photos";

interface SiteContent { hero_description: string; hero_highlights: string[]; about_quote: string; }

const TIMELINE_COLORS = ["bg-primary", "bg-blue-400", "bg-purple-400", "bg-emerald-400", "bg-amber-400"];

export function AboutSection() {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isFr = lang === "fr";

  const { data: siteContent } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });
  const quote = siteContent?.about_quote || t.about.quote;

  const photos = PROFILE_PHOTOS.map((src) => ({ src, caption: "" }));
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const timer = setInterval(() => setPhotoIdx((i) => (i + 1) % photos.length), PHOTO_ROTATION_MS);
    return () => clearInterval(timer);
  }, [photos.length]);

  const domains = [
    { label: "Data & BI",                                          icon: Database },
    { label: isFr ? "Intelligence Artificielle" : "Artificial Intelligence", icon: Brain },
    { label: "Excel & VBA",                                        icon: FileSpreadsheet },
    { label: "Web & Mobile",                                       icon: Globe },
    { label: isFr ? "Digital Logistique" : "Digital Logistics",   icon: Package },
  ];

  const [bio1Before, bio1After] = t.about.bio1.split("Institut National Polytechnique Félix Houphouët-Boigny (INPHB)");
  const [bio3Before, bio3After] = t.about.bio3.split("RemoX");

  return (
    <section id="apropos" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-about">
      <div className="section-blob w-96 h-96 bg-primary/6 top-0 right-0 animate-glow-pulse" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* Header */}
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

          {/* ── Left col: bio + timeline ── */}
          <div className="lg:col-span-3 space-y-10 order-2 lg:order-1">

            {/* Quote */}
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -left-2 -top-2 text-6xl text-primary/10 font-serif leading-none select-none">"</div>
                <blockquote className="relative pl-6 border-l-2 border-primary/40">
                  <p className="text-lg font-medium text-foreground leading-relaxed italic">{quote}</p>
                </blockquote>
              </div>
            </ScrollReveal>

            {/* Bio content */}
            <ScrollReveal direction="left" delay={80}>
              <div className="space-y-5">

                {/* bio1 */}
                <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
                  {bio1Before}
                  <span className="text-foreground font-semibold">Institut National Polytechnique Félix Houphouët-Boigny (INPHB)</span>
                  {bio1After}
                </p>

                {/* bio2 — accent block + domain chips */}
                <div className={`rounded-2xl border px-5 py-4 space-y-3.5 ${
                  isDark
                    ? "border-primary/15 bg-primary/5"
                    : "border-primary/20 bg-primary/[0.04]"
                }`}>
                  <p className="text-[0.9rem] text-muted-foreground leading-relaxed">{t.about.bio2}</p>
                  <div className="flex flex-wrap gap-2">
                    {domains.map(({ label, icon: Icon }) => (
                      <span
                        key={label}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                          isDark
                            ? "bg-background/60 border-border/50 text-foreground/70 hover:border-primary/40 hover:text-primary"
                            : "bg-white/90 border-border/60 text-foreground/70 hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        <Icon className="w-3 h-3 text-primary shrink-0" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* bio3 */}
                <p className="text-[0.9rem] text-muted-foreground leading-relaxed">
                  {bio3Before}
                  <a
                    href="https://remox-landing.onrender.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    RemoX
                  </a>
                  {bio3After}
                </p>

                {/* RemoX card */}
                <a
                  href="https://remox-landing.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-remox"
                  className={`group flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_6px_24px_hsl(216,90%,40%,0.10)] ${
                    isDark ? "border-border/60 bg-card" : "border-border/50 bg-white/60"
                  }`}
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden border border-border/40 bg-white shrink-0 flex items-center justify-center p-1">
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
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isFr ? "Assistance routière · Voir la plateforme" : "Roadside assistance · View platform"}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                </a>
              </div>
            </ScrollReveal>

            {/* Timeline */}
            <div>
              <ScrollReveal delay={100}>
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">{t.about.journeyTitle}</h3>
              </ScrollReveal>
              <div className="space-y-0">
                {t.about.timeline.map((item, i) => (
                  <ScrollReveal key={i} delay={i * 100 + 150}>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${TIMELINE_COLORS[i % TIMELINE_COLORS.length]} mt-1.5 shrink-0 shadow-sm ring-2 ring-background`} />
                        {i < t.about.timeline.length - 1 && (
                          <div className="w-px flex-1 bg-border/50 mt-2 min-h-[40px]" />
                        )}
                      </div>
                      <div className={`pb-6 ${i === t.about.timeline.length - 1 ? "pb-0" : ""}`}>
                        <span className="text-[11px] font-semibold text-primary/70 tracking-wide uppercase">{item.period}</span>
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

          {/* ── Right col: photo + aside cards ── */}
          <div className="lg:col-span-2 space-y-5 order-1 lg:order-2">

            {/* Photo carousel */}
            <ScrollReveal direction="right">
              <div className="relative max-w-xs mx-auto lg:max-w-none">
                <div className={`about-photo-circle absolute -right-6 top-6 w-[72%] h-[72%] rounded-full pointer-events-none ${isDark ? "bg-primary/10" : "bg-primary/12"}`} />
                <div className={`absolute -left-3 bottom-12 w-8 h-8 rounded-full pointer-events-none ${isDark ? "bg-blue-400/20" : "bg-blue-400/25"}`} />

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
                    <div className="absolute inset-0 z-20 select-none" style={{ WebkitTouchCallout: "none" } as React.CSSProperties} />
                  </AnimatePresence>

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

                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary to-blue-400 pointer-events-none" />

                  <div className="absolute bottom-3 right-3 flex gap-1.5 pointer-events-none">
                    {photos.map((_, i) => (
                      <span
                        key={i}
                        className={`block rounded-full transition-all duration-300 ${
                          i === photoIdx ? "w-4 h-1.5 bg-white/90" : "w-1.5 h-1.5 bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Stats */}
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

            {/* Formation */}
            <ScrollReveal direction="right" delay={160}>
              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
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
            <ScrollReveal direction="right" delay={220}>
              <div className="grid grid-cols-2 gap-2.5">
                {t.about.values.map(({ label, desc }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border/60 bg-card p-3.5 hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
                  >
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
