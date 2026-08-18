# Authentication

> [!NOTE]
> **To be written.**

Thatch authenticates API requests with a bearer API key issued from the Portal.

```bash
curl https://api.thatch.cloud/v1/... \
  -H "Authorization: Bearer $THATCH_API_KEY"
```

## Rules of thumb

- Keys are secrets. Store them in your platform's secret manager, not in source
  control, CI logs, or a `.env` committed by accident.
- Rotate on a schedule, and immediately if a key may have been exposed — see
  [API keys](../account/api-keys.md).
- Use one key per application or environment so revoking one doesn't take everything
  else down with it.

<!-- TODO: scopes/permissions model, key prefixes, expiry, and what an auth failure
     looks like on the wire (link to Errors). -->
