package database

import (
	"log"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"

	"go-fiber/internal/config"
)

func Connect(cfg *config.Config) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to SQLite database: %v", err)
	}

	return db
}
