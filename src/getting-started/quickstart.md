# Quickstart

This page takes you from an invitation to a first successful response.

## 1. Accept your invitation

Thatch accounts are invite-only: Thatch sets up your organisation, and you join
it from an email invitation. Open the link in the email — it works once and
expires after seven days — choose a password, and you are signed in to the
Portal at <https://app.thatch.cloud>.

No invitation? Talk to your Thatch contact, or ask an admin of your
organisation to invite you. See [Accounts & organisations](../account/accounts.md).

## 2. Create an API key

In the Portal, open **Developers** and, under **Create API key**, click
**Create key**.

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

First, see which models are being served:

```bash
curl https://api.thatch.cloud/v1/models \
  -H "Authorization: Bearer $THATCH_API_KEY"
```

Then send a chat completion request, using the `id` of a model whose `task` is
`chat`:

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

The answer is in `choices[0].message.content`. If you get an error instead,
[Troubleshooting](../support/troubleshooting.md) is organised by symptom.

## 4. Next steps

- [SDKs](../api/sdks.md) — the same request from Python or Node.js.
- [Chat completions](../api/chat-completions.md) — streaming, tools, and reasoning.
- [Core concepts](concepts.md) — organisations, keys, models, and how a request is served.
- [Rate limits & quotas](../api/limits.md) — before you scale up.
