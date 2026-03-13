# Cursor AI Prompt — Directus Authentication Integration (Directus Generates JWT)

## System Context

You are implementing authentication for an **enterprise Loan Origination System (LOS)** built with **NestJS**.

Infrastructure stack:

- NestJS modular monolith (**LOS-Core**)
- PostgreSQL (operational LOS database)
- Redis / Kafka / Temporal (not required for this task)
- **Kong API Gateway** (public entry point)
- **Directus** running inside Docker as a governance service

Directus is **not publicly exposed**.

Only **NestJS can call Directus APIs**.

---

# Architecture

Internet
↓
Kong API Gateway
↓
NestJS LOS-Core
├── Directus (Auth + Governance)
└── PostgreSQL (Operational Data)

Directus responsibilities:

- User authentication
- Roles
- Authorization Matrix
- Policy Rules

NestJS responsibilities:

- Business logic
- Loan workflow execution
- Authorization enforcement

---

# JWT Design

Directus is configured with:

```
SECRET=<directus_secret>
JWT_ISSUER=los-core-api
```

Therefore Directus automatically generates JWT tokens containing the `iss` claim.

Example Directus JWT payload:

```
{
  "id": "user_id",
  "role": "role_id",
  "app_access": true,
  "admin_access": false,
  "iss": "los-core-api",
  "exp": 1710003600
}
```

NestJS **must NOT reissue JWT tokens**.

NestJS only:

1. Calls Directus login API
2. Returns Directus JWT to client
3. Verifies JWT on protected APIs

---

# Login Requirement

Frontend sends:

```
POST /auth/login
```

Body:

```
{
  "email": "user@email.com",
  "password": "password",
  "iss": "los-core-api"
}
```

The `iss` field is required because **Kong Gateway validates issuer**.

However NestJS must **validate issuer before proceeding**.

---

# Allowed Issuers

Create a whitelist:

```
ALLOWED_ISSUERS = [
  "los-core-api"
]
```

If issuer is not allowed:

```
throw UnauthorizedException("Invalid issuer")
```

---

# Login Flow

Client
↓
Kong
↓
NestJS `/auth/login`
↓
Validate issuer
↓
Call Directus `/auth/login`
↓
Directus verifies credentials
↓
Directus returns JWT (already contains `iss`)
↓
NestJS returns the same token

NestJS **does NOT create a new JWT**.

---

# Directus Login API

```
POST /auth/login
```

Body:

```
{
  "email": "user@email.com",
  "password": "password"
}
```

Response:

```
{
  "data": {
    "access_token": "jwt_token"
  }
}
```

---

# Login Response

Return the same token to the client.

```
{
  "status": "SUCCESS",
  "data": {
    "access_token": "jwt_token"
  }
}
```

---

# Directus Integration Module

Create module:

```
src/modules/directus
```

Files:

```
directus.module.ts
directus.service.ts
directus.client.ts
directus.constants.ts
```

Responsibilities:

- Call Directus APIs
- Authenticate users
- Fetch authorization_matrix
- Fetch policy_rules

Use **axios**.

---

# Environment Variables

NestJS `.env`

```
DIRECTUS_URL=http://directus:8055
DIRECTUS_JWT_SECRET=<same as Directus SECRET>
JWT_ISSUER=los-core-api
```

---

# Authentication Module

Create module:

```
src/modules/auth
```

Files:

```
auth.controller.ts
auth.service.ts
dto/login.dto.ts
interfaces/directus-login-response.interface.ts
```

---

# JWT Authentication Guard

Create guard:

```
src/common/guards/jwt-auth.guard.ts
```

Responsibilities:

1. Extract token

```
Authorization: Bearer <token>
```

2. Verify signature

```
jwt.verify(token, process.env.DIRECTUS_JWT_SECRET)
```

3. Validate issuer

```
decoded.iss === process.env.JWT_ISSUER
```

4. Validate expiration

5. Attach decoded user to request

```
req.user = {
  id: decoded.id,
  role: decoded.role
}
```

If validation fails:

```
throw UnauthorizedException()
```

---

# Authorization Module

Create module:

```
src/modules/authorization
```

Files:

```
authorization.module.ts
authorization.controller.ts
authorization.service.ts
```

---

# Authorization Endpoint

```
GET /authorization/matrix
```

Flow:

Client request
↓
Kong Gateway
↓
NestJS Controller
↓
JwtAuthGuard verifies token
↓
Extract role from JWT
↓
Call Directus API
↓
Return authorization_matrix

---

# Directus Query

```
GET /items/authorization_matrix
```

Query:

```
filter[role_id][_eq]=<role_id>
```

---

# Standard API Response Format

Success:

```
{
  "status": "SUCCESS",
  "data": {}
}
```

Error:

```
{
  "status": "ERROR",
  "message": "Unauthorized"
}
```

---

# Security Rules

1. Directus must remain private.
2. Only NestJS can call Directus APIs.
3. JWT must always be verified.
4. Never trust client-provided roles.
5. Extract role only from verified JWT.
6. Kong Gateway validates JWT before NestJS.

---

# Dependencies

Install if missing:

```
npm install axios jsonwebtoken
```

---

# Final Folder Structure

```
src

 ├── modules
 │   ├── auth
 │   │   ├── auth.controller.ts
 │   │   ├── auth.service.ts
 │   │   ├── dto/login.dto.ts
 │   │
 │   ├── directus
 │   │   ├── directus.module.ts
 │   │   ├── directus.client.ts
 │   │   ├── directus.service.ts
 │   │   ├── directus.constants.ts
 │   │
 │   ├── authorization
 │   │   ├── authorization.controller.ts
 │   │   ├── authorization.service.ts
 │   │   ├── authorization.module.ts

 ├── common
 │   ├── guards
 │   │   ├── jwt-auth.guard.ts
```

---

# Expected Outcome

1. Frontend sends email, password, and issuer.
2. NestJS validates issuer.
3. NestJS calls Directus authentication API.
4. Directus authenticates the user.
5. Directus generates JWT including `iss`.
6. NestJS returns the same token.
7. Client calls APIs with Authorization header.
8. Kong validates JWT.
9. NestJS verifies JWT.
10. Authorization matrix is fetched securely.
