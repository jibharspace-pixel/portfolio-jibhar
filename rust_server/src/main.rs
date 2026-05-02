use axum::{
    extract::{Json, Multipart, Path, State},
    http::{HeaderMap, HeaderValue, Method, StatusCode},
    middleware::{self, Next},
    response::Response,
    routing::{delete, get, post, put},
    Router,
};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::{Arc, Mutex},
};
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;

// ─── Security headers middleware ─────────────────────────────────────────────
async fn security_headers(req: axum::extract::Request, next: Next) -> Response {
    let mut res = next.run(req).await;
    let h = res.headers_mut();
    h.insert("x-content-type-options",  HeaderValue::from_static("nosniff"));
    h.insert("x-frame-options",          HeaderValue::from_static("DENY"));
    h.insert("x-xss-protection",         HeaderValue::from_static("1; mode=block"));
    h.insert("referrer-policy",          HeaderValue::from_static("strict-origin-when-cross-origin"));
    h.insert("x-permitted-cross-domain-policies", HeaderValue::from_static("none"));
    res
}

// ─── Types ───────────────────────────────────────────────────────────────────

#[derive(Clone, Serialize, Deserialize)]
struct MediaItem {
    id: String,
    url: String,
    media_type: String,
    project_id: String,
    filename: String,
}

#[derive(Clone, Serialize, Deserialize)]
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
    #[serde(skip_serializing_if = "Option::is_none")]
    media: Option<Vec<MediaItem>>,
}

#[derive(Clone, Serialize, Deserialize)]
struct BlogPost {
    id: String,
    title: String,
    slug: String,
    excerpt: String,
    content: String,
    category: String,
    tags: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    cover_url: Option<String>,
    status: String,
    created_at: String,
    view_count: u64,
    read_time: u64,
}

#[derive(Clone, Serialize, Deserialize)]
struct FreeFile {
    id: String,
    title: String,
    description: String,
    file_url: String,
    file_type: String,
    download_count: u64,
    category: String,
    tags: Vec<String>,
    created_at: String,
}

#[derive(Serialize)]
struct AdminStats {
    total_page_views: u64,
    total_blog_views: u64,
    total_downloads: u64,
    blog_count: usize,
    published_blog_count: usize,
    file_count: usize,
    media_count: usize,
    page_views: HashMap<String, u64>,
}

#[derive(Clone, Serialize, Deserialize)]
struct Service {
    id: String,
    title: String,
    description: String,
    icon: String,
    features: Vec<String>,
}

#[derive(Clone, Serialize, Deserialize)]
struct ContactInfo {
    email: String,
    linkedin: String,
    whatsapp: String,
    github: String,
}

#[derive(Clone, Serialize, Deserialize)]
struct SiteContent {
    hero_description: String,
    hero_highlights: Vec<String>,
    about_quote: String,
}

// ─── Input Types ─────────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct CreateBlogPost {
    title: String,
    slug: String,
    excerpt: String,
    content: String,
    category: String,
    tags: Vec<String>,
    cover_url: Option<String>,
    status: String,
}

#[derive(Deserialize)]
struct UpdateBlogPost {
    title: String,
    slug: String,
    excerpt: String,
    content: String,
    category: String,
    tags: Vec<String>,
    cover_url: Option<String>,
    status: String,
}

#[derive(Deserialize)]
struct CreateFreeFile {
    title: String,
    description: String,
    file_url: String,
    file_type: String,
    category: String,
    tags: Vec<String>,
}

#[derive(Deserialize)]
struct TrackEvent {
    event_type: String,
    path: String,
}

#[derive(Deserialize)]
struct UpdateContact {
    email: String,
    linkedin: String,
    whatsapp: String,
    github: String,
}

#[derive(Deserialize)]
struct UpdateSiteContent {
    hero_description: String,
    hero_highlights: Vec<String>,
    about_quote: String,
}

#[derive(Deserialize)]
struct CreateProject {
    title: String,
    description: String,
    problem: String,
    solution: String,
    result: String,
    technologies: Vec<String>,
    category: String,
    demo_url: Option<String>,
    download_url: Option<String>,
}

#[derive(Deserialize)]
struct UpdateProject {
    title: String,
    description: String,
    problem: String,
    solution: String,
    result: String,
    technologies: Vec<String>,
    category: String,
    demo_url: Option<String>,
    download_url: Option<String>,
}

#[derive(Deserialize)]
struct UpdateServices {
    services: Vec<Service>,
}

// ─── App State ───────────────────────────────────────────────────────────────

#[derive(Clone)]
struct AppState {
    projects: Arc<Mutex<Vec<Project>>>,
    services: Arc<Mutex<Vec<Service>>>,
    media: Arc<Mutex<HashMap<String, Vec<MediaItem>>>>,
    blog: Arc<Mutex<Vec<BlogPost>>>,
    files: Arc<Mutex<Vec<FreeFile>>>,
    page_views: Arc<Mutex<HashMap<String, u64>>>,
    blog_views: Arc<Mutex<HashMap<String, u64>>>,
    contact: Arc<Mutex<ContactInfo>>,
    site_content: Arc<Mutex<SiteContent>>,
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

fn seed_blog() -> Vec<BlogPost> {
    vec![
        BlogPost {
            id: "1".to_string(),
            title: "5 KPIs essentiels pour piloter votre Supply Chain".to_string(),
            slug: "5-kpis-essentiels-supply-chain".to_string(),
            excerpt: "Découvrez les indicateurs clés indispensables pour piloter votre chaîne logistique avec efficacité et réactivité.".to_string(),
            content: "La gestion d'une supply chain performante repose sur la mesure précise de ses indicateurs clés. Sans données fiables, les décisions restent approximatives.\n\n## 1. Taux de Service Client (TSC)\n\nLe taux de service mesure le pourcentage de commandes livrées à temps et en quantité correcte. Un bon taux se situe au-dessus de 95%. C'est l'indicateur le plus directement lié à la satisfaction client.\n\nFormule : TSC = (Commandes livrées conformément / Total commandes) × 100\n\n## 2. Rotation des Stocks\n\nCet indicateur mesure combien de fois votre stock est renouvelé sur une période donnée. Une rotation élevée signifie moins de capital immobilisé et moins de risque d'obsolescence.\n\nFormule : Rotation = Coût des ventes / Stock moyen\n\n## 3. Délai Moyen de Paiement Fournisseurs (DSO)\n\nLe DSO mesure le délai moyen entre la réception d'une facture fournisseur et son paiement. Le maîtriser impacte directement votre trésorerie.\n\n## 4. Perfect Order Rate\n\nLe taux de commandes parfaites mesure les commandes livrées sans aucun défaut : à temps, complètes, sans dommage, avec documentation correcte.\n\n## 5. Coût Total de la Supply Chain\n\nRapporté en pourcentage du chiffre d'affaires, ce KPI permet de benchmarker votre performance vs le secteur et d'identifier les gisements d'économies.\n\n## Conclusion\n\nCes 5 KPIs forment la base d'un tableau de bord supply chain efficace. L'enjeu est de les automatiser via un outil comme Power BI pour un pilotage en temps réel.".to_string(),
            category: "logistique".to_string(),
            tags: vec!["KPI".to_string(), "Supply Chain".to_string(), "Logistique".to_string(), "Performance".to_string()],
            cover_url: None,
            status: "published".to_string(),
            created_at: "2025-01-15".to_string(),
            view_count: 142,
            read_time: 5,
        },
        BlogPost {
            id: "2".to_string(),
            title: "Automatiser vos rapports Excel avec VBA".to_string(),
            slug: "automatiser-rapports-excel-vba".to_string(),
            excerpt: "Guide pratique pour créer des macros VBA puissantes qui génèrent vos rapports automatiquement en quelques secondes.".to_string(),
            content: "L'automatisation des rapports Excel est l'une des transformations les plus impactantes pour votre productivité. Ce qui prenait 2 heures peut se faire en 15 secondes.\n\n## Pourquoi VBA ?\n\nVBA (Visual Basic for Applications) est intégré nativement dans Excel. Pas besoin d'installation supplémentaire. Vous pouvez automatiser pratiquement n'importe quelle tâche répétitive.\n\n## Cas d'usage concret\n\nImaginez un rapport hebdomadaire qui nécessite de :\n1. Importer des données depuis 3 fichiers différents\n2. Appliquer des filtres et tris\n3. Créer des tableaux croisés dynamiques\n4. Mettre en forme le rapport\n5. Envoyer par email\n\nAvec VBA, ce workflow complet peut être déclenché par un seul bouton.\n\n## Structure d'une macro de base\n\n```vba\nSub GenererRapport()\n    Dim wb As Workbook\n    Dim ws As Worksheet\n    \n    ' Charger les données\n    Set wb = Workbooks.Open(\"C:\\données\\source.xlsx\")\n    Set ws = wb.Sheets(\"Données\")\n    \n    ' Copier vers rapport\n    ws.UsedRange.Copy Destination:=ThisWorkbook.Sheets(\"Rapport\").Range(\"A1\")\n    \n    ' Fermer source\n    wb.Close SaveChanges:=False\n    \n    MsgBox \"Rapport généré avec succès !\"\nEnd Sub\n```\n\n## Conseils pour débuter\n\n- Utilisez l'enregistreur de macros pour comprendre la syntaxe\n- Commentez votre code abondamment\n- Testez sur des copies avant d'automatiser la production\n\n## Conclusion\n\nL'investissement initial de 2-3 heures pour créer une macro se rentabilise dès la première utilisation. N'hésitez pas à me contacter pour un accompagnement personnalisé.".to_string(),
            category: "automatisation".to_string(),
            tags: vec!["Excel".to_string(), "VBA".to_string(), "Automatisation".to_string(), "Productivité".to_string()],
            cover_url: None,
            status: "published".to_string(),
            created_at: "2025-02-03".to_string(),
            view_count: 89,
            read_time: 6,
        },
        BlogPost {
            id: "3".to_string(),
            title: "Machine Learning appliqué à la Logistique".to_string(),
            slug: "machine-learning-logistique".to_string(),
            excerpt: "Comment les algorithmes de ML révolutionnent la prévision des stocks et l'optimisation des routes de livraison.".to_string(),
            content: "Le Machine Learning transforme profondément le secteur logistique. Des algorithmes de prévision de la demande aux optimisations de tournées, les applications sont nombreuses et concrètes.\n\n## Prévision de la demande\n\nLes modèles SARIMA, Prophet et LSTM permettent de prévoir la demande avec une précision bien supérieure aux méthodes traditionnelles (moyennes mobiles, lissage exponentiel).\n\n## Optimisation des routes\n\nLe problème du voyageur de commerce (TSP) et ses variantes sont au cœur de l'optimisation logistique. Des algorithmes comme les colonies de fourmis ou la recherche tabou permettent de trouver des solutions quasi-optimales.\n\n## Détection d'anomalies\n\nLes algorithmes Isolation Forest et Autoencoder permettent de détecter automatiquement les anomalies dans les données de stock, signalant des risques de rupture avant qu'ils ne surviennent.".to_string(),
            category: "ia".to_string(),
            tags: vec!["Machine Learning".to_string(), "IA".to_string(), "Logistique".to_string(), "Python".to_string()],
            cover_url: None,
            status: "draft".to_string(),
            created_at: "2025-03-10".to_string(),
            view_count: 0,
            read_time: 8,
        },
    ]
}

fn seed_files() -> Vec<FreeFile> {
    vec![
        FreeFile {
            id: "1".to_string(),
            title: "Dashboard KPI Supply Chain".to_string(),
            description: "Tableau de bord Excel complet avec les KPIs essentiels : taux de service, rotation des stocks, délais fournisseurs, coût transport.".to_string(),
            file_url: "#".to_string(),
            file_type: "xlsx".to_string(),
            download_count: 234,
            category: "data".to_string(),
            tags: vec!["Excel".to_string(), "KPI".to_string(), "Supply Chain".to_string()],
            created_at: "2024-12-01".to_string(),
        },
        FreeFile {
            id: "2".to_string(),
            title: "Template Rapport RH — Power BI".to_string(),
            description: "Template Power BI clé en main pour analyser les données RH : effectifs, absentéisme, turnover, pyramide des âges, formation.".to_string(),
            file_url: "#".to_string(),
            file_type: "pbix".to_string(),
            download_count: 156,
            category: "data".to_string(),
            tags: vec!["Power BI".to_string(), "RH".to_string(), "Dashboard".to_string()],
            created_at: "2024-12-15".to_string(),
        },
        FreeFile {
            id: "3".to_string(),
            title: "Guide Complet Power BI — Débutants".to_string(),
            description: "Guide PDF de 45 pages pour maîtriser Power BI de zéro : installation, connexion aux données, création de visuels, DAX basique, publication.".to_string(),
            file_url: "#".to_string(),
            file_type: "pdf".to_string(),
            download_count: 412,
            category: "formation".to_string(),
            tags: vec!["Power BI".to_string(), "Formation".to_string(), "Débutant".to_string()],
            created_at: "2025-01-05".to_string(),
        },
        FreeFile {
            id: "4".to_string(),
            title: "Macro VBA — Rapport Automatique".to_string(),
            description: "Code VBA prêt à l'emploi pour automatiser la génération de rapports Excel depuis plusieurs sources de données.".to_string(),
            file_url: "#".to_string(),
            file_type: "xlsm".to_string(),
            download_count: 98,
            category: "automatisation".to_string(),
            tags: vec!["VBA".to_string(), "Excel".to_string(), "Automatisation".to_string()],
            created_at: "2025-02-10".to_string(),
        },
    ]
}

fn seed_projects() -> Vec<Project> {
    vec![
        Project { id: "dashboard-rh".into(), title: "Dashboard RH Analytics".into(), description: "Tableau de bord interactif pour le suivi des indicateurs RH".into(), problem: "Difficulté à suivre les KPI RH et à prendre des décisions basées sur les données".into(), solution: "Création d'un dashboard Power BI avec des visualisations dynamiques et des filtres interactifs".into(), result: "Réduction de 60% du temps de reporting et amélioration de la prise de décision".into(), technologies: vec!["Power BI".into(), "DAX".into(), "SQL Server".into(), "Excel".into()], category: "dashboard".into(), demo_url: Some("#".into()), download_url: None, media: None },
        Project { id: "inventory-app".into(), title: "Application Gestion Inventaire".into(), description: "Application web pour la gestion optimisée des stocks".into(), problem: "Suivi manuel des stocks causant des erreurs et des ruptures".into(), solution: "Développement d'une application React avec base de données temps réel".into(), result: "Diminution de 80% des erreurs d'inventaire et optimisation des commandes".into(), technologies: vec!["React.js".into(), "Node.js".into(), "PostgreSQL".into(), "REST API".into()], category: "app-web".into(), demo_url: None, download_url: None, media: None },
        Project { id: "vba-automation".into(), title: "Automatisation Reporting VBA".into(), description: "Macro VBA pour génération automatique de rapports".into(), problem: "Création manuelle de rapports hebdomadaires prenant plusieurs heures".into(), solution: "Développement de macros VBA automatisant la collecte et mise en forme des données".into(), result: "Gain de 8 heures par semaine et élimination des erreurs humaines".into(), technologies: vec!["Excel VBA".into(), "Power Query".into(), "Automatisation".into()], category: "excel-vba".into(), demo_url: None, download_url: None, media: None },
        Project { id: "chatbot-support".into(), title: "Chatbot Support Client".into(), description: "Assistant virtuel intelligent pour le service client".into(), problem: "Volume élevé de demandes support répétitives saturant l'équipe".into(), solution: "Création d'un chatbot IA gérant les questions fréquentes et redirigeant les cas complexes".into(), result: "Réduction de 40% des tickets support et satisfaction client améliorée".into(), technologies: vec!["IA".into(), "ChatGPT API".into(), "React".into(), "Node.js".into()], category: "automatisation".into(), demo_url: None, download_url: None, media: None },
        Project { id: "logistics-dashboard".into(), title: "Dashboard Logistique".into(), description: "Suivi temps réel des opérations logistiques".into(), problem: "Manque de visibilité sur les performances transport et livraison".into(), solution: "Dashboard Power BI avec KPI logistiques et alertes automatiques".into(), result: "Amélioration de 25% des délais de livraison".into(), technologies: vec!["Power BI".into(), "SQL".into(), "Excel".into(), "Time Intelligence".into()], category: "dashboard".into(), demo_url: None, download_url: None, media: None },
        Project { id: "web-portfolio".into(), title: "Site Portfolio Moderne".into(), description: "Site web portfolio responsive et moderne".into(), problem: "Absence de présence en ligne professionnelle".into(), solution: "Développement d'un site React moderne avec design professionnel".into(), result: "Augmentation de la visibilité et des opportunités professionnelles".into(), technologies: vec!["React.js".into(), "TypeScript".into(), "Tailwind CSS".into(), "Rust".into()], category: "site-web".into(), demo_url: None, download_url: None, media: None },
    ]
}

fn seed_services() -> Vec<Service> {
    vec![
        Service { id: "data".into(), title: "Analyse de données & BI".into(), description: "Tableaux de bord interactifs, KPIs et visualisations avancées pour piloter votre activité.".into(), icon: "BarChart3".into(), features: vec!["Power BI".into(), "Excel / DAX".into(), "SQL".into()] },
        Service { id: "ai".into(), title: "Solutions IA & Automatisation".into(), description: "Intégration IA et automatisation de vos processus métier pour gagner en productivité.".into(), icon: "Brain".into(), features: vec!["ChatGPT API".into(), "Python ML".into(), "VBA".into()] },
        Service { id: "web".into(), title: "Développement Web".into(), description: "Applications web modernes, performantes et adaptées à vos besoins métier.".into(), icon: "Globe".into(), features: vec!["React / TypeScript".into(), "REST API".into(), "PostgreSQL".into()] },
    ]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

fn projects_with_media(state: &AppState) -> Vec<Project> {
    let store = state.media.lock().unwrap();
    let projects = state.projects.lock().unwrap();
    projects.iter().map(|p| {
        let mut proj = p.clone();
        proj.media = store.get(&p.id).cloned();
        proj
    }).collect()
}

fn check_admin_auth(headers: &HeaderMap) -> bool {
    let password = std::env::var("ADMIN_PASSWORD").unwrap_or_else(|_| "nexalion2024".to_string());
    headers.get("x-admin-password").and_then(|v| v.to_str().ok()).map(|v| v == password).unwrap_or(false)
}

fn chrono_date() -> String {
    let now = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_secs();
    let days = now / 86400;
    let year = 1970 + days / 365;
    let month = (days % 365 / 30) + 1;
    let day = (days % 30) + 1;
    format!("{:04}-{:02}-{:02}", year, month.min(12), day.min(31))
}

// ─── Project Handlers ─────────────────────────────────────────────────────────

async fn list_projects(State(state): State<AppState>) -> Json<Vec<Project>> {
    Json(projects_with_media(&state))
}

async fn get_project(Path(id): Path<String>, State(state): State<AppState>) -> Result<Json<Project>, StatusCode> {
    projects_with_media(&state).into_iter().find(|p| p.id == id).map(Json).ok_or(StatusCode::NOT_FOUND)
}

async fn create_project(State(state): State<AppState>, headers: HeaderMap, Json(payload): Json<CreateProject>) -> Result<Json<Project>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let project = Project {
        id: Uuid::new_v4().to_string(),
        title: payload.title,
        description: payload.description,
        problem: payload.problem,
        solution: payload.solution,
        result: payload.result,
        technologies: payload.technologies,
        category: payload.category,
        demo_url: payload.demo_url.filter(|s| !s.is_empty()),
        download_url: payload.download_url.filter(|s| !s.is_empty()),
        media: None,
    };
    let result = project.clone();
    state.projects.lock().unwrap().insert(0, project);
    Ok(Json(result))
}

async fn update_project(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap, Json(payload): Json<UpdateProject>) -> Result<Json<Project>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut projects = state.projects.lock().unwrap();
    if let Some(p) = projects.iter_mut().find(|p| p.id == id) {
        p.title = payload.title;
        p.description = payload.description;
        p.problem = payload.problem;
        p.solution = payload.solution;
        p.result = payload.result;
        p.technologies = payload.technologies;
        p.category = payload.category;
        p.demo_url = payload.demo_url.filter(|s| !s.is_empty());
        p.download_url = payload.download_url.filter(|s| !s.is_empty());
        Ok(Json(p.clone()))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

async fn delete_project(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap) -> Result<StatusCode, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut projects = state.projects.lock().unwrap();
    let len_before = projects.len();
    projects.retain(|p| p.id != id);
    if projects.len() < len_before { Ok(StatusCode::NO_CONTENT) } else { Err(StatusCode::NOT_FOUND) }
}

// ─── Services Handlers ────────────────────────────────────────────────────────

async fn list_services(State(state): State<AppState>) -> Json<Vec<Service>> {
    Json(state.services.lock().unwrap().clone())
}

async fn update_services(State(state): State<AppState>, headers: HeaderMap, Json(payload): Json<UpdateServices>) -> Result<Json<Vec<Service>>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut services = state.services.lock().unwrap();
    *services = payload.services;
    Ok(Json(services.clone()))
}

// ─── Skills Handler ───────────────────────────────────────────────────────────

async fn list_skills() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        serde_json::json!({ "id": "1", "title": "Data & BI", "icon": "BarChart3", "skills": ["Power BI", "Tableau", "SQL", "DAX", "Python (Pandas)"] }),
        serde_json::json!({ "id": "2", "title": "Développement", "icon": "Code2", "skills": ["React / TypeScript", "Node.js", "Rust", "PostgreSQL"] }),
        serde_json::json!({ "id": "3", "title": "Supply Chain", "icon": "Package", "skills": ["Gestion des stocks", "Optimisation des flux", "ERP", "Lean"] }),
        serde_json::json!({ "id": "4", "title": "IA & ML", "icon": "Brain", "skills": ["Scikit-learn", "TensorFlow", "NLP", "Prévision temporelle"] }),
    ])
}

// ─── Contact & Site Content Handlers ─────────────────────────────────────────

async fn get_contact(State(state): State<AppState>) -> Json<ContactInfo> {
    Json(state.contact.lock().unwrap().clone())
}

async fn update_contact(State(state): State<AppState>, headers: HeaderMap, Json(payload): Json<UpdateContact>) -> Result<Json<ContactInfo>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut contact = state.contact.lock().unwrap();
    contact.email = payload.email;
    contact.linkedin = payload.linkedin;
    contact.whatsapp = payload.whatsapp;
    contact.github = payload.github;
    Ok(Json(contact.clone()))
}

async fn get_site_content(State(state): State<AppState>) -> Json<SiteContent> {
    Json(state.site_content.lock().unwrap().clone())
}

async fn update_site_content(State(state): State<AppState>, headers: HeaderMap, Json(payload): Json<UpdateSiteContent>) -> Result<Json<SiteContent>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut content = state.site_content.lock().unwrap();
    content.hero_description = payload.hero_description;
    content.hero_highlights = payload.hero_highlights;
    content.about_quote = payload.about_quote;
    Ok(Json(content.clone()))
}

async fn health() -> &'static str { "OK" }

// ─── Blog Handlers ────────────────────────────────────────────────────────────

async fn list_blog(State(state): State<AppState>) -> Json<Vec<BlogPost>> {
    let posts = state.blog.lock().unwrap();
    let published: Vec<BlogPost> = posts.iter().filter(|p| p.status == "published").cloned().collect();
    Json(published)
}

async fn list_all_blog(State(state): State<AppState>, headers: HeaderMap) -> Result<Json<Vec<BlogPost>>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let posts = state.blog.lock().unwrap().clone();
    Ok(Json(posts))
}

async fn get_blog_post(Path(slug): Path<String>, State(state): State<AppState>) -> Result<Json<BlogPost>, StatusCode> {
    let mut posts = state.blog.lock().unwrap();
    if let Some(post) = posts.iter_mut().find(|p| p.slug == slug && p.status == "published") {
        post.view_count += 1;
        let post_clone = post.clone();
        drop(posts);
        let mut views = state.blog_views.lock().unwrap();
        *views.entry(slug).or_insert(0) += 1;
        Ok(Json(post_clone))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

async fn create_blog_post(State(state): State<AppState>, headers: HeaderMap, Json(payload): Json<CreateBlogPost>) -> Result<Json<BlogPost>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let words = payload.content.split_whitespace().count();
    let read_time = (words as u64 / 200).max(1);
    let post = BlogPost {
        id: Uuid::new_v4().to_string(),
        title: payload.title, slug: payload.slug, excerpt: payload.excerpt,
        content: payload.content, category: payload.category, tags: payload.tags,
        cover_url: payload.cover_url, status: payload.status,
        created_at: chrono_date(),
        view_count: 0, read_time,
    };
    let result = post.clone();
    state.blog.lock().unwrap().insert(0, post);
    Ok(Json(result))
}

async fn update_blog_post(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap, Json(payload): Json<UpdateBlogPost>) -> Result<Json<BlogPost>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut posts = state.blog.lock().unwrap();
    if let Some(post) = posts.iter_mut().find(|p| p.id == id) {
        post.title = payload.title; post.slug = payload.slug; post.excerpt = payload.excerpt;
        post.content = payload.content; post.category = payload.category; post.tags = payload.tags;
        post.cover_url = payload.cover_url; post.status = payload.status;
        let words = post.content.split_whitespace().count();
        post.read_time = (words as u64 / 200).max(1);
        Ok(Json(post.clone()))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

async fn delete_blog_post(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap) -> Result<StatusCode, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut posts = state.blog.lock().unwrap();
    let len_before = posts.len();
    posts.retain(|p| p.id != id);
    if posts.len() < len_before { Ok(StatusCode::NO_CONTENT) } else { Err(StatusCode::NOT_FOUND) }
}

// ─── Files Handlers ───────────────────────────────────────────────────────────

async fn list_files(State(state): State<AppState>) -> Json<Vec<FreeFile>> {
    Json(state.files.lock().unwrap().clone())
}

async fn track_download(Path(id): Path<String>, State(state): State<AppState>) -> Result<Json<FreeFile>, StatusCode> {
    let mut files = state.files.lock().unwrap();
    if let Some(file) = files.iter_mut().find(|f| f.id == id) {
        file.download_count += 1;
        Ok(Json(file.clone()))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

async fn create_file(State(state): State<AppState>, headers: HeaderMap, Json(payload): Json<CreateFreeFile>) -> Result<Json<FreeFile>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let file = FreeFile {
        id: Uuid::new_v4().to_string(), title: payload.title, description: payload.description,
        file_url: payload.file_url, file_type: payload.file_type, download_count: 0,
        category: payload.category, tags: payload.tags, created_at: chrono_date(),
    };
    let result = file.clone();
    state.files.lock().unwrap().push(file);
    Ok(Json(result))
}

async fn delete_file(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap) -> Result<StatusCode, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut files = state.files.lock().unwrap();
    let len_before = files.len();
    files.retain(|f| f.id != id);
    if files.len() < len_before { Ok(StatusCode::NO_CONTENT) } else { Err(StatusCode::NOT_FOUND) }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

async fn track_event(State(state): State<AppState>, Json(payload): Json<TrackEvent>) -> StatusCode {
    if payload.event_type == "pageview" {
        let mut views = state.page_views.lock().unwrap();
        *views.entry(payload.path).or_insert(0) += 1;
    }
    StatusCode::OK
}

async fn get_admin_stats(State(state): State<AppState>, headers: HeaderMap) -> Result<Json<AdminStats>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let blog = state.blog.lock().unwrap();
    let files = state.files.lock().unwrap();
    let media = state.media.lock().unwrap();
    let page_views = state.page_views.lock().unwrap();
    let blog_views = state.blog_views.lock().unwrap();
    let total_page_views: u64 = page_views.values().sum();
    let total_blog_views: u64 = blog_views.values().sum::<u64>() + blog.iter().map(|p| p.view_count).sum::<u64>();
    let total_downloads: u64 = files.iter().map(|f| f.download_count).sum();
    let media_count: usize = media.values().map(|v| v.len()).sum();
    let published_blog_count = blog.iter().filter(|p| p.status == "published").count();
    Ok(Json(AdminStats {
        total_page_views, total_blog_views, total_downloads,
        blog_count: blog.len(), published_blog_count,
        file_count: files.len(), media_count,
        page_views: page_views.clone(),
    }))
}

// ─── Media Upload ─────────────────────────────────────────────────────────────

async fn upload_media(Path(project_id): Path<String>, State(state): State<AppState>, headers: HeaderMap, mut multipart: Multipart) -> Result<Json<MediaItem>, (StatusCode, String)> {
    if !check_admin_auth(&headers) { return Err((StatusCode::UNAUTHORIZED, "Unauthorized".to_string())); }
    tokio::fs::create_dir_all("uploads").await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    while let Some(field) = multipart.next_field().await.map_err(|e| (StatusCode::BAD_REQUEST, e.to_string()))? {
        let content_type = field.content_type().unwrap_or("application/octet-stream").to_string();
        let original_name = field.file_name().unwrap_or("upload.bin").to_string();
        let media_type = if content_type.starts_with("image/") || ["jpg","jpeg","png","gif","webp","svg","avif"].iter().any(|e| original_name.to_lowercase().ends_with(e)) { "image" }
            else if content_type.starts_with("video/") || ["mp4","webm","mov","avi","mkv"].iter().any(|e| original_name.to_lowercase().ends_with(e)) { "video" }
            else { return Err((StatusCode::BAD_REQUEST, "Type non supporté".to_string())); };
        let ext = original_name.split('.').last().unwrap_or("bin");
        let id = Uuid::new_v4().to_string();
        let filename = format!("{}.{}", id, ext);
        let bytes = field.bytes().await.map_err(|e| (StatusCode::BAD_REQUEST, e.to_string()))?;
        tokio::fs::write(format!("uploads/{}", filename), &bytes).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        let item = MediaItem { id: id.clone(), url: format!("/uploads/{}", filename), media_type: media_type.to_string(), project_id: project_id.clone(), filename };
        state.media.lock().unwrap().entry(project_id.clone()).or_default().push(item.clone());
        return Ok(Json(item));
    }
    Err((StatusCode::BAD_REQUEST, "Aucun fichier reçu".to_string()))
}

async fn get_project_media(Path(project_id): Path<String>, State(state): State<AppState>) -> Json<Vec<MediaItem>> {
    let store = state.media.lock().unwrap();
    Json(store.get(&project_id).cloned().unwrap_or_default())
}

async fn delete_media_item(Path(media_id): Path<String>, State(state): State<AppState>, headers: HeaderMap) -> Result<StatusCode, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut store = state.media.lock().unwrap();
    for items in store.values_mut() {
        if let Some(pos) = items.iter().position(|m| m.id == media_id) {
            let filename = items[pos].filename.clone();
            items.remove(pos);
            let _ = std::fs::remove_file(format!("uploads/{}", filename));
            return Ok(StatusCode::NO_CONTENT);
        }
    }
    Err(StatusCode::NOT_FOUND)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() {
    tokio::fs::create_dir_all("uploads").await.ok();

    let state = AppState {
        projects: Arc::new(Mutex::new(seed_projects())),
        services: Arc::new(Mutex::new(seed_services())),
        media: Arc::new(Mutex::new(HashMap::new())),
        blog: Arc::new(Mutex::new(seed_blog())),
        files: Arc::new(Mutex::new(seed_files())),
        page_views: Arc::new(Mutex::new(HashMap::new())),
        blog_views: Arc::new(Mutex::new(HashMap::new())),
        contact: Arc::new(Mutex::new(ContactInfo {
            email: "jibharkroman@gmail.com".into(),
            linkedin: "https://linkedin.com/in/kroman-jibhar-samuel".into(),
            whatsapp: "+225 0700000000".into(),
            github: "https://github.com/kromanjibhar".into(),
        })),
        site_content: Arc::new(Mutex::new(SiteContent {
            hero_description: "Je conçois des solutions digitales et des tableaux de bord sur mesure qui transforment vos données en décisions. Données, automatisation, web — adaptés à votre contexte métier.".into(),
            hero_highlights: vec![
                "Tableaux de bord Power BI".into(),
                "Applications React / TypeScript".into(),
                "Automatisation VBA & Python".into(),
            ],
            about_quote: "Autodidacte déterminé, je transforme la complexité en solutions simples et efficaces.".into(),
        })),
    };

    // CORS: allow the Express proxy (localhost:5000) and production domain if set
    let allowed_origin = std::env::var("ALLOWED_ORIGIN")
        .unwrap_or_else(|_| "http://localhost:5000".to_string());
    let cors_origin = allowed_origin
        .parse::<HeaderValue>()
        .unwrap_or_else(|_| HeaderValue::from_static("http://localhost:5000"));

    let cors = CorsLayer::new()
        .allow_origin(cors_origin)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers(Any);

    let app = Router::new()
        // Public
        .route("/api/projects", get(list_projects))
        .route("/api/projects/:id", get(get_project))
        .route("/api/services", get(list_services))
        .route("/api/skills", get(list_skills))
        .route("/api/contact", get(get_contact))
        .route("/api/site-content", get(get_site_content))
        .route("/api/blog", get(list_blog))
        .route("/api/blog/:slug", get(get_blog_post))
        .route("/api/files", get(list_files))
        .route("/api/files/:id/download", post(track_download))
        .route("/api/track", post(track_event))
        // Admin — stats & blog
        .route("/api/admin/stats", get(get_admin_stats))
        .route("/api/admin/blog", get(list_all_blog).post(create_blog_post))
        .route("/api/admin/blog/:id", put(update_blog_post).delete(delete_blog_post))
        // Admin — files
        .route("/api/admin/files", post(create_file))
        .route("/api/admin/files/:id", delete(delete_file))
        // Admin — projects CRUD
        .route("/api/admin/projects", post(create_project))
        .route("/api/admin/projects/:id", put(update_project).delete(delete_project))
        // Admin — media
        .route("/api/admin/projects/:id/upload", post(upload_media))
        .route("/api/admin/projects/:id/media", get(get_project_media))
        .route("/api/admin/media/:media_id", delete(delete_media_item))
        // Admin — contact, site content, services
        .route("/api/admin/contact", put(update_contact))
        .route("/api/admin/site-content", put(update_site_content))
        .route("/api/admin/services", put(update_services))
        // Health
        .route("/health", get(health))
        .layer(middleware::from_fn(security_headers))
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("🦀 Rust API server running on http://0.0.0.0:3001");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
