# Integration API

Base path: `/integration`

All responses: `{ status, data?, message?, correlation_id }`.

---

## POST /integration/mca-pull/:application_id

Pull MCA (Ministry of Corporate Affairs) entity snapshot for an application and store it.

**Headers**

| Header           | Required | Description    |
|------------------|----------|----------------|
| Authorization    | Yes      | Bearer \<JWT\> |
| X-Correlation-ID | No       | Correlation ID |

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": {
    "application_id": "uuid",
    "mca_reference_id": "U12345MH2020PTC123456",
    "legal_name": null,
    "snapshot_version": 1,
    "pulled_at": "2025-01-01T00:00:00.000Z"
  },
  "correlation_id": "uuid"
}
```

**Database table:** `integration_schema.entity_snapshots` — `id`, `application_id`, `mca_reference_id`, `legal_name`, `registration_number`, `incorporation_date`, `company_status`, `company_type`, `registered_address`, `snapshot_version`, `pulled_at`, `raw_response` (JSONB).
