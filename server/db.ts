// ─── Types ────────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string; url: string; media_type: string; project_id: string; filename: string;
}
export interface Project {
  id: string; title: string; description: string; problem: string; solution: string;
  result: string; technologies: string[]; category: string;
  demo_url?: string; download_url?: string; media?: MediaItem[];
}
export interface BlogPost {
  id: string; title: string; slug: string; excerpt: string; content: string;
  category: string; tags: string[]; cover_url?: string; status: string;
  created_at: string; view_count: number; read_time: number;
}
export interface FreeFile {
  id: string; title: string; description: string; file_url: string; file_type: string;
  download_count: number; category: string; tags: string[]; created_at: string;
}
export interface Service {
  id: string; title: string; description: string; icon: string; features: string[];
  long_description?: string; videos?: string[]; photos?: string[];
}
export interface ContactInfo {
  email: string; linkedin: string; whatsapp: string; github: string; upwork?: string; chariow?: string;
}
export interface SiteContent {
  hero_description: string; hero_highlights: string[]; about_quote: string;
  footer_tagline: string; stack_tags: string[]; cv_url?: string;
}
export interface ContactMessage {
  id: string; name: string; email: string; subject: string; message: string;
  created_at: string; read: boolean;
}

// ─── Persistence ──────────────────────────────────────────────────────────────
import { loadData, saveData } from "./persist";

// ─── In-memory store ──────────────────────────────────────────────────────────

export const db = {
  projects: [] as Project[],

  services: [
    { id: "data", title: "Analyse de données & BI", description: "Tableaux de bord interactifs, KPIs et visualisations avancées pour piloter votre activité.", icon: "BarChart3", features: ["Power BI", "Excel / DAX", "SQL"] },
    { id: "ai",   title: "Solutions IA & Automatisation", description: "Intégration IA et automatisation de vos processus métier pour gagner en productivité.", icon: "Brain", features: ["ChatGPT API", "Python ML", "VBA"] },
    { id: "web",  title: "Développement Web", description: "Applications web modernes, performantes et adaptées à vos besoins métier.", icon: "Globe", features: ["React / TypeScript", "REST API", "PostgreSQL"] },
  ] as Service[],

  blog: [] as BlogPost[],

  files: [] as FreeFile[],

  media: new Map<string, MediaItem[]>(),
  page_views: new Map<string, number>(),
  blog_views: new Map<string, number>(),

  contact: {
    email: "jibharkroman@gmail.com",
    linkedin: "https://linkedin.com/in/kroman-jibhar-samuel",
    whatsapp: "+225 0767682937",
    github: "https://github.com/kromanjibhar",
    upwork: "#",
    chariow: "https://apdzoviz.mychariow.shop",
  } as ContactInfo,

  site_content: {
    hero_description: "Je transforme vos données en décisions|vos décisions en résultats|Dashboards, applications web et automatisations conçus sur mesure.",
    hero_highlights: ["Tableau de bord sur mesure", "Solutions IA & automatisation", "Solutions Excel & VBA", "Création d'applications & sites web", "Présence digitale & community management"],
    about_quote: "Autodidacte déterminé, je transforme la complexité en solutions simples et efficaces.",
    footer_tagline: "Je transforme vos données en décisions, vos décisions en résultats. Dashboards, applications web et automatisations conçus sur mesure.",
    stack_tags: ["Excel", "VBA", "Power BI", "Power Apps", "React", "HTML", "CSS", "JS", "Python", "Rust", "Analyse et réalisation d'inventaire", "Analyse de données", "Analyste Supply Chain", "Solutions IA", "Site web", "App mobile", "App web", "Tableau de bord"],
  } as SiteContent,
  messages: [] as ContactMessage[],
};

// ─── Load persisted data on startup ──────────────────────────────────────────
const saved = loadData();
if (saved) {
  if (saved.projects)     db.projects     = saved.projects as typeof db.projects;
  if (saved.services)     db.services     = saved.services as typeof db.services;
  if (saved.blog)         db.blog         = saved.blog as typeof db.blog;
  if (saved.files)        db.files        = saved.files as typeof db.files;
  if (saved.contact)      Object.assign(db.contact, saved.contact);
  if (saved.site_content) Object.assign(db.site_content, saved.site_content);
  if (saved.messages)     db.messages     = saved.messages as typeof db.messages;
}

// ─── Save helper ─────────────────────────────────────────────────────────────
export function persist(): void {
  saveData({
    projects:     db.projects,
    services:     db.services,
    blog:         db.blog,
    files:        db.files,
    contact:      db.contact,
    site_content: db.site_content,
    messages:     db.messages,
  });
}
