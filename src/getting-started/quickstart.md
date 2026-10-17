# Quickstart

> [!NOTE]
> **Partly written.** Steps 2 and 3 are settled; the sign-up flow in step 1 is
> still to come.

## 1. Create an account

<!-- TODO: sign-up flow, and whether self-serve or invite-only at launch. -->

## 2. Create an API key

In the Portal, open **Developers** and click **Create API key**.

The key's secret is shown once, at creation, and cannot be retrieved afterwards.
Copy it somewhere safe before you leave the page — if you lose it, the only way
forward is to rotate the key. Keys are prefixed `thatch_sk_`.

```bash
export THATCH_API_KEY="..."
```

See [API keys](../account/api-keys.md) for who may create, rotate, and revoke keys.

## 3. Send a request

The API is OpenAI-compatible: if you already have code talking to an
OpenAI-shaped endpoint, you can point it at Thatch by changing the base URL
(`https://api.thatch.cloud/v1`) and the key.

First, see which models are available to your key:

```bash
curl https://api.thatch.cloud/v1/models \
  -H "Authorization: Bearer $THATCH_API_KEY"
```

Then send a completion request, using a model id from that response:

```bash
curl https://api.thatch.cloud/v1/chat/completions \
  -H "Authorization: Bearer $THATCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "messages": [
      { "role": "user", "content": "Hello" }
    ]
  }'
```

## 4. Next steps

- [Core concepts](concepts.md) — what a job, node, and region actually are.
- [API overview](../api/overview.md) — the full surface.
- [Rate limits & quotas](../api/limits.md) — before you scale up.
