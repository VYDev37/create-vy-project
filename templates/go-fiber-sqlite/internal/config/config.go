package config

import (
	"log"

	"github.com/joho/godotenv"

	"go-fiber/internal/pkg"
)

type Config struct {
	AppName     string
	AppPort     string
	DatabaseURL string
	JWTSecret   string
	FrontendURL string
	JWTTTL      uint
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("Note: .env file not found, loading configurations from environment")
	}

	return &Config{
		AppName:     pkg.ReadEnv("APP_NAME", "Golang SQLite Template"),
		AppPort:     pkg.ReadEnv("APP_PORT", "8080"),
		DatabaseURL: pkg.ReadEnv("DATABASE_URL", "sqlite.db"),
		JWTSecret:   pkg.ReadEnv("JWT_SECRET", "your-secret-key"),
		FrontendURL: pkg.ReadEnv("FRONTEND_URL", "http://localhost:3000"),
		JWTTTL:      pkg.ReadEnvUint("JWT_TTL", 60),
	}
}
