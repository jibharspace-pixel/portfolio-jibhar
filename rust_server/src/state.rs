use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
use crate::models::*;

// ─── App State ────────────────────────────────────────────────────────────────

#[derive(Clone)]
pub struct AppState {
    pub projects:     Arc<Mutex<Vec<Project>>>,
    pub services:     Arc<Mutex<Vec<Service>>>,
    pub media:        Arc<Mutex<HashMap<String, Vec<MediaItem>>>>,
    pub blog:         Arc<Mutex<Vec<BlogPost>>>,
    pub files:        Arc<Mutex<Vec<FreeFile>>>,
    pub page_views:   Arc<Mutex<HashMap<String, u64>>>,
    pub blog_views:   Arc<Mutex<HashMap<String, u64>>>,
    pub contact:      Arc<Mutex<ContactInfo>>,
    pub site_content: Arc<Mutex<SiteContent>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            projects:     Arc::new(Mutex::new(seed_projects())),
            services:     Arc::new(Mutex::new(seed_services())),
            media:        Arc::new(Mutex::new(HashMap::new())),
            blog:         Arc::new(Mutex::new(seed_blog())),
            files:        Arc::new(Mutex::new(seed_files())),
            page_views:   Arc::new(Mutex::new(HashMap::new())),
            blog_views:   Arc::new(Mutex::new(HashMap::new())),
            contact:      Arc::new(Mutex::new(ContactInfo {
                email:    "jibharkroman@gmail.com".into(),
                linkedin: "https://linkedin.com/in/kroman-jibhar-samuel".into(),
                whatsapp: "+225 0700000000".into(),
                github:   "https://github.com/kromanjibhar".into(),
            })),
            site_content: Arc::new(Mutex::new(SiteContent {
                hero_description: "Je conçois des solutions digitales et des tableaux de bord sur mesure qui transforment vos données en décisions. Données, automatisation, web — adaptés à votre contexte métier.".into(),
                hero_highlights: vec![
                    "Tableaux de bord Power BI".into(),
                    "Applications React / TypeScript".into(),
                    "Automatisation VBA & Python".into(),
                ],
                about_quote: "Autodidacte déterminé, je transforme la complexité en solutions simples et efficaces.".into(),
                footer_tagline: "Je conçois des solutions digitales sur mesure — dashboards, apps web et automatisations — pour transformer vos données en décisions.".into(),
            })),
        }
    }
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

pub fn seed_blog() -> Vec<BlogPost> {
    vec![
        BlogPost {
            id: "1".into(), title: "5 KPIs essentiels pour piloter votre Supply Chain".into(),
            slug: "5-kpis-essentiels-supply-chain".into(),
            excerpt: "Découvrez les indicateurs clés indispensables pour piloter votre chaîne logistique avec efficacité et réactivité.".into(),
            content: "La gestion d'une supply chain performante repose sur la mesure précise de ses indicateurs clés. Sans données fiables, les décisions restent approximatives.\n\n## 1. Taux de Service Client (TSC)\n\nLe taux de service mesure le pourcentage de commandes livrées à temps et en quantité correcte. Un bon taux se situe au-dessus de 95%. C'est l'indicateur le plus directement lié à la satisfaction client.\n\nFormule : TSC = (Commandes livrées conformément / Total commandes) × 100\n\n## 2. Rotation des Stocks\n\nCet indicateur mesure combien de fois votre stock est renouvelé sur une période donnée. Une rotation élevée signifie moins de capital immobilisé et moins de risque d'obsolescence.\n\nFormule : Rotation = Coût des ventes / Stock moyen\n\n## 3. Délai Moyen de Paiement Fournisseurs (DSO)\n\nLe DSO mesure le délai moyen entre la réception d'une facture fournisseur et son paiement. Le maîtriser impacte directement votre trésorerie.\n\n## 4. Perfect Order Rate\n\nLe taux de commandes parfaites mesure les commandes livrées sans aucun défaut : à temps, complètes, sans dommage, avec documentation correcte.\n\n## 5. Coût Total de la Supply Chain\n\nRapporté en pourcentage du chiffre d'affaires, ce KPI permet de benchmarker votre performance vs le secteur et d'identifier les gisements d'économies.\n\n## Conclusion\n\nCes 5 KPIs forment la base d'un tableau de bord supply chain efficace. L'enjeu est de les automatiser via un outil comme Power BI pour un pilotage en temps réel.".into(),
            category: "logistique".into(),
            tags: vec!["KPI".into(), "Supply Chain".into(), "Logistique".into(), "Performance".into()],
            cover_url: None, status: "published".into(), created_at: "2025-01-15".into(), view_count: 142, read_time: 5,
        },
        BlogPost {
            id: "2".into(), title: "Automatiser vos rapports Excel avec VBA".into(),
            slug: "automatiser-rapports-excel-vba".into(),
            excerpt: "Guide pratique pour créer des macros VBA puissantes qui génèrent vos rapports automatiquement en quelques secondes.".into(),
            content: "L'automatisation des rapports Excel est l'une des transformations les plus impactantes pour votre productivité. Ce qui prenait 2 heures peut se faire en 15 secondes.\n\n## Pourquoi VBA ?\n\nVBA (Visual Basic for Applications) est intégré nativement dans Excel. Pas besoin d'installation supplémentaire. Vous pouvez automatiser pratiquement n'importe quelle tâche répétitive.\n\n## Cas d'usage concret\n\nImaginez un rapport hebdomadaire qui nécessite de :\n1. Importer des données depuis 3 fichiers différents\n2. Appliquer des filtres et tris\n3. Créer des tableaux croisés dynamiques\n4. Mettre en forme le rapport\n5. Envoyer par email\n\nAvec VBA, ce workflow complet peut être déclenché par un seul bouton.\n\n## Structure d'une macro de base\n\n```vba\nSub GenererRapport()\n    Dim wb As Workbook\n    Dim ws As Worksheet\n    Set wb = Workbooks.Open(\"C:\\données\\source.xlsx\")\n    Set ws = wb.Sheets(\"Données\")\n    ws.UsedRange.Copy Destination:=ThisWorkbook.Sheets(\"Rapport\").Range(\"A1\")\n    wb.Close SaveChanges:=False\n    MsgBox \"Rapport généré avec succès !\"\nEnd Sub\n```\n\n## Conseils pour débuter\n\n- Utilisez l'enregistreur de macros pour comprendre la syntaxe\n- Commentez votre code abondamment\n- Testez sur des copies avant d'automatiser la production\n\n## Conclusion\n\nL'investissement initial de 2-3 heures pour créer une macro se rentabilise dès la première utilisation.".into(),
            category: "automatisation".into(),
            tags: vec!["Excel".into(), "VBA".into(), "Automatisation".into(), "Productivité".into()],
            cover_url: None, status: "published".into(), created_at: "2025-02-03".into(), view_count: 89, read_time: 6,
        },
        BlogPost {
            id: "3".into(), title: "Machine Learning appliqué à la Logistique".into(),
            slug: "machine-learning-logistique".into(),
            excerpt: "Comment les algorithmes de ML révolutionnent la prévision des stocks et l'optimisation des routes de livraison.".into(),
            content: "Le Machine Learning transforme profondément le secteur logistique. Des algorithmes de prévision de la demande aux optimisations de tournées, les applications sont nombreuses et concrètes.\n\n## Prévision de la demande\n\nLes modèles SARIMA, Prophet et LSTM permettent de prévoir la demande avec une précision bien supérieure aux méthodes traditionnelles.\n\n## Optimisation des routes\n\nLe problème du voyageur de commerce (TSP) et ses variantes sont au cœur de l'optimisation logistique. Des algorithmes comme les colonies de fourmis ou la recherche tabou permettent de trouver des solutions quasi-optimales.\n\n## Détection d'anomalies\n\nLes algorithmes Isolation Forest et Autoencoder permettent de détecter automatiquement les anomalies dans les données de stock.".into(),
            category: "ia".into(),
            tags: vec!["Machine Learning".into(), "IA".into(), "Logistique".into(), "Python".into()],
            cover_url: None, status: "draft".into(), created_at: "2025-03-10".into(), view_count: 0, read_time: 8,
        },
    ]
}

pub fn seed_files() -> Vec<FreeFile> {
    vec![
        FreeFile { id: "1".into(), title: "Dashboard KPI Supply Chain".into(), description: "Tableau de bord Excel complet avec les KPIs essentiels : taux de service, rotation des stocks, délais fournisseurs, coût transport.".into(), file_url: "#".into(), file_type: "xlsx".into(), download_count: 234, category: "data".into(), tags: vec!["Excel".into(), "KPI".into(), "Supply Chain".into()], created_at: "2024-12-01".into() },
        FreeFile { id: "2".into(), title: "Template Rapport RH — Power BI".into(), description: "Template Power BI clé en main pour analyser les données RH : effectifs, absentéisme, turnover, pyramide des âges, formation.".into(), file_url: "#".into(), file_type: "pbix".into(), download_count: 156, category: "data".into(), tags: vec!["Power BI".into(), "RH".into(), "Dashboard".into()], created_at: "2024-12-15".into() },
        FreeFile { id: "3".into(), title: "Guide Complet Power BI — Débutants".into(), description: "Guide PDF de 45 pages pour maîtriser Power BI de zéro : installation, connexion aux données, création de visuels, DAX basique, publication.".into(), file_url: "#".into(), file_type: "pdf".into(), download_count: 412, category: "formation".into(), tags: vec!["Power BI".into(), "Formation".into(), "Débutant".into()], created_at: "2025-01-05".into() },
        FreeFile { id: "4".into(), title: "Macro VBA — Rapport Automatique".into(), description: "Code VBA prêt à l'emploi pour automatiser la génération de rapports Excel depuis plusieurs sources de données.".into(), file_url: "#".into(), file_type: "xlsm".into(), download_count: 98, category: "automatisation".into(), tags: vec!["VBA".into(), "Excel".into(), "Automatisation".into()], created_at: "2025-02-10".into() },
    ]
}

pub fn seed_projects() -> Vec<Project> {
    vec![
        Project { id: "dashboard-rh".into(), title: "Dashboard RH Analytics".into(), description: "Tableau de bord interactif pour le suivi des indicateurs RH".into(), problem: "Difficulté à suivre les KPI RH et à prendre des décisions basées sur les données".into(), solution: "Création d'un dashboard Power BI avec des visualisations dynamiques et des filtres interactifs".into(), result: "Réduction de 60% du temps de reporting et amélioration de la prise de décision".into(), technologies: vec!["Power BI".into(), "DAX".into(), "SQL Server".into(), "Excel".into()], category: "dashboard".into(), demo_url: Some("#".into()), download_url: None, media: None },
        Project { id: "inventory-app".into(), title: "Application Gestion Inventaire".into(), description: "Application web pour la gestion optimisée des stocks".into(), problem: "Suivi manuel des stocks causant des erreurs et des ruptures".into(), solution: "Développement d'une application React avec base de données temps réel".into(), result: "Diminution de 80% des erreurs d'inventaire et optimisation des commandes".into(), technologies: vec!["React.js".into(), "Node.js".into(), "PostgreSQL".into(), "REST API".into()], category: "app-web".into(), demo_url: None, download_url: None, media: None },
        Project { id: "vba-automation".into(), title: "Automatisation Reporting VBA".into(), description: "Macro VBA pour génération automatique de rapports".into(), problem: "Création manuelle de rapports hebdomadaires prenant plusieurs heures".into(), solution: "Développement de macros VBA automatisant la collecte et mise en forme des données".into(), result: "Gain de 8 heures par semaine et élimination des erreurs humaines".into(), technologies: vec!["Excel VBA".into(), "Power Query".into(), "Automatisation".into()], category: "excel-vba".into(), demo_url: None, download_url: None, media: None },
        Project { id: "chatbot-support".into(), title: "Chatbot Support Client".into(), description: "Assistant virtuel intelligent pour le service client".into(), problem: "Volume élevé de demandes support répétitives saturant l'équipe".into(), solution: "Création d'un chatbot IA gérant les questions fréquentes et redirigeant les cas complexes".into(), result: "Réduction de 40% des tickets support et satisfaction client améliorée".into(), technologies: vec!["IA".into(), "ChatGPT API".into(), "React".into(), "Node.js".into()], category: "automatisation".into(), demo_url: None, download_url: None, media: None },
        Project { id: "logistics-dashboard".into(), title: "Dashboard Logistique".into(), description: "Suivi temps réel des opérations logistiques".into(), problem: "Manque de visibilité sur les performances transport et livraison".into(), solution: "Dashboard Power BI avec KPI logistiques et alertes automatiques".into(), result: "Amélioration de 25% des délais de livraison".into(), technologies: vec!["Power BI".into(), "SQL".into(), "Excel".into(), "Time Intelligence".into()], category: "dashboard".into(), demo_url: None, download_url: None, media: None },
        Project { id: "web-portfolio".into(), title: "Site Portfolio Moderne".into(), description: "Site web portfolio responsive et moderne".into(), problem: "Absence de présence en ligne professionnelle".into(), solution: "Développement d'un site React moderne avec design professionnel".into(), result: "Augmentation de la visibilité et des opportunités professionnelles".into(), technologies: vec!["React.js".into(), "TypeScript".into(), "Tailwind CSS".into(), "Rust".into()], category: "site-web".into(), demo_url: None, download_url: None, media: None },
    ]
}

pub fn seed_services() -> Vec<Service> {
    vec![
        Service { id: "data".into(), title: "Analyse de données & BI".into(), description: "Tableaux de bord interactifs, KPIs et visualisations avancées pour piloter votre activité.".into(), icon: "BarChart3".into(), features: vec!["Power BI".into(), "Excel / DAX".into(), "SQL".into()] },
        Service { id: "ai".into(),   title: "Solutions IA & Automatisation".into(), description: "Intégration IA et automatisation de vos processus métier pour gagner en productivité.".into(), icon: "Brain".into(), features: vec!["ChatGPT API".into(), "Python ML".into(), "VBA".into()] },
        Service { id: "web".into(),  title: "Développement Web".into(), description: "Applications web modernes, performantes et adaptées à vos besoins métier.".into(), icon: "Globe".into(), features: vec!["React / TypeScript".into(), "REST API".into(), "PostgreSQL".into()] },
    ]
}
