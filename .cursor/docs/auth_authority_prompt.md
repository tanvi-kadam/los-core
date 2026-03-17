# Cursor Prompt --- Auth & Authority Modules (NestJS LOS)

## CONTEXT

You are implementing the Auth and Authority modules for a Fintech MSME
Loan Origination System (LOS).

System stack: - NestJS - TypeORM - PostgreSQL - Redis - Kafka -
Temporal - Kong Gateway

Database schemas already exist:

auth_schema authority_schema

Tables:

auth_schema.users auth_schema.roles auth_schema.user_roles
authority_schema.authority_matrix

Authentication uses JWT.

Follow enterprise fintech practices: - RBAC - Maker--Checker
enforcement - Authority limits - Full auditability - Correlation ID
propagation - Idempotent APIs - Swagger documentation

------------------------------------------------------------------------

# ARCHITECTURE REQUIREMENTS

Use Domain Driven Design.

Modules:

src/modules/auth src/modules/authority

Each module must include:

controllers services repositories entities dto guards decorators

TypeORM entities must reference schema:

@Entity({ schema: 'auth_schema', name: 'users' })

------------------------------------------------------------------------

# AUTH MODULE

Responsibilities:

User login JWT generation Password validation Token refresh Current user
retrieval

------------------------------------------------------------------------

# DATABASE TABLES

auth_schema.users

id UUID PK email VARCHAR UNIQUE password_hash TEXT status VARCHAR
created_at TIMESTAMP updated_at TIMESTAMP

auth_schema.roles

id UUID PK name VARCHAR description TEXT created_at TIMESTAMP

auth_schema.user_roles

id UUID PK user_id UUID role_id UUID assigned_at TIMESTAMP

------------------------------------------------------------------------

# AUTH MODULE STRUCTURE

src/modules/auth

auth.module.ts auth.controller.ts auth.service.ts jwt.strategy.ts
jwt.guard.ts

entities/ user.entity.ts role.entity.ts user-role.entity.ts

repositories/ user.repository.ts role.repository.ts
user-role.repository.ts

dto/ login.dto.ts refresh.dto.ts

------------------------------------------------------------------------

# AUTH APIS

POST /auth/login

Request: { "email": "user@los.com", "password": "password" }

JWT payload: { user_id email role_id }

Response: { status: "SUCCESS", data: { access_token: "" },
correlation_id: "" }

POST /auth/refresh

GET /auth/me

------------------------------------------------------------------------

# AUTH SECURITY

Implement:

JwtStrategy JwtAuthGuard

Token header:

Authorization: Bearer `<token>`{=html}

Use bcrypt for password validation.

------------------------------------------------------------------------

# AUTH LOGGING

Use Pino logger.

Log:

login success login failure token generation

------------------------------------------------------------------------

# REDIS CACHE

AUTH:{user_id}

Cache role and user info.

------------------------------------------------------------------------

# AUTHORITY MODULE

Responsibilities:

RBAC permissions Credit authority limits Maker-checker enforcement

------------------------------------------------------------------------

# AUTHORITY TABLE

authority_schema.authority_matrix

Columns:

id UUID role_id UUID max_loan_amount NUMERIC max_deviation_percent
NUMERIC allowed_products JSONB allowed_geographies JSONB effective_from
TIMESTAMP effective_to TIMESTAMP

------------------------------------------------------------------------

# AUTHORITY MODULE STRUCTURE

src/modules/authority

authority.module.ts authority.controller.ts authority.service.ts

entities/ authority-matrix.entity.ts

repositories/ authority.repository.ts

dto/ create-authority.dto.ts update-authority.dto.ts

guards/ permission.guard.ts

decorators/ permissions.decorator.ts

------------------------------------------------------------------------

# AUTHORITY APIS

POST /authority/matrix

PUT /authority/matrix/:id

GET /authority/role/:roleId

------------------------------------------------------------------------

# AUTHORITY SERVICE

Functions:

createAuthorityRule() updateAuthorityRule() getAuthorityForRole()
checkAuthorityLimit()

Example rule:

if loan_amount \> max_loan_amount throw ForbiddenException

------------------------------------------------------------------------

# PERMISSIONS SYSTEM

Decorator:

@Permissions("APPLICATION_CREATE")

Guard:

PermissionGuard

Flow:

request → jwt guard → permission guard → controller

------------------------------------------------------------------------

# MAKER CHECKER RULE

maker_id must never equal checker_id

------------------------------------------------------------------------

# AUTHORITY REDIS CACHE

AUTHORITY:{role_id}

TTL 10 minutes

------------------------------------------------------------------------

# API RESPONSE FORMAT

Success:

{ status: "SUCCESS", data: {}, correlation_id: "" }

Error:

{ status: "ERROR", message: "", correlation_id:"" }

------------------------------------------------------------------------

# SWAGGER

Endpoint:

/api/docs

Annotate APIs with:

@ApiTags @ApiOperation @ApiResponse

Include:

request examples response examples error responses

------------------------------------------------------------------------

# API INVENTORY

Generate:

docs/api/auth-api.md docs/api/authority-api.md

Include:

endpoint method request example response example description

------------------------------------------------------------------------

# TESTING

Create tests for:

login success login failure jwt guard authority rule validation

------------------------------------------------------------------------

# CODE QUALITY

Follow:

SOLID principles dependency injection repository pattern DTO validation
structured logging

------------------------------------------------------------------------

# NEXT MODULES

After completion:

Application Workflow Approval Audit Idempotency Integration AML
