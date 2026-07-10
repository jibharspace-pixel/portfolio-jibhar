import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "./database";
import {
  projects, blog_posts, free_files, services, contact_info,
  site_content, contact_messages, cv_downloads,
} from "../shared/schema";
import type { Project, BlogPost, FreeFile, Service, ContactInfo, MediaItem } from "../shared/schema";

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_CONTACT: Omit<ContactInfo, never> = {
  email: "jibharkroman@gmail.com",
  linkedin: "https://linkedin.com/in/kroman-jibhar-samuel",
  whatsapp: "+225 0767682937",
  github: "https://github.com/kromanjibhar",
  upwork: "#",
  chariow: "https://apdzoviz.mychariow.shop",
};

const DEFAULT_CONTENT = {
  hero_description: "Je transforme vos données en décisions|vos décisions en résultats|Dashboards, applications web et automatisations conçus sur mesure.",
  hero_highlights: ["Tableau de bord sur mesure", "Solutions IA & automatisation", "Solutions Excel & VBA", "Création d'applications & sites web", "Présence digitale & community management"],
  about_quote: "Autodidacte déterminé, je transforme la complexité en solutions simples et efficaces.",
  footer_tagline: "Je transforme vos données en décisions, vos décisions en résultats. Dashboards, applications web et automatisations conçus sur mesure.",
  stack_tags: ["Excel", "VBA", "Power BI", "Power Apps", "React", "HTML", "CSS", "JS", "Python", "Rust", "Analyse et réalisation d'inventaire", "Analyse de données", "Analyste Supply Chain", "Solutions IA", "Site web", "App mobile", "App web", "Tableau de bord"],
  cv_url: null as string | null,
};

const DEFAULT_SERVICES = [
  { id: "data", title: "Analyse de données & BI", description: "Tableaux de bord interactifs, KPIs et visualisations avancées.", icon: "BarChart3", features: ["Power BI", "Excel / DAX", "SQL"] },
  { id: "ai",   title: "Solutions IA & Automatisation", description: "Intégration IA et automatisation de vos processus métier.", icon: "Brain", features: ["ChatGPT API", "Python ML", "VBA"] },
  { id: "web",  title: "Développement Web", description: "Applications web modernes, performantes et adaptées.", icon: "Globe", features: ["React / TypeScript", "REST API", "PostgreSQL"] },
];

const DEFAULT_PROJECTS = [
  {
    title: "RemoX",
    description: "Plateforme de mise en relation entre automobilistes et dépanneurs remorqueurs en Côte d'Ivoire. Coordination des interventions en temps réel, partout sur le territoire.",
    problem: "En Côte d'Ivoire, les automobilistes en panne n'ont aucun moyen fiable et rapide de trouver un dépanneur disponible à proximité. Les appels téléphoniques, le bouche-à-oreille et l'attente aléatoire créent stress et perte de temps.",
    solution: "RemoX est une application web et mobile qui géolocalise les dépanneurs disponibles en temps réel, permet à l'automobiliste de lancer une demande d'intervention, de suivre l'arrivée du dépanneur sur une carte et de régler en ligne.",
    result: "Plateforme en cours de développement. Startup fondée et en cours de déclaration officielle. Rôle : CEO & Co-fondateur.",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Google Maps API", "Socket.io", "Stripe"],
    category: "app-web",
    demo_url: "https://remox-landing.onrender.com",
    download_url: null as unknown as undefined,
  },
  {
    title: "ILT — Ingénieurs en Logistique & Transport",
    description: "Site web institutionnel pour une association professionnelle regroupant des ingénieurs spécialisés en logistique et transport.",
    problem: "L'association n'avait pas de présence digitale centralisée pour valoriser ses membres, partager ses actualités et faciliter les échanges avec les partenaires.",
    solution: "Conception et développement d'un site vitrine moderne avec pages dédiées aux membres, publications, événements, et formulaire de contact.",
    result: "Site livré avec une interface claire, responsive et optimisée pour renforcer la crédibilité de l'association.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Express", "PostgreSQL"],
    category: "site-web",
    demo_url: null as unknown as undefined,
    download_url: null as unknown as undefined,
  },
  {
    title: "Agence de Musique — Site Web",
    description: "Site web vitrine pour une agence de musique : présentation des artistes, catalogue, actualités et gestion des demandes de booking.",
    problem: "L'agence gérait ses artistes et ses contacts de manière informelle, sans plateforme centralisée pour présenter son catalogue et recevoir des demandes de prestation.",
    solution: "Développement d'un site élégant et immersif mettant en valeur les artistes de l'agence, avec espace portfolio audio/vidéo et formulaire de contact dédié au booking.",
    result: "Site livré, design identitaire fort, expérience utilisateur fluide sur mobile et desktop.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "site-web",
    demo_url: null as unknown as undefined,
    download_url: null as unknown as undefined,
  },
  {
    title: "Agence de Voyage — Site Web",
    description: "Site web pour une agence de voyage : présentation des destinations, packages, offres spéciales et système de prise de contact.",
    problem: "L'agence souhaitait moderniser son image digitale et centraliser la présentation de ses offres pour capter de nouveaux clients en ligne.",
    solution: "Conception d'un site vitrine attrayant avec galeries de destinations, fiches de séjours détaillées, formulaire de devis et intégration des réseaux sociaux.",
    result: "Site responsive et visuel livré, avec un parcours utilisateur optimisé pour transformer les visiteurs en prospects qualifiés.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js"],
    category: "site-web",
    demo_url: null as unknown as undefined,
    download_url: null as unknown as undefined,
  },
];

// ─── Helper: upsert single-row tables ─────────────────────────────────────────

async function ensureContactInfo() {
  const rows = await db.select().from(contact_info).where(eq(contact_info.id, 1));
  if (!rows.length) {
    await db.insert(contact_info).values({ id: 1, ...DEFAULT_CONTACT });
  }
}

async function ensureSiteContent() {
  const rows = await db.select().from(site_content).where(eq(site_content.id, 1));
  if (!rows.length) {
    await db.insert(site_content).values({ id: 1, ...DEFAULT_CONTENT });
  }
}

async function ensureServices() {
  const rows = await db.select().from(services);
  if (!rows.length) {
    for (const svc of DEFAULT_SERVICES) {
      await db.insert(services).values({ ...svc, features: svc.features });
    }
  }
}

async function ensureProjects() {
  const rows = await db.select().from(projects);
  if (!rows.length) {
    for (const p of DEFAULT_PROJECTS) {
      await db.insert(projects).values({
        id: randomUUID(),
        title: p.title,
        description: p.description,
        problem: p.problem,
        solution: p.solution,
        result: p.result,
        technologies: p.technologies as unknown as string[],
        category: p.category,
        demo_url: p.demo_url ?? null,
        download_url: null,
        media: [] as unknown as MediaItem[],
      });
    }
  }
}

export async function initDb() {
  await ensureContactInfo();
  await ensureSiteContent();
  await ensureServices();
  await ensureProjects();
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const rows = await db.select().from(projects).orderBy(desc(projects.created_at));
  return rows.map(r => ({
    ...r,
    technologies: (r.technologies as string[]) ?? [],
    media: (r.media as MediaItem[]) ?? [],
    demo_url: r.demo_url ?? undefined,
    download_url: r.download_url ?? undefined,
  }));
}

export async function createProject(data: Omit<Project, "id" | "media">): Promise<Project> {
  const id = randomUUID();
  await db.insert(projects).values({ id, ...data, technologies: data.technologies as unknown as string[], media: [] as unknown as MediaItem[] });
  const [row] = await db.select().from(projects).where(eq(projects.id, id));
  return { ...row, technologies: row.technologies as string[], media: [], demo_url: row.demo_url ?? undefined, download_url: row.download_url ?? undefined };
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  const updateData: Record<string, unknown> = { ...data };
  if (data.technologies) updateData.technologies = data.technologies;
  await db.update(projects).set(updateData as never).where(eq(projects.id, id));
  const [row] = await db.select().from(projects).where(eq(projects.id, id));
  if (!row) return null;
  return { ...row, technologies: row.technologies as string[], media: (row.media as MediaItem[]) ?? [], demo_url: row.demo_url ?? undefined, download_url: row.download_url ?? undefined };
}

export async function deleteProject(id: string): Promise<boolean> {
  const result = await db.delete(projects).where(eq(projects.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function getProjectMedia(id: string): Promise<MediaItem[]> {
  const [row] = await db.select().from(projects).where(eq(projects.id, id));
  return (row?.media as MediaItem[]) ?? [];
}

export async function addProjectMedia(projectId: string, item: MediaItem): Promise<void> {
  const [row] = await db.select().from(projects).where(eq(projects.id, projectId));
  const existing = (row?.media as MediaItem[]) ?? [];
  await db.update(projects).set({ media: [...existing, item] }).where(eq(projects.id, projectId));
}

export async function removeProjectMedia(mediaId: string): Promise<MediaItem | null> {
  const rows = await db.select().from(projects);
  for (const row of rows) {
    const media = (row.media as MediaItem[]) ?? [];
    const idx = media.findIndex(m => m.id === mediaId);
    if (idx !== -1) {
      const [removed] = media.splice(idx, 1);
      await db.update(projects).set({ media }).where(eq(projects.id, row.id));
      return removed;
    }
  }
  return null;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

function rowToBlog(r: typeof blog_posts.$inferSelect): BlogPost {
  return {
    ...r,
    tags: (r.tags as string[]) ?? [],
    cover_url: r.cover_url ?? undefined,
    status: r.status as "draft" | "published",
    created_at: r.created_at.toISOString().split("T")[0],
    view_count: r.view_count,
    read_time: r.read_time,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await db.select().from(blog_posts).orderBy(desc(blog_posts.created_at));
  return rows.map(rowToBlog);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const [row] = await db.select().from(blog_posts).where(eq(blog_posts.slug, slug));
  return row ? rowToBlog(row) : null;
}

export async function createBlogPost(data: Omit<BlogPost, "id" | "created_at" | "view_count">): Promise<BlogPost> {
  const id = randomUUID();
  await db.insert(blog_posts).values({ id, ...data, tags: data.tags, view_count: 0 });
  const [row] = await db.select().from(blog_posts).where(eq(blog_posts.id, id));
  return rowToBlog(row);
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  const updateData: Record<string, unknown> = { ...data };
  if (data.tags) updateData.tags = data.tags;
  await db.update(blog_posts).set(updateData as never).where(eq(blog_posts.id, id));
  const [row] = await db.select().from(blog_posts).where(eq(blog_posts.id, id));
  return row ? rowToBlog(row) : null;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const result = await db.delete(blog_posts).where(eq(blog_posts.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function incrementBlogViews(id: string): Promise<void> {
  const [row] = await db.select().from(blog_posts).where(eq(blog_posts.id, id));
  if (row) await db.update(blog_posts).set({ view_count: (row.view_count ?? 0) + 1 }).where(eq(blog_posts.id, id));
}

// ─── Files ────────────────────────────────────────────────────────────────────

function rowToFile(r: typeof free_files.$inferSelect): FreeFile {
  return { ...r, tags: (r.tags as string[]) ?? [], created_at: r.created_at.toISOString().split("T")[0] };
}

export async function getFiles(): Promise<FreeFile[]> {
  const rows = await db.select().from(free_files).orderBy(desc(free_files.created_at));
  return rows.map(rowToFile);
}

export async function createFile(data: Omit<FreeFile, "id" | "download_count" | "created_at">): Promise<FreeFile> {
  const id = randomUUID();
  await db.insert(free_files).values({ id, ...data, tags: data.tags, download_count: 0 });
  const [row] = await db.select().from(free_files).where(eq(free_files.id, id));
  return rowToFile(row);
}

export async function updateFile(id: string, data: Partial<FreeFile>): Promise<FreeFile | null> {
  const updateData: Record<string, unknown> = { ...data };
  if (data.tags) updateData.tags = data.tags;
  await db.update(free_files).set(updateData as never).where(eq(free_files.id, id));
  const [row] = await db.select().from(free_files).where(eq(free_files.id, id));
  return row ? rowToFile(row) : null;
}

export async function deleteFile(id: string): Promise<boolean> {
  const result = await db.delete(free_files).where(eq(free_files.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function incrementFileDownloads(id: string): Promise<void> {
  const [row] = await db.select().from(free_files).where(eq(free_files.id, id));
  if (row) await db.update(free_files).set({ download_count: row.download_count + 1 }).where(eq(free_files.id, id));
}

// ─── Services ─────────────────────────────────────────────────────────────────

function rowToService(r: typeof services.$inferSelect): Service {
  return {
    ...r,
    features: (r.features as string[]) ?? [],
    long_description: r.long_description ?? undefined,
    videos: r.videos ? (r.videos as string[]) : undefined,
    photos: r.photos ? (r.photos as string[]) : undefined,
  };
}

export async function getServices(): Promise<Service[]> {
  const rows = await db.select().from(services);
  return rows.map(rowToService);
}

export async function updateServices(svcs: Service[]): Promise<Service[]> {
  for (const svc of svcs) {
    await db.insert(services)
      .values({ ...svc, features: svc.features, videos: svc.videos ?? null, photos: svc.photos ?? null })
      .onConflictDoUpdate({ target: services.id, set: { ...svc, features: svc.features, videos: svc.videos ?? null, photos: svc.photos ?? null } });
  }
  return getServices();
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export async function getContact(): Promise<ContactInfo> {
  await ensureContactInfo();
  const [row] = await db.select().from(contact_info).where(eq(contact_info.id, 1));
  return {
    email: row.email,
    linkedin: row.linkedin ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    github: row.github ?? undefined,
    upwork: row.upwork ?? undefined,
    chariow: row.chariow ?? undefined,
  };
}

export async function updateContact(data: Partial<ContactInfo>): Promise<ContactInfo> {
  await ensureContactInfo();
  await db.update(contact_info).set(data).where(eq(contact_info.id, 1));
  return getContact();
}

// ─── Site Content ─────────────────────────────────────────────────────────────

export async function getSiteContent() {
  await ensureSiteContent();
  const [row] = await db.select().from(site_content).where(eq(site_content.id, 1));
  return {
    ...row,
    hero_highlights: (row.hero_highlights as string[]) ?? [],
    stack_tags: (row.stack_tags as string[]) ?? [],
    cv_url: row.cv_url ?? undefined,
  };
}

export async function updateSiteContent(data: Record<string, unknown>) {
  await ensureSiteContent();
  await db.update(site_content).set(data).where(eq(site_content.id, 1));
  return getSiteContent();
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessages() {
  const rows = await db.select().from(contact_messages).orderBy(desc(contact_messages.created_at));
  return rows.map(r => ({ ...r, created_at: r.created_at.toISOString() }));
}

export async function createMessage(data: { name: string; email: string; subject: string; message: string }) {
  const id = randomUUID();
  await db.insert(contact_messages).values({ id, ...data, read: false });
  const [row] = await db.select().from(contact_messages).where(eq(contact_messages.id, id));
  return { ...row, created_at: row.created_at.toISOString() };
}

export async function markMessageRead(id: string) {
  await db.update(contact_messages).set({ read: true }).where(eq(contact_messages.id, id));
}

export async function deleteMessage(id: string) {
  await db.delete(contact_messages).where(eq(contact_messages.id, id));
}

// ─── CV Downloads tracking ────────────────────────────────────────────────────

export async function trackCvDownload(ip?: string, userAgent?: string) {
  await db.insert(cv_downloads).values({ id: randomUUID(), ip: ip ?? null, user_agent: userAgent ?? null });
}

export async function getCvDownloadCount(): Promise<number> {
  const rows = await db.select().from(cv_downloads);
  return rows.length;
}

export async function getCvDownloadHistory() {
  const rows = await db.select().from(cv_downloads).orderBy(desc(cv_downloads.downloaded_at));
  return rows.map(r => ({ ...r, downloaded_at: r.downloaded_at.toISOString() }));
}
