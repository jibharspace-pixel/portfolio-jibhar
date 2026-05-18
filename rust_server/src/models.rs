use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ─── Domain Models ────────────────────────────────────────────────────────────

#[derive(Clone, Serialize, Deserialize)]
pub struct MediaItem {
    pub id: String,
    pub url: String,
    pub media_type: String,
    pub project_id: String,
    pub filename: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub title: String,
    pub description: String,
    pub problem: String,
    pub solution: String,
    pub result: String,
    pub technologies: Vec<String>,
    pub category: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub demo_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub download_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub media: Option<Vec<MediaItem>>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct BlogPost {
    pub id: String,
    pub title: String,
    pub slug: String,
    pub excerpt: String,
    pub content: String,
    pub category: String,
    pub tags: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cover_url: Option<String>,
    pub status: String,
    pub created_at: String,
    pub view_count: u64,
    pub read_time: u64,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct FreeFile {
    pub id: String,
    pub title: String,
    pub description: String,
    pub file_url: String,
    pub file_type: String,
    pub download_count: u64,
    pub category: String,
    pub tags: Vec<String>,
    pub created_at: String,
}

#[derive(Serialize)]
pub struct AdminStats {
    pub total_page_views: u64,
    pub total_blog_views: u64,
    pub total_downloads: u64,
    pub blog_count: usize,
    pub published_blog_count: usize,
    pub file_count: usize,
    pub media_count: usize,
    pub page_views: HashMap<String, u64>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Service {
    pub id: String,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub features: Vec<String>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ContactInfo {
    pub email: String,
    pub linkedin: String,
    pub whatsapp: String,
    pub github: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct SiteContent {
    pub hero_description: String,
    pub hero_highlights: Vec<String>,
    pub about_quote: String,
    pub footer_tagline: String,
    pub stack_tags: Vec<String>,
}

// ─── Input / Request Types ────────────────────────────────────────────────────

#[derive(Deserialize)]
pub struct CreateBlogPost {
    pub title: String,
    pub slug: String,
    pub excerpt: String,
    pub content: String,
    pub category: String,
    pub tags: Vec<String>,
    pub cover_url: Option<String>,
    pub status: String,
}

#[derive(Deserialize)]
pub struct UpdateBlogPost {
    pub title: String,
    pub slug: String,
    pub excerpt: String,
    pub content: String,
    pub category: String,
    pub tags: Vec<String>,
    pub cover_url: Option<String>,
    pub status: String,
}

#[derive(Deserialize)]
pub struct CreateFreeFile {
    pub title: String,
    pub description: String,
    pub file_url: String,
    pub file_type: String,
    pub category: String,
    pub tags: Vec<String>,
}

#[derive(Deserialize)]
pub struct TrackEvent {
    pub event_type: String,
    pub path: String,
}

#[derive(Deserialize)]
pub struct UpdateContact {
    pub email: String,
    pub linkedin: String,
    pub whatsapp: String,
    pub github: String,
}

#[derive(Deserialize)]
pub struct UpdateSiteContent {
    pub hero_description: String,
    pub hero_highlights: Vec<String>,
    pub about_quote: String,
    #[serde(default)]
    pub footer_tagline: String,
    #[serde(default)]
    pub stack_tags: Vec<String>,
}

#[derive(Deserialize)]
pub struct VerifyPayload {
    pub password: String,
}

#[derive(Deserialize)]
pub struct CreateProject {
    pub title: String,
    pub description: String,
    pub problem: String,
    pub solution: String,
    pub result: String,
    pub technologies: Vec<String>,
    pub category: String,
    pub demo_url: Option<String>,
    pub download_url: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateProject {
    pub title: String,
    pub description: String,
    pub problem: String,
    pub solution: String,
    pub result: String,
    pub technologies: Vec<String>,
    pub category: String,
    pub demo_url: Option<String>,
    pub download_url: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateServices {
    pub services: Vec<Service>,
}
