package routes

import (
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/helmet"
	"github.com/gofiber/fiber/v3/middleware/limiter"
	"github.com/gofiber/fiber/v3/middleware/recover"
	"gorm.io/gorm"

	"go-fiber/internal/config"
	"go-fiber/internal/handlers"
	"go-fiber/internal/middlewares"
	"go-fiber/internal/repositories"
	"go-fiber/internal/services"
)

func SetupRoutes(app *fiber.App, cfg *config.Config, db *gorm.DB) {
	app.Use(recover.New())
	app.Use(helmet.New())
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

	// Rate limiter for authentication endpoints (anti-brute force)
	authLimiter := limiter.New(limiter.Config{
		Max:        10,
		Expiration: 1 * time.Minute,
		LimitReached: func(c fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"success": false,
				"message": "Too many requests, please try again after a minute",
				"data":    nil,
			})
		},
	})

	// Public Auth Endpoints
	auth := api.Group("/auth", authLimiter)
	auth.Post("/register", userHandler.Register)
	auth.Post("/login", userHandler.Login)
	auth.Post("/logout", userHandler.Logout)

	// Protected User Endpoints
	users := api.Group("/users", middlewares.Protected(cfg.JWTSecret))
	users.Get("/me", userHandler.GetProfile)

	// Admin Only Endpoints (Level 2)
	users.Get("/", middlewares.AdminOnly(), userHandler.GetAllUsers)
}
