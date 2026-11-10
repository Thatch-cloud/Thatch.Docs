# Errors

## Error response format

Errors use OpenAI's envelope: an `error` object with a human-readable `message`
and a machine-readable `type`. Most errors also carry a `code`, and `param` when
one parameter is to blame.

```json
{
  "error": {
    "message": "key is not authorized for model 'example-model'",
    "type": "model_not_allowed",
    "param": "example-model",
    "code": "model_not_allowed"
  }
}
```

A field that does not apply may be absent or `null`. Branch on the HTTP status
and `code`; treat `message` as text for people, which may change.

Every response from an API endpoint, errors included, carries an `x-request-id`
header. Include it when you [contact support](../support/contact.md).

## Status codes

| Status | `code` (or `type`) | Meaning | What to do |
| --- | --- | --- | --- |
| `400` | `invalid_request` | The body is not valid JSON, or a required field is missing or malformed | Fix the request; retrying won't help |
| `400` | `unsupported_parameter`, `forbidden_parameter`, `invalid_value`, `missing_required_parameter` | A parameter is not accepted, or its value is out of range. `param` names it | Remove or fix the parameter — see [Chat completions](chat-completions.md#parameters) |
| `400` | `context_length_exceeded` | The prompt plus the requested completion does not fit the model's context window | Shorten the input or lower `max_tokens` — see `max_model_len` in [Models](models.md) |
| `401` | `unauthorized` | The API key is missing, malformed, or revoked | Check [Authentication](../getting-started/authentication.md) |
| `403` | `forbidden` | This credential is not allowed on this route — for example, a Portal sign-in used on an inference endpoint | Use an API key — see [Authentication](../getting-started/authentication.md) |
| `403` | `model_not_allowed` | The key is restricted to other models | Use a permitted model — see [API keys](../account/api-keys.md#restricting-a-key-to-particular-models) |
| `404` | `model_not_found` | No such model, or the wrong kind of model for this endpoint | Check `id` and `task` in [`GET /v1/models`](models.md) |
| `404` | `unknown_url` | An endpoint Thatch does not serve | Check the path — see [OpenAI compatibility](openai-compatibility.md) |
| `413` | `payload_too_large` | The request body is too large | Send a smaller request. A very large body can be refused before it reaches the API, with a non-JSON `413` |
| `429` | `rate_limit_exceeded` | The key has sent too many requests in the current window | Wait for `Retry-After`, then retry — see [Rate limits & quotas](limits.md) |
| `429` | `capacity_exhausted` | Serving capacity for the model is full | Wait for `Retry-After`, then retry |
| `429` | `quota_exceeded` | The key has used its token quota | Retrying won't help. [Contact support](../support/contact.md) |
| `502` | `backend_rejected` | The model server refused the request | Retry once; if it persists, contact support with the request ID |
| `503` | `backend_unavailable` | No machine serving that model can take the request right now — including a model that has briefly dropped out of [`GET /v1/models`](models.md) — or your key could not be checked | Wait for `Retry-After`, then retry with backoff |
| `503` | `overloaded` | The API is at its concurrency limit | Wait for `Retry-After`, then retry with backoff |
| `5xx` | — | A fault on our side | Retry with backoff; check [Status & incidents](../support/status.md) |

Errors from the authentication check — `401`, `403`, and a `503` when the key
could not be checked — carry only `message` and `type` (`unauthorized`,
`forbidden` or `backend_unavailable`), with no `code`:

```json
{ "error": { "message": "missing or invalid credentials", "type": "unauthorized" } }
```

## Retries

Retry `429` (except `quota_exceeded`) and `5xx` with exponential backoff and
jitter, and never sooner than the `Retry-After` header says. Do not retry:

- `429 quota_exceeded`, or any other `4xx` — the request will fail identically
  every time;
- a response carrying `x-should-retry: false`, which marks a failure that will
  not succeed on retry.

There are no idempotency keys: a retried request is a new request. A request
refused with an error status is not metered, so retrying it does not
double-bill — but retrying a request that succeeded and whose response you lost
will run, and be metered, again. (A stream that fails part-way is metered for
what it generated before the failure.)

## Errors after a `200`

Two cases deliver an error with a `200` status, because the status had already
been sent when the failure happened. The headers have gone too, so there is no
`Retry-After` or `x-should-retry` to read — use your own backoff:

- **Streaming** — the error arrives as a `data:` event. See
  [Errors during a stream](chat-completions.md#errors-during-a-stream).
- **Long non-streamed requests** — marked by `x-thatch-status-deferred: true`. See
  [Long requests without streaming](chat-completions.md#long-requests-without-streaming).
