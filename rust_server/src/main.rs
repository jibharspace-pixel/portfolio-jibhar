use axum::{
    extract::Path,
    http::StatusCode,
    response::Json,
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[derive(Serialize, Deserialize, Clone)]
struct Project {
    id: String,
    title: String,
    description: String,
    problem: String,
    solution: String,
    result: String,
    technologies: Vec<String>,
    category: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    demo_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    download_url: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
struct Service {
    id: String,
    title: String,
    description: String,
    icon: String,
    features: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone)]
struct SkillCategory {
    id: String,
    title: String,
    icon: String,
    skills: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone)]
struct ContactInfo {
    email: String,
    linkedin: String,
    whatsapp: String,
    github: String,
}

fn get_projects() -> Vec<Project> {
    vec![
        Project {
            id: "dashboard-rh".into(),
            title: "Dashboard RH Analytics".into(),
            description: "Tableau de bord interactif pour le suivi des indicateurs RH".into(),
            problem: "Difficulté à suivre les KPI RH et à prendre des décisions basées sur les données".into(),
            solution: "Création d'un dashboard Power BI avec des visualisations dynamiques et des filtres interactifs".into(),
            result: "Réduction de 60% du temps de reporting et amélioration de la prise de décision".into(),
            technologies: vec!["Power BI".into(), "DAX".into(), "SQL Server".into(), "Excel".into()],
            category: "data".into(),
            demo_url: Some("#".into()),
            download_url: None,
        },
        Project {
            id: "inventory-app".into(),
            title: "Application Gestion Inventaire".into(),
            description: "Application web pour la gestion optimisée des stocks".into(),
            problem: "Suivi manuel des stocks causant des erreurs et des ruptures".into(),
            solution: "Développement d'une application React avec base de données temps réel".into(),
            result: "Diminution de 80% des erreurs d'inventaire et optimisation des commandes".into(),
            technologies: vec!["React.js".into(), "Node.js".into(), "PostgreSQL".into(), "REST API".into()],
            category: "web".into(),
            demo_url: None,
            download_url: None,
        },
        Project {
            id: "vba-automation".into(),
            title: "Automatisation Reporting VBA".into(),
            description: "Macro VBA pour génération automatique de rapports".into(),
            problem: "Création manuelle de rapports hebdomadaires prenant plusieurs heures".into(),
            solution: "Développement de macros VBA automatisant la collecte et mise en forme des données".into(),
            result: "Gain de 8 heures par semaine et élimination des erreurs humaines".into(),
            technologies: vec!["Excel VBA".into(), "Power Query".into(), "Automatisation".into()],
            category: "automation".into(),
            demo_url: None,
            download_url: None,
        },
        Project {
            id: "chatbot-support".into(),
            title: "Chatbot Support Client".into(),
            description: "Assistant virtuel intelligent pour le service client".into(),
            problem: "Volume élevé de demandes support répétitives saturant l'équipe".into(),
            solution: "Création d'un chatbot IA gérant les questions fréquentes et redirigeant les cas complexes".into(),
            result: "Réduction de 40% des tickets support et satisfaction client améliorée".into(),
            technologies: vec!["IA".into(), "ChatGPT API".into(), "React".into(), "Node.js".into()],
            category: "ai".into(),
            demo_url: None,
            download_url: None,
        },
        Project {
            id: "logistics-dashboard".into(),
            title: "Dashboard Logistique".into(),
            description: "Suivi temps réel des opérations logistiques".into(),
            problem: "Manque de visibilité sur les performances transport et livraison".into(),
            solution: "Dashboard Power BI avec KPI logistiques et alertes automatiques".into(),
            result: "Amélioration de 25% des délais de livraison".into(),
            technologies: vec!["Power BI".into(), "SQL".into(), "Excel".into(), "Time Intelligence".into()],
            category: "data".into(),
            demo_url: None,
            download_url: None,
        },
        Project {
            id: "web-portfolio".into(),
            title: "Site Portfolio Moderne".into(),
            description: "Site web portfolio responsive et moderne".into(),
            problem: "Absence de présence en ligne professionnelle".into(),
            solution: "Développement d'un site React moderne avec design professionnel".into(),
            result: "Augmentation de la visibilité et des opportunités professionnelles".into(),
            technologies: vec!["React.js".into(), "TypeScript".into(), "Tailwind CSS".into(), "Rust".into()],
            category: "web".into(),
            demo_url: None,
            download_url: None,
        },
    ]
}

fn get_services() -> Vec<Service> {
    vec![
        Service {
            id: "data-analysis".into(),
            title: "Analyse de données & IA".into(),
            description: "Transformez vos données en insights actionnables avec des tableaux de bord interactifs et des analyses avancées.".into(),
            icon: "BarChart3".into(),
            features: vec!["Power BI".into(), "Excel avancé".into(), "SQL".into(), "Power Pivot".into(), "DAX".into()],
        },
        Service {
            id: "ai-solutions".into(),
            title: "Solutions IA & Vibe Coding".into(),
            description: "Intégration d'intelligence artificielle et prototypage rapide pour accélérer vos projets.".into(),
            icon: "Brain".into(),
            features: vec!["Replit AI".into(), "ChatGPT".into(), "Lovable".into(), "Prototypage express".into()],
        },
        Service {
            id: "chatbot".into(),
            title: "Chatbot personnalisé".into(),
            description: "Création de chatbots intelligents pour automatiser vos interactions client.".into(),
            icon: "MessageSquare".into(),
            features: vec!["Intégration IA".into(), "Support 24/7".into(), "Personnalisation complète".into()],
        },
        Service {
            id: "excel-vba".into(),
            title: "Automatisation Excel VBA".into(),
            description: "Automatisez vos tâches répétitives et optimisez vos processus Excel.".into(),
            icon: "FileSpreadsheet".into(),
            features: vec!["Macros VBA".into(), "Automatisation".into(), "Reporting".into(), "Maintenance".into()],
        },
    ]
}

fn get_skills() -> Vec<SkillCategory> {
    vec![
        SkillCategory {
            id: "web-dev".into(),
            title: "Développement Web".into(),
            icon: "Code2".into(),
            skills: vec!["HTML5".into(), "CSS3".into(), "JavaScript ES6+".into(), "React.js".into(), "TypeScript".into()],
        },
        SkillCategory {
            id: "data-bi".into(),
            title: "Data, BI & Analyse".into(),
            icon: "Database".into(),
            skills: vec!["Excel avancé".into(), "Power BI (DAX)".into(), "SQL".into(), "Tableaux de bord".into()],
        },
        SkillCategory {
            id: "ai-automation".into(),
            title: "IA & Automatisation".into(),
            icon: "Cpu".into(),
            skills: vec!["Intégration IA".into(), "Automatisation processus".into(), "Vibe Coding".into()],
        },
        SkillCategory {
            id: "supply-chain".into(),
            title: "Supply Chain & Logistique".into(),
            icon: "Truck".into(),
            skills: vec!["Analyse des flux".into(), "Gestion transports".into(), "Suivi KPI".into()],
        },
    ]
}

fn get_contact() -> ContactInfo {
    ContactInfo {
        email: "jibharkroman@gmail.com".into(),
        linkedin: "https://linkedin.com/in/kroman-jibhar-samuel".into(),
        whatsapp: "+225 0700000000".into(),
        github: "https://github.com/kromanjibhar".into(),
    }
}

async fn list_projects() -> Json<Vec<Project>> {
    Json(get_projects())
}

async fn get_project(Path(id): Path<String>) -> Result<Json<Project>, StatusCode> {
    get_projects()
        .into_iter()
        .find(|p| p.id == id)
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn list_services() -> Json<Vec<Service>> {
    Json(get_services())
}

async fn list_skills() -> Json<Vec<SkillCategory>> {
    Json(get_skills())
}

async fn contact_info() -> Json<ContactInfo> {
    Json(get_contact())
}

async fn health() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/projects", get(list_projects))
        .route("/api/projects/:id", get(get_project))
        .route("/api/services", get(list_services))
        .route("/api/skills", get(list_skills))
        .route("/api/contact", get(contact_info))
        .route("/health", get(health))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("🦀 Rust API server running on http://0.0.0.0:3001");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
