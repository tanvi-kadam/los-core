# Workflow API

Base path: `/applications` (transition only)

All responses: `{ status, data?, message?, correlation_id }`.

---

## POST /applications/:id/transition

Transition application to a target state. Supports idempotency via `X-Idempotency-Key`.

**Headers**

| Header             | Required | Description    |
|--------------------|----------|----------------|
| Authorization      | Yes      | Bearer \<JWT\> |
| X-Correlation-ID   | No       | Correlation ID |
| X-Idempotency-Key  | No       | Idempotency key |
| Content-Type       | Yes      | application/json |

**Body**

```json
{
  "target_state": "SUBMITTED"
}
```

| Field         | Type   | Required | Description  |
|---------------|--------|----------|--------------|
| target_state  | string | Yes      | Target state  |

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": {
    "application_id": "uuid",
    "from_state": "DRAFT",
    "to_state": "SUBMITTED"
  },
  "correlation_id": "uuid"
}
```

**Database table:** `workflow_schema.application_state_transitions` — `id`, `application_id`, `from_state`, `to_state`, `triggered_by`, `triggered_role`, `authority_snapshot` (JSONB), `occurred_at`, `correlation_id`.  
**Kafka:** `ApplicationStateChanged` on `los.workflow.events`.
