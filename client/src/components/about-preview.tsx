import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";
import profileImage from "@assets/Jibhar-photo.jpeg";

const stats = [
  { value: "10+", label: "Projets réalisés" },
  { value: "5+",  label: "Clients satisfaits" },
  { value: "3+",  label: "Années d'expérience" },
  { value: "24/7", label: "Disponible remote" },
];

export function AboutPreview() {
  return (
    <section className="relative bg-[hsl(210,20%,98%)] dark:bg-[hsl(222,20%,7%)] border-t border-border/40 overflow-hidden">

      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Left: Big editorial typography ───────── */}
          <ScrollReveal direction="left">
            <div className="space-y-6">

              {/* Intro line */}
              <p className="font-serif italic text-foreground/50 text-[1.05rem] tracking-wide">
                Hey, je suis
              </p>

              {/* Massive mixed headline */}
              <div className="leading-[0.88] tracking-tight select-none">
                <span
                  className="block font-serif font-black italic text-foreground dark:text-foreground"
                  style={{ fontSize: "clamp(3.2rem, 8vw, 7rem)" }}
                >
                  Logisticien
                </span>
                <span
                  className="block font-serif font-black text-primary"
                  style={{ fontSize: "clamp(3.2rem, 8vw, 7rem)" }}
                >
                  &amp; Dev
                </span>
                <span
                  className="block font-sans font-black uppercase text-foreground/90 dark:text-foreground/85"
                  style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.8rem)", letterSpacing: "-0.02em" }}
                >
                  Full-Stack
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-[0.95rem] max-w-[400px] pt-2">
                Diplômé de l'INPHB en Logistique &amp; Transports, je bâtis des solutions digitales
                pour simplifier les opérations, maîtriser les flux et connecter les bonnes ressources.
              </p>

              {/* Two fronts */}
              <div className="grid gap-2.5 pt-1">
                <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/60 px-4 py-3">
                  <span className="text-base shrink-0 mt-0.5">🔧</span>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Tech &amp; Digital</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Web, data, IA et automatisation sur mesure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/60 px-4 py-3">
                  <span className="text-base shrink-0 mt-0.5">📦</span>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Logistique</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Inventaire, planification et stockage temporaire</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 flex items-center gap-4">
                <Link href="/contact">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold cursor-pointer hover:bg-foreground/85 transition-colors"
                  >
                    Me contacter
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
                <Link href="/apropos">
                  <span className="text-sm font-medium text-primary hover:opacity-70 transition-opacity cursor-pointer">
                    En savoir plus →
                  </span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Right: Stats + Photo ──────────────────── */}
          <ScrollReveal direction="right" delay={100}>
            <div className="flex gap-6 lg:gap-8 items-stretch">

              {/* Stats column */}
              <div className="flex flex-col justify-center gap-8 shrink-0 py-2">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="cursor-default"
                  >
                    <p className="font-serif font-black text-[2.2rem] leading-none text-foreground tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1 font-mono uppercase tracking-widest whitespace-nowrap">
                      {s.label}
                    </p>
                    {/* Subtle divider */}
                    {i < stats.length - 1 && (
                      <div className="h-px w-10 bg-border mt-3" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Photo */}
              <div className="flex-1 relative">
                {/* Decorative accent */}
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

                <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-lg h-full min-h-[360px] lg:min-h-[440px]">
                  <img
                    src={profileImage}
                    alt="Kroman Jibhar Samuel"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Top accent */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary to-blue-400" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
