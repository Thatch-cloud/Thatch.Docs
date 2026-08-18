# Quickstart

> [!NOTE]
> **To be written.** This page should take a reader from nothing to a successful
> response in under five minutes, with no prior Thatch knowledge assumed.

## 1. Create an account

<!-- TODO: sign-up flow, and whether self-serve or invite-only at launch. -->

## 2. Create an API key

See [API keys](../account/api-keys.md).

```bash
export THATCH_API_KEY="..."
```

## 3. Send a request

<!-- TODO: replace with the real endpoint, payload, and response once the public
     API surface is frozen. -->

```bash
curl https://api.thatch.cloud/v1/... \
  -H "Authorization: Bearer $THATCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ }'
```

## 4. Next steps

- [Core concepts](concepts.md) — what a job, node, and region actually are.
- [API overview](../api/overview.md) — the full surface.
- [Rate limits & quotas](../api/limits.md) — before you scale up.
