# JWT Authentication & Cookie Standards

## Password Hashing: Argon2id
- Passwords MUST be hashed using **Argon2id** (`golang.org/x/crypto/argon2`).
- Never use legacy MD5, SHA, or bcrypt.
- Store hashes in standard PHC string format: `$argon2id$v=19$m=65536,t=3,p=2$<salt>$<hash>`.
- Use constant-time comparison (`crypto/subtle.ConstantTimeCompare`) during verification to protect against timing attacks.

## Token Generation
- Sign JWT tokens using `github.com/golang-jwt/jwt/v5` with HMAC-SHA256 (`jwt.SigningMethodHS256`).
- Secret is loaded from `JWT_SECRET` in `.env`.
- Standard claims include `user_id`, `username`, and `exp` (e.g. 24 hours).

## Cookie Dispatch (HTTP-only)
- On successful login or registration, handlers must set the token directly into an HTTP-only cookie:
  ```go
  c.Cookie(&fiber.Cookie{
      Name:     "token",
      Value:    tokenString,
      Path:     "/",
      HTTPOnly: true,
      Secure:   false, // Set to true in production with HTTPS
      SameSite: "Lax",
      MaxAge:   3600 * 24, // 24 hours in seconds
  })
  ```
- Handlers should also provide a `/logout` route that invokes `c.ClearCookie("token")`.

## Protected Middleware
- Checks `c.Cookies("token")` first.
- Falls back to `Authorization: Bearer <token>` header if cookie is not present (for native mobile apps or API tools like Postman).
- On valid token, sets `c.Locals("user_id", ...)` and `c.Locals("username", ...)`.
- On error/missing token, returns standard 401 JSON response.
