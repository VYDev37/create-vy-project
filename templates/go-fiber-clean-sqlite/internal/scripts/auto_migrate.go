package main

import (
	"log"

	"go-fiber/internal/config"
	"go-fiber/internal/database"
	"go-fiber/internal/user"
)

func main() {
	cfg := config.LoadConfig()
	db := database.Connect(cfg)

	log.Println("Running database auto-migrations...")
	if err := db.AutoMigrate(
		&user.User{},
	); err != nil {
		log.Fatalf("Auto-migration failed: %v", err)
	}
	log.Println("Auto-migrations completed successfully!")
}
