# Usage & metering

> [!NOTE]
> **Partly written.** How usage is measured is settled below; per-model prices
> are not published yet.

## What is metered

Usage is metered in **tokens**, per model, at three rates per million tokens:

| Rate | Applies to |
| --- | --- |
| Input | Prompt tokens — `usage.prompt_tokens` in the response |
| Cached input | Prompt tokens served from the model's prompt cache, at their own, currently lower, rate |
| Output | Completion tokens — `usage.completion_tokens`, which includes any reasoning tokens |

[Embeddings](../api/embeddings.md) are metered on their input tokens.

<!-- TODO: per-model prices, and where customers find them. Neither /v1/models
     nor the Portal publishes them yet. -->

## When usage is recorded

Each request is metered once, when it finishes, from the token counts the model
reports — the same counts as the `usage` in the response. It is priced at the
rates in force when the request was served.

- A request refused with an error status — a `4xx`, including `429`, or a
  `5xx` — is not metered.
- A streamed request that ends early — your client disconnects, or the stream
  fails part-way — is metered for the tokens generated up to that point.
- Asking for usage in a stream, or not, makes no difference to metering: every
  request is metered either way.

Each request's charge is kept to a millionth of a currency unit; amounts are
rounded to cents only on the invoice. See [Billing & invoices](billing.md).

## Viewing your usage

Sign in to the Thatch Portal and open **Cost & usage**. Signing in is enough: every
member of an organisation can see that organisation's usage there, and no API key
is required to view it. If your login belongs to more than one organisation, you
choose which one you are viewing, and the page shows that organisation's usage.

The page covers the current and the previous month, broken down by line and by
model, and exports to CSV. Amounts are shown excluding GST.

## Reading usage over the API

`GET /v1/usage` reports on the **API key that calls it**: that key's totals since
it was created, overall and per model. Call it with the key whose usage you want.
For your organisation's usage across all its keys, use the Portal.

```bash
curl https://api.thatch.cloud/v1/usage \
  -H "Authorization: Bearer $THATCH_API_KEY"
```

```json
{
  "key_id": "…",
  "label": "…",
  "totals": {
    "requests": 1200,
    "prompt_tokens": 400000,
    "completion_tokens": 100000,
    "cached_prompt_tokens": 50000,
    "total_tokens": 500000,
    "cost_micro": 1234567,
    "currency": "NZD",
    "unpriced_requests": 0
  },
  "by_endpoint": [
    { "model": "<model-id>", "requests": 1200, "prompt_tokens": 400000, "…": "…" }
  ]
}
```

| Field | Meaning |
| --- | --- |
| `requests` | Requests metered |
| `prompt_tokens`, `completion_tokens`, `total_tokens` | Token totals |
| `cached_prompt_tokens` | Prompt tokens served from cache; `null` where this was not measured |
| `cost_micro` | Cost so far, in millionths of `currency` — divide by 1,000,000. Excludes GST |
| `currency` | ISO 4217 currency code, or `null` if nothing could be priced |
| `unpriced_requests` | Requests to a model with no price set; they are not included in `cost_micro` |
| `by_endpoint` | The same totals, per model |
