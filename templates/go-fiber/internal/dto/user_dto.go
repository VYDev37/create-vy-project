package dto

type UserResponse struct {
	ID        uint   `json:"id"`
	Name      string `json:"name"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Role      int    `json:"role"`
	AvatarURL string `json:"avatar_url,omitempty"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type UpdateProfileRequest struct {
	Name      string `json:"name" validate:"required,min=2,max=100"`
	AvatarURL string `json:"avatar_url" validate:"omitempty,url,max=500"`
}

