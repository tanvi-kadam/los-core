# AML API

Base path: `/aml`

All responses: `{ status, data?, message?, correlation_id }`.

---

## POST /aml/compute/:application_id

Compute AML risk profile for an application.

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
    "risk_band": "MEDIUM",
    "composite_score": 42
  },
  "correlation_id": "uuid"
}
```

| Field           | Type   | Description                    |
|-----------------|--------|--------------------------------|
| risk_band       | string | LOW \| MEDIUM \| HIGH \| CRITICAL |
| composite_score | number | 0–100                          |

**Database table:** `aml_schema.aml_risk_profiles` — `id`, `application_id`, `entity_risk_score`, `director_risk_score`, `structural_risk_score`, `jurisdiction_risk_score`, `composite_score`, `risk_band`, `computed_at`, `model_version`.  
**Kafka:** `AMLProfileGenerated` on `los.aml.events`.
