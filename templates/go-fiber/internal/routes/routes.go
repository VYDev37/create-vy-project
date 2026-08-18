package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"

	"go-fiber/internal/config"
	"go-fiber/internal/handlers"
	"go-fiber/internal/middlewares"
	"go-fiber/internal/repositories"
	"go-fiber/internal/services"
)

func SetupRoutes(app *fiber.App, cfg *config.Config, db *gorm.DB) {
	app.Use(middlewares.NewCORS(cfg))

	app.Get("/health", func(c fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "Service is healthy and running",
			"data": fiber.Map{
				"status": "up",
			},
		})
	})

	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo, cfg.JWTSecret, cfg.JWTTTL)
	userHandler := handlers.NewUserHandler(userService)

	api := app.Group("/api/v1")

	auth := api.Group("/auth")
	auth.Post("/register", userHandler.Register)
	auth.Post("/login", userHandler.Login)
	auth.Post("/logout", userHandler.Logout)

	users := api.Group("/users", middlewares.Protected(cfg.JWTSecret))
	users.Get("/me", userHandler.GetProfile)
	users.Get("/", userHandler.GetAllUsers)
}
