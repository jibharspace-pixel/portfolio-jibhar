import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";

const stats = [
  { value: "3+",   label: "Années d'expérience", icon: "⏱" },
  { value: "10+",  label: "Projets réalisés",     icon: "🚀" },
  { value: "5+",   label: "Entreprises servies",  icon: "🏢" },
  { value: "24/7", label: "Disponible remote",    icon: "🌍" },
];

export function StatsStrip() {
  return (
    <section className="relative bg-[#0a0a0a] dark:bg-[#04070f] overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-0">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 80}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`flex flex-col items-center justify-center py-8 lg:py-10 px-4 text-center cursor-default ${
                  i < stats.length - 1 ? "border-r border-white/[0.07]" : ""
                } ${i < 2 ? "border-b lg:border-b-0 border-white/[0.07]" : ""}`}
              >
                <span className="text-xl mb-1 select-none">{stat.icon}</span>
                <p className="text-[2.4rem] lg:text-[2.8rem] font-black text-white leading-none tracking-tight font-sans">
                  {stat.value}
                </p>
                <p className="text-[11px] text-white/30 font-medium tracking-wide mt-1.5 uppercase">
                  {stat.label}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
