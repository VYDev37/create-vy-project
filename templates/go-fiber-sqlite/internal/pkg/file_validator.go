package pkg

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"
)

var (
	ErrFileTooLarge     = errors.New("file size exceeds maximum allowed limit")
	ErrInvalidFileType  = errors.New("file content type is not allowed")
	ErrUnableToReadFile = errors.New("unable to read uploaded file header for verification")
)

// ValidateUploadedFile inspects the file header and real magic bytes (first 512 bytes)
// to prevent MIME spoofing and malicious file uploads.
func ValidateUploadedFile(header *multipart.FileHeader, maxSizeBytes int64, allowedMimes []string) (string, error) {
	if header == nil {
		return "", errors.New("no file provided")
	}

	if header.Size > maxSizeBytes {
		return "", fmt.Errorf("%w: maximum allowed is %d MB", ErrFileTooLarge, maxSizeBytes/(1024*1024))
	}

	file, err := header.Open()
	if err != nil {
		return "", fmt.Errorf("%w: %v", ErrUnableToReadFile, err)
	}
	defer file.Close()

	buffer := make([]byte, 512)
	n, err := file.Read(buffer)
	if err != nil && n == 0 {
		return "", fmt.Errorf("%w: %v", ErrUnableToReadFile, err)
	}

	detectedMime := http.DetectContentType(buffer[:n])

	mimeAllowed := false
	for _, allowed := range allowedMimes {
		if strings.EqualFold(detectedMime, allowed) || strings.HasPrefix(detectedMime, allowed) {
			mimeAllowed = true
			break
		}
	}

	if !mimeAllowed {
		return "", fmt.Errorf("%w: detected %s, expected one of %v", ErrInvalidFileType, detectedMime, allowedMimes)
	}

	ext := strings.ToLower(filepath.Ext(header.Filename))
	randomBytes := make([]byte, 16)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", errors.New("failed to generate secure filename")
	}
	safeFileName := hex.EncodeToString(randomBytes) + ext

	return safeFileName, nil
}
