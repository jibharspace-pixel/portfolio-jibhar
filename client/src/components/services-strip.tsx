import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { BarChart3, FileSpreadsheet, LayoutDashboard, Globe, Package } from "lucide-react";

const SERVICES = [
  {
    num: "01",
    icon: BarChart3,
    label: "Data & Business Intelligence",
    desc: "Transformez vos données brutes en tableaux de bord clairs, interactifs et exploitables pour piloter vos décisions.",
  },
  {
    num: "02",
    icon: FileSpreadsheet,
    label: "Applications Excel & Power Apps",
    desc: "Des outils métier sur mesure pour automatiser vos fichiers, formulaires et processus du quotidien.",
  },
  {
    num: "03",
    icon: LayoutDashboard,
    label: "Tableaux de bord personnalisés",
    desc: "Suivez vos performances en temps réel avec des indicateurs adaptés à votre activité et vos objectifs.",
  },
  {
    num: "04",
    icon: Globe,
    label: "App Web, Mobile & IA",
    desc: "Des applications modernes et intelligentes pour digitaliser votre métier et automatiser vos services.",
  },
  {
    num: "05",
    icon: Package,
    label: "Stockage temporaire & Logistique",
    desc: "Mise en relation, gestion de stocks et optimisation des flux pour e-commerçants et opérateurs logistiques.",
  },
];

export function ServicesStrip() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`relative border-b overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-[#0e1118] border-white/[0.06]"
          : "bg-[hsl(220,15%,97%)] border-border/50"
      }`}
    >

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-18">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <span className="w-1 h-5 rounded-full bg-primary shrink-0" />
          <p className={`text-[11px] font-mono uppercase tracking-[0.28em] ${isDark ? "text-white/30" : "text-foreground/35"}`}>
            Ce que je fais
          </p>
          <div className={`flex-1 h-px ${isDark ? "bg-white/[0.05]" : "bg-border/50"}`} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex flex-col gap-4 px-5 py-6 border rounded-2xl cursor-default transition-all duration-300 ${
                  isDark
                    ? "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12]"
                    : "border-border/50 bg-white hover:border-border shadow-sm hover:shadow-md"
                }`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isDark
                    ? "bg-white/[0.05] border border-white/[0.08] group-hover:bg-primary/12 group-hover:border-primary/25"
                    : "bg-muted/60 border border-border/60 group-hover:bg-primary/8 group-hover:border-primary/20"
                }`}>
                  <Icon className={`w-4 h-4 transition-colors duration-300 ${isDark ? "text-white/50 group-hover:text-primary" : "text-foreground/50 group-hover:text-primary"}`} strokeWidth={1.5} />
                </div>

                {/* Number */}
                <span className={`font-mono text-[9px] select-none absolute top-4 right-4 ${isDark ? "text-white/12" : "text-foreground/18"}`}>
                  {s.num}
                </span>

                {/* Label */}
                <p className={`text-[13px] font-semibold leading-snug transition-colors duration-200 ${
                  isDark
                    ? "text-white/70 group-hover:text-white/90"
                    : "text-foreground/80 group-hover:text-foreground"
                }`}>
                  {s.label}
                </p>

                {/* Description */}
                <p className={`text-[11.5px] leading-relaxed ${isDark ? "text-white/28" : "text-muted-foreground/80"}`}>
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent ${isDark ? "via-white/[0.05]" : "via-border/50"} to-transparent`} />
    </section>
  );
}
