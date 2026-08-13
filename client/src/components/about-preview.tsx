import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";

export function AboutPreview() {
  return (
    <section className="relative bg-[hsl(210,20%,98%)] dark:bg-[hsl(222,20%,7%)] border-t border-border/40 overflow-hidden">

      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">

          {/* ── Big editorial typography ───────── */}
          <ScrollReveal direction="left">
            <div className="space-y-6">

              {/* Massive mixed headline */}
              <div className="leading-[0.88] tracking-tight select-none">
                <span
                  className="block font-serif font-black italic text-foreground dark:text-foreground"
                  style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
                >
                  Logisticien
                </span>
                <span
                  className="block font-sans font-black uppercase text-primary"
                  style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.02em" }}
                >
                  &amp; Entrepreneur Tech
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-[0.95rem] max-w-[560px] pt-2">
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
                    En savoir plus sur moi →
                  </span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
