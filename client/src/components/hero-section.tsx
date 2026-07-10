import { ArrowRight, Download, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { DevisDialog } from "@/components/devis-dialog";
import profileImage from "@assets/WhatsApp_Image_2025-12-18_à_11.19.30_7d050f19_1766058148816.jpg";

const techItems = [
  "Power BI", "React.js", "TypeScript", "SQL", "Excel VBA",
  "Python", "Node.js", "Tailwind CSS", "Supply Chain",
  "DAX", "PostgreSQL", "Automatisation", "Power Query",
];

interface SiteContent { hero_description: string; hero_highlights: string[]; about_quote: string; cv_url?: string; }

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const fadeUp  = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };

export function HeroSection() {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { data: content } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });
  const isDark = theme === "dark";
  const cvUrl = content?.cv_url;

  const bg = isDark
    ? "bg-[#070b14]"
    : "bg-[#f8f8f6]";

  const headingColor  = isDark ? "text-white"           : "text-[#0a0a0a]";
  const accentColor   = isDark ? "text-[hsl(216,90%,62%)]" : "text-primary";
  const descColor     = isDark ? "text-white/50"         : "text-[#555]";
  const eyebrowColor  = isDark ? "text-white/35"         : "text-[#888]";
  const ghostNum      = isDark ? "text-white/[0.022]"    : "text-black/[0.025]";

  return (
    <section
      id="accueil"
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden transition-colors duration-500 ${bg}`}
      data-testid="section-hero"
    >
      {/* Noise */}
      <div className={`absolute inset-0 pointer-events-none noise-texture ${isDark ? "opacity-[0.035]" : "opacity-[0.018]"}`} />

      {/* Grid — dark only */}
      {isDark && <div className="hero-grid hero-grid--dark" />}

      {/* Ghost number */}
      <div aria-hidden className={`hero-ghost-num absolute -top-6 right-[-2%] select-none pointer-events-none font-serif font-black leading-none ${ghostNum}`}>01</div>

      {/* Glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: isDark ? [0.07, 0.13, 0.07] : [0.05, 0.09, 0.05] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[15%] w-[480px] h-[480px] rounded-full pointer-events-none orb-blue"
      />

      {/* Available badge — top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="absolute top-20 right-6 lg:right-8 hidden sm:flex items-center gap-2 z-10"
      >
        <span className="relative flex w-1.5 h-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-green-400" />
        </span>
        <span className={`text-[10px] font-bold tracking-[0.22em] uppercase ${isDark ? "text-white/35" : "text-[#888]"}`}>
          {lang === "fr" ? "Disponible" : "Available"}
        </span>
      </motion.div>

      {/* ── Main content ─────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-12 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">

          {/* Left */}
          <motion.div className="space-y-8" variants={stagger} initial="hidden" animate="visible">

            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-primary" : "bg-primary"}`} />
              <span className={`text-[11px] font-bold tracking-[0.28em] uppercase ${eyebrowColor}`}>
                Kroman Jibhar Samuel · Abidjan, Côte d'Ivoire
              </span>
            </motion.div>

            {/* Bold editorial heading */}
            <motion.div variants={fadeUp}>
              <h1 className="font-sans font-black leading-[0.90] tracking-[-0.03em] select-none">
                <span className={`block text-[3.6rem] sm:text-[5rem] lg:text-[5.8rem] xl:text-[6.8rem] uppercase ${headingColor}`}>
                  Logistique
                </span>
                <span className={`block text-[3.6rem] sm:text-[5rem] lg:text-[5.8rem] xl:text-[6.8rem] uppercase ${accentColor}`}>
                  &amp; Digital
                </span>
                <span className={`block text-[3.6rem] sm:text-[5rem] lg:text-[5.8rem] xl:text-[6.8rem] uppercase ${headingColor} opacity-40`}>
                  Résultats.
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p variants={fadeUp} className={`text-[1rem] leading-[1.75] max-w-[420px] ${descColor}`}>
              {content?.hero_description ?? "Je conçois des solutions digitales et des tableaux de bord sur mesure qui transforment vos données en décisions."}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <Link href="/projets">
                <Button
                  size="lg"
                  className="group flex items-center gap-2.5 font-bold text-sm px-8 h-12 text-white border-0 hero-cta-primary rounded-full"
                  data-testid="button-view-projects"
                >
                  {t.hero.viewProjects}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>

              {cvUrl ? (
                <a href={cvUrl} download target="_blank" rel="noopener noreferrer">
                  <button className={`flex items-center gap-2 text-sm font-bold transition-colors duration-200 ${isDark ? "text-white/50 hover:text-white/90" : "text-[#888] hover:text-[#0a0a0a]"}`}>
                    <Download className="w-4 h-4" />
                    {t.nav.downloadCv}
                  </button>
                </a>
              ) : (
                <DevisDialog trigger={
                  <button className={`flex items-center gap-2 text-sm font-bold transition-colors duration-200 ${isDark ? "text-white/50 hover:text-white/90" : "text-[#888] hover:text-[#0a0a0a]"}`}>
                    Demander un devis
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                } />
              )}
            </motion.div>

            {/* Quick role tags */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {["Full-Stack Dev", "Data & BI", "Supply Chain", "Fondateur RemoX"].map((tag) => (
                <span
                  key={tag}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors duration-200 ${
                    isDark
                      ? "border-white/10 text-white/40 hover:border-white/25 hover:text-white/65"
                      : "border-black/10 text-[#777] hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Photo */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              {/* Large editorial circle — INKY inspired */}
              <div className={`absolute -right-8 -top-8 w-[85%] h-[85%] rounded-full pointer-events-none ${isDark ? "bg-primary/18" : "bg-primary/20"}`} />
              {/* Small accent dot */}
              <div className={`absolute -left-4 bottom-16 w-10 h-10 rounded-full pointer-events-none ${isDark ? "bg-blue-400/20" : "bg-blue-400/25"}`} />

              {/* Ambient glow */}
              <div className="absolute -inset-12 rounded-full pointer-events-none orb-blue opacity-[0.08]" />

              {/* Frame */}
              <div className="hero-photo-frame relative w-[260px] h-[340px] sm:w-[290px] sm:h-[378px] lg:w-[320px] lg:h-[416px] rounded-3xl overflow-hidden z-10">
                <img
                  src={profileImage}
                  alt="Kroman Jibhar Samuel"
                  className="w-full h-full object-cover object-top"
                  data-testid="img-profile"
                />
                <div className={`absolute inset-x-0 bottom-0 h-1/3 pointer-events-none ${isDark ? "bg-gradient-to-t from-black/50 to-transparent" : "bg-gradient-to-t from-black/15 to-transparent"}`} />
                <div className="hero-photo-topline absolute inset-x-0 top-0 h-[2px] pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Tech marquee ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className={`mt-10 pt-8 border-t ${isDark ? "border-white/[0.05]" : "border-black/[0.07]"}`}
        >
          <p className={`text-[10px] font-mono uppercase tracking-[0.26em] text-center mb-5 ${isDark ? "text-white/20" : "text-black/25"}`}>
            {t.hero.techStrip}
          </p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...techItems, ...techItems].map((tech, i) => (
                <span key={i} className={`inline-flex items-center gap-2 mx-7 text-[13px] font-medium whitespace-nowrap transition-colors duration-300 ${isDark ? "text-white/22 hover:text-white/50" : "text-black/28 hover:text-black/60"}`}>
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className={`w-4 h-4 ${isDark ? "text-white/20" : "text-black/20"}`} />
        </motion.div>
      </motion.div>
    </section>
  );
}
