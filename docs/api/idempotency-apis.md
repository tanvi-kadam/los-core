# Idempotency (Middleware)

Idempotency is enforced via middleware and the `X-Idempotency-Key` header. There are no dedicated idempotency endpoints; the behavior applies to the following routes when the header is present.

**Applied routes**

- `POST /applications`
- `PUT /applications/:id`
- `POST /applications/:id/transition`
- `POST /approvals`
- `POST /approvals/:id/decision`

**Header**

| Header             | Required | Description                                      |
|--------------------|----------|--------------------------------------------------|
| X-Idempotency-Key  | No       | When present, duplicate requests return stored response or 409 |

**Logic**

1. If `X-Idempotency-Key` is missing, the request is processed normally.
2. If the key exists: compute a hash of the request body and look up the key.
3. If the key exists with the **same** request hash → return the stored response (200, same body as original).
4. If the key exists with a **different** request hash → return **409 Conflict**.
5. If the key does not exist → process the request and store the response for future replays.

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
