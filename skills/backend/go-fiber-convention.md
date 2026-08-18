# Go Fiber v3 Conventions

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
