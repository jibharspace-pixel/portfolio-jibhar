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
  projects: [
    { id: "dashboard-rh", title: "Dashboard RH Analytics", description: "Tableau de bord interactif pour le suivi des indicateurs RH", problem: "Difficulté à suivre les KPI RH et à prendre des décisions basées sur les données", solution: "Création d'un dashboard Power BI avec des visualisations dynamiques et des filtres interactifs", result: "Réduction de 60% du temps de reporting et amélioration de la prise de décision", technologies: ["Power BI", "DAX", "SQL Server", "Excel"], category: "dashboard", demo_url: "#" },
    { id: "inventory-app", title: "Application Gestion Inventaire", description: "Application web pour la gestion optimisée des stocks", problem: "Suivi manuel des stocks causant des erreurs et des ruptures", solution: "Développement d'une application React avec base de données temps réel", result: "Diminution de 80% des erreurs d'inventaire et optimisation des commandes", technologies: ["React.js", "Node.js", "PostgreSQL", "REST API"], category: "app-web" },
    { id: "vba-automation", title: "Automatisation Reporting VBA", description: "Macro VBA pour génération automatique de rapports", problem: "Création manuelle de rapports hebdomadaires prenant plusieurs heures", solution: "Développement de macros VBA automatisant la collecte et mise en forme des données", result: "Gain de 8 heures par semaine et élimination des erreurs humaines", technologies: ["Excel VBA", "Power Query", "Automatisation"], category: "excel-vba" },
    { id: "chatbot-support", title: "Chatbot Support Client", description: "Assistant virtuel intelligent pour le service client", problem: "Volume élevé de demandes support répétitives saturant l'équipe", solution: "Création d'un chatbot IA gérant les questions fréquentes et redirigeant les cas complexes", result: "Réduction de 40% des tickets support et satisfaction client améliorée", technologies: ["IA", "ChatGPT API", "React", "Node.js"], category: "automatisation" },
    { id: "logistics-dashboard", title: "Dashboard Logistique", description: "Suivi temps réel des opérations logistiques", problem: "Manque de visibilité sur les performances transport et livraison", solution: "Dashboard Power BI avec KPI logistiques et alertes automatiques", result: "Amélioration de 25% des délais de livraison", technologies: ["Power BI", "SQL", "Excel", "Time Intelligence"], category: "dashboard" },
    { id: "web-portfolio", title: "Site Portfolio Moderne", description: "Site web portfolio responsive et moderne", problem: "Absence de présence en ligne professionnelle", solution: "Développement d'un site React moderne avec design professionnel", result: "Augmentation de la visibilité et des opportunités professionnelles", technologies: ["React.js", "TypeScript", "Tailwind CSS", "Node.js"], category: "site-web" },
  ] as Project[],

  services: [
    { id: "data", title: "Analyse de données & BI", description: "Tableaux de bord interactifs, KPIs et visualisations avancées pour piloter votre activité.", icon: "BarChart3", features: ["Power BI", "Excel / DAX", "SQL"] },
    { id: "ai",   title: "Solutions IA & Automatisation", description: "Intégration IA et automatisation de vos processus métier pour gagner en productivité.", icon: "Brain", features: ["ChatGPT API", "Python ML", "VBA"] },
    { id: "web",  title: "Développement Web", description: "Applications web modernes, performantes et adaptées à vos besoins métier.", icon: "Globe", features: ["React / TypeScript", "REST API", "PostgreSQL"] },
  ] as Service[],

  blog: [
    { id: "1", title: "5 KPIs essentiels pour piloter votre Supply Chain", slug: "5-kpis-essentiels-supply-chain", excerpt: "Découvrez les indicateurs clés indispensables pour piloter votre chaîne logistique avec efficacité et réactivité.", content: "La gestion d'une supply chain performante repose sur la mesure précise de ses indicateurs clés. Sans données fiables, les décisions restent approximatives.\n\n## 1. Taux de Service Client (TSC)\n\nLe taux de service mesure le pourcentage de commandes livrées à temps et en quantité correcte. Un bon taux se situe au-dessus de 95%.\n\nFormule : TSC = (Commandes livrées conformément / Total commandes) × 100\n\n## 2. Rotation des Stocks\n\nCet indicateur mesure combien de fois votre stock est renouvelé sur une période donnée.\n\nFormule : Rotation = Coût des ventes / Stock moyen\n\n## 3. Délai Moyen de Paiement Fournisseurs (DSO)\n\nLe DSO mesure le délai moyen entre la réception d'une facture fournisseur et son paiement.\n\n## 4. Perfect Order Rate\n\nLe taux de commandes parfaites mesure les commandes livrées sans aucun défaut.\n\n## 5. Coût Total de la Supply Chain\n\nRapporté en pourcentage du chiffre d'affaires, ce KPI permet de benchmarker votre performance.\n\n## Conclusion\n\nCes 5 KPIs forment la base d'un tableau de bord supply chain efficace.", category: "logistique", tags: ["KPI", "Supply Chain", "Logistique", "Performance"], status: "published", created_at: "2025-01-15", view_count: 142, read_time: 5 },
    { id: "2", title: "Automatiser vos rapports Excel avec VBA", slug: "automatiser-rapports-excel-vba", excerpt: "Guide pratique pour créer des macros VBA puissantes qui génèrent vos rapports automatiquement en quelques secondes.", content: "L'automatisation des rapports Excel est l'une des transformations les plus impactantes pour votre productivité.\n\n## Pourquoi VBA ?\n\nVBA est intégré nativement dans Excel. Vous pouvez automatiser pratiquement n'importe quelle tâche répétitive.\n\n## Structure d'une macro de base\n\n```vba\nSub GenererRapport()\n    Dim wb As Workbook\n    Set wb = Workbooks.Open(\"C:\\données\\source.xlsx\")\n    wb.Close SaveChanges:=False\n    MsgBox \"Rapport généré !\"\nEnd Sub\n```\n\n## Conclusion\n\nL'investissement de 2-3 heures pour créer une macro se rentabilise dès la première utilisation.", category: "automatisation", tags: ["Excel", "VBA", "Automatisation", "Productivité"], status: "published", created_at: "2025-02-03", view_count: 89, read_time: 6 },
    { id: "3", title: "Machine Learning appliqué à la Logistique", slug: "machine-learning-logistique", excerpt: "Comment les algorithmes de ML révolutionnent la prévision des stocks et l'optimisation des routes de livraison.", content: "Le Machine Learning transforme profondément le secteur logistique.\n\n## Prévision de la demande\n\nLes modèles SARIMA, Prophet et LSTM permettent de prévoir la demande avec une précision supérieure aux méthodes traditionnelles.\n\n## Optimisation des routes\n\nLes algorithmes comme les colonies de fourmis permettent de trouver des solutions quasi-optimales.\n\n## Détection d'anomalies\n\nIsolation Forest et Autoencoder permettent de détecter automatiquement les anomalies dans les données de stock.", category: "ia", tags: ["Machine Learning", "IA", "Logistique", "Python"], status: "draft", created_at: "2025-03-10", view_count: 0, read_time: 8 },
  ] as BlogPost[],

  files: [
    { id: "1", title: "Dashboard KPI Supply Chain", description: "Tableau de bord Excel complet avec les KPIs essentiels : taux de service, rotation des stocks, délais fournisseurs, coût transport.", file_url: "#", file_type: "xlsx", download_count: 234, category: "data", tags: ["Excel", "KPI", "Supply Chain"], created_at: "2024-12-01" },
    { id: "2", title: "Template Rapport RH — Power BI", description: "Template Power BI clé en main pour analyser les données RH : effectifs, absentéisme, turnover, pyramide des âges, formation.", file_url: "#", file_type: "pbix", download_count: 156, category: "data", tags: ["Power BI", "RH", "Dashboard"], created_at: "2024-12-15" },
    { id: "3", title: "Guide Complet Power BI — Débutants", description: "Guide PDF de 45 pages pour maîtriser Power BI de zéro : installation, connexion aux données, création de visuels, DAX basique, publication.", file_url: "#", file_type: "pdf", download_count: 412, category: "formation", tags: ["Power BI", "Formation", "Débutant"], created_at: "2025-01-05" },
    { id: "4", title: "Macro VBA — Rapport Automatique", description: "Code VBA prêt à l'emploi pour automatiser la génération de rapports Excel depuis plusieurs sources de données.", file_url: "#", file_type: "xlsm", download_count: 98, category: "automatisation", tags: ["VBA", "Excel", "Automatisation"], created_at: "2025-02-10" },
  ] as FreeFile[],

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
