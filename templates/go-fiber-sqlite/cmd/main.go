package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v3"

	"go-fiber/internal/config"
	"go-fiber/internal/database"
	"go-fiber/internal/routes"
)

func main() {
	cfg := config.LoadConfig()
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	app := fiber.New(fiber.Config{
		AppName: cfg.AppName,
	})

	routes.SetupRoutes(app, cfg, db)

	listenAddr := fmt.Sprintf(":%s", cfg.AppPort)
	log.Printf("Server starting on port %s...", cfg.AppPort)
	if err := app.Listen(listenAddr); err != nil {
		log.Fatalf("Server stopped unexpectedly: %v", err)
	}
}
