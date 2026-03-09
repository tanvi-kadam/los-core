# Policy API

Base path: `/policy`

All responses: `{ status, data?, message?, correlation_id }`.

---

## POST /policy

Create a policy registry entry.

**Headers**

| Header            | Required | Description    |
|-------------------|----------|----------------|
| Authorization     | Yes      | Bearer \<JWT\> |
| X-Correlation-ID  | No       | Correlation ID |
| Content-Type      | Yes      | application/json |

**Body**

```json
{
  "policyType": "ELIGIBILITY",
  "version": 1,
  "description": "MSME eligibility policy v1",
  "effectiveFrom": "2025-01-01T00:00:00.000Z",
  "approvedBy": "uuid"
}
```

| Field         | Type   | Required | Description   |
|---------------|--------|----------|---------------|
| policyType    | string | Yes      | Policy type   |
| version       | number | No       | Version       |
| description   | string | No       | Description   |
| effectiveFrom | string | No       | ISO date      |
| approvedBy    | string | No       | Approver UUID |

**Response (201)**

```json
{
  "status": "SUCCESS",
  "data": {
    "id": "uuid",
    "policyType": "ELIGIBILITY",
    "version": 1
  },
  "correlation_id": "uuid"
}
```

**Database table:** `policy_schema.policy_registry` — `id`, `policy_type`, `version`, `description`, `effective_from`, `approved_by`, `created_at`.

---

## GET /policy

Get all policies.

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "uuid",
      "policyType": "ELIGIBILITY",
      "version": 1,
      "description": "MSME eligibility policy v1",
      "effectiveFrom": "2025-01-01T00:00:00.000Z",
      "approvedBy": "uuid",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "correlation_id": "uuid"
}
```

**Database table:** `policy_schema.policy_registry`.
