import { ArrowRight, Mail, BarChart3, CheckCircle2, FileText, Clock, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

const techItems = [
  "Power BI", "React.js", "TypeScript", "SQL", "Excel VBA",
  "Python", "Node.js", "Tailwind CSS", "Supply Chain",
  "DAX", "PostgreSQL", "Automatisation", "Power Query",
];

const defaultHighlights = [
  "Tableaux de bord Power BI",
  "Applications React / TypeScript",
  "Automatisation VBA & Python",
];

const defaultDescription =
  "Je conçois des solutions digitales et des tableaux de bord sur mesure qui transforment vos données en décisions.";

interface SiteContent {
  hero_description: string;
  hero_highlights: string[];
  about_quote: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export function HeroSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { data: content } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });

  const description = content?.hero_description ?? defaultDescription;
  const highlights  = content?.hero_highlights ?? defaultHighlights;
  const isDark = theme === "dark";

  // ── Theme tokens ─────────────────────────────────────────────────────────────
  const bg = isDark
    ? "bg-gradient-to-br from-[#060912] via-[#080c1a] to-[#060b18]"
    : "bg-gradient-to-br from-slate-50 via-white to-blue-50/40";

  const eyebrowColor   = isDark ? "text-[hsl(216,90%,70%)]" : "text-primary";
  const nameKroman     = isDark ? "text-white" : "text-foreground";
  const nameSamuel     = isDark ? "text-white/80" : "text-foreground/70";
  const descColor      = isDark ? "text-white/50" : "text-muted-foreground";
  const highlightColor = isDark ? "text-white/65" : "text-foreground/75";
  const checkColor     = isDark ? "text-[hsl(216,90%,60%)]" : "text-primary";
  const statValue      = isDark ? "text-white" : "text-foreground";
  const statLabel      = isDark ? "text-white/30" : "text-muted-foreground/60";
  const scrollColor    = isDark ? "text-white/20" : "text-foreground/20";
  const ghostNum       = isDark ? "text-white/[0.022]" : "text-black/[0.028]";
  const marqueeLabelColor = isDark ? "text-white/20" : "text-foreground/30";
  const marqueeTextColor  = isDark ? "text-white/22 hover:text-white/45" : "text-foreground/30 hover:text-foreground/60";

  return (
    <section
      id="accueil"
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden pt-16 transition-colors duration-500 ${bg}`}
      data-testid="section-hero"
    >
      {/* Noise texture */}
      <div className={`absolute inset-0 pointer-events-none noise-texture ${isDark ? "opacity-[0.035]" : "opacity-[0.018]"}`} />

      {/* Grid lines — dark mode only */}
      {isDark && <div className="hero-grid hero-grid--dark" />}

      {/* Ghost section number "01" — decorative background */}
      <div
        aria-hidden
        className={`hero-ghost-num absolute -top-6 right-[-2%] select-none pointer-events-none font-serif font-black leading-none ${ghostNum}`}
      >
        01
      </div>

      {/* Glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: isDark ? [0.07, 0.13, 0.07] : [0.08, 0.14, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[15%] w-[520px] h-[520px] rounded-full pointer-events-none orb-blue"
      />
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: isDark ? [0.05, 0.09, 0.05] : [0.04, 0.07, 0.04] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none orb-purple"
      />

      {/* ── Content ────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24 w-full">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <motion.div
            className="space-y-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Status badge + eyebrow row */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3">
              {/* Available badge */}
              <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border border-green-500/25 bg-green-500/[0.07]">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-green-400" />
                </span>
                <span className="text-[11px] font-semibold text-green-400 tracking-wide">
                  {t.hero.available ?? "Disponible pour un projet"}
                </span>
              </div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-px bg-gradient-to-r from-[hsl(216,90%,60%)] to-transparent" />
                <span className={`font-mono text-[11px] tracking-[0.28em] uppercase select-none ${eyebrowColor}`}>
                  {t.hero.role}
                </span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.div variants={itemVariants}>
              <h1 className="font-serif font-black tracking-tighter leading-[0.88] select-none">
                <span className={`block text-[3.8rem] sm:text-[5.2rem] lg:text-[6.5rem] xl:text-[7.5rem] ${nameKroman}`}>
                  Kroman
                </span>
                {isDark ? (
                  <span className="hero-name-jibhar block text-[3.8rem] sm:text-[5.2rem] lg:text-[6.5rem] xl:text-[7.5rem]">
                    Jibhar
                  </span>
                ) : (
                  <span className="block text-[3.8rem] sm:text-[5.2rem] lg:text-[6.5rem] xl:text-[7.5rem] text-primary">
                    Jibhar
                  </span>
                )}
                <span className={`block text-[3.8rem] sm:text-[5.2rem] lg:text-[6.5rem] xl:text-[7.5rem] ${nameSamuel}`}>
                  Samuel
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p variants={itemVariants} className={`text-[0.975rem] leading-[1.80] max-w-[400px] ${descColor}`}>
              {description}
            </motion.p>

            {/* Highlights */}
            <motion.div variants={itemVariants}>
              <ul className="space-y-2.5">
                {highlights.map((h) => (
                  <li key={h} className={`flex items-center gap-2.5 text-sm font-medium ${highlightColor}`}>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${checkColor}`} />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/projets">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="group flex items-center gap-2 font-semibold text-sm px-7 w-full sm:w-auto text-white border-0 hero-cta-primary"
                    data-testid="button-view-projects"
                  >
                    <BarChart3 className="w-4 h-4" />
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

            {/* Devis card */}
            <motion.div variants={itemVariants}>
              <Link href="/contact">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`group flex items-center justify-between gap-4 rounded-2xl cursor-pointer px-5 py-4 border transition-colors duration-200 ${
                    isDark
                      ? "hero-devis-dark hover:border-[rgba(79,142,247,0.25)]"
                      : "border-border/60 hover:border-primary/30 hover:bg-primary/[0.02]"
                  }`}
                  data-testid="button-devis"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-[0_4px_20px_hsl(216,90%,40%,0.35)] bg-primary/10 border border-primary/20">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm leading-snug ${isDark ? "text-white/85" : "text-foreground"}`}>
                        {t.hero.quoteTitle}
                      </p>
                      <p className={`text-xs flex items-center gap-1.5 mt-0.5 ${isDark ? "text-white/35" : "text-muted-foreground/70"}`}>
                        <Clock className="w-3 h-3 shrink-0" />
                        {t.hero.quoteSubtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary ${isDark ? "text-white/25" : "text-muted-foreground/40"}`} />
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className={`flex items-center gap-8 pt-6 border-t ${isDark ? "border-white/[0.06]" : "border-border"}`}
            >
              {t.hero.stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-4">
                  {i > 0 && <div className={`w-px h-9 ${isDark ? "bg-white/[0.07]" : "bg-border"}`} />}
                  <div className="cursor-default">
                    <p className={`text-[1.9rem] font-black font-serif leading-none tracking-tight ${statValue} ${isDark ? "hero-stat-glow" : ""}`}>
                      {stat.value}
                    </p>
                    <p className={`text-[10px] mt-1 tracking-widest font-mono uppercase ${statLabel}`}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — profile photo */}
          <motion.div
            className="order-first lg:order-last flex justify-center"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              {/* Decorative accent shape behind photo */}
              <motion.div
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute -bottom-4 -right-4 w-[80%] h-[80%] rounded-2xl pointer-events-none ${isDark ? "bg-primary/8 border border-primary/10" : "bg-primary/6 border border-primary/12"}`}
              />
              {/* Second offset accent */}
              <div className={`absolute -top-4 -left-4 w-16 h-16 rounded-xl pointer-events-none ${isDark ? "border border-white/[0.06]" : "border border-black/[0.05]"}`} />

              {/* Ambient glow */}
              <div className="absolute -inset-10 rounded-[3rem] pointer-events-none orb-blue opacity-10" />

              {/* Frame */}
              <div className="hero-photo-frame relative w-[256px] h-[332px] sm:w-[280px] sm:h-[363px] lg:w-[300px] lg:h-[390px] rounded-3xl overflow-hidden z-10">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-profile"
                />
                <div className={`absolute inset-x-0 bottom-0 h-1/3 pointer-events-none ${isDark ? "bg-gradient-to-t from-black/50 to-transparent" : "bg-gradient-to-t from-black/20 to-transparent"}`} />
                <div className="hero-photo-topline absolute inset-x-0 top-0 h-[2px] pointer-events-none" />
              </div>

            </div>
          </motion.div>
        </div>

        {/* ── Tech marquee ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className={`mt-20 pt-8 border-t ${isDark ? "border-white/[0.05]" : "border-border"}`}
        >
          <p className={`text-[10px] font-mono uppercase tracking-[0.26em] text-center mb-6 ${marqueeLabelColor}`}>
            {t.hero.techStrip}
          </p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...techItems, ...techItems].map((tech, i) => (
                <span key={i} className={`inline-flex items-center gap-2 mx-7 text-[13px] font-medium whitespace-nowrap transition-colors duration-300 ${marqueeTextColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary/35" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className={`font-mono text-[9px] tracking-[0.25em] uppercase ${scrollColor}`}>Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className={`w-3.5 h-3.5 ${scrollColor}`} />
        </motion.div>
      </motion.div>
    </section>
  );
}
