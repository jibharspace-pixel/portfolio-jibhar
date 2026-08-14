import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactDialog } from "@/components/contact-dialog";
import { PROFILE_PHOTOS, PHOTO_ROTATION_MS } from "@/lib/profile-photos";

export function AboutPreview() {
  const [contactOpen, setContactOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (PROFILE_PHOTOS.length < 2) return;
    const timer = setInterval(
      () => setPhotoIdx((i) => (i + 1) % PROFILE_PHOTOS.length),
      PHOTO_ROTATION_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-[hsl(210,20%,98%)] dark:bg-[hsl(222,20%,7%)] border-t border-border/40 overflow-hidden">

      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Left: Big editorial typography ───────── */}
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
                <motion.button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold cursor-pointer hover:bg-foreground/85 transition-colors"
                  data-testid="button-contact-preview"
                >
                  Me contacter
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <Link href="/apropos">
                  <span className="text-sm font-medium text-primary hover:opacity-70 transition-opacity cursor-pointer">
                    En savoir plus sur moi →
                  </span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Right: Photo ──────────────────────────── */}
          <ScrollReveal direction="right" delay={100}>
            <div className="relative">
              {/* Decorative accent */}
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-lg min-h-[360px] lg:min-h-[440px]">
                <img
                  src={PROFILE_PHOTOS[photoIdx]}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top absolute inset-0"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Top accent */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary to-blue-400" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </section>
  );
}
