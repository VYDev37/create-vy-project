package middlewares

import (
	"go-fiber/internal/config"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func NewCORS(cfg *config.Config) fiber.Handler {
	origins := []string{"http://localhost:3000", "http://localhost:5173"}
	if cfg.FrontendURL != "" && cfg.FrontendURL != "http://localhost:3000" && cfg.FrontendURL != "http://localhost:5173" {
		origins = append(origins, cfg.FrontendURL)
	}

	return cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Cookie", "X-Requested-With"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"},
		AllowCredentials: true,
	})
}
