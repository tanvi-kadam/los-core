# Config API

Base path: `/config`

All responses: `{ status, data?, message?, correlation_id }`.

---

## POST /config

Create a configuration entry.

**Headers**

| Header            | Required | Description        |
|-------------------|----------|--------------------|
| Authorization     | Yes      | Bearer \<JWT\>     |
| X-Correlation-ID  | No       | Correlation ID     |
| Content-Type      | Yes      | application/json   |

**Body**

```json
{
  "configType": "RATE",
  "configKey": "base_rate",
  "configValue": { "value": 0.12 },
  "effectiveFrom": "2025-01-01T00:00:00.000Z",
  "approvedBy": "uuid"
}
```

| Field          | Type   | Required | Description        |
|----------------|--------|----------|--------------------|
| configType     | string | Yes      | Config type        |
| configKey      | string | Yes      | Config key         |
| configValue    | object | Yes      | JSON value         |
| effectiveFrom  | string | No       | ISO date           |
| approvedBy     | string | No       | Approver user UUID |

**Response (201)**

```json
{
  "status": "SUCCESS",
  "data": {
    "id": "uuid",
    "configType": "RATE",
    "configKey": "base_rate",
    "version": 1
  },
  "correlation_id": "uuid"
}
```

**Database table:** `config_schema.configurations` — `id`, `config_type`, `config_key`, `config_value` (JSONB), `version`, `effective_from`, `approved_by`, `created_at`.

---

## GET /config/:type

Get all configurations for a type (effective as of now).

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "uuid",
      "config_type": "RATE",
      "config_key": "base_rate",
      "config_value": { "value": 0.12 },
      "version": 1,
      "effective_from": "2025-01-01T00:00:00.000Z",
      "approved_by": "uuid",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "correlation_id": "uuid"
}
```

**Database table:** `config_schema.configurations`.
