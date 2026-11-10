# Rate limits & quotas

> [!NOTE]
> **Partly written.** How the limits behave is settled below; the numbers are
> not published yet.

## Limits

The request rate and the token quota are applied **per API key**; the others
apply to the API, or to the model, as a whole.

| Limit | Applies to | When you hit it |
| --- | --- | --- |
| Request rate | Requests per key, counted over a one-minute window | `429` `rate_limit_exceeded`, with `Retry-After` |
| Token quota | Tokens per key, where a key has a quota | `429` `quota_exceeded`, with no `Retry-After` |
| Serving capacity | Requests a model's serving capacity can take at once | `429` `capacity_exhausted`, with `Retry-After` |
| Concurrency | Requests in flight on the API | `503` `overloaded`, with `Retry-After` |
| Request size | The size of the request body | `413` `payload_too_large` |
| Context window | Prompt plus completion, per model | `400` `context_length_exceeded` |

Because the request rate is per key, separate applications with separate keys
do not share a rate limit — one more reason to use a key per application or environment
(see [Authentication](../getting-started/authentication.md)).

<!-- TODO: the actual numbers — requests per window, the token quota, and the
     request size limit — and whether they differ per customer. -->

## Reading your current usage

There are no `x-ratelimit-*` headers. A `429 rate_limit_exceeded` tells you how
long to wait in `Retry-After`, in seconds, until the window resets.

For tokens used so far, call [`GET /v1/usage`](../account/usage.md#reading-usage-over-the-api)
with the key in question.

## When you hit a limit

- **`429 rate_limit_exceeded`** — wait at least `Retry-After` seconds, then retry
  with exponential backoff and jitter. Retrying immediately only extends the wait.
- **`429 capacity_exhausted`** — the model's serving capacity is full. Wait for
  `Retry-After` and retry.
- **`429 quota_exceeded`** — the key has used its token quota, and retrying won't
  help. [Contact support](../support/contact.md).
- **`503 overloaded`** — the API is briefly at capacity. Wait for `Retry-After`
  and retry with backoff.

If you need a higher ceiling, [contact support](../support/contact.md). Requests
refused with `429` are not metered.
