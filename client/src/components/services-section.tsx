import {
  BarChart3, Brain, Code2, Cog, Truck, Sparkles,
  CheckCircle2, Search, Pencil, Zap, PackageCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    id: "data",
    icon: BarChart3,
    accent: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    glow: "card-hover-glow",
    borderHover: "hover:border-blue-300/60",
    title: "Data & Business Intelligence",
    description:
      "Des tableaux de bord interactifs et des analyses avancées pour piloter vos décisions avec précision et clarté.",
    features: [
      "Dashboards Power BI & DAX",
      "SQL & Bases de données",
      "Excel avancé & Power Query",
      "KPIs Supply Chain",
    ],
  },
  {
    id: "web",
    icon: Code2,
    accent: "from-primary to-blue-500",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    glow: "card-hover-glow",
    borderHover: "hover:border-primary/40",
    title: "Développement Web & Applications",
    description:
      "Applications web modernes, performantes et scalables — du frontend React au backend Rust, clé en main.",
    features: [
      "React.js / TypeScript",
      "API REST (Rust / Node.js)",
      "Bases de données (PostgreSQL)",
      "Déploiement & hébergement",
    ],
  },
  {
    id: "ai",
    icon: Sparkles,
    accent: "from-purple-500 to-violet-600",
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    glow: "card-hover-glow-purple",
    borderHover: "hover:border-purple-300/60",
    title: "IA & Automatisation",
    description:
      "Intégrez l'intelligence artificielle et automatisez vos processus répétitifs pour gagner en efficacité chaque semaine.",
    features: [
      "ChatGPT & LLM APIs",
      "VBA & Macros Excel",
      "Scripts Python / ML",
      "Workflows automatisés",
    ],
  },
];

const process = [
  { num: "01", icon: Search, title: "Évaluation", desc: "Analyse de vos besoins et objectifs" },
  { num: "02", icon: Pencil, title: "Conception", desc: "Design de la solution adaptée" },
  { num: "03", icon: Zap, title: "Réalisation", desc: "Développement itératif & tests" },
  { num: "04", icon: PackageCheck, title: "Livraison", desc: "Formation, documentation & support" },
];

const skills = [
  { label: "Power BI & Data Viz", pct: 92 },
  { label: "Excel & VBA", pct: 90 },
  { label: "Supply Chain", pct: 88 },
  { label: "SQL & Bases de données", pct: 85 },
  { label: "React / TypeScript", pct: 80 },
  { label: "IA & Automatisation", pct: 78 },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-28 relative overflow-hidden bg-muted/25" data-testid="section-services">
      <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
      <div className="section-blob w-96 h-96 bg-primary/6 -top-20 -left-20 animate-glow-pulse" />
      <div className="section-blob w-80 h-80 bg-purple-400/6 bottom-0 right-0 animate-glow-pulse delay-400" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* ── Section header ─────────────────────── */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            Services
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Ce que je propose
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
            Des solutions digitales sur mesure pour transformer vos données en décisions et optimiser vos opérations.
          </p>
        </div>

        {/* ── Service cards ──────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={`group relative rounded-2xl bg-card border border-border/60 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${s.glow} ${s.borderHover}`}
                data-testid={`card-service-${s.id}`}
              >
                {/* Gradient top accent bar */}
                <div className={`h-[3px] w-full bg-gradient-to-r ${s.accent}`} />

                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${s.iconColor}`} />
                  </div>

                  {/* Title & desc */}
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2 leading-snug">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.description}</p>

                  {/* Feature list */}
                  <ul className="space-y-2">
                    {s.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/80">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${s.iconColor} shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Process steps ──────────────────────── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl lg:text-3xl font-bold mb-2">Ma démarche</h3>
            <p className="text-sm text-muted-foreground">4 étapes pour transformer votre idée en solution opérationnelle</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {process.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative text-center group">
                  {/* Connector line */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-7 left-1/2 w-full h-px bg-border z-0 translate-x-6" />
                  )}
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-card border border-border/60 flex items-center justify-center mx-auto mb-3 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:shadow-[0_4px_16px_hsl(216,90%,40%,0.12)] transition-all duration-300 shadow-sm">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-primary/40 tracking-widest block mb-0.5">{step.num}</span>
                    <p className="font-semibold text-sm text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug px-2">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Skill bars ─────────────────────────── */}
        <div className="rounded-2xl border border-border/60 bg-card p-7 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-x-12 gap-y-5">
            <div className="lg:col-span-2 mb-2">
              <h3 className="font-serif text-xl font-bold text-foreground mb-1">Compétences Techniques</h3>
              <p className="text-sm text-muted-foreground">Niveau de maîtrise par domaine</p>
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
      </div>
    </section>
  );
}
