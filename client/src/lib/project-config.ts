import { BarChart3, Globe, Cog, Smartphone, Monitor, FileSpreadsheet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Category Icons ───────────────────────────────────────────────────────────

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  dashboard:      BarChart3,
  "app-web":      Globe,
  "app-mobile":   Smartphone,
  "site-web":     Monitor,
  "excel-vba":    FileSpreadsheet,
  automatisation: Cog,
};

// ─── Category Labels ──────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  dashboard:      "Dashboard",
  "app-web":      "App web",
  "app-mobile":   "App mobile",
  "site-web":     "Site web",
  "excel-vba":    "Excel VBA app",
  automatisation: "Automatisation",
};

// ─── Category Visual Styles ───────────────────────────────────────────────────

export type CategoryStyle = {
  gradient: string; text: string; border: string; iconColor: string;
  badgeBg: string; glowHover: string; accentBar: string;
};

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  dashboard: {
    gradient: "from-blue-500/20 via-blue-400/10 to-blue-600/5",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200/60 dark:border-blue-800/40",
    iconColor: "text-blue-500/45",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60",
    glowHover: "hover:shadow-[0_16px_48px_hsl(216,80%,55%,0.20)]",
    accentBar: "from-blue-500 to-blue-400",
  },
  "app-web": {
    gradient: "from-primary/15 via-primary/8 to-blue-400/5",
    text: "text-primary",
    border: "border-primary/25",
    iconColor: "text-primary/35",
    badgeBg: "bg-primary/8 text-primary border-primary/20",
    glowHover: "hover:shadow-[0_16px_48px_hsl(216,90%,40%,0.20)]",
    accentBar: "from-primary to-blue-400",
  },
  "app-mobile": {
    gradient: "from-green-500/15 via-emerald-400/8 to-teal-500/5",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200/60 dark:border-green-800/40",
    iconColor: "text-green-500/45",
    badgeBg: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200/60",
    glowHover: "hover:shadow-[0_16px_48px_hsl(142,65%,45%,0.18)]",
    accentBar: "from-green-500 to-emerald-400",
  },
  "site-web": {
    gradient: "from-cyan-500/15 via-sky-400/8 to-blue-400/5",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200/60 dark:border-cyan-800/40",
    iconColor: "text-cyan-500/45",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200/60",
    glowHover: "hover:shadow-[0_16px_48px_hsl(190,80%,45%,0.18)]",
    accentBar: "from-cyan-500 to-sky-400",
  },
  "excel-vba": {
    gradient: "from-emerald-500/15 via-green-400/8 to-lime-400/5",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/60 dark:border-emerald-800/40",
    iconColor: "text-emerald-500/45",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60",
    glowHover: "hover:shadow-[0_16px_48px_hsl(158,70%,40%,0.18)]",
    accentBar: "from-emerald-500 to-green-400",
  },
  automatisation: {
    gradient: "from-amber-500/15 via-amber-400/8 to-orange-500/5",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/60 dark:border-amber-800/40",
    iconColor: "text-amber-500/45",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60",
    glowHover: "hover:shadow-[0_16px_48px_hsl(38,90%,50%,0.18)]",
    accentBar: "from-amber-500 to-orange-400",
  },
};

export const DEFAULT_STYLE: CategoryStyle = {
  gradient:  "from-muted/30 to-muted/10",
  text:      "text-foreground",
  border:    "border-border/60",
  iconColor: "text-muted-foreground/40",
  badgeBg:   "bg-muted text-muted-foreground border-border/60",
  glowHover: "hover:shadow-md",
  accentBar: "from-muted to-muted/60",
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

export const PROJECT_FILTERS = [
  { key: "all",            label: "Tous" },
  { key: "dashboard",      label: "Dashboard" },
  { key: "app-web",        label: "App web" },
  { key: "app-mobile",     label: "App mobile" },
  { key: "site-web",       label: "Site web" },
  { key: "excel-vba",      label: "Excel VBA" },
  { key: "automatisation", label: "Automatisation" },
] as const;
