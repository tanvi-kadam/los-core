# Auth API

Base path: `/auth`

All responses follow the standard format: `{ status, data?, message?, correlation_id }`.

---

## POST /auth/login

User login. Returns JWT access and refresh tokens.

**Request**

| Header           | Required | Description                                |
| ---------------- | -------- | ------------------------------------------ |
| X-Correlation-ID | No       | Correlation ID (auto-generated if missing) |
| Content-Type     | Yes      | application/json                           |

**Body**

```json
{
  "email": "admin@test.com",
  "password": "password123"
}
```

| Field    | Type   | Required | Description   |
| -------- | ------ | -------- | ------------- |
| email    | string | Yes      | User email    |
| password | string | Yes      | User password |

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900
  },
  "correlation_id": "uuid"
}
```

**Response (401)**

```json
{
  "status": "ERROR",
  "message": "Invalid email or password",
  "correlation_id": "uuid"
}
```

**Description:** Validates credentials with bcrypt, issues JWT (payload: user_id, email, role_id). Caches user/role in Redis under `AUTH:{user_id}`.

---

## POST /auth/refresh

Refresh access token using a valid refresh token.

**Request**

| Header           | Required | Description      |
| ---------------- | -------- | ---------------- |
| X-Correlation-ID | No       | Correlation ID   |
| Content-Type     | Yes      | application/json |

**Body**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200)**

Same shape as login: `{ status: "SUCCESS", data: { access_token, refresh_token, expires_in }, correlation_id }`.

**Response (401)**

```json
{
  "status": "ERROR",
  "message": "Invalid or expired refresh token",
  "correlation_id": "uuid"
}
```

**Description:** Verifies refresh token and issues new access and refresh tokens.

---

## GET /auth/me

Returns the current authenticated user. Requires JWT.

**Request**

| Header           | Required | Description             |
| ---------------- | -------- | ----------------------- |
| Authorization    | Yes      | Bearer \<access_token\> |
| X-Correlation-ID | No       | Correlation ID          |

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": {
    "user_id": "uuid",
    "email": "user@los.com",
    "role_id": "uuid"
  },
  "correlation_id": "uuid"
}
```

**Response (401)**

```json
{
  "status": "ERROR",
  "message": "Unauthorized",
  "correlation_id": "uuid"
}
```

**Description:** Resolves user from JWT; uses Redis cache `AUTH:{user_id}` when available.
