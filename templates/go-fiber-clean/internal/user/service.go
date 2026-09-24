package user

import (
	"errors"

	"go-fiber/internal/pkg"
)

type UserService interface {
	Register(req RegisterRequest) (*AuthResponse, error)
	Login(req LoginRequest) (*AuthResponse, error)
	GetProfile(id uint) (*UserResponse, error)
	GetAllUsers() ([]UserResponse, error)
}

type userService struct {
	userRepo  UserRepository
	jwtSecret string
	jwtTTL    uint
}

func NewUserService(userRepo UserRepository, jwtSecret string, jwtTTL uint) UserService {
	return &userService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
		jwtTTL:    jwtTTL,
	}
}

func (s *userService) Register(req RegisterRequest) (*AuthResponse, error) {
	if req.Username == "" || req.Email == "" || req.Password == "" {
		return nil, errors.New("username, email, and password are required")
	}

	if existing, _ := s.userRepo.FindByUsername(req.Username); existing != nil {
		return nil, errors.New("username is already taken")
	}

	if existing, _ := s.userRepo.FindByEmail(req.Email); existing != nil {
		return nil, errors.New("email is already registered")
	}

	// Hash password using Argon2id
	hashedPassword, err := pkg.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	name := req.Name
	if name == "" {
		name = req.Username
	}

	u := User{
		Name:     name,
		Username: req.Username,
		Email:    req.Email,
		Role:     1, // Level 1 (USER)
		Password: hashedPassword,
	}

	if err := s.userRepo.Create(&u); err != nil {
		return nil, err
	}

	token, err := pkg.GenerateToken(u.ID, u.Username, u.Role, s.jwtSecret, s.jwtTTL)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  toUserResponse(&u),
	}, nil
}

func (s *userService) Login(req LoginRequest) (*AuthResponse, error) {
	if req.Username == "" || req.Password == "" {
		return nil, errors.New("username and password are required")
	}

	u, err := s.userRepo.FindByUsername(req.Username)
	if err != nil {
		return nil, errors.New("invalid username or password")
	}

	match, err := pkg.CheckPasswordHash(req.Password, u.Password)
	if err != nil || !match {
		return nil, errors.New("invalid username or password")
	}

	token, err := pkg.GenerateToken(u.ID, u.Username, u.Role, s.jwtSecret, s.jwtTTL)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  toUserResponse(u),
	}, nil
}

func (s *userService) GetProfile(id uint) (*UserResponse, error) {
	u, err := s.userRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	res := toUserResponse(u)
	return &res, nil
}

func (s *userService) GetAllUsers() ([]UserResponse, error) {
	users, err := s.userRepo.FindAll()
	if err != nil {
		return nil, err
	}

	responses := make([]UserResponse, len(users))
	for i, u := range users {
		responses[i] = toUserResponse(&u)
	}
	return responses, nil
}

func toUserResponse(u *User) UserResponse {
	return UserResponse{
		ID:        u.ID,
		Name:      u.Name,
		Username:  u.Username,
		Email:     u.Email,
		Role:      u.Role,
		AvatarURL: u.AvatarURL,
		CreatedAt: u.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: u.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}
