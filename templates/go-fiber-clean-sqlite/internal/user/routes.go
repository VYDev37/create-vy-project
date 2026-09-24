package user

import (
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/limiter"

	"go-fiber/internal/middlewares"
)

func RegisterRoutes(router fiber.Router, handler *UserHandler, jwtSecret string) {
	authLimiter := limiter.New(limiter.Config{
		Max:        10,
		Expiration: 1 * time.Minute,
		LimitReached: func(c fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"success": false,
				"message": "Too many requests, please try again after a minute",
				"data":    nil,
			})
		},
	})

	auth := router.Group("/auth", authLimiter)
	auth.Post("/register", handler.Register)
	auth.Post("/login", handler.Login)
	auth.Post("/logout", handler.Logout)

	users := router.Group("/users", middlewares.Protected(jwtSecret))
	users.Get("/me", handler.GetProfile)

	users.Get("/", middlewares.AdminOnly(), handler.GetAllUsers)
}
