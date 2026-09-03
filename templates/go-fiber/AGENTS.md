# Agent Instructions & Guidelines

This project was scaffolded with `create-vy-project`.

## Active Stacks
- `go-fiber` (PostgreSQL)

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in `.agents/skills/`:

- **Go Fiber Architecture & Conventions:** Read `.agents/skills/backend/go-fiber-convention.md` for layer separation, Fiber v3 handlers, and response shapes.
- **GORM Patterns & Migrations:** Read `.agents/skills/backend/gorm-patterns.md` for models and database operations.
- **Authentication & Security:** Read `.agents/skills/backend/jwt-auth.md` and check `.agents/skills/007/` for secure JWT cookies, password hashing (Argon2), and route protection.
- **General & Anti-Slop:** Read `.agents/skills/general/stop-slop.md` for clean, human, humble writing without AI buzzwords or em-dashes.
- **Golang Best Practices:** Consult the specialized Go skills in `.agents/skills/` (`golang-code-style`, `golang-naming`, `golang-error-handling`, `golang-security`, `golang-database`).

---

## Core Directives & Standards

### 1. File & Naming Conventions (Strict Golang Rules)
- **All Golang Files in Lowercase & snake_case:** Khusus semua file Golang (`.go`), penamaan file **WAJIB** menggunakan huruf kecil (**`lowercase`**) dan **`snake_case`** (contoh: `user_handler.go`, `user_repository.go`, `user_service.go`, `auto_migrate.go`, `read_env.go`, `auth.go`, `main.go`).
- **NO PascalCase, camelCase, or kebab-case:** DILARANG KERAS menggunakan `PascalCase` (contoh: `UserHandler.go`), `camelCase` (contoh: `userHandler.go`), atau `kebab-case` (contoh: `user-handler.go`) untuk nama file Go apapun.
- **Directory Naming:** Semua direktori Go wajib menggunakan huruf kecil / lowercase (contoh: `cmd/`, `internal/handlers/`, `internal/models/`, `internal/repositories/`, `internal/services/`, `internal/middlewares/`).
- **Go Identifier Naming (Symbols):** Nama file memakai `snake_case`, namun simbol di dalam kode tetap mematuhi konvensi idiomatik Go:
  - `PascalCase` untuk exported/public structs, interfaces, methods, functions, constants (e.g., `UserHandler`, `NewUserRepository`, `User`).
  - `camelCase` untuk unexported/private variables, fields, helper functions (e.g., `userService`, `hashPassword`).

### 2. Architecture & Layering Rules
- **`cmd/main.go`:** Entry point aplikasi untuk inisialisasi konfigurasi, koneksi database, setup Fiber v3, dan mounting route handlers.
- **`internal/models/`:** Struct model GORM murni yang merepresentasikan tabel database dan tag JSON/GORM.
- **`internal/repositories/`:** Data access layer yang berinteraksi langsung dengan database via `*gorm.DB`.
- **`internal/services/`:** Layer business logic murni. Menerima repository dependency via interface.
- **`internal/handlers/`:** HTTP handlers Fiber v3. Bertanggung jawab atas parsing input (`c.Bind().Body()`), validasi, dan format HTTP response.
- **`internal/middlewares/`:** Middleware Fiber (CORS, JWT authentication, logging).
- **`internal/routes/`:** Konfigurasi routing dan dependency injection wiring.
- **`internal/scripts/auto_migrate.go`:** Script standalone migrasi skema tabel database.

### 3. Response Shape Standard
Semua HTTP handler harus selalu mengembalikan JSON response dengan format standar:
```json
{
  "success": true,
  "message": "Deskripsi sukses",
  "data": {}
}
```
Dan untuk response error:
```json
{
  "success": false,
  "message": "Deskripsi kesalahan",
  "data": null
}
```

### 4. UI/UX Craft & Anti-Slop Principles
- **No Em-Dashes (`—`):** Never use em-dashes in code comments, responses, or error messages.
- **No AI Buzzwords:** Keep documentation and error messages clear, concise, natural, and humble.
- **Proper Error Handling:** Always handle and wrap errors gracefully without panic in production code paths.
