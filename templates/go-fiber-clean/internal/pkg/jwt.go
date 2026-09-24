package pkg

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AuthClaims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Role     int    `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(userID uint, username string, role int, secret string, ttlMinutes uint) (string, error) {
	if ttlMinutes == 0 {
		ttlMinutes = 60 // Default 60 minutes
	}

	claims := AuthClaims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * time.Duration(ttlMinutes))),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
