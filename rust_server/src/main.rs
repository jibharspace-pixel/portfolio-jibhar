use axum::{
    extract::{Multipart, Path, State},
    http::{HeaderMap, Method, StatusCode},
    response::Json,
    routing::{delete, get, post},
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
struct Service {
    id: String,
    title: String,
    description: String,
    icon: String,
    features: Vec<String>,
}

#[derive(Clone, Serialize, Deserialize)]
struct SkillCategory {
    id: String,
    title: String,
    icon: String,
    skills: Vec<String>,
}

#[derive(Clone, Serialize, Deserialize)]
struct ContactInfo {
    email: String,
    linkedin: String,
    whatsapp: String,
    github: String,
}

// ─── App State ───────────────────────────────────────────────────────────────

#[derive(Clone)]
struct AppState {
    media: Arc<Mutex<HashMap<String, Vec<MediaItem>>>>,
}

// ─── Static Data ─────────────────────────────────────────────────────────────

fn base_projects() -> Vec<Project> {
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
            media: None,
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
            media: None,
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
            media: None,
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
            media: None,
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
            media: None,
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
            media: None,
        },
    ]
}

fn projects_with_media(state: &AppState) -> Vec<Project> {
    let store = state.media.lock().unwrap();
    base_projects()
        .into_iter()
        .map(|mut p| {
            p.media = store.get(&p.id).cloned();
            p
        })
        .collect()
}

// ─── Auth Helper ─────────────────────────────────────────────────────────────

fn check_admin_auth(headers: &HeaderMap) -> bool {
    let password = std::env::var("ADMIN_PASSWORD")
        .unwrap_or_else(|_| "nexalion2024".to_string());
    headers
        .get("x-admin-password")
        .and_then(|v| v.to_str().ok())
        .map(|v| v == password)
        .unwrap_or(false)
}

// ─── Route Handlers ──────────────────────────────────────────────────────────

async fn list_projects(State(state): State<AppState>) -> Json<Vec<Project>> {
    Json(projects_with_media(&state))
}

async fn get_project(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<Project>, StatusCode> {
    projects_with_media(&state)
        .into_iter()
        .find(|p| p.id == id)
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn list_services() -> Json<Vec<Service>> {
    Json(vec![
        Service {
            id: "data-analysis".into(),
            title: "Analyse de données & IA".into(),
            description: "Transformez vos données en insights actionnables avec des tableaux de bord interactifs.".into(),
            icon: "BarChart3".into(),
            features: vec!["Power BI".into(), "Excel avancé".into(), "SQL".into(), "DAX".into()],
        },
        Service {
            id: "ai-solutions".into(),
            title: "Solutions IA & Automatisation".into(),
            description: "Intégration d'intelligence artificielle et automatisation de processus.".into(),
            icon: "Brain".into(),
            features: vec!["ChatGPT API".into(), "Automatisation".into(), "Vibe Coding".into()],
        },
        Service {
            id: "web-dev".into(),
            title: "Développement Web".into(),
            description: "Applications web modernes et performantes avec les dernières technologies.".into(),
            icon: "Globe".into(),
            features: vec!["React / TypeScript".into(), "REST API".into(), "PostgreSQL".into()],
        },
    ])
}

async fn list_skills() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        serde_json::json!({ "id": "1", "title": "Data & BI", "icon": "BarChart3", "skills": ["Power BI", "Tableau", "SQL", "DAX", "Python (Pandas, NumPy)"] }),
        serde_json::json!({ "id": "2", "title": "Développement", "icon": "Code2", "skills": ["React / TypeScript", "Node.js", "Rust", "PostgreSQL", "REST API"] }),
        serde_json::json!({ "id": "3", "title": "Logistique & Supply Chain", "icon": "Package", "skills": ["Gestion des stocks", "Optimisation des flux", "ERP", "Lean Management"] }),
        serde_json::json!({ "id": "4", "title": "IA & Machine Learning", "icon": "Brain", "skills": ["Scikit-learn", "TensorFlow", "NLP", "Prévision temporelle"] }),
    ])
}

async fn get_contact() -> Json<ContactInfo> {
    Json(ContactInfo {
        email: "jibharkroman@gmail.com".into(),
        linkedin: "https://linkedin.com/in/kroman-jibhar-samuel".into(),
        whatsapp: "+225 0700000000".into(),
        github: "https://github.com/kromanjibhar".into(),
    })
}

async fn health() -> &'static str {
    "OK"
}

// ─── Admin: Upload Media ──────────────────────────────────────────────────────

async fn upload_media(
    Path(project_id): Path<String>,
    State(state): State<AppState>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Result<Json<MediaItem>, (StatusCode, String)> {
    if !check_admin_auth(&headers) {
        return Err((StatusCode::UNAUTHORIZED, "Mot de passe invalide".to_string()));
    }

    tokio::fs::create_dir_all("uploads")
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| (StatusCode::BAD_REQUEST, e.to_string()))?
    {
        let content_type = field
            .content_type()
            .unwrap_or("application/octet-stream")
            .to_string();
        let original_name = field.file_name().unwrap_or("upload.bin").to_string();

        let media_type = if content_type.starts_with("image/")
            || ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"]
                .iter()
                .any(|ext| original_name.to_lowercase().ends_with(ext))
        {
            "image"
        } else if content_type.starts_with("video/")
            || ["mp4", "webm", "mov", "avi", "mkv"]
                .iter()
                .any(|ext| original_name.to_lowercase().ends_with(ext))
        {
            "video"
        } else {
            return Err((
                StatusCode::BAD_REQUEST,
                "Type non supporté. Utilisez image (jpg/png/webp) ou vidéo (mp4/webm).".to_string(),
            ));
        };

        let ext = original_name.split('.').last().unwrap_or("bin");
        let id = Uuid::new_v4().to_string();
        let filename = format!("{}.{}", id, ext);
        let file_path = format!("uploads/{}", filename);

        let bytes = field
            .bytes()
            .await
            .map_err(|e| (StatusCode::BAD_REQUEST, e.to_string()))?;

        tokio::fs::write(&file_path, &bytes)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        let item = MediaItem {
            id: id.clone(),
            url: format!("/uploads/{}", filename),
            media_type: media_type.to_string(),
            project_id: project_id.clone(),
            filename,
        };

        state
            .media
            .lock()
            .unwrap()
            .entry(project_id.clone())
            .or_default()
            .push(item.clone());

        return Ok(Json(item));
    }

    Err((StatusCode::BAD_REQUEST, "Aucun fichier reçu".to_string()))
}

// ─── Admin: Get Project Media ─────────────────────────────────────────────────

async fn get_project_media(
    Path(project_id): Path<String>,
    State(state): State<AppState>,
) -> Json<Vec<MediaItem>> {
    let store = state.media.lock().unwrap();
    Json(store.get(&project_id).cloned().unwrap_or_default())
}

// ─── Admin: Delete Media Item ─────────────────────────────────────────────────

async fn delete_media_item(
    Path(media_id): Path<String>,
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<StatusCode, StatusCode> {
    if !check_admin_auth(&headers) {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let mut store = state.media.lock().unwrap();
    let mut found_filename: Option<String> = None;

    for items in store.values_mut() {
        if let Some(pos) = items.iter().position(|m| m.id == media_id) {
            found_filename = Some(items[pos].filename.clone());
            items.remove(pos);
            break;
        }
    }

    if let Some(filename) = found_filename {
        let _ = std::fs::remove_file(format!("uploads/{}", filename));
        Ok(StatusCode::NO_CONTENT)
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() {
    tokio::fs::create_dir_all("uploads").await.ok();

    let state = AppState {
        media: Arc::new(Mutex::new(HashMap::new())),
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/projects", get(list_projects))
        .route("/api/projects/:id", get(get_project))
        .route("/api/services", get(list_services))
        .route("/api/skills", get(list_skills))
        .route("/api/contact", get(get_contact))
        .route("/api/admin/projects/:id/upload", post(upload_media))
        .route("/api/admin/projects/:id/media", get(get_project_media))
        .route("/api/admin/media/:media_id", delete(delete_media_item))
        .route("/health", get(health))
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("🦀 Rust API server running on http://0.0.0.0:3001");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
