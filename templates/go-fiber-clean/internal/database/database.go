package database

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"go-fiber/internal/config"
)

func Connect(cfg *config.Config) *gorm.DB {
	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	return db
}
