import {
  BarChart3, Code2, Cog,
  CheckCircle2, Search, Pencil, Zap, PackageCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";

const servicesMeta = [
  {
    id: "data",
    icon: BarChart3,
    accent: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    glow: "card-hover-glow",
    borderHover: "hover:border-blue-300/60",
  },
  {
    id: "web",
    icon: Code2,
    accent: "from-primary to-blue-500",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    glow: "card-hover-glow",
    borderHover: "hover:border-primary/40",
  },
  {
    id: "automation",
    icon: Cog,
    accent: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    glow: "card-hover-glow-amber",
    borderHover: "hover:border-amber-300/60",
  },
];

const processIcons = [Search, Pencil, Zap, PackageCheck];

const skills = [
  { label: "Power BI & Data Viz", pct: 92 },
  { label: "Excel & VBA", pct: 90 },
  { label: "Supply Chain", pct: 88 },
  { label: "SQL & Bases de données", pct: 85 },
  { label: "React / TypeScript", pct: 80 },
  { label: "IA & Automatisation", pct: 78 },
];

export function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-20 lg:py-28 relative overflow-hidden bg-[hsl(216,30%,99%)] dark:bg-muted/10" data-testid="section-services">

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* ── Section header ─────────────────────── */}
        <ScrollReveal className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            {t.services.badge}
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t.services.title}
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
            {t.services.subtitle}
          </p>
        </ScrollReveal>

        {/* ── Service cards ──────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {t.services.items.map((s, i) => {
            const meta = servicesMeta[i];
            const Icon = meta.icon;
            return (
              <ScrollReveal key={meta.id} delay={i * 120} className="h-full">
                <div
                  className={`group relative rounded-2xl bg-card border border-border/60 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 h-full ${meta.glow} ${meta.borderHover}`}
                  data-testid={`card-service-${meta.id}`}
                >
                  {/* Gradient top accent bar */}
                  <div className={`h-[3px] w-full bg-gradient-to-r ${meta.accent}`} />

                  <div className="p-6">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${meta.iconBg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`w-6 h-6 ${meta.iconColor}`} />
                    </div>

                    {/* Title & desc */}
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2 leading-snug">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.description}</p>

                    {/* Feature list */}
                    <ul className="space-y-2">
                      {s.features.map(f => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/80">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${meta.iconColor} shrink-0`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* ── Process steps ──────────────────────── */}
        <div className="mb-16">
          <ScrollReveal className="text-center mb-10">
            <h3 className="font-serif text-2xl lg:text-3xl font-bold mb-2">{t.services.processTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.services.processSubtitle}</p>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {t.services.process.map((step, i) => {
              const Icon = processIcons[i];
              const num = String(i + 1).padStart(2, "0");
              return (
                <ScrollReveal key={num} delay={i * 100}>
                  <div className="relative text-center group">
                    {/* Connector line */}
                    {i < 3 && (
                      <div className="hidden lg:block absolute top-7 left-1/2 w-full h-px bg-border z-0 translate-x-6" />
                    )}
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-card border border-border/60 flex items-center justify-center mx-auto mb-3 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:shadow-[0_4px_16px_hsl(216,90%,40%,0.12)] transition-all duration-300 shadow-sm">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[10px] font-bold text-primary/40 tracking-widest block mb-0.5">{num}</span>
                      <p className="font-semibold text-sm text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug px-2">{step.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* ── Skill bars ─────────────────────────── */}
        <ScrollReveal>
          <div className="rounded-2xl border border-border/60 bg-card p-7 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-x-12 gap-y-5">
              <div className="lg:col-span-2 mb-2">
                <h3 className="font-serif text-xl font-bold text-foreground mb-1">{t.services.skillsTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.services.skillsSubtitle}</p>
              </div>
              {skills.map((skill) => (
                <div key={skill.label} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{skill.label}</span>
                    <span className="text-xs font-bold text-primary">{skill.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400"
                      style={{ width: `${skill.pct}%`, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
