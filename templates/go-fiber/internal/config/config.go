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
		AppName:     pkg.ReadEnv("APP_NAME", "Golang Template"),
		AppPort:     pkg.ReadEnv("APP_PORT", "3000"),
		DatabaseURL: pkg.ReadEnv("DATABASE_URL", "postgres://postgres:password@localhost:5432/dbname?sslmode=disable"),
		JWTSecret:   pkg.ReadEnv("JWT_SECRET", "your-secret-key"),
		FrontendURL: pkg.ReadEnv("FRONTEND_URL", "http://localhost:3000"),
		JWTTTL:      pkg.ReadEnvUint("JWT_TTL", 60),
	}
}
