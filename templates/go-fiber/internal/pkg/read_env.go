package pkg

import (
	"os"
	"strconv"
)

func ReadEnv(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func ReadEnvUint(key string, fallback uint) uint {
	if value := os.Getenv(key); value != "" {
		if u, err := strconv.ParseUint(value, 10, 32); err == nil {
			return uint(u)
		}
	}
	return fallback
}

func ReadEnvInt(key string, fallback int) int {
	if value := os.Getenv(key); value != "" {
		if i, err := strconv.Atoi(value); err == nil {
			return i
		}
	}
	return fallback
}
