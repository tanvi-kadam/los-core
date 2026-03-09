# Authority API

Base path: `/authority`

All endpoints require JWT via `Authorization: Bearer <token>`.

All responses follow: `{ status, data?, message?, correlation_id }`.

---

## POST /authority/matrix

Create an authority matrix rule (RBAC / credit limit).

**Request**

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer \<access_token\> |
| X-Correlation-ID | No | Correlation ID |
| Content-Type | Yes | application/json |

**Body**

```json
{
  "role_id": "uuid",
  "max_loan_amount": 1000000,
  "max_deviation_percent": 5,
  "allowed_products": ["WORKING_CAPITAL", "TERM_LOAN"],
  "allowed_geographies": ["IN", "KE"],
  "effective_from": "2025-01-01T00:00:00Z",
  "effective_to": "2026-12-31T23:59:59Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| role_id | uuid | Yes | Role ID |
| max_loan_amount | number | Yes | Maximum loan amount |
| max_deviation_percent | number | No | Max deviation % |
| allowed_products | string[] | No | Allowed product codes |
| allowed_geographies | string[] | No | Allowed geography codes |
| effective_from | ISO date | Yes | Rule effective from |
| effective_to | ISO date | No | Rule effective to |

**Response (201)**

```json
{
  "status": "SUCCESS",
  "data": {
    "id": "uuid",
    "role_id": "uuid",
    "max_loan_amount": "1000000",
    "max_deviation_percent": "5",
    "allowed_products": ["WORKING_CAPITAL", "TERM_LOAN"],
    "allowed_geographies": ["IN", "KE"],
    "effective_from": "2025-01-01T00:00:00.000Z",
    "effective_to": "2026-12-31T23:59:59.000Z"
  },
  "correlation_id": "uuid"
}
```

**Description:** Inserts into `authority_schema.authority_matrix`. Invalidates Redis cache `AUTHORITY:{role_id}` (TTL 10 min).

---

## PUT /authority/matrix/:id

Update an existing authority matrix rule.

**Request**

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer \<access_token\> |
| X-Correlation-ID | No | Correlation ID |
| Content-Type | Yes | application/json |

**Path**

| Param | Type | Description |
|-------|------|-------------|
| id | uuid | Authority matrix row ID |

**Body**

Same fields as POST; all optional (partial update).

**Response (200)**

Same shape as POST create response.

**Response (404)**

```json
{
  "status": "ERROR",
  "message": "Authority matrix not found",
  "correlation_id": "uuid"
}
```

---

## GET /authority/role/:roleId

Get active authority rules for a role.

**Request**

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer \<access_token\> |
| X-Correlation-ID | No | Correlation ID |

**Path**

| Param | Type | Description |
|-------|------|-------------|
| roleId | uuid | Role ID |

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "uuid",
      "role_id": "uuid",
      "max_loan_amount": "1000000",
      "max_deviation_percent": "5",
      "allowed_products": ["WORKING_CAPITAL"],
      "allowed_geographies": ["IN"],
      "effective_from": "2025-01-01T00:00:00.000Z",
      "effective_to": null
    }
  ],
  "correlation_id": "uuid"
}
```

**Description:** Returns rules where `effective_from <= now` and (`effective_to` is null or `effective_to >= now`). Uses Redis cache `AUTHORITY:{role_id}` (TTL 10 min).
