# Application API

Base path: `/applications`

All responses: `{ status, data?, message?, correlation_id }`.

---

## POST /applications

Create a new loan application (DRAFT). Supports idempotency via `X-Idempotency-Key`.

**Headers**

| Header             | Required | Description        |
|--------------------|----------|--------------------|
| Authorization      | Yes      | Bearer \<JWT\>     |
| X-Correlation-ID   | No       | Correlation ID     |
| X-Idempotency-Key  | No       | Idempotency key    |
| Content-Type       | Yes      | application/json   |

**Body**

```json
{
  "entity_type": "PRIVATE_LIMITED",
  "entity_identifier": "U12345MH2020PTC123456",
  "pan": "ABCDE1234F",
  "product_code": "TERM_LOAN",
  "loan_amount": 5000000,
  "loan_tenure_months": 36,
  "purpose": "Working capital"
}
```

**Response (201)**

```json
{
  "status": "SUCCESS",
  "data": {
    "application_id": "uuid",
    "current_state": "DRAFT"
  },
  "correlation_id": "uuid"
}
```

**Database tables:** `application_schema.applications`, `application_schema.duplicate_checks` (if duplicate detected).  
**Kafka:** `ApplicationCreated` on `los.application.events`.

---

## PUT /applications/:id

Update an application (DRAFT only).

**Response (200):** `{ status: "SUCCESS", data: { application_id, current_state }, correlation_id }`

**Database table:** `application_schema.applications`.

---

## POST /applications/:id/consent

Record consent for an application.

**Body**

```json
{
  "consentTypeId": "uuid"
}
```

**Response (201):** `{ status: "SUCCESS", data: { status: "CONSENTED" }, correlation_id }`

**Database table:** `application_schema.consent_records`.

---

## POST /applications/:id/submit

Submit the application (requires CONSENTED). Moves state to SUBMITTED.

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": {
    "application_id": "uuid",
    "current_state": "SUBMITTED"
  },
  "correlation_id": "uuid"
}
```

**Database table:** `application_schema.applications`.  
**Kafka:** `ApplicationSubmitted` on `los.application.events`.
