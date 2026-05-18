use axum::{
    extract::{Json, Multipart, Path, State},
    http::{HeaderMap, HeaderValue, StatusCode},
    middleware::Next,
    response::Response,
};
use uuid::Uuid;
use crate::models::*;
use crate::state::AppState;

// ─── Security Headers Middleware ──────────────────────────────────────────────

pub async fn security_headers(req: axum::extract::Request, next: Next) -> Response {
    let mut res = next.run(req).await;
    let h = res.headers_mut();
    h.insert("x-content-type-options",           HeaderValue::from_static("nosniff"));
    h.insert("x-frame-options",                   HeaderValue::from_static("DENY"));
    h.insert("x-xss-protection",                  HeaderValue::from_static("1; mode=block"));
    h.insert("referrer-policy",                   HeaderValue::from_static("strict-origin-when-cross-origin"));
    h.insert("x-permitted-cross-domain-policies", HeaderValue::from_static("none"));
    res
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

pub fn projects_with_media(state: &AppState) -> Vec<Project> {
    let store = state.media.lock().unwrap();
    let projects = state.projects.lock().unwrap();
    projects.iter().map(|p| {
        let mut proj = p.clone();
        proj.media = store.get(&p.id).cloned();
        proj
    }).collect()
}

pub fn check_admin_auth(headers: &HeaderMap) -> bool {
    let password = std::env::var("ADMIN_PASSWORD").unwrap_or_else(|_| "nexalion2024".to_string());
    headers.get("x-admin-password")
        .and_then(|v| v.to_str().ok())
        .map(|v| v == password)
        .unwrap_or(false)
}

pub fn chrono_date() -> String {
    let secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default().as_secs();
    let days = secs / 86400;
    let year = 1970 + days / 365;
    let month = ((days % 365) / 30) + 1;
    let day = (days % 30) + 1;
    format!("{:04}-{:02}-{:02}", year, month.min(12), day.min(31))
}

// ─── Health ───────────────────────────────────────────────────────────────────

pub async fn health() -> &'static str { "OK" }

pub async fn verify_admin(Json(payload): Json<VerifyPayload>) -> StatusCode {
    let password = std::env::var("ADMIN_PASSWORD").unwrap_or_else(|_| "nexalion2024".to_string());
    if payload.password == password { StatusCode::OK } else { StatusCode::UNAUTHORIZED }
}

// ─── Project Handlers ─────────────────────────────────────────────────────────

pub async fn list_projects(State(state): State<AppState>) -> Json<Vec<Project>> {
    Json(projects_with_media(&state))
}

pub async fn get_project(Path(id): Path<String>, State(state): State<AppState>) -> Result<Json<Project>, StatusCode> {
    projects_with_media(&state).into_iter().find(|p| p.id == id).map(Json).ok_or(StatusCode::NOT_FOUND)
}

pub async fn create_project(State(state): State<AppState>, headers: HeaderMap, Json(p): Json<CreateProject>) -> Result<Json<Project>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let project = Project {
        id: Uuid::new_v4().to_string(),
        title: p.title, description: p.description, problem: p.problem,
        solution: p.solution, result: p.result, technologies: p.technologies,
        category: p.category,
        demo_url: p.demo_url.filter(|s| !s.is_empty()),
        download_url: p.download_url.filter(|s| !s.is_empty()),
        media: None,
    };
    let result = project.clone();
    state.projects.lock().unwrap().insert(0, project);
    Ok(Json(result))
}

pub async fn update_project(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap, Json(p): Json<UpdateProject>) -> Result<Json<Project>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut projects = state.projects.lock().unwrap();
    if let Some(proj) = projects.iter_mut().find(|x| x.id == id) {
        proj.title = p.title; proj.description = p.description; proj.problem = p.problem;
        proj.solution = p.solution; proj.result = p.result; proj.technologies = p.technologies;
        proj.category = p.category;
        proj.demo_url = p.demo_url.filter(|s| !s.is_empty());
        proj.download_url = p.download_url.filter(|s| !s.is_empty());
        Ok(Json(proj.clone()))
    } else { Err(StatusCode::NOT_FOUND) }
}

pub async fn delete_project(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap) -> Result<StatusCode, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut projects = state.projects.lock().unwrap();
    let before = projects.len();
    projects.retain(|p| p.id != id);
    if projects.len() < before { Ok(StatusCode::NO_CONTENT) } else { Err(StatusCode::NOT_FOUND) }
}

// ─── Services ─────────────────────────────────────────────────────────────────

pub async fn list_services(State(state): State<AppState>) -> Json<Vec<Service>> {
    Json(state.services.lock().unwrap().clone())
}

pub async fn update_services(State(state): State<AppState>, headers: HeaderMap, Json(payload): Json<UpdateServices>) -> Result<Json<Vec<Service>>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut services = state.services.lock().unwrap();
    *services = payload.services;
    Ok(Json(services.clone()))
}

// ─── Skills (static) ─────────────────────────────────────────────────────────

pub async fn list_skills() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        serde_json::json!({ "id": "1", "title": "Data & BI",      "icon": "BarChart3", "skills": ["Power BI", "Tableau", "SQL", "DAX", "Python (Pandas)"] }),
        serde_json::json!({ "id": "2", "title": "Développement",   "icon": "Code2",     "skills": ["React / TypeScript", "Node.js", "Rust", "PostgreSQL"] }),
        serde_json::json!({ "id": "3", "title": "Supply Chain",    "icon": "Package",   "skills": ["Gestion des stocks", "Optimisation des flux", "ERP", "Lean"] }),
        serde_json::json!({ "id": "4", "title": "IA & ML",         "icon": "Brain",     "skills": ["Scikit-learn", "TensorFlow", "NLP", "Prévision temporelle"] }),
    ])
}

// ─── Contact & Site Content ───────────────────────────────────────────────────

pub async fn get_contact(State(state): State<AppState>) -> Json<ContactInfo> {
    Json(state.contact.lock().unwrap().clone())
}

pub async fn update_contact(State(state): State<AppState>, headers: HeaderMap, Json(p): Json<UpdateContact>) -> Result<Json<ContactInfo>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut c = state.contact.lock().unwrap();
    c.email = p.email; c.linkedin = p.linkedin; c.whatsapp = p.whatsapp; c.github = p.github;
    Ok(Json(c.clone()))
}

pub async fn get_site_content(State(state): State<AppState>) -> Json<SiteContent> {
    Json(state.site_content.lock().unwrap().clone())
}

pub async fn update_site_content(State(state): State<AppState>, headers: HeaderMap, Json(p): Json<UpdateSiteContent>) -> Result<Json<SiteContent>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut sc = state.site_content.lock().unwrap();
    sc.hero_description = p.hero_description;
    sc.hero_highlights = p.hero_highlights;
    sc.about_quote = p.about_quote;
    if !p.footer_tagline.is_empty() { sc.footer_tagline = p.footer_tagline; }
    if !p.stack_tags.is_empty() { sc.stack_tags = p.stack_tags; }
    Ok(Json(sc.clone()))
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

pub async fn list_blog(State(state): State<AppState>) -> Json<Vec<BlogPost>> {
    Json(state.blog.lock().unwrap().iter().filter(|p| p.status == "published").cloned().collect())
}

pub async fn list_all_blog(State(state): State<AppState>, headers: HeaderMap) -> Result<Json<Vec<BlogPost>>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    Ok(Json(state.blog.lock().unwrap().clone()))
}

pub async fn get_blog_post(Path(slug): Path<String>, State(state): State<AppState>) -> Result<Json<BlogPost>, StatusCode> {
    let mut posts = state.blog.lock().unwrap();
    if let Some(post) = posts.iter_mut().find(|p| p.slug == slug && p.status == "published") {
        post.view_count += 1;
        let clone = post.clone();
        drop(posts);
        *state.blog_views.lock().unwrap().entry(slug).or_insert(0) += 1;
        Ok(Json(clone))
    } else { Err(StatusCode::NOT_FOUND) }
}

pub async fn create_blog_post(State(state): State<AppState>, headers: HeaderMap, Json(p): Json<CreateBlogPost>) -> Result<Json<BlogPost>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let read_time = (p.content.split_whitespace().count() as u64 / 200).max(1);
    let post = BlogPost {
        id: Uuid::new_v4().to_string(),
        title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content,
        category: p.category, tags: p.tags, cover_url: p.cover_url, status: p.status,
        created_at: chrono_date(), view_count: 0, read_time,
    };
    let result = post.clone();
    state.blog.lock().unwrap().insert(0, post);
    Ok(Json(result))
}

pub async fn update_blog_post(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap, Json(p): Json<UpdateBlogPost>) -> Result<Json<BlogPost>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut posts = state.blog.lock().unwrap();
    if let Some(post) = posts.iter_mut().find(|x| x.id == id) {
        post.title = p.title; post.slug = p.slug; post.excerpt = p.excerpt;
        post.content = p.content; post.category = p.category; post.tags = p.tags;
        post.cover_url = p.cover_url; post.status = p.status;
        post.read_time = (post.content.split_whitespace().count() as u64 / 200).max(1);
        Ok(Json(post.clone()))
    } else { Err(StatusCode::NOT_FOUND) }
}

pub async fn delete_blog_post(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap) -> Result<StatusCode, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut posts = state.blog.lock().unwrap();
    let before = posts.len();
    posts.retain(|p| p.id != id);
    if posts.len() < before { Ok(StatusCode::NO_CONTENT) } else { Err(StatusCode::NOT_FOUND) }
}

// ─── Files ────────────────────────────────────────────────────────────────────

pub async fn list_files(State(state): State<AppState>) -> Json<Vec<FreeFile>> {
    Json(state.files.lock().unwrap().clone())
}

pub async fn track_download(Path(id): Path<String>, State(state): State<AppState>) -> Result<Json<FreeFile>, StatusCode> {
    let mut files = state.files.lock().unwrap();
    if let Some(file) = files.iter_mut().find(|f| f.id == id) {
        file.download_count += 1;
        Ok(Json(file.clone()))
    } else { Err(StatusCode::NOT_FOUND) }
}

pub async fn create_file(State(state): State<AppState>, headers: HeaderMap, Json(p): Json<CreateFreeFile>) -> Result<Json<FreeFile>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let file = FreeFile {
        id: Uuid::new_v4().to_string(), title: p.title, description: p.description,
        file_url: p.file_url, file_type: p.file_type, download_count: 0,
        category: p.category, tags: p.tags, created_at: chrono_date(),
    };
    let result = file.clone();
    state.files.lock().unwrap().push(file);
    Ok(Json(result))
}

pub async fn delete_file(Path(id): Path<String>, State(state): State<AppState>, headers: HeaderMap) -> Result<StatusCode, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let mut files = state.files.lock().unwrap();
    let before = files.len();
    files.retain(|f| f.id != id);
    if files.len() < before { Ok(StatusCode::NO_CONTENT) } else { Err(StatusCode::NOT_FOUND) }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

pub async fn track_event(State(state): State<AppState>, Json(p): Json<TrackEvent>) -> StatusCode {
    if p.event_type == "pageview" {
        *state.page_views.lock().unwrap().entry(p.path).or_insert(0) += 1;
    }
    StatusCode::OK
}

pub async fn get_admin_stats(State(state): State<AppState>, headers: HeaderMap) -> Result<Json<AdminStats>, StatusCode> {
    if !check_admin_auth(&headers) { return Err(StatusCode::UNAUTHORIZED); }
    let blog       = state.blog.lock().unwrap();
    let files      = state.files.lock().unwrap();
    let media      = state.media.lock().unwrap();
    let page_views = state.page_views.lock().unwrap();
    let blog_views = state.blog_views.lock().unwrap();
    Ok(Json(AdminStats {
        total_page_views:     page_views.values().sum(),
        total_blog_views:     blog_views.values().sum::<u64>() + blog.iter().map(|p| p.view_count).sum::<u64>(),
        total_downloads:      files.iter().map(|f| f.download_count).sum(),
        blog_count:           blog.len(),
        published_blog_count: blog.iter().filter(|p| p.status == "published").count(),
        file_count:           files.len(),
        media_count:          media.values().map(|v| v.len()).sum(),
        page_views:           page_views.clone(),
    }))
}

// ─── Media ────────────────────────────────────────────────────────────────────

pub async fn upload_media(
    Path(project_id): Path<String>,
    State(state): State<AppState>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Result<Json<MediaItem>, (StatusCode, String)> {
    if !check_admin_auth(&headers) { return Err((StatusCode::UNAUTHORIZED, "Unauthorized".into())); }
    tokio::fs::create_dir_all("uploads").await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    while let Some(field) = multipart.next_field().await.map_err(|e| (StatusCode::BAD_REQUEST, e.to_string()))? {
        let content_type = field.content_type().unwrap_or("application/octet-stream").to_string();
        let original_name = field.file_name().unwrap_or("upload.bin").to_string();
        let media_type =
            if content_type.starts_with("image/") || ["jpg","jpeg","png","gif","webp","svg","avif"].iter().any(|e| original_name.to_lowercase().ends_with(e)) { "image" }
            else if content_type.starts_with("video/") || ["mp4","webm","mov","avi","mkv"].iter().any(|e| original_name.to_lowercase().ends_with(e)) { "video" }
            else { return Err((StatusCode::BAD_REQUEST, "Type non supporté".into())); };
        let ext = original_name.split('.').last().unwrap_or("bin");
        let id = Uuid::new_v4().to_string();
        let filename = format!("{}.{}", id, ext);
        let bytes = field.bytes().await.map_err(|e| (StatusCode::BAD_REQUEST, e.to_string()))?;
        tokio::fs::write(format!("uploads/{}", filename), &bytes).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        let item = MediaItem { id, url: format!("/uploads/{}", filename), media_type: media_type.into(), project_id: project_id.clone(), filename };
        state.media.lock().unwrap().entry(project_id.clone()).or_default().push(item.clone());
        return Ok(Json(item));
    }
    Err((StatusCode::BAD_REQUEST, "Aucun fichier reçu".into()))
}

pub async fn get_project_media(Path(project_id): Path<String>, State(state): State<AppState>) -> Json<Vec<MediaItem>> {
    Json(state.media.lock().unwrap().get(&project_id).cloned().unwrap_or_default())
}

pub async fn delete_media_item(Path(media_id): Path<String>, State(state): State<AppState>, headers: HeaderMap) -> Result<StatusCode, StatusCode> {
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
