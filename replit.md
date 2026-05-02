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
- Typography: Inter (body/UI) + Space Grotesk (headings/display)
- Color palette: Nexalion deep royal blue (`hsl(216, 90%, 40%)`) + pure white
- Subtle grid background pattern
- Premium aesthetic: Linear/Stripe-level polish
- Theme support: Light/dark mode (localStorage key: `portfolio-theme`)

### Backend Architecture — Rust (Axum)
- **Runtime**: Rust with Axum web framework on port **3001**
- **All API endpoints** are served by the Rust server
- **Express/Node.js** runs on port 5000 (Vite dev server middleware + proxy to Rust for `/api/*`)

**API Endpoints** (served by Rust):
- `GET /api/projects` — All portfolio projects
- `GET /api/projects/:id` — Single project
- `GET /api/services` — Available services
- `GET /api/skills` — Skill categories
- `GET /api/contact` — Contact information

**Rust Server Location**: `rust_server/` (Cargo.toml + src/main.rs using Axum + Tokio + Serde)

### Data Storage
- **Current**: Static in-memory data in Rust server (`rust_server/src/main.rs`)
- **ORM**: Drizzle ORM configured for PostgreSQL (available via `DATABASE_URL`)
- **Schema**: `shared/schema.ts`

### Project Structure
```
├── client/              # React frontend
│   └── src/
│       ├── components/  # Navigation, Hero, Projects, About, Contact, Footer
│       ├── pages/       # home.tsx, projects.tsx, about.tsx, contact.tsx
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

## Admin Dashboard
- **Route**: `/admin` — dashboard complet protégé par mot de passe
- **Password**: `nexalion2024` (ou variable `ADMIN_PASSWORD` côté Rust)
- **Sections**: Tableau de bord, Blog, Ressources, Médias (upload photos/vidéos par projet)
- **Media upload**: `POST /api/admin/projects/:id/upload` (multipart) · stockage `rust_server/uploads/`

## Workflows
- **Start application**: `npm run dev` — Express + Vite on port 5000
- **Rust API Server**: `cd rust_server && cargo run` — Axum on port 3001
