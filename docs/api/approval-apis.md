# Approval API

Base path: `/approvals`

All responses: `{ status, data?, message?, correlation_id }`.

Maker-checker rule: **maker_id must not equal checker_id** (checker cannot approve/reject their own request).

---

## POST /approvals

Create an approval request (maker). Supports idempotency via `X-Idempotency-Key`.

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
  "objectType": "APPLICATION",
  "objectId": "uuid",
  "actionType": "SANCTION"
}
```

**Response (201)**

```json
{
  "status": "SUCCESS",
  "data": {
    "id": "uuid",
    "object_type": "APPLICATION",
    "object_id": "uuid",
    "action_type": "SANCTION",
    "status": "PENDING"
  },
  "correlation_id": "uuid"
}
```

**Database table:** `approval_schema.approval_requests`.  
**Kafka:** `ApprovalRequested` on `los.approval.events`.

---

## POST /approvals/:id/decision

Record checker decision (APPROVED or REJECTED). Supports idempotency via `X-Idempotency-Key`. Checker must not be the maker.

**Body**

```json
{
  "decision": "APPROVED",
  "authoritySnapshot": {}
}
```

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": {
    "approval_request_id": "uuid",
    "decision": "APPROVED"
  },
  "correlation_id": "uuid"
}
```

**Database tables:** `approval_schema.approval_requests`, `approval_schema.approval_decisions`.  
**Kafka:** `ApprovalDecision` on `los.approval.events`.
