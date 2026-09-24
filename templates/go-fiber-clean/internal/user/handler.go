package user

import (
	"log"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"

	"go-fiber/internal/pkg"
)

type UserHandler struct {
	userService UserService
	validator   *validator.Validate
}

func NewUserHandler(userService UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
		validator:   pkg.NewValidator(),
	}
}

func (h *UserHandler) Register(c fiber.Ctx) error {
	var req RegisterRequest
	if err := c.Bind().Body(&req); err != nil {
		log.Printf("[ERROR] Register bind body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request payload",
			"data":    nil,
		})
	}

	if err := h.validator.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": pkg.FormatValidationError(err),
			"data":    nil,
		})
	}

	res, err := h.userService.Register(req)
	if err != nil {
		log.Printf("[ERROR] Register service: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	// Set HTTP-only auth cookie
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    res.Token,
		Path:     "/",
		HTTPOnly: true,
		Secure:   c.Protocol() == "https",
		SameSite: "Lax",
		MaxAge:   3600 * 24, // 24 hours in seconds
	})

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "User registered successfully",
		"data":    res,
	})
}

func (h *UserHandler) Login(c fiber.Ctx) error {
	var req LoginRequest
	if err := c.Bind().Body(&req); err != nil {
		log.Printf("[ERROR] Login bind body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request payload",
			"data":    nil,
		})
	}

	if err := h.validator.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": pkg.FormatValidationError(err),
			"data":    nil,
		})
	}

	res, err := h.userService.Login(req)
	if err != nil {
		log.Printf("[ERROR] Login service: %v", err)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Invalid username or password",
			"data":    nil,
		})
	}

	// Set HTTP-only auth cookie
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    res.Token,
		Path:     "/",
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
		MaxAge:   3600 * 24, // 24 hours in seconds
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Login successful",
		"data":    res,
	})
}

func (h *UserHandler) Logout(c fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
		MaxAge:   -1,
		Expires:  time.Now().Add(-24 * time.Hour),
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Logged out successfully",
		"data":    nil,
	})
}

func (h *UserHandler) GetProfile(c fiber.Ctx) error {
	userIDVal := c.Locals("user_id")
	if userIDVal == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized access",
			"data":    nil,
		})
	}

	var userID uint
	switch v := userIDVal.(type) {
	case float64:
		userID = uint(v)
	case uint:
		userID = v
	case int:
		userID = uint(v)
	case string:
		parsed, err := strconv.ParseUint(v, 10, 32)
		if err != nil {
			log.Printf("[ERROR] GetProfile parse user ID: %v", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid user ID format",
				"data":    nil,
			})
		}
		userID = uint(parsed)
	default:
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid user ID type",
			"data":    nil,
		})
	}

	user, err := h.userService.GetProfile(userID)
	if err != nil {
		log.Printf("[ERROR] GetProfile service: %v", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "User not found",
			"data":    nil,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "User profile retrieved successfully",
		"data":    user,
	})
}

func (h *UserHandler) GetAllUsers(c fiber.Ctx) error {
	users, err := h.userService.GetAllUsers()
	if err != nil {
		log.Printf("[ERROR] GetAllUsers service: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch users",
			"data":    nil,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Users retrieved successfully",
		"data":    users,
	})
}

