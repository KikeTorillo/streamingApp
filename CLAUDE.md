# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Key Commands

### Development (Docker-based - Recommended)
```bash
npm run dev          # Start complete platform: backend + frontend + storybook + services
npm run stop         # Stop all services
npm run dev:restart  # Restart all services
npm run dev:logs     # View logs from all services
npm run status       # Show status of all services
```

### Local Development (without Docker)
```bash
npm run dev:local    # Run backend, frontend, and storybook locally
npm run dev:backend  # Start backend only (requires external DB)
npm run dev:frontend # Start frontend only  
npm run dev:storybook # Start storybook only
```

### Build & Production
```bash
npm run build        # Build frontend for production
npm run prod         # Start production environment
npm run prod:up      # Start production environment
npm run prod:logs    # View production logs
```

### Code Quality
```bash
npm run lint         # Run ESLint on both backend and frontend
npm run lint:fix     # Auto-fix linting issues
npm run test         # Run frontend tests with Vitest
npm run test:storybook # Run Storybook tests
```

### Individual Services
```bash
npm run up:backend   # Start backend + database + storage
npm run up:frontend  # Start frontend only
npm run up:database  # Start PostgreSQL + pgAdmin
npm run up:storage   # Start MinIO storage
npm run up:cdn       # Start CDN and transcoding services
```

### Utilities & Debugging
```bash
npm run env:copy     # Copy example.env to .env
npm run env:validate # Validate environment variables
npm run health       # Check health of all services
npm run ports        # Show which ports are in use
npm run clean        # Clean Docker containers and volumes
npm run monitor      # Monitor Docker stats
```

### Shell Access
```bash
npm run shell:backend  # Access backend container shell
npm run shell:frontend # Access frontend container shell
npm run shell:db      # Access PostgreSQL CLI
```

## Architecture Overview

This is a **monorepo streaming platform** with the following structure:

### Core Components
- **Backend**: Node.js/Express API (`backend/app/`)
- **Frontend**: React/Vite SPA (`frontend/app/`)
- **Storybook**: Component library for UI development
- **Database**: PostgreSQL with pgAdmin
- **Storage**: MinIO S3-compatible storage
- **CDN**: Custom NGINX-based content distribution

### Key Services and Ports
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Storybook: http://localhost:6006
- pgAdmin: http://localhost:5050
- MinIO Console: http://localhost:9001
- CDN: http://localhost:8082

## Code Architecture

### Backend (`backend/app/`)
- **MVC Pattern**: Routes → Services → Models
- **Authentication**: JWT with Passport.js strategies
- **Database**: PostgreSQL with connection pooling
- **File Processing**: FFmpeg for video transcoding
- **Storage**: MinIO for media files
- **API Routes**: RESTful endpoints for movies, series, episodes, users, categories

### Frontend (`frontend/app/`)
- **Architecture**: Atomic Design pattern
  - `atoms/`: Basic components (Avatar, Badge, Button, Card, Checkbox, Container, Input, Select, etc.)
  - `molecules/`: Component combinations (ActionsDropdown, ContentCard, DynamicForm, FilterBar, StatsCard, etc.)
  - `organisms/`: Complex sections (AdminSidebar, AppHeader, DataTable, LoginCard, TMDBSearchView)
  - `templates/`: Page layouts (AdminLayout, PageLayout)
- **State Management**: React Context API (CategoriesContext, MoviesContext, ThemeContext, UserContext)
- **Routing**: React Router v7
- **Styling**: CSS modules with design system variables
- **Services**: Axios-based API clients organized by domain (Auth, Categories, Episodes, Movies, Series, Users)
- **Video Player**: Video.js with HLS support and quality selector
- **Testing**: Vitest with Playwright for browser testing
- **Development**: Vite with path aliases (@, @components, @services, @assets)

### Design System Rules
- Use **named exports only**: `export { ComponentName }`
- Use CSS variables: `var(--color-primary)`, `var(--space-md)`
- Storybook stories required for all components
- Component structure: `ComponentName/ComponentName.jsx`, `ComponentName.css`, `ComponentName.stories.jsx`

## Development Workflow

1. **Setup**: Run `npm run dev` to start all services
2. **Frontend Development**: Components auto-reload on save
3. **Backend Development**: API auto-reloads with nodemon
4. **Storybook**: Component development and testing
5. **Database**: Access via pgAdmin or `npm run shell:db`

## Testing

### Frontend Testing Architecture
- **Unit Tests**: Vitest for component testing
- **Browser Tests**: Playwright for end-to-end testing
- **Storybook Tests**: Visual and interaction testing via Storybook addon
- **Test Structure**: 
  - Component tests: `ComponentName.test.jsx` next to components
  - Global tests: `frontend/app/src/__tests__/`
  - Vitest workspace configuration for multiple test environments

### Test Commands
- `npm run test` - Run all frontend tests
- `npm run test:frontend` - Run frontend tests specifically  
- `npm run test:storybook` - Run Storybook tests

### Test Configuration
- **Vitest Workspace**: Configured for both component and Storybook testing
- **Browser Provider**: Playwright with Chromium
- **Coverage**: Available via Vitest coverage reporter

## Environment Configuration

### Required Setup
1. Copy `example.env` to `.env`: `npm run env:copy`
2. Configure required variables in `.env`:
   - `VITE_TMDB_API_KEY`: Required for movie/series data (get from themoviedb.org)
   - `JWT_SECRET`: Recommended to change for security
   - `EMAIL` & `PASS_EMAIL`: Optional for notifications

### Environment Files
- **Development**: Uses `docker-compose.dev.yml`
- **Production**: Uses `docker-compose.yml` 
- **Variables**: All services configured via environment variables
- **Validation**: Use `npm run env:validate` to check configuration

## Key Files

### Root Level
- `package.json`: Centralized npm scripts for monorepo management (100+ scripts organized by category)
- `docker-compose.yml`: Production service orchestration
- `docker-compose.dev.yml`: Development service orchestration  
- `example.env`: Template for environment variables with instructions
- `clean.js`: Docker cleanup utility script

### Frontend (`frontend/app/`)
- `vite.config.js`: Vite configuration with path aliases and build optimization
- `vitest.workspace.js`: Test workspace configuration for Vitest + Storybook
- `eslint.config.js`: ESLint configuration with React, Storybook plugins
- `package.json`: Frontend-specific dependencies and scripts

### Backend (`backend/app/`)
- `index.js`: Backend entry point with Express server
- `package.json`: Backend dependencies (Express, PostgreSQL, MinIO, FFmpeg, etc.)
- `routes/`: API endpoints organized by domain (auth, movies, series, episodes, categories, users)
- `services/`: Business logic layer
- `utils/`: Video processing, image handling, authentication utilities

### Infrastructure (`servers/`)
- `postgresQl/init.sql`: Database schema and initial data
- `minio/init-minio.sh`: S3 storage initialization
- `cdn/nginx.conf.template`: CDN configuration
- `transcoderServers/`: Video transcoding service configurations

## Common Tasks

### Frontend Development
- **Add new component**: Create in appropriate atomic design folder with .jsx, .css, and .stories.jsx files
- **Component structure**: Follow atomic design - atoms → molecules → organisms → templates
- **CSS**: Use CSS modules with design system variables (var(--color-primary), var(--space-md))
- **Stories**: Required for all components with appropriate coverage (6 for atoms, 5+ for molecules)
- **Testing**: Add component tests alongside each component

### Backend Development  
- **Add new API endpoint**: Create route in `backend/app/routes/`, service in `services/`, and schema in `schemas/`
- **Database changes**: Modify `servers/postgresQl/init.sql` and rebuild containers
- **Authentication**: JWT-based with Passport.js strategies (local, JWT)
- **File uploads**: Use Multer with MinIO storage integration
- **Video processing**: Utilities in `backend/app/utils/` for FFmpeg transcoding and quality management

### Development Workflow
- **Start development**: `npm run dev` (starts all services)
- **Check logs**: `npm run dev:logs` or service-specific logs
- **Debug issues**: `npm run health`, `npm run ports`, `npm run status`
- **Code quality**: `npm run lint` and `npm run lint:fix` before commits
- **Testing**: `npm run test` for frontend, `npm run test:storybook` for components