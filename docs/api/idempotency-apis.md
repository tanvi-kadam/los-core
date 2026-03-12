# Idempotency (Middleware)

Idempotency is enforced via middleware and the `X-Idempotency-Key` header. For the write routes listed below, the header is **required**; requests without it are rejected with **400 Bad Request**.

**Routes that require idempotency**

- `POST /applications`
- `PUT /applications/:id`
- `POST /applications/:id/submit`
- `POST /applications/:id/transition`
- `POST /approvals`
- `POST /approvals/:id/decision`

**Header**

| Header             | Required | Description                                      |
|--------------------|----------|--------------------------------------------------|
| X-Idempotency-Key  | Yes      | Required for the routes above. Duplicate requests (same key + same body) return stored response; same key + different body returns 409. |

**Scope**

Idempotency is scoped by **(key, endpoint)**. The same key can be used for different endpoints (e.g. one key for create, another for submit). Lookup and replay use both the key and the request endpoint (method + path).

**Logic**

1. If `X-Idempotency-Key` is **missing** on a route that requires it → **400 Bad Request**.
2. If the key is present: compute a hash of the request body and look up by **(key, endpoint)**.
3. If a record exists with the **same** request hash → return the stored response (200, same body as original).
4. If a record exists with a **different** request hash → return **409 Conflict**.
5. If no record exists → process the request and store the response for future replays.

**Response (400 — missing header)**

When the request is to a write route and `X-Idempotency-Key` is missing:

```json
{
  "status": "ERROR",
  "message": "X-Idempotency-Key is required for this request",
  "correlation_id": "uuid"
}
```

**Response (replay, 200)**

Same as the original successful response:

```json
{
  "status": "SUCCESS",
  "data": { ... },
  "correlation_id": "uuid"
}
```

**Response (409 Conflict)**

```json
{
  "status": "ERROR",
  "message": "Idempotency key already used with a different request body",
  "correlation_id": "uuid"
}
```

**Database table**

- `idempotency_schema.idempotency_keys`: `id`, `idempotency_key`, `endpoint`, `user_id`, `request_hash`, `response_snapshot` (JSONB), `status`, `expires_at`, `created_at`. Keys expire after 24 hours.
