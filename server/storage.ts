import { type User, type InsertUser, type Project, type Service, type SkillCategory, type ContactInfo } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  getServices(): Promise<Service[]>;
  getSkillCategories(): Promise<SkillCategory[]>;
  getContactInfo(): Promise<ContactInfo>;
}

const contactInfo: ContactInfo = {
  email: "jibharkroman@gmail.com",
  linkedin: "https://linkedin.com/in/kroman-jibhar-samuel",
  whatsapp: "+225 0700000000",
  github: "https://github.com/kromanjibhar",
};

const services: Service[] = [
  {
    id: "data-analysis",
    title: "Analyse de données & IA",
    description: "Transformez vos données en insights actionnables avec des tableaux de bord interactifs et des analyses avancées.",
    icon: "BarChart3",
    features: ["Power BI", "Excel avancé", "SQL", "Power Pivot", "DAX", "Time Intelligence"],
  },
  {
    id: "ai-solutions",
    title: "Solutions IA & Vibe Coding",
    description: "Intégration d'intelligence artificielle et prototypage rapide pour accélérer vos projets.",
    icon: "Brain",
    features: ["Replit AI", "ChatGPT", "Lovable", "Prototypage express 50 min"],
  },
  {
    id: "chatbot",
    title: "Chatbot personnalisé",
    description: "Création de chatbots intelligents pour automatiser vos interactions client.",
    icon: "MessageSquare",
    features: ["Intégration IA", "Support 24/7", "Personnalisation complète"],
  },
  {
    id: "excel-vba",
    title: "Maintenance & Automatisation Excel VBA",
    description: "Automatisez vos tâches répétitives et optimisez vos processus Excel.",
    icon: "FileSpreadsheet",
    features: ["Macros VBA", "Automatisation", "Reporting", "Maintenance"],
  },
  {
    id: "dashboards",
    title: "Tableaux de bord sur mesure",
    description: "Créez des dashboards adaptés à votre stack technologique et vos besoins métier.",
    icon: "LayoutDashboard",
    features: ["Power BI", "Excel", "Tableau", "Python", "Visualisation"],
  },
];

const skillCategories: SkillCategory[] = [
  {
    id: "web-dev",
    title: "Développement Web",
    icon: "Code2",
    skills: ["HTML5", "CSS3", "JavaScript ES6+", "React.js", "Applications responsives"],
  },
  {
    id: "data-bi",
    title: "Data, BI & Analyse",
    icon: "Database",
    skills: ["Excel avancé", "Power BI (DAX)", "SQL", "Tableaux de bord automatisés"],
  },
  {
    id: "ai-automation",
    title: "IA & Automatisation",
    icon: "Cpu",
    skills: ["Intégration IA", "Automatisation processus", "Vibe Coding", "Prototypage rapide"],
  },
  {
    id: "supply-chain",
    title: "Supply Chain & Logistique",
    icon: "Truck",
    skills: ["Analyse des flux", "Gestion transports", "Gestion inventaires", "Suivi KPI"],
  },
];

const projects: Project[] = [
  {
    id: "dashboard-rh",
    title: "Dashboard RH Analytics",
    description: "Tableau de bord interactif pour le suivi des indicateurs RH",
    problem: "Difficulté à suivre les KPI RH et à prendre des décisions basées sur les données",
    solution: "Création d'un dashboard Power BI avec des visualisations dynamiques et des filtres interactifs",
    result: "Réduction de 60% du temps de reporting et amélioration de la prise de décision",
    technologies: ["Power BI", "DAX", "SQL Server", "Excel"],
    category: "data",
    demoUrl: "#",
  },
  {
    id: "inventory-app",
    title: "Application Gestion Inventaire",
    description: "Application web pour la gestion optimisée des stocks",
    problem: "Suivi manuel des stocks causant des erreurs et des ruptures",
    solution: "Développement d'une application React avec base de données temps réel",
    result: "Diminution de 80% des erreurs d'inventaire et optimisation des commandes",
    technologies: ["React.js", "Node.js", "PostgreSQL", "REST API"],
    category: "web",
  },
  {
    id: "vba-automation",
    title: "Automatisation Reporting VBA",
    description: "Macro VBA pour génération automatique de rapports",
    problem: "Création manuelle de rapports hebdomadaires prenant plusieurs heures",
    solution: "Développement de macros VBA automatisant la collecte et mise en forme des données",
    result: "Gain de 8 heures par semaine et élimination des erreurs humaines",
    technologies: ["Excel VBA", "Power Query", "Automatisation"],
    category: "automation",
  },
  {
    id: "chatbot-support",
    title: "Chatbot Support Client",
    description: "Assistant virtuel intelligent pour le service client",
    problem: "Volume élevé de demandes support répétitives saturant l'équipe",
    solution: "Création d'un chatbot IA gérant les questions fréquentes et redirigeant les cas complexes",
    result: "Réduction de 40% des tickets support et satisfaction client améliorée",
    technologies: ["IA", "ChatGPT API", "React", "Node.js"],
    category: "ai",
  },
  {
    id: "logistics-dashboard",
    title: "Dashboard Logistique",
    description: "Suivi temps réel des opérations logistiques",
    problem: "Manque de visibilité sur les performances transport et livraison",
    solution: "Dashboard Power BI avec KPI logistiques et alertes automatiques",
    result: "Amélioration de 25% des délais de livraison",
    technologies: ["Power BI", "SQL", "Excel", "Time Intelligence"],
    category: "data",
  },
  {
    id: "web-portfolio",
    title: "Site Portfolio Moderne",
    description: "Site web portfolio responsive et moderne",
    problem: "Absence de présence en ligne professionnelle",
    solution: "Développement d'un site React moderne avec design professionnel",
    result: "Augmentation de la visibilité et des opportunités professionnelles",
    technologies: ["React.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "web",
  },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return projects;
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    return projects.find((p) => p.id === id);
  }

  async getServices(): Promise<Service[]> {
    return services;
  }

  async getSkillCategories(): Promise<SkillCategory[]> {
    return skillCategories;
  }

  async getContactInfo(): Promise<ContactInfo> {
    return contactInfo;
  }
}

export const storage = new MemStorage();
