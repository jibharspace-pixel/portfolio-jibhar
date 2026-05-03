# Kroman Jibhar Samuel Portfolio

## Overview

A professional premium portfolio website for Kroman Jibhar Samuel, a Logistics & Data Analyst freelancer based in Côte d'Ivoire. Built with a blue/white Nexalion brand identity, multi-page routing, and a real Rust backend API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (multi-page — Accueil `/`, Projets `/projets`, À propos `/apropos`, Contact `/contact`)
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS with Nexalion blue/white design system
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Build Tool**: Vite

**Design System**:
- Typography: Inter (body/UI) + **Plus Jakarta Sans** (headings/display) — `--font-serif`
- Color palette: Nexalion deep royal blue (`hsl(216, 90%, 40%)`) + pure white
- **Aurora mesh gradient backgrounds** on all pages (`.bg-aurora-page`) + `.bg-hero-aurora` on hero
- Subtle grid background overlay (35% opacity in hero)
- Premium aesthetic: Linear/Stripe-level polish with radial gradient mesh
- Theme support: Light/dark mode (localStorage key: `portfolio-theme`)

### Backend Architecture — Rust (Axum)
- **Runtime**: Rust with Axum web framework on port **3001**
- **All API endpoints** are served by the Rust server
- **Express/Node.js** runs on port 5000 (Vite dev server middleware + proxy to Rust for `/api/*`)

**Rust Modules** (`rust_server/src/`):
- `main.rs` (68 lines) — entry point: declares modules, CORS, router, server start
- `models.rs` (185 lines) — all data structs + request input types
- `state.rs` (111 lines) — `AppState::new()` + 4 seed functions
- `handlers.rs` (319 lines) — all HTTP handlers + auth/date helpers

**API Endpoints** (served by Rust):
- `GET /api/projects` — All portfolio projects
- `GET /api/projects/:id` — Single project
- `GET /api/services` — Available services
- `GET /api/skills` — Skill categories
- `GET /api/contact` — Contact information
- `GET /api/site-content` — Dynamic site texts
- `GET /api/blog` — Published blog posts
- `GET /api/blog/:slug` — Single post
- `GET /api/files` — Free resources
- `POST /api/track` — Analytics tracking

**Admin API Endpoints** (require `x-admin-password` header):
- `GET /api/admin/stats` — Analytics dashboard
- `GET|POST /api/admin/blog` — Blog CRUD
- `PUT|DELETE /api/admin/blog/:id` — Blog update/delete
- `POST /api/admin/files` — Add resource
- `DELETE /api/admin/files/:id` — Delete resource
- `POST /api/admin/projects` — Create project *(new)*
- `PUT /api/admin/projects/:id` — Update project content *(new)*
- `DELETE /api/admin/projects/:id` — Delete project *(new)*
- `POST /api/admin/projects/:id/upload` — Upload project media
- `GET /api/admin/projects/:id/media` — List project media
- `DELETE /api/admin/media/:media_id` — Delete media item
- `PUT /api/admin/contact` — Update contact info
- `PUT /api/admin/site-content` — Update site texts
- `PUT /api/admin/services` — Update services *(new)*

**Rust Server Location**: `rust_server/` (Cargo.toml + src/main.rs using Axum + Tokio + Serde)

### Data Storage
- **Current**: In-memory state in Rust AppState (projects, services, blog, files, media, contact, site_content)
- **ORM**: Drizzle ORM configured for PostgreSQL (available via `DATABASE_URL`)
- **Schema**: `shared/schema.ts`

### Project Structure
```
├── client/              # React frontend
│   └── src/
│       ├── components/  # Navigation, Hero, Projects, About, Contact, Footer
│       ├── pages/       # home.tsx, projects.tsx, about.tsx, contact.tsx, admin.tsx
│       └── lib/         # queryClient, utilities
├── server/              # Node.js Express (Vite middleware + API proxy)
│   ├── index.ts
│   ├── routes.ts        # Proxies /api/* → Rust server on port 3001
│   └── vite.ts
├── rust_server/         # Rust Axum API server
│   ├── Cargo.toml
│   └── src/main.rs
└── shared/              # Shared Drizzle schema + Zod types
```

### Build & Run
- **Frontend dev + proxy**: `npm run dev` (port 5000) — "Start application" workflow
- **Rust API**: `cd rust_server && cargo run` (port 3001) — "Rust API Server" workflow
- **Production build**: `npm run build` → `dist/`

## Blog
- **Public routes**: `/blog` (listing) · `/blog/:slug` (post detail)
- **Admin**: `/admin` → section Blog — créer, éditer, publier/dépublier, supprimer
- **API**: `GET /api/blog`, `GET /api/blog/:slug`, `POST|PUT|DELETE /api/admin/blog/*`
- **Seed**: 2 articles publiés + 1 brouillon

## Ressources Gratuites
- **Public route**: `/ressources` — grille de fichiers téléchargeables avec filtres
- **Admin**: `/admin` → section Ressources — ajouter, supprimer
- **API**: `GET /api/files`, `POST /api/files/:id/download`, `POST|DELETE /api/admin/files/*`
- **Seed**: 4 fichiers (xlsx, pbix, pdf, xlsm)

## Analytics
- Chaque page trace ses visites via `POST /api/track { event_type, path }`
- Dashboard admin : `GET /api/admin/stats` — vues totales, vues blog, téléchargements, médias

## Admin Dashboard (Mini CMS)
- **Route**: `/admin` — dashboard complet protégé par mot de passe
- **Password**: `nexalion2024` (ou variable `ADMIN_PASSWORD` côté Rust)
- **Architecture** : `admin.tsx` (shell ~150 lignes) + 6 fichiers dans `client/src/pages/admin/` :
  - `shared.tsx` — `StatCard`, `AdminSkeleton`, `API` helper
  - `dashboard.tsx` — statistiques globales
  - `blog.tsx` — CRUD articles
  - `files.tsx` — ressources téléchargeables
  - `projects.tsx` — CRUD projets
  - `media.tsx` — upload médias
  - `infos.tsx` — coordonnées + textes hero + services
- **Sections**:
  1. **Tableau de bord** — statistiques globales (visites, blog, téléchargements, projets)
  2. **Blog** — CRUD articles (créer, éditer, publier/dépublier, supprimer)
  3. **Ressources** — ajouter/supprimer fichiers téléchargeables
  4. **Projets** — CRUD complet projets (titre, description, catégorie, problème, solution, résultat, technologies, liens démo/téléchargement)
  5. **Médias** — upload photos/vidéos par projet
  6. **Informations** — édition coordonnées + textes hero + services (3 cartes éditables)

## Site Content API
- `GET /api/site-content` — textes dynamiques (hero_description, hero_highlights, about_quote)
- `PUT /api/admin/site-content` — mise à jour des textes (auth requise)
- `PUT /api/admin/contact` — mise à jour des coordonnées (auth requise)
- `PUT /api/admin/services` — mise à jour des 3 cartes services (auth requise) *(nouveau)*
- Données stockées en mémoire dans le state Rust (`AppState`)

## Deployment
- **Target**: VM (deux processus — Rust API + Node.js)
- **Build**: `npm run build && cd rust_server && cargo build --release`
- **Run**: `cd rust_server && ./target/release/portfolio-api & node ./dist/index.cjs`

## Workflows
- **Start application**: `npm run dev` — Express + Vite on port 5000
- **Rust API Server**: `cd rust_server && cargo run` — Axum on port 3001
