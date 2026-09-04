# Go Fiber v3 Conventions

## Backend Stack
- **Language**: Go (Golang) 1.23+
- **Framework**: Fiber v3
- **ORM**: GORM
- **Database**: PostgreSQL / SQLite (pure Go glebarez/sqlite)
- **Auth**: JWT (golang-jwt/v5) + Argon2id

---

## File Naming Conventions (Strict Golang Rule)
- **Lowercase & snake_case for ALL Golang Files:** Specifically for all Golang source files (`.go`), file names **MUST** use **`lowercase`** and **`snake_case`** format (e.g., `user_handler.go`, `user_repository.go`, `user_service.go`, `auto_migrate.go`, `read_env.go`, `auth.go`, `main.go`).
- **NO PascalCase / camelCase / kebab-case:** NEVER use PascalCase (e.g., `UserHandler.go`), camelCase (e.g., `userHandler.go`), or kebab-case (e.g., `user-handler.go`) for Go file names.
- **Directories:** Use lowercase for all directories (e.g., `cmd/`, `internal/handlers/`, `internal/models/`, `internal/repositories/`, `internal/services/`, `internal/middlewares/`, `internal/routes/`, `internal/pkg/`, `internal/scripts/`).
- **Code Symbols:** Go code symbols follow idiomatic Go conventions (PascalCase for exported/public identifiers, camelCase for unexported/private identifiers).

---

## Architecture Layers & Strict Responsibilities

- **`internal/models/` (Table Definitions):**
  - Dedicated to GORM struct model definitions representing database tables, along with JSON and GORM tags.
  - Naming: `snake_case.go` (e.g., `user.go`), struct `PascalCase` (`type User struct`).

- **`internal/repositories/` (Direct Database Access):**
  - **ALL** direct interactions with the database (`*gorm.DB`) **MUST** reside exclusively in this layer. Strictly avoid invoking database queries directly from services or handlers.
  - Naming: `[domain]_repository.go` (e.g., `user_repository.go`).
  - Interface: `[Domain]Repository`, struct: `[domain]Repository{ db *gorm.DB }`, constructor: `New[Domain]Repository(db *gorm.DB)`.

- **`internal/services/` (Business Logic Layer):**
  - Contains all business logic, validation rules, domain logic, password hashing (Argon2), JWT token generation, and orchestration between repositories.
  - Naming: `[domain]_service.go` (e.g., `user_service.go`).
  - Interface: `[Domain]Service`, struct: `[domain]Service{ repo ... }`, constructor: `New[Domain]Service(...)`.

- **`internal/handlers/` (REST API HTTP Handlers):**
  - Fiber v3 HTTP handler functions. Responsible for parsing request payloads (`c.Bind().Body(&req)`), setting HTTP status codes, and formatting JSON responses.
  - Prohibited from containing direct database queries or heavy business logic.
  - Naming: `[domain]_handler.go` (e.g., `user_handler.go`).
  - Struct: `[Domain]Handler{ svc ... }`, constructor: `New[Domain]Handler(...)`, receiver method: `func (h *[Domain]Handler) Action(c fiber.Ctx) error`.

- **`internal/routes/` (Route Registration & Wiring):**
  - Registers handler functions into accessible HTTP routes (`app.Group`, `api.Post`, `api.Get`).
  - Applies route middlewares and wires dependencies (`db` -> `repo` -> `service` -> `handler`).
  - Naming: `routes.go`, function: `func SetupRoutes(app *fiber.App, cfg *config.Config, db *gorm.DB)`.

- **`internal/middlewares/` (HTTP Middlewares):**
  - Fiber middlewares (CORS, JWT auth guard, request logging, rate limiting).
  - Naming: `snake_case.go` (e.g., `auth.go`, `cors.go`), function: `PascalCase(...) fiber.Handler`.

- **`internal/pkg/` (Utility Functions):**
  - Reusable, domain-agnostic utility and helper functions (e.g., `argon2.go`, `read_env.go`).

- **`internal/scripts/` (Standalone Scripts):**
  - Standalone utility scripts (e.g., `auto_migrate.go` for database schema migrations).

- **`cmd/main.go` (Entry Point):**
  - Application entry point: configuration loading, database connection initialization, Fiber app setup, and calling `routes.SetupRoutes`.

---

## Protected Files: Database & Config (DO NOT MODIFY)
> [!IMPORTANT]
> The files `internal/database/database.go` and `internal/config/config.go` **MUST NOT BE MODIFIED** unless new environment variables or database connection configurations are explicitly required. Database connections and configuration parsing are already configured securely and optimally.

---

## Struct-Based Pattern (MUST Use Structs, NOT Global Variables / Loose Functions)
- **Dependency Injection via Structs:** All repositories, services, and handlers **MUST** be implemented as methods on a **`struct`** with constructor functions `New...()`.
- **NEVER use global variables or package-level mutable state:** Do not store database instances (`*gorm.DB`), authentication state, or dependencies in global variables. All dependencies must be injected via struct fields during initialization in `routes.SetupRoutes`.
- **Method Receivers:**
  - Repositories: `func (r *userRepository) FindByID(id uint) (*models.User, error)`
  - Services: `func (s *userService) Register(req RegisterRequest) (*AuthResponse, error)`
  - Handlers: `func (h *UserHandler) Register(c fiber.Ctx) error`

---

## Layer Naming Conventions
| Layer | Folder Location | File Naming Convention | Struct / Interface Convention | Constructor / Function |
|---|---|---|---|---|
| **Models** | `internal/models/` | `snake_case.go` (`user.go`) | `PascalCase` (`type User struct`) | - |
| **Repositories** | `internal/repositories/` | `[domain]_repository.go` | Interface: `[Domain]Repository`<br>Struct: `[domain]Repository` | `New[Domain]Repository(db *gorm.DB)` |
| **Services** | `internal/services/` | `[domain]_service.go` | Interface: `[Domain]Service`<br>Struct: `[domain]Service` | `New[Domain]Service(repo ...)` |
| **Handlers** | `internal/handlers/` | `[domain]_handler.go` | Struct: `[Domain]Handler` | `New[Domain]Handler(svc ...)` |
| **Middlewares** | `internal/middlewares/` | `snake_case.go` (`auth.go`) | - | `PascalCase(...) fiber.Handler` |
| **Routes** | `internal/routes/` | `routes.go` | - | `SetupRoutes(app, cfg, db)` |
| **Utilities** | `internal/pkg/` | `snake_case.go` (`argon2.go`) | Helper structs if needed | `PascalCase` functions |
| **Scripts** | `internal/scripts/` | `snake_case.go` (`auto_migrate.go`) | - | `main()` |

---

## Standard JSON Response Shape
All handlers must return responses matching:
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
