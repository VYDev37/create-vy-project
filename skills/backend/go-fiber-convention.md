# Go Fiber v3 Conventions

## File Naming Conventions (Strict Golang Rule)
- **Lowercase & snake_case for ALL Golang Files:** Khusus file Golang (`.go`), semua nama file WAJIB menggunakan huruf kecil (**`lowercase`**) dan format **`snake_case`** (contoh: `user_handler.go`, `user_repository.go`, `user_service.go`, `auto_migrate.go`, `read_env.go`, `auth.go`, `main.go`).
- **DILARANG PascalCase / camelCase / kebab-case:** Jangan pernah menggunakan PascalCase (e.g., `UserHandler.go`), camelCase (e.g., `userHandler.go`), atau kebab-case (e.g., `user-handler.go`) untuk file Go.
- **Directories:** Gunakan lowercase untuk semua direktori (e.g., `cmd/`, `internal/handlers/`, `internal/models/`).
- **Code Symbols:** Simbol Go (struct, method, function, interface) tetap mematuhi aturan idiomatik Go (PascalCase untuk exported/publik, camelCase untuk unexported/private).

## Architecture Layers
- **`cmd/main.go`**: Entry point for loading configuration, connecting to the database, configuring Fiber v3, and mounting routes.
- **`internal/models/`**: Pure GORM struct models representing database tables.
- **`internal/repositories/`**: Data access layer executing database queries with `*gorm.DB`.
- **`internal/services/`**: Pure business logic layer. Receives repositories via interface.
- **`internal/handlers/`**: Fiber HTTP handlers receiving services via interface. Responsible for request binding (`c.Bind().Body()`), status codes, and formatting JSON responses.
- **`internal/middlewares/`**: Fiber middlewares (CORS, JWT auth, logging).
- **`internal/routes/`**: Dependency injection wiring and HTTP route definitions.

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
