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
- **Port conflicts**: Frontend (5173) and Backend (5000) - check for conflicts if startup fails
- **Environment loading**: Backend loads `.env` via dotenv, frontend uses Vite's built-in env support
- **Hot reload**: Both servers support hot reload but database schema changes require backend restart

## Architecture & Data Flow

### Backend Structure
- **Entry point**: `backend/src/app.js` (NOT server.js which is legacy Google OAuth setup)
- **API routes**: `/api/*` endpoints in `src/routes/` (auth, students, lecturers, courses, users)
- **Controllers**: Business logic in `src/controllers/` with pattern `<resource>_controller.js`
- **Models**: Sequelize ORM in `src/models/` with auto-associations in `index.js`
- **Auth**: Dual system - JWT for API + Supabase Auth (middleware: `src/middleware/auth.js`)
- **Database**: PostgreSQL via Sequelize + Supabase integration
- **Rate limiting**: Express rate limiters in `src/middleware/rate_limit.js` with different tiers
- **Security**: Helmet.js for headers, CORS configured for frontend origin only

### Frontend Structure
- **Entry**: `frontend/src/main.js` → initializes auth store → mounts App.vue
- **Auth store**: `src/store/auth.js` - reactive store with 3-hour token expiry, auto-logout, localStorage persistence
- **Router**: `src/router/index.js` - **FULLY IMPLEMENTED** with nested routes, auth guards, role-based access control
- **API client**: `src/services/api.js` - axios interceptors for auth tokens + rate limiting + error handling
- **UI**: Tailwind CSS + Flowbite + custom glassmorphism components in `components/ui/`
- **Pages**: Role-based organization (`pages/student/`, `pages/lecturer/`) with nested layouts
- **Composables**: Reusable logic in `src/composables/` (useForm, useStudentProfile, useLecturerProfile)
- **Assets**: Static resources in `src/assets/` (logos, images) with Vite optimization

### Key Integration Points
- **Auth flow**: Supabase Auth → JWT tokens (3-hour expiry) → localStorage → reactive auth store with auto-logout
- **API communication**: Frontend auth store provides tokens for `api.js` service calls with automatic token refresh
- **Database**: Sequelize models auto-sync in development (BE CAREFUL in production)
- **Route protection**: Auth guards in router with role-based redirects (`student`/`lecturer`/`authenticated`)
- **Error handling**: API interceptors handle 401 (auto-logout), 429 (rate limiting), with user feedback

## Project-Specific Patterns

### Authentication Architecture
- **Dual auth system**: Supabase for OAuth providers + custom JWT for role-based access
- **Token expiry**: 3-hour JWT tokens with auto-logout on expiry + visibility change detection
- **Role management**: Stored in localStorage and JWT payload (`student`/`lecturer`/`authenticated`)
- **Session persistence**: Uses both Supabase session + custom token storage with refresh tokens
- **OAuth defaults**: Google OAuth users default to `student` role unless specified

### UI Component System
- **Base components**: `components/ui/` - glassmorphism design system (BaseButton, BaseCard, Modal, LoadingSpinner)
- **Form components**: `components/form/` - BaseInput, BaseSelect, BaseTextarea with validation states
- **Glassmorphism variants**: Custom CSS with backdrop-filter, multiple button variants (glass, glass-primary, gradient)
- **Performance-optimized glassmorphism**: `src/assets/performance-glassmorphism.css` provides optimized utility classes for cross-browser compatible glass effects with fallbacks
- **Tailwind + Flowbite**: Hybrid approach using both libraries for comprehensive UI toolkit

### File Naming Conventions
- Controllers: `<resource>_controller.js` (e.g., `student_controller.js`)
- Models: Singular resource names (e.g., `student.js`, `lecturer.js`)
- Routes: Plural endpoints (`/api/students`, `/api/lecturers`)
- Frontend pages: PascalCase Vue components in role-based folders

### Database Patterns
- **Auto-sync warning**: `sequelize.sync({ force: process.env.NODE_ENV === 'development' })` - DESTRUCTIVE in dev mode
- **Models**: Centralized associations in `src/models/index.js`
- **Migrations**: Uses Sequelize CLI but no migration files present
- **Rate limiting**: Express rate limiters configured per route type (general, auth, lecturer, admin)

## Development Workflows & Debugging

### Common Development Tasks
1. **Adding new API endpoints**: Create route in `src/routes/`, controller in `src/controllers/`, update rate limiting
2. **Adding UI components**: Place in `components/ui/` for reusable elements, follow glassmorphism patterns
3. **Role-based features**: Use router meta `{ requiresAuth: true, role: 'lecturer' }` for protection
4. **Database changes**: Modify models in `src/models/`, restart backend for schema sync in development

### Authentication Debugging
- **Token issues**: Check browser localStorage for `token`, `role`, `tokenExpiry` values
- **Role problems**: Verify `authStore.role` matches expected value (`student`/`lecturer`/`authenticated`)
- **Route protection**: Console logs in router guard show auth state during navigation
- **Supabase connection**: Use `/api/test-supabase` endpoint to verify database connectivity

### Component Development Patterns
- **Glassmorphism buttons**: Use `variant="glass"`, `variant="glass-primary"`, or `variant="gradient"`
- **Form validation**: BaseInput components support `error` prop for validation states
- **Loading states**: BaseButton has built-in `loading` prop with spinner animation
- **Icon positioning**: All form components support `iconPosition="left|right"` with slot-based icons

### API Integration Patterns
- **Authentication headers**: Automatically handled by `apiClient` interceptors
- **Error handling**: 401 triggers auto-logout, 429 shows rate limit messages
- **Endpoint structure**: Follow `/api/{resource}` pattern with standard CRUD operations
- **Rate limiting tiers**: General (100/15min), Auth (50/15min), Lecturer (200/15min), Admin (500/15min)

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
- **Glassmorphism components**: Require proper CSS support for backdrop-filter (use fallbacks from `performance-glassmorphism.css`)

### Advanced Troubleshooting
- **Supabase Auth loops**: Check for redundant SIGNED_IN event handling in auth store
- **Route redirect loops**: Verify role-based redirects don't conflict with user's actual role
- **Backdrop-filter support**: Glassmorphism may not work on older browsers or without GPU acceleration
- **Token refresh timing**: 3-hour expiry with 5-minute check intervals - adjust if needed
- **Database force sync**: In development, tables recreated on restart - backup data if needed

### Performance Considerations
- **Asset optimization**: Vite handles automatic code splitting and asset optimization
- **Component lazy loading**: Router supports dynamic imports for code splitting
- **API rate limiting**: Different tiers prevent abuse while allowing legitimate usage
- **Glassmorphism performance**: Performance-optimized glass effects with the `.glass-performance`, `.glass-light`, `.glass-medium`, and `.glass-dark` utility classes from `performance-glassmorphism.css`
- **Responsive blur**: Blur values automatically reduce on mobile devices and when users prefer reduced motion
- **GPU acceleration**: `.glass-optimized` class with hardware acceleration and composite layer hints
- **Auth store reactivity**: Minimal localStorage checks to avoid performance overhead

### No CI/CD Pipeline
- No GitHub Actions or automated testing
- No ESLint, Prettier, or code quality tools configured
- Manual deployment and validation required

## Code Quality & Standards

### Vue 3 Composition API Patterns
- **Reactive stores**: Use `reactive()` for complex state objects like auth store
- **Component structure**: `<script setup>` with props, emits, computed, methods pattern
- **Slot usage**: Named slots for icons, help text, and flexible content areas
- **Composables**: Extract reusable logic to `src/composables/` with `use` prefix

### CSS Architecture
- **Utility-first**: Tailwind CSS classes for rapid development
- **Component styles**: Scoped `<style>` blocks for custom glassmorphism effects
- **Performance utilities**: `performance-glassmorphism.css` provides performance-optimized glass effects with mobile optimizations and fallbacks
- **Design tokens**: Consistent spacing, colors, and typography via Tailwind config
- **Responsive design**: Mobile-first approach with Tailwind breakpoints

### Backend API Design
- **RESTful endpoints**: Follow `/api/{resource}` convention with standard HTTP methods
- **Error responses**: Consistent JSON structure with `success`, `message`, `error` fields
- **Authentication middleware**: Applied per route with role-based access control
- **Input validation**: Validate required fields and data types in controllers

### Security Best Practices
- **CORS restriction**: Backend only accepts requests from configured frontend URL
- **Rate limiting**: Multiple tiers prevent abuse and DOS attacks
- **JWT expiry**: 3-hour tokens force regular re-authentication
- **Environment variables**: Sensitive data never committed to repository
- **Helmet.js**: Security headers configured for production readiness

## Trust These Instructions
These instructions are comprehensive and tested. Only search the codebase if:
1. Specific file contents are needed for implementation
2. Error messages reference unfamiliar code patterns
3. Instructions appear outdated or incomplete

The project uses standard patterns but has specific auth flow complexity and dual server setup that requires careful attention to the documented workflows.