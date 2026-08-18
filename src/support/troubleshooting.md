# Troubleshooting

> [!NOTE]
> **To be written.** Organise this page by the symptom a customer sees, not by the
> subsystem at fault — they don't know which subsystem it is.

## `401 Unauthorized` on every request

Check that the header is `Authorization: Bearer <key>`, that the key hasn't been
revoked, and that you're not sending a key from a different environment. See
[Authentication](../getting-started/authentication.md).

## Requests suddenly return `429`

You've hit a rate limit. See [Rate limits & quotas](../api/limits.md).

## A job never leaves its initial state

<!-- TODO: what this means (no node currently satisfies the requirements?), how long is
     normal, and what to check. -->

## Intermittent `5xx`

Retry with backoff. If it persists, check [Status & incidents](status.md) before
opening a ticket.

<!-- TODO: add symptoms as real support tickets come in — this page should be driven
     by ticket volume, not guesswork. -->
