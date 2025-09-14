# Copilot Instructions for Cognivus (ITTR Website Project)

## Project Overview
**Monorepo** with `backend/` (Node.js/Express) and `frontend/` (Vue 3 + Vite + Tailwind CSS + Flowbite). Educational management system for ITTR with student/lecturer authentication via Supabase + JWT, and PostgreSQL/Sequelize ORM.

## Environment Setup & Build Commands

### Prerequisites
- Node.js v22.18.0, npm v10.9.3
- PostgreSQL database
- Supabase account with configured auth providers

### Required Environment Variables
**Backend (.env in backend/):**
```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
SUPABASE_URL=your_supabase_url
SUPABASE_SUPER_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
PORT=5000
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=development
```

**Frontend (.env in frontend/):**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Development Workflow (PowerShell)
1. **Backend setup:**
   ```powershell
   cd "backend"; npm install; npm run dev
   ```
   - Runs on http://localhost:5000
   - Uses nodemon for auto-restart
   - Requires .env file with database credentials

2. **Frontend setup:**
   ```powershell
   cd "frontend"; npm install; npm run dev
   ```
   - Runs on http://localhost:5173
   - Vite dev server with hot reload
   - Build: `npm run build` (outputs to dist/)

### Critical Build Notes
- **PowerShell syntax**: Use `;` instead of `&&` for command chaining
- **Security vulnerabilities**: Both repos show npm audit warnings - run `npm audit fix` if needed
- **No test suite**: Backend has placeholder test, frontend has none
- **Database sync**: Backend auto-syncs DB in development mode via `syncDatabase()`

## Architecture & Data Flow

### Backend Structure
- **Entry point**: `backend/src/app.js` (NOT server.js which is legacy Google OAuth setup)
- **API routes**: `/api/*` endpoints in `src/routes/` (auth, students, lecturers, courses, users)
- **Controllers**: Business logic in `src/controllers/` with pattern `<resource>_controller.js`
- **Models**: Sequelize ORM in `src/models/` with auto-associations in `index.js`
- **Auth**: Dual system - JWT for API + Supabase Auth (middleware: `src/middleware/auth.js`)
- **Database**: PostgreSQL via Sequelize + Supabase integration

### Frontend Structure
- **Entry**: `frontend/src/main.js` → initializes auth store → mounts App.vue
- **Auth store**: `src/store/auth.js` - reactive store with token expiry, local storage persistence
- **Router**: `src/router/index.js` (currently empty - needs route definitions)
- **API client**: `src/services/api.js` for backend communication
- **UI**: Tailwind CSS + Flowbite components
- **Pages**: Role-based organization (`pages/student/`, `pages/lecturer/`)

### Key Integration Points
- **Auth flow**: Supabase Auth → JWT tokens → localStorage → reactive auth store
- **API communication**: Frontend auth store provides tokens for `api.js` service calls
- **Database**: Sequelize models auto-sync in development (BE CAREFUL in production)

## Project-Specific Patterns

### Authentication Architecture
- **Dual auth system**: Supabase for OAuth providers + custom JWT for role-based access
- **Token expiry**: 3-hour JWT tokens with auto-logout on expiry
- **Role management**: Stored in localStorage and JWT payload (`student`/`lecturer`)
- **Session persistence**: Uses both Supabase session + custom token storage

### File Naming Conventions
- Controllers: `<resource>_controller.js` (e.g., `student_controller.js`)
- Models: Singular resource names (e.g., `student.js`, `lecturer.js`)
- Routes: Plural endpoints (`/api/students`, `/api/lecturers`)
- Frontend pages: PascalCase Vue components

### Database Patterns
- **Auto-sync warning**: `sequelize.sync({ force: process.env.NODE_ENV === 'development' })` - DESTRUCTIVE in dev mode
- **Models**: Centralized associations in `src/models/index.js`
- **Migrations**: Uses Sequelize CLI but no migration files present

## Validation & Debugging

### Health Checks
- Backend: GET `/api/health` - basic server status
- Supabase: GET `/api/test-supabase` - tests database connectivity
- Frontend: Vite dev server shows compile errors in browser

### Common Issues
- **Environment variables**: Missing .env files cause silent failures
- **CORS**: Backend configured for specific frontend URL
- **Token expiry**: Auth store auto-clears expired tokens but may need manual refresh
- **Database sync**: Development mode recreates tables on each restart

### No CI/CD Pipeline
- No GitHub Actions or automated testing
- No ESLint, Prettier, or code quality tools configured
- Manual deployment and validation required

## Trust These Instructions
These instructions are comprehensive and tested. Only search the codebase if:
1. Specific file contents are needed for implementation
2. Error messages reference unfamiliar code patterns
3. Instructions appear outdated or incomplete

The project uses standard patterns but has specific auth flow complexity and dual server setup that requires careful attention to the documented workflows.
