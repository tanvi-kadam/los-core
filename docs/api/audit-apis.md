# Audit Module

The audit module does not expose HTTP endpoints. It provides `AuditService.record()` for other modules to log significant actions.

**Usage**

Inject `AuditService` and call:

```ts
await this.auditService.record({
  actorId: userId,
  actorRole: roleName,
  authoritySnapshot: { ... },
  actionType: 'CREATE',
  objectType: 'APPLICATION',
  objectId: applicationId,
  beforeStateHash: null,
  afterStateHash: hash,
  correlationId: req.correlationId,
});
```

**Database table**

- `audit_schema.audit_logs`: `id`, `actor_id`, `actor_role`, `authority_snapshot` (JSONB), `action_type`, `object_type`, `object_id`, `before_state_hash`, `after_state_hash`, `occurred_at`, `correlation_id`.

Every module must call `AuditService.record()` for relevant actions (e.g. application create, submit, workflow transition, approval decision).
