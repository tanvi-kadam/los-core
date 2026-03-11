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
  "purpose": "Working capital",
  "consents": [
    {
      "consent_code": "BUREAU_PULL",
      "consent_text_version": 1
    },
    {
      "consent_code": "ACCOUNT_AGGREGATOR",
      "consent_text_version": 1
    }
  ]
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

## GET /applications

List applications with pagination and optional state filter.

**Headers**

| Header           | Required | Description    |
|------------------|----------|----------------|
| Authorization    | Yes      | Bearer \<JWT\> |
| X-Correlation-ID | No       | Correlation ID |

**Query params**

| Param | Type   | Required | Description                      |
|-------|--------|----------|----------------------------------|
| page  | number | No       | Page number (1-based, default 1)|
| limit | number | No       | Page size (default 20, max 100) |
| state | string | No       | Filter by `current_state`       |

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": {
    "items": [
      {
        "id": "uuid",
        "entity_type": "PRIVATE_LIMITED",
        "entity_identifier": "U12345MH2020PTC123456",
        "pan": "ABCDE1234F",
        "product_code": "TERM_LOAN",
        "loan_amount": "5000000.00",
        "loan_tenure_months": 36,
        "purpose": "Working capital",
        "current_state": "DRAFT",
        "consent_status": "CONSENTED",
        "duplicate_flag": false,
        "created_by": "user-uuid",
        "created_at": "2026-03-10T12:00:00Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1
  },
  "correlation_id": "uuid"
}
```

**Database table:** `application_schema.applications`.

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
  "consent_code": "BUREAU_PULL",
  "consent_text_version": 1
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

---

## GET /applications/consent-types

List all active consent types configured in `config_schema.consent_types`.

**Headers**

| Header           | Required | Description    |
|------------------|----------|----------------|
| Authorization    | Yes      | Bearer \<JWT\> |
| X-Correlation-ID | No       | Correlation ID |

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "uuid",
      "consent_code": "BUREAU_PULL",
      "description": "Consent for credit bureau pull (CRIF, Experian, CIBIL)"
    },
    {
      "id": "uuid",
      "consent_code": "ACCOUNT_AGGREGATOR",
      "description": "Consent for fetching banking data via Account Aggregator ecosystem"
    }
  ],
  "correlation_id": "uuid"
}
```

**Database table:** `config_schema.consent_types`.

---

## GET /applications/:id/transitions

Get workflow state transition history for a given application.

**Headers**

| Header           | Required | Description    |
|------------------|----------|----------------|
| Authorization    | Yes      | Bearer \<JWT\> |
| X-Correlation-ID | No       | Correlation ID |

**Response (200)**

```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "uuid",
      "application_id": "uuid",
      "from_state": "DRAFT",
      "to_state": "SUBMITTED",
      "triggered_by": "user-uuid",
      "triggered_role": "ROLE_RM",
      "authority_snapshot": {
        "max_loan_amount": "10000000"
      },
      "correlation_id": "uuid",
      "occurred_at": "2026-03-10T12:00:00Z"
    }
  ],
  "correlation_id": "uuid"
}
```

**Database table:** `workflow_schema.application_state_transitions`.
