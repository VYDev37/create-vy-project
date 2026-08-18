package main

import (
	"go-fiber/internal/config"
	"go-fiber/internal/database"
	"go-fiber/internal/models"
	"log"
)

func main() {
	cfg := config.LoadConfig()
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v.\n", err)
	}

	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Fatalf("Failed to push migration to database: %v.\n", err)
	}

	log.Println("Database automigration completed")
}
