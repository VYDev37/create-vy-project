package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/helmet"
	"github.com/gofiber/fiber/v3/middleware/recover"

	"go-fiber/internal/config"
	"go-fiber/internal/database"
	"go-fiber/internal/middlewares"
	"go-fiber/internal/user"
)

func main() {
	cfg := config.LoadConfig()
	db := database.Connect(cfg)

	app := fiber.New(fiber.Config{
		AppName:   cfg.AppName,
		BodyLimit: 4 * 1024 * 1024,
	})

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

	api := app.Group("/api/v1")

	// Domain / Feature Modules Initialization & Route Registration
	userRepo := user.NewUserRepository(db)
	userService := user.NewUserService(userRepo, cfg.JWTSecret, cfg.JWTTTL)
	userHandler := user.NewUserHandler(userService)
	user.RegisterRoutes(api, userHandler, cfg.JWTSecret)

	log.Printf("Starting %s on port %s...", cfg.AppName, cfg.AppPort)
	if err := app.Listen(":" + cfg.AppPort); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
