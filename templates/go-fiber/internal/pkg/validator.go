package pkg

import (
	"fmt"
	"html"
	"strings"

	"github.com/go-playground/validator/v10"
)

// NewValidator initializes and returns a configured validator instance.
func NewValidator() *validator.Validate {
	return validator.New()
}

// FormatValidationError converts validator.ValidationErrors into a human-readable string.
func FormatValidationError(err error) string {
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		var errMsgs []string
		for _, e := range validationErrors {
			field := strings.ToLower(e.Field())
			switch e.Tag() {
			case "required":
				errMsgs = append(errMsgs, fmt.Sprintf("%s is required", field))
			case "email":
				errMsgs = append(errMsgs, fmt.Sprintf("%s must be a valid email address", field))
			case "min":
				errMsgs = append(errMsgs, fmt.Sprintf("%s must be at least %s characters", field, e.Param()))
			case "max":
				errMsgs = append(errMsgs, fmt.Sprintf("%s must be at most %s characters", field, e.Param()))
			case "alphanum":
				errMsgs = append(errMsgs, fmt.Sprintf("%s must contain alphanumeric characters only", field))
			case "url":
				errMsgs = append(errMsgs, fmt.Sprintf("%s must be a valid URL", field))
			default:
				errMsgs = append(errMsgs, fmt.Sprintf("%s failed validation on %s", field, e.Tag()))
			}
		}
		return strings.Join(errMsgs, ", ")
	}
	return "Invalid input data"
}

// SanitizeString trims leading/trailing whitespaces and escapes HTML special characters to prevent XSS.
func SanitizeString(input string) string {
	trimmed := strings.TrimSpace(input)
	return html.EscapeString(trimmed)
}
