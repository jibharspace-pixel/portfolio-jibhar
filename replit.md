# Kroman Jibhar Samuel Portfolio

## Overview

A professional portfolio website for Kroman Jibhar Samuel, a Logistics & Data Analyst freelancer based in Côte d'Ivoire. The site showcases digital solutions, data analysis services, AI integrations, and web/mobile application development. Built as a bilingual-ready (French primary) single-page application with modern design principles inspired by Linear, Stripe, and Awwwards-featured portfolios.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Component Library**: shadcn/ui (Radix UI primitives with custom styling)
- **Build Tool**: Vite with React plugin

**Design System**:
- Typography: Inter (body/UI) + Space Grotesk (headings/display) from Google Fonts
- Theme support: Light/dark mode with system preference detection
- CSS architecture: CSS variables for colors, extensive use of Tailwind utility classes

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints under `/api/*` prefix
- **Development**: Vite dev server with HMR for frontend, tsx for backend hot reloading

**API Endpoints**:
- `GET /api/projects` - Retrieve all portfolio projects
- `GET /api/projects/:id` - Get specific project details
- `GET /api/services` - List available services
- `GET /api/skills` - Get skill categories
- `GET /api/contact` - Get contact information

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Current State**: In-memory storage implementation (`server/storage.ts`) with static data for projects, services, skills, and contact info
- **Database Ready**: Drizzle config points to PostgreSQL via `DATABASE_URL` environment variable

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/   # React components (sections, UI)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and query client
│   │   └── pages/        # Page components
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data storage layer
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared types and schemas
│   └── schema.ts     # Drizzle schemas and Zod types
└── migrations/       # Database migrations (Drizzle Kit)
```

### Build System
- **Development**: `npm run dev` - Runs tsx for server with Vite middleware
- **Production Build**: `npm run build` - Vite builds frontend, esbuild bundles server
- **Output**: `dist/` directory with `public/` (frontend) and `index.cjs` (server bundle)

## External Dependencies

### UI/Component Libraries
- **Radix UI**: Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-styled component collection built on Radix
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel/slider functionality
- **class-variance-authority**: Component variant management

### Data & Forms
- **TanStack React Query**: Server state management
- **React Hook Form**: Form handling
- **Zod**: Schema validation (integrated with Drizzle via drizzle-zod)

### Database
- **Drizzle ORM**: TypeScript-first ORM
- **PostgreSQL**: Target database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: PostgreSQL session store (available for future auth)

### Development Tools
- **Vite**: Frontend build tool with HMR
- **tsx**: TypeScript execution for Node.js
- **Drizzle Kit**: Database migration tooling (`npm run db:push`)

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator