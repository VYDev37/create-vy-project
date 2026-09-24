package config

import (
	"log"

	"github.com/joho/godotenv"

	"go-fiber/internal/pkg"
)

type Config struct {
	AppName     string
	AppEnv      string
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

	appEnv := pkg.ReadEnv("APP_ENV", "development")
	jwtSecret := pkg.ReadEnv("JWT_SECRET", "your-secret-key")

	if appEnv == "production" && (jwtSecret == "your-secret-key" || len(jwtSecret) < 32) {
		log.Println("[WARNING] Insecure JWT_SECRET detected in production environment! Use a strong secret of at least 32 characters.")
	}

	return &Config{
		AppName:     pkg.ReadEnv("APP_NAME", "Go Fiber Clean"),
		AppEnv:      appEnv,
		AppPort:     pkg.ReadEnv("APP_PORT", "8080"),
		DatabaseURL: pkg.ReadEnv("DATABASE_URL", "postgres://postgres:password@localhost:5432/dbname?sslmode=disable"),
		JWTSecret:   jwtSecret,
		FrontendURL: pkg.ReadEnv("FRONTEND_URL", "http://localhost:3000"),
		JWTTTL:      pkg.ReadEnvUint("JWT_TTL", 60),
	}
}
