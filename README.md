# SaaS Project Management & Collaboration Platform

A multi-tenant SaaS project management and collaboration platform inspired by products like Jira, Linear, and Slack.

The platform provides organizations with project management, task tracking, team collaboration, real-time updates, notifications, search, analytics, caching, and AI-assisted workflows.

---

## 🚀 Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Protected API routes
- Token expiration and validation
- Organization-level membership
- Role-based access control
- Organization roles:
  - Owner
  - Admin
  - Member
- Tenant-isolated data access

### Organizations

- Create organizations
- Add/remove organization members
- Update member roles
- Organization-level authorization
- Owner/Admin permission management

### Projects

- Create, update, retrieve and delete projects
- Organization-scoped projects
- Automatic default task statuses
- Project-level access control

Default statuses:

- TODO
- IN PROGRESS
- DONE

### Task Management

- Create, update, retrieve and delete tasks
- Task descriptions
- Task assignment
- Task status management
- Project-specific task statuses
- Task search
- Status filtering
- Assignee filtering
- Pagination
- Task-level audit logging
- Assignment notifications

### Task Statuses

- Create custom statuses
- Update status names
- Reorder statuses using position
- Delete statuses
- Project-specific status workflows

### Comments

- Add comments to tasks
- Update comments
- Delete comments
- Creator-based comment permissions
- Comment activity logging

### Labels

- Create project labels
- Update labels
- Delete labels
- Attach labels to tasks
- Remove labels from tasks
- Project-level label uniqueness

### Attachments

- Attach file metadata to tasks
- File URL, name, size and MIME type support
- Creator-based deletion permissions

> Actual object storage such as AWS S3 can be integrated later. The current implementation intentionally keeps file storage independent from the core application.

### Notifications

- User-specific notifications
- Task assignment notifications
- Mark notification as read
- Mark all notifications as read
- Delete notifications
- User-scoped notification retrieval

### Audit Logs

Track important application actions including:

- Project creation/update
- Task creation
- Task assignment
- Task status changes
- Comment creation/update/deletion
- Label creation/update
- Label attachment/removal
- Status creation/update

### Global Search

Organization-scoped global search across:

- Projects
- Tasks
- Comments

Example:

```http
GET /api/organizations/:organizationId/search?q=authentication
```

Search is tenant-aware and prevents cross-organization data access.

### Dashboard

Organization-level dashboard containing:

- Total projects
- Total tasks
- Completed tasks
- Assigned tasks
- Unassigned tasks
- Task distribution by status

### Real-Time Collaboration

Socket.IO is used for real-time project collaboration.

Supported events include:

- `task.created`
- `task.updated`
- `task.deleted`
- `task.status_changed`
- `task.assigned`
- `comment.created`
- `comment.updated`
- `comment.deleted`
- `notification.created`

Project users join project-specific rooms so updates are delivered only to relevant users.

### Redis Caching

Redis is used with a cache-aside strategy for frequently accessed or potentially large datasets.

Current cached resources:

- Projects
- Tasks
- Task statuses
- Audit logs
- Notifications
- Dashboard

Tenant-safe cache keys are used to prevent cross-organization data leakage.

Example:

```text
organization:{organizationId}:projects
organization:{organizationId}:project:{projectId}:tasks
organization:{organizationId}:project:{projectId}:statuses
organization:{organizationId}:project:{projectId}:logs
user:{userId}:notifications
organization:{organizationId}:dashboard
```

Cache invalidation is performed after relevant mutations.

### AI-Powered Workflows

The application integrates an LLM API to provide practical AI assistance.

#### AI Task Description Generator

Generates an implementation-ready task description containing:

- Overview
- Implementation requirements
- Acceptance criteria
- Relevant edge cases

```http
POST /api/ai/task-description
```

#### AI Task Breakdown

Converts a task into actionable subtasks.

```http
POST /api/ai/task-breakdown
```

#### AI Summarization

Summarizes project/task discussions and preserves important:

- Requirements
- Decisions
- Blockers
- Action items

```http
POST /api/ai/summarize
```

AI credentials are kept server-side and are never exposed to the frontend.

---

# 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │    React App     │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                    REST API + Socket.IO
                                  │
                         ┌────────▼─────────┐
                         │     Express      │
                         │     Backend      │
                         └───────┬─┬─┬─────┘
                                 │ │ │
                ┌────────────────┘ │ └─────────────────┐
                │                  │                   │
                ▼                  ▼                   ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │ PostgreSQL   │    │    Redis     │    │  RabbitMQ    │
        │              │    │   Caching    │    │   / Worker   │
        └──────────────┘    └──────────────┘    └──────────────┘
                                                        
                         ┌──────────────────┐
                         │    LLM API       │
                         │  AI Workflows    │
                         └──────────────────┘
```

> RabbitMQ integration and production deployment are part of the next implementation stage.

---

# 🛠️ Tech Stack

## Backend

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma 8 RC Contract API
- Zod
- JWT
- bcrypt
- Socket.IO
- Redis
- RabbitMQ
- OpenAI API

## Frontend

- React
- TypeScript
- Vite
- Redux / state management
- Socket.IO Client

## Infrastructure

- Docker
- GitHub Actions
- AWS

---

# 📁 Backend Structure

```text
src/
├── config/
├── errors/
├── middleware/
├── modules/
│   ├── auth/
│   ├── organizations/
│   ├── projects/
│   ├── tasks/
│   ├── comments/
│   ├── labels/
│   ├── attachments/
│   ├── task-statuses/
│   ├── audit-logs/
│   ├── notifications/
│   ├── search/
│   ├── dashboard/
│   └── ai/
│
├── prisma/
├── services/
├── socket/
├── types/
├── utils/
├── app.ts
└── server.ts
```

The backend follows a feature-based modular architecture with separation between:

- Routes
- Controllers
- Services
- Validation
- Middleware
- Shared infrastructure

---

# 🗄️ Database

PostgreSQL is used as the primary relational database.

Core entities include:

```text
User
Organization
OrganizationMember
Project
Task
TaskStatus
Comment
Label
TaskLabel
Attachment
AuditLog
Notification
```

### Multi-Tenant Design

Organizations act as tenants.

Most organization-owned resources are linked through:

```text
Organization
    ↓
Project
    ↓
Task
```

Authorization middleware verifies organization membership before organization-scoped operations.

Database queries additionally apply organization/project ownership constraints to maintain tenant isolation.

---

# 🔐 Security

The application implements:

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based authorization
- Organization membership validation
- Tenant-aware database queries
- Secure environment configuration
- Input validation using Zod
- Consistent error handling
- User-scoped notifications
- Server-side AI API credentials

Sensitive credentials are stored in environment variables and excluded from source control.

---

# ⚡ Redis Strategy

The application follows a cache-aside strategy:

```text
Request
   ↓
Check Redis
   ↓
Cache Hit ─────────────→ Return cached data
   │
   │ Cache Miss
   ↓
PostgreSQL
   ↓
Store in Redis
   ↓
Return data
```

Cache invalidation occurs after successful mutations.

The project intentionally avoids unnecessary caching for small or highly dynamic datasets such as comments and labels.

---

# 🔄 Real-Time Architecture

REST APIs are responsible for:

- Creating data
- Updating data
- Deleting data
- Fetching initial state

Socket.IO is responsible for:

- Broadcasting live changes
- Updating connected clients
- Delivering real-time notifications

Example:

```text
User A assigns Task
       ↓
Post