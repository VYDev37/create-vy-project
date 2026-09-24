# Agent Instructions & Guidelines

This project was scaffolded with `create-vy-project`.

## Active Stacks
- `go-fiber` (Clean Architecture + SQLite)

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in `.agents/skills/`:

- **General & Anti-Slop:** Read `.agents/skills/general/stop-slop.md` for clean, human, humble writing without AI buzzwords or em-dashes.
- **Go Fiber Architecture & Conventions:** Read `.agents/skills/backend/go-fiber-convention.md` for clean domain separation, Fiber v3 handlers, and response shapes.
- **GORM Database Patterns:** Read `.agents/skills/backend/gorm-patterns.md` for database models, migrations, and repositories.
- **JWT Authentication:** Read `.agents/skills/backend/jwt-auth.md` for cookie-based authentication, token validation, and password hashing.
- **Golang Best Practices:** Consult the specialized Go skills in `.agents/skills/` (`golang-code-style`, `golang-naming`, `golang-error-handling`, `golang-security`, `golang-database`).

---

## Core Directives & Standards

### 1. File & Component Naming Conventions
- **Golang Files (Strict Lowercase & snake_case):** Specifically for all Golang source files (`.go`), file names **MUST** use **`lowercase`** and **`snake_case`** format (e.g., `models.go`, `dto.go`, `repository.go`, `service.go`, `handler.go`, `routes.go`, `auto_migrate.go`, `read_env.go`, `auth.go`, `main.go`). NEVER use PascalCase (e.g., `UserHandler.go`), camelCase (e.g., `userHandler.go`), or kebab-case for any Go file names. All Go directories MUST also use lowercase (`cmd/`, `internal/user/`, `internal/middlewares/`, etc.).

### 2. Clean Architecture & Domain Responsibilities
This backend stack follows **Clean / Feature-Driven Architecture** with pure Go SQLite (`glebarez/sqlite`). Each domain/feature module encapsulates its complete lifecycle in `internal/<domain>/`:

```
internal/
├── user/
│   ├── models.go       # GORM table definitions & struct tags
│   ├── dto.go          # Request & Response DTOs, ApiResponse[T]
│   ├── repository.go   # Direct DB access layer (*gorm.DB)
│   ├── service.go      # Business logic, Argon2 hashing, JWT generation
│   ├── handler.go      # Fiber v3 HTTP handlers (c.Bind().Body, status codes)
│   └── routes.go       # RegisterRoutes(router, handler, jwtSecret)
├── config/             # Environment configuration (config.go)
├── database/           # GORM SQLite connection (database.go)
├── middlewares/        # HTTP middlewares (auth.go, role.go, cors.go)
├── pkg/                # Utility helpers (argon2.go, jwt.go, read_env.go)
└── scripts/            # Database auto-migrations (auto_migrate.go)
```

- **`internal/<domain>/` (Domain Module):**
  - **`models.go`**: Struct model definitions representing database tables.
  - **`dto.go`**: Request payloads (`*Request`) and sanitized response structs (`*Response`). Never expose sensitive fields (like password hash) in response DTOs.
  - **`repository.go`**: All direct database operations (`*gorm.DB`) live here. Interface `[Domain]Repository`, struct `[domain]Repository`, constructor `New[Domain]Repository(db *gorm.DB)`.
  - **`service.go`**: Business logic, domain validations, JWT token generation. Interface `[Domain]Service`, struct `[domain]Service`, constructor `New[Domain]Service(...)`.
  - **`handler.go`**: HTTP presentation layer parsing Fiber context. Struct `[Domain]Handler`, constructor `New[Domain]Handler(svc ...)`.
  - **`routes.go`**: Route mapping `RegisterRoutes(router fiber.Router, handler *[Domain]Handler, jwtSecret string)`.

- **`internal/middlewares/` (HTTP Middlewares):**
  - JWT auth guard `Protected()`, Role-Based Access Control `RequireRole()`, `AdminOnly()`, CORS.

### 3. Protected Files: Database & Config (DO NOT MODIFY)
> [!IMPORTANT]
> The files `internal/database/database.go` and `internal/config/config.go` **MUST NOT BE MODIFIED** unless new environment variables or database connection configurations need to be explicitly added or changed.

### 4. Struct-Based Pattern (MUST Use Structs, NOT Global Variables / Loose Functions)
- **Dependency Injection via Structs:** All repositories, services, and handlers **MUST** be implemented as methods on a **`struct`** with constructor functions `New...()`.
- **NEVER use global variables or package-level mutable state:** All dependencies must be injected via struct fields during initialization in `cmd/main.go`.

### 5. Standard JSON Response Shape
All HTTP handlers must return responses matching the standard format:
```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```
In error cases:
```json
{
  "success": false,
  "message": "Error details",
  "data": null
}
```

### 6. Database Indexing Strategy (When to Index vs When NOT to Index)
- **When to Index (High Value):**
  - **Foreign keys & JOIN columns:** Always index references (`user_id`, `tenant_id`, `order_id`) to avoid full table scans during joins (`gorm:"index"`).
  - **High-cardinality lookup filters:** Unique columns frequently filtered in `WHERE` clauses (`email`, `username`, `slug`, `api_key`).
  - **Sorting & Range Queries:** Frequently sorted timestamps in pagination (`created_at DESC`, `deleted_at`).
  - **Composite Indexes:** Multiple columns queried together following the leftmost prefix rule.
- **When NOT to Index (Avoid Bloat & Slow Writes):**
  - **Low-cardinality boolean flags alone:** Standalone `is_active` or `is_verified` where full table scan is faster.
  - **Small / Static Tables:** Tables with < 500 rows.
  - **High-Throughput Counter Columns:** Rapidly mutated columns (`view_count`, `last_active_at`) where B-tree index rebalancing degrades write throughput.
  - **Unbounded Text/JSON:** Avoid indexing raw long text without prefix or GIN/GiST.

### 7. Security & Error Leakage Prevention
- **Zero Internal Error Leakage:** API handlers MUST NEVER expose raw database error messages, SQL syntax strings, internal file paths, or stack traces in HTTP JSON responses.
- **Server-Side Logging:** Log raw errors exclusively to the server console or structured logger (`log.Printf("[ERROR] ...: %v", err)`).
- **Sanitized Client Responses:** Return clear, sanitized, user-friendly messages to the frontend (e.g., `"Invalid username or password"`, `"User not found"`, `"Invalid request payload"`).
- **Request Validation:** Initialize `validator.New()` inside domain handlers (e.g., `NewUserHandler`) and validate incoming request DTOs.

### 8. UI/UX Craft & Anti-Slop Principles
- **No Em-Dashes (`—`):** Never use em-dashes in user-facing copy or labels.
- **No AI Buzzwords:** Keep copy simple, natural, and humble. Avoid words like "delve", "testament", "unleash", "elevate", "cutting-edge", "game-changer", "tapestry", "seamlessly", "enterprise-grade".
- **Single-Line Desktop Actions:** Navbar, primary CTA buttons, and header action rows must remain single-line without awkward wrapping.
- **Strict WCAG AA:** All text, badges, and form controls must maintain high contrast (minimum 4.5:1).

