package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"go-fiber/internal/models"
	"go-fiber/internal/pkg"
	"go-fiber/internal/repositories"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

type UserService interface {
	Register(req RegisterRequest) (*AuthResponse, error)
	Login(req LoginRequest) (*AuthResponse, error)
	GetProfile(id uint) (*models.User, error)
	GetAllUsers() ([]models.User, error)
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

	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
	}

	if err := s.userRepo.Create(&user); err != nil {
		return nil, err
	}

	token, err := s.generateToken(user.ID, user.Username)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

func (s *userService) Login(req LoginRequest) (*AuthResponse, error) {
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

	token, err := s.generateToken(user.ID, user.Username)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *userService) GetProfile(id uint) (*models.User, error) {
	return s.userRepo.FindByID(id)
}

func (s *userService) GetAllUsers() ([]models.User, error) {
	return s.userRepo.FindAll()
}

func (s *userService) generateToken(userID uint, username string) (string, error) {
	ttl := s.jwtTTL
	if ttl == 0 {
		ttl = 60 // Default 60 minutes
	}

	claims := jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"exp":      time.Now().Add(time.Minute * time.Duration(ttl)).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
