package pkg

import (
	"os"
	"strconv"
)

func ReadEnv(key string, fallback string) string {
	val, exists := os.LookupEnv(key)
	if !exists || val == "" {
		return fallback
	}
	return val
}

func ReadEnvUint(key string, fallback uint) uint {
	val, exists := os.LookupEnv(key)
	if !exists || val == "" {
		return fallback
	}
	parsed, err := strconv.ParseUint(val, 10, 32)
	if err != nil {
		return fallback
	}
	return uint(parsed)
}
