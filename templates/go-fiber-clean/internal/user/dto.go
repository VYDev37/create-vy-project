package user

type RegisterRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Username string `json:"username" validate:"required,min=3,max=50,alphanum"`
	Email    string `json:"email" validate:"required,email,max=255"`
	Password string `json:"password" validate:"required,min=6,max=100"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

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

type ApiResponse[T any] struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    T      `json:"data"`
}

