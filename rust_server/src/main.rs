mod models;
mod state;
mod handlers;

use axum::{
    Router,
    middleware,
    routing::{delete, get, post, put},
    http::{HeaderValue, Method},
};
use tower_http::cors::{Any, CorsLayer};
use handlers::*;
use state::AppState;

#[tokio::main]
async fn main() {
    tokio::fs::create_dir_all("uploads").await.ok();

    let state = AppState::new();

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
        // ── Public ──────────────────────────────────────────────────────────
        .route("/api/projects",                   get(list_projects))
        .route("/api/projects/:id",               get(get_project))
        .route("/api/services",                   get(list_services))
        .route("/api/skills",                     get(list_skills))
        .route("/api/contact",                    get(get_contact))
        .route("/api/site-content",               get(get_site_content))
        .route("/api/blog",                       get(list_blog))
        .route("/api/blog/:slug",                 get(get_blog_post))
        .route("/api/files",                      get(list_files))
        .route("/api/files/:id/download",         post(track_download))
        .route("/api/track",                      post(track_event))
        // ── Admin ───────────────────────────────────────────────────────────
        .route("/api/admin/stats",                get(get_admin_stats))
        .route("/api/admin/blog",                 get(list_all_blog).post(create_blog_post))
        .route("/api/admin/blog/:id",             put(update_blog_post).delete(delete_blog_post))
        .route("/api/admin/files",                post(create_file))
        .route("/api/admin/files/:id",            delete(delete_file))
        .route("/api/admin/projects",             post(create_project))
        .route("/api/admin/projects/:id",         put(update_project).delete(delete_project))
        .route("/api/admin/projects/:id/upload",  post(upload_media))
        .route("/api/admin/projects/:id/media",   get(get_project_media))
        .route("/api/admin/media/:media_id",      delete(delete_media_item))
        .route("/api/admin/verify",               post(verify_admin))
        .route("/api/admin/contact",              put(update_contact))
        .route("/api/admin/site-content",         put(update_site_content))
        .route("/api/admin/services",             put(update_services))
        // ── Infra ────────────────────────────────────────────────────────────
        .route("/health",                         get(health))
        .layer(middleware::from_fn(security_headers))
        .layer(cors)
        .with_state(state);

    println!("🦀 Rust API server running on http://0.0.0.0:3001");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
