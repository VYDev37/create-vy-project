package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Username  string         `gorm:"size:255;not null;uniqueIndex" json:"username"`
	Name      string         `gorm:"size:255" json:"name"`
	Email     string         `gorm:"size:255;not null;uniqueIndex" json:"email"`
	Role      int            `gorm:"default:1" json:"role"` // Level 1: USER, Level 2: ADMIN
	Password  string         `gorm:"size:255;not null" json:"-"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
