import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

interface SiteContent {
  hero_description: string;
  hero_highlights: string[];
  about_quote: string;
}

const defaultDescription =
  "J'aide les entreprises à exploiter leurs données, automatiser leurs processus et optimiser leur logistique pour gagner en efficacité.";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export function HeroSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: content } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });
  const description = content?.hero_description ?? defaultDescription;

  const bg = isDark
    ? "bg-gradient-to-br from-[#060912] via-[#080c1a] to-[#060b18]"
    : "bg-gradient-to-br from-slate-50 via-white to-blue-50/40";

  const descColor   = isDark ? "text-white/70"  : "text-foreground/70";
  const borderColor = isDark ? "border-white/[0.07]" : "border-border";
  const statVal     = isDark ? "text-white" : "text-foreground";
  const statLbl     = isDark ? "text-white/25" : "text-muted-foreground/60";
  const divider     = isDark ? "bg-white/[0.07]" : "bg-border";
  const ghostColor  = isDark ? "text-white" : "text-foreground";
  const ringOuter   = isDark ? "border-white/[0.04]" : "border-border/30";
  const photoBorder = isDark ? "border-white/10" : "border-border/50";

  return (
    <section
      id="accueil"
      className={`relative min-h-screen flex flex-col overflow-hidden transition-colors duration-500 ${bg}`}
      data-testid="section-hero"
    >
      {/* Noise */}
      <div className={`absolute inset-0 pointer-events-none noise-texture ${isDark ? "opacity-[0.035]" : "opacity-[0.018]"}`} />

      {/* Grid lines dark only */}
      {isDark && <div className="hero-grid hero-grid--dark" />}

      {/* Glow orb */}
      <motion.div
        animate={{ opacity: isDark ? [0.07, 0.13, 0.07] : [0.05, 0.10, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-[20%] w-[500px] h-[500px] rounded-full pointer-events-none orb-blue"
      />

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 lg:px-8 pt-24 pb-0">

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-center py-10 lg:py-16">

          {/* Left */}
          <motion.div
            className="space-y-7 order-1"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
          >
            {/* Available badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/25 bg-green-500/[0.07]">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-green-400" />
                </span>
                <span className="text-[11px] font-semibold text-green-400 tracking-wide">
                  {t.hero.available}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className={`text-[1rem] leading-[1.85] max-w-[420px] ${descColor}`}>
                {description}
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants}>
              <div className={`flex items-center gap-8 pt-2 border-t ${borderColor}`}>
                {t.hero.stats.map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    {i > 0 && <div className={`w-px h-8 ${divider}`} />}
                    <div className="cursor-default">
                      <p className={`font-serif font-black text-[1.8rem] leading-none tracking-tight ${statVal} ${isDark ? "hero-stat-glow" : ""}`}>
                        {stat.value}
                      </p>
                      <p className={`text-[10px] mt-1 tracking-widest font-mono uppercase ${statLbl}`}>{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
              <Link href="/projets">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="group flex items-center gap-2 font-semibold text-sm px-7 w-full sm:w-auto text-white border-0 hero-cta-primary"
                    data-testid="button-view-projects"
                  >
                    {t.hero.viewProjects}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`flex items-center gap-2 font-semibold text-sm px-7 w-full sm:w-auto ${isDark ? "hero-outline-btn-dark" : ""}`}
                    data-testid="button-contact-me"
                  >
                    <Mail className="w-4 h-4" />
                    {t.hero.contactMe}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Photo */}
          <motion.div
            className="order-2 flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-full border border-primary/20 pointer-events-none" />
              <div className={`absolute -inset-6 rounded-full border pointer-events-none ${ringOuter}`} />
              <div className="absolute -left-4 bottom-8 w-7 h-7 rounded-full bg-blue-400/30 pointer-events-none" />

              <div className={`relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] lg:w-[340px] lg:h-[340px] rounded-full overflow-hidden z-10 border-2 ${photoBorder}`}>
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-profile"
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                  onDragStart={e => e.preventDefault()}
                  style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
                />
                {/* Overlay transparent — bloque appui long Android */}
                <div className="absolute inset-0 z-20 select-none" style={{ WebkitTouchCallout: "none" } as React.CSSProperties} />
                <div className="hero-photo-topline absolute inset-x-0 top-0 h-[2px] pointer-events-none z-30" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Huge decorative name */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pb-0 overflow-hidden"
          aria-hidden
        >
          <p
            className={`font-serif font-black leading-[0.82] tracking-tighter select-none whitespace-nowrap ${ghostColor}`}
            style={{ fontSize: "clamp(5rem, 18vw, 17rem)", opacity: isDark ? 0.12 : 0.04 }}
          >
            JIBHAR
          </p>
        </motion.div>
      </div>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 right-0 leading-[0] overflow-hidden pointer-events-none" style={{ height: 80 }}>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M0,40 C180,80 360,10 540,45 C720,80 900,15 1080,50 C1260,80 1380,30 1440,40 L1440,80 L0,80 Z"
            fill={isDark ? "#0e1118" : "hsl(220,15%,97%)"}
          />
          <path
            d="M0,55 C200,20 440,70 660,45 C880,20 1100,65 1440,50 L1440,80 L0,80 Z"
            fill={isDark ? "#0e1118" : "hsl(220,15%,97%)"}
            opacity="0.6"
          />
        </svg>
      </div>
    </section>
  );
}
