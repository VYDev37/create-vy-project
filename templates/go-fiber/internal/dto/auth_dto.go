package dto

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

