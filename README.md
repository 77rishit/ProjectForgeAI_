# ProjectForge AI — Academic Project Lifecycle & Teammate Intelligence Platform

**ProjectForge AI** is an AI-powered project lifecycle management and collaboration platform engineered for university students, faculty mentors, and academic administrators.

---

## 🌟 Core Capabilities

### 1. Student Portal
- **AI Idea Discovery Bank**: Browse curated capstone and semester project proposals across AI/ML, Healthcare, ClimateTech, IoT, Cybersecurity, and Web3.
- **"Forge with AI" Studio**: Synthesize customized project proposals with problem statements, novelty factors, recommended tech stacks, and milestone roadmaps.
- **Multi-Factor Teammate Matchmaker**: Compatibility calculation balancing complementary skills (`+Skill`), shared foundational skills, department diversity, and availability hours.
- **Comprehensive Project Workspaces**:
  - Interactive **Kanban Task Board** (To Do, In Progress, In Review, Done) with priority indicators, assignees, and milestone tags.
  - **Milestone & Sprint Tracker**: Deliverables checklists, student submission notes, demo/PR links, and faculty rubric grade displays.
  - **AI Architecture & Specification Lab**: Synthesizes production system prompts, database schemas (DDL), agent topologies, and sprint roadmaps.
- **Student Analytics**: Task completion velocity, skill acquisition radar, and team health diagnostics.

### 2. Faculty Portal
- **Capstone Supervision Dashboard**: Monitor active student engineering teams and department projects.
- **Milestone Evaluation Queue**: Review student code submissions and demo links.
- **Standardized Rubric Grading Modal**:
  - 5 Dimensions (Innovation, Technical Execution, Documentation, Teamwork, Presentation - 1 to 5 stars).
  - **AI Grading Assistant**: Automatically generates objective rubric recommendations and constructive feedback.
  - Formal approval or revision request decisions.
- **At-Risk Alerts**: Proactive notifications for projects with low velocity or overdue milestones.

### 3. Administrator Portal
- **Institutional Health & Analytics**: Department project density, category distribution, technology stack adoption rates.
- **User Directory**: View enrolled students and faculty mentors.
- **AI Infrastructure Oversight**: Active AI provider status, model abstractions, and database connection telemetry.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Lucide Icons
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication, Bcrypt
- **AI Engine**: Modular AI Service Abstraction (`IAIService`):
  - `LocalEngineService`: Rule-and-heuristic engine generating realistic blueprints, match matrices, and rubric feedback offline/online.
  - `GeminiService` / `OpenAIService`: Pluggable via environment variables.

---

## 🚀 Quick Start

### 1. Environment Configuration
The application is pre-configured with a `.env` file:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/projectforge
JWT_SECRET=projectforge_super_secure_jwt_dev_secret_2026
JWT_EXPIRES_IN=7d
AI_PROVIDER=local
CLIENT_URL=http://localhost:5173
```

### 2. Seed Database
To populate demo users, realistic projects, tasks, milestones, and ideas:
```bash
npm run seed
```

### 3. Run Development Server
To launch both Express backend (port 5001) and Vite frontend (port 5173):
```bash
npm run dev
```
Or run separately:
- Backend: `npm run server`
- Frontend: `npm run client`

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Demo Switcher)

Use the **Demo Switcher** in the top navigation bar or log in with these credentials:

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Student (Lead)** | Aarav Sharma | `aarav@university.edu` | `password123` |
| **Faculty Mentor** | Dr. Elena Vance | `dr.elena@university.edu` | `password123` |
| **Administrator** | Prof. Marcus Reed | `admin.marcus@university.edu` | `password123` |

---

## 📡 REST API Endpoints

- **Auth**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/demo/:role` (student, faculty, admin)
  - `GET /api/auth/me`
- **Projects**:
  - `GET /api/projects` (filters: category, status, search)
  - `GET /api/projects/my`
  - `GET /api/projects/supervised`
  - `GET /api/projects/:id`
  - `POST /api/projects`
  - `PUT /api/projects/:id`
  - `POST /api/projects/:id/assess-health`
- **Tasks & Milestones**:
  - `GET /api/tasks/project/:projectId`
  - `POST /api/tasks`
  - `PUT /api/tasks/:id`
  - `GET /api/milestones/project/:projectId`
  - `POST /api/milestones/:id/submit`
  - `POST /api/milestones/:id/review` (Rubric evaluation)
  - `GET /api/milestones/:id/rubric-suggestion` (AI grading assist)
- **Team Matchmaker**:
  - `GET /api/team-matches/recommendations`
  - `POST /api/team-matches/request`
  - `GET /api/team-matches/my-requests`
  - `PATCH /api/team-matches/request/:id/respond`
- **Ideas & AI**:
  - `GET /api/ideas`
  - `POST /api/ideas/generate`
  - `POST /api/ideas/:id/adopt`
  - `POST /api/ai/synthesize-architecture`
- **Analytics**:
  - `GET /api/analytics/student`
  - `GET /api/analytics/faculty`
  - `GET /api/analytics/admin`
