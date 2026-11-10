# Contact support

> [!NOTE]
> **Partly written.** A support address and hours are not published yet.

Until a support address is published, contact your Thatch contact — the person
who set up your organisation.

<!-- TODO: support email/portal address, hours of coverage, target response times,
     and the escalation path for a production-down issue. -->

## What to include

A ticket with these details is usually resolved in one round trip instead of three:

- **Request IDs** for the failing calls — the `x-request-id` response header — and
  **timestamps in UTC**.
- The **exact error** returned — status code and body.
- The **model** you called, and the endpoint.
- What you expected instead, and when it last worked.

> [!WARNING]
> **Never include an API key, password, or any other secret in a ticket.** If a
> secret has already been sent to us, treat it as leaked: rotate or revoke it —
> see [API keys](../account/api-keys.md).
