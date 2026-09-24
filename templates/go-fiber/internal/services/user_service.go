package services

import (
	"errors"

	"go-fiber/internal/dto"
	"go-fiber/internal/models"
	"go-fiber/internal/pkg"
	"go-fiber/internal/repositories"
)

type UserService interface {
	Register(req dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(req dto.LoginRequest) (*dto.AuthResponse, error)
	GetProfile(id uint) (*dto.UserResponse, error)
	GetAllUsers() ([]dto.UserResponse, error)
}

type userService struct {
	userRepo  repositories.UserRepository
	jwtSecret string
	jwtTTL    uint
}

func NewUserService(userRepo repositories.UserRepository, jwtSecret string, jwtTTL uint) UserService {
	return &userService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
		jwtTTL:    jwtTTL,
	}
}

func (s *userService) Register(req dto.RegisterRequest) (*dto.AuthResponse, error) {
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

	user := models.User{
		Name:     name,
		Username: req.Username,
		Email:    req.Email,
		Role:     1, // Level 1 (USER)
		Password: hashedPassword,
	}

	if err := s.userRepo.Create(&user); err != nil {
		return nil, err
	}

	token, err := pkg.GenerateToken(user.ID, user.Username, user.Role, s.jwtSecret, s.jwtTTL)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User:  toUserResponse(&user),
	}, nil
}

func (s *userService) Login(req dto.LoginRequest) (*dto.AuthResponse, error) {
	if req.Username == "" || req.Password == "" {
		return nil, errors.New("username and password are required")
	}

	user, err := s.userRepo.FindByUsername(req.Username)
	if err != nil {
		return nil, errors.New("invalid username or password")
	}

	match, err := pkg.CheckPasswordHash(req.Password, user.Password)
	if err != nil || !match {
		return nil, errors.New("invalid username or password")
	}

	token, err := pkg.GenerateToken(user.ID, user.Username, user.Role, s.jwtSecret, s.jwtTTL)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User:  toUserResponse(user),
	}, nil
}

func (s *userService) GetProfile(id uint) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	res := toUserResponse(user)
	return &res, nil
}

func (s *userService) GetAllUsers() ([]dto.UserResponse, error) {
	users, err := s.userRepo.FindAll()
	if err != nil {
		return nil, err
	}

	responses := make([]dto.UserResponse, len(users))
	for i, u := range users {
		responses[i] = toUserResponse(&u)
	}
	return responses, nil
}

func toUserResponse(u *models.User) dto.UserResponse {
	return dto.UserResponse{
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
