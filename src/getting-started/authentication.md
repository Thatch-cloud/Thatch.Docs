# Authentication

Thatch authenticates API requests with an API key, sent as a bearer token in the
`Authorization` header:

```bash
curl https://api.thatch.cloud/v1/models \
  -H "Authorization: Bearer $THATCH_API_KEY"
```

That header is the only place a key is read from — not an `x-api-key` header,
and not the URL.

## API keys

- A key is `thatch_sk_` followed by 64 hexadecimal characters. Thatch keeps only
  a hash of it, so the full key is shown once, when it is created — see
  [API keys](../account/api-keys.md).
- A key belongs to your **organisation**, not to the person who created it, and
  every request made with it acts for that organisation. Usage is metered to the
  organisation.
- A key works until it is rotated or revoked: it has no expiry date.
- A key can call every model by default. Thatch can restrict a key to particular
  models — see [API keys](../account/api-keys.md#restricting-a-key-to-particular-models).
- A key is for calling the API, not for managing your account. Creating,
  rotating and revoking keys, inviting members and the like happen in the Portal,
  signed in as a member.

## What a failure looks like

A missing, malformed or revoked key is a `401`:

```
HTTP/2 401
www-authenticate: Bearer
x-request-id: 01M3JH9GQWS6MBE38KWKC74GQG

{"error":{"message":"missing or invalid credentials","type":"unauthorized"}}
```

A `503` with the type `backend_unavailable` means the key could not be checked
at that moment, not that it is invalid — retry after `Retry-After`. See
[Errors](../api/errors.md).

## Rules of thumb

- Keys are secrets. Store them in your platform's secret manager, not in source
  control, CI logs, or a `.env` committed by accident.
- Call the API from your server, never from a browser or a mobile app, where the
  key can be read by anyone using it.
- Rotate on a schedule, and immediately if a key may have been exposed — see
  [API keys](../account/api-keys.md).
- Use one key per application or environment so revoking one doesn't take
  everything else down with it.
