package middlewares

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"

	"go-fiber/internal/config"
)

func NewCORS(cfg *config.Config) fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendURL, "http://localhost:3000", "http://localhost:5173"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowCredentials: true,
	})
}
