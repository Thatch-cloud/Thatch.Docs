# Errors

> [!NOTE]
> **To be written.**

## Error response format

<!-- TODO: the canonical error envelope — code, message, request id — and confirm it
     matches what the control plane actually returns. -->

## Status codes

| Code | Meaning | What to do |
| --- | --- | --- |
| `400` | Malformed request | Fix the payload; retrying won't help |
| `401` | Missing or invalid API key | Check [Authentication](../getting-started/authentication.md) |
| `403` | Key lacks permission for this resource | Check the key's scope |
| `404` | No such resource, or not visible to this account | |
| `429` | Rate limited | Back off — see [Rate limits & quotas](limits.md) |
| `5xx` | Fault on our side | Retry with backoff; check [Status](../support/status.md) |

## Retries

Retry `429` and `5xx` with exponential backoff and jitter. Never retry `4xx` other than
`429` — the request will fail identically every time.

<!-- TODO: idempotency keys — are they supported, and on which endpoints? -->
