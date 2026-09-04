# GORM Patterns & Best Practices

## Connection & Migration
- Open connections using `gorm.Open(postgres.Open(dsn), &gorm.Config{})`.
- Perform `db.AutoMigrate(&models.User{}, ...)` on startup.

## Repositories
- Keep all database queries encapsulated inside `internal/repositories/`.
- Handle errors gracefully and propagate them to the service layer.
- Use explicit struct pointers and avoid raw untyped queries where possible.
