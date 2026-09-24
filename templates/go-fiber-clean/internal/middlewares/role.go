package middlewares

import (
	"github.com/gofiber/fiber/v3"
)

// RequireRole checks if the authenticated user's role is within the allowed roles.
// Example: RequireRole(1, 2) or RequireRole(2) for admin only.
func RequireRole(allowedRoles ...int) fiber.Handler {
	return func(c fiber.Ctx) error {
		roleVal := c.Locals("role")
		if roleVal == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"message": "Authentication required",
				"data":    nil,
			})
		}

		userRole, ok := roleVal.(int)
		if !ok {
			if floatVal, okFloat := roleVal.(float64); okFloat {
				userRole = int(floatVal)
			} else {
				return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
					"success": false,
					"message": "Invalid role type in session",
					"data":    nil,
				})
			}
		}

		for _, allowed := range allowedRoles {
			if userRole == allowed {
				return c.Next()
			}
		}

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"success": false,
			"message": "Forbidden: insufficient permissions",
			"data":    nil,
		})
	}
}

// AdminOnly is a helper middleware strictly permitting Level 2 (Admin) users.
func AdminOnly() fiber.Handler {
	return RequireRole(2)
}
