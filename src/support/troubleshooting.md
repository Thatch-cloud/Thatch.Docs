# Troubleshooting

This page is organised by the symptom you see, not by the part of the system at
fault. API responses carry an `x-request-id` header — note it down before you
start; support will ask for it.

## `401 Unauthorized` on every request

Check that the header is `Authorization: Bearer <key>` — a key sent in an
`x-api-key` header or in the URL is not read — that the key hasn't been revoked or
rotated, and that you're not sending a key from a different environment. See
[Authentication](../getting-started/authentication.md).

## Every call from an OpenAI SDK returns `404`

The base URL must end at `/v1`: `https://api.thatch.cloud/v1`. The SDK appends the
endpoint path itself, so a base URL that already ends in `/chat/completions`
produces paths that do not exist (`404` with the code `unknown_url`). See
[SDKs](../api/sdks.md).

## `404` with the code `model_not_found`

Thatch does not serve the `model` in your request on this endpoint. Check, in
[`GET /v1/models`](../api/models.md):

- that the `id` matches exactly — IDs are case-sensitive;
- that the model's `task` matches the endpoint — `chat` for chat completions,
  `embed` for embeddings.

A model you have used before that has briefly dropped out of the list answers
`503 backend_unavailable` instead; see [Intermittent `5xx`](#intermittent-5xx).

## `403` with the code `model_not_allowed`

Your key is restricted to other models. See
[API keys](../account/api-keys.md#restricting-a-key-to-particular-models).

## Requests suddenly return `429`

Check the `code`. `rate_limit_exceeded` means you've hit the per-key request rate,
and `capacity_exhausted` means the model's serving capacity is full: for both,
wait for `Retry-After` and back off. `quota_exceeded` means the key has used its
token quota, and retrying won't help. See [Rate limits & quotas](../api/limits.md).

## `413` with an HTML body

The request body is too large, and was refused before it reached the API, which
is why the body is not JSON. Send a smaller request — for example, split a large
batch of embedding inputs across several requests.

## A `200` response with an `error` in the body

A non-streamed request that ran for a long time had its `200` status sent early,
and then failed. These responses carry the header `x-thatch-status-deferred: true`.
See [Long requests without streaming](../api/chat-completions.md#long-requests-without-streaming);
streaming avoids this.

## Intermittent `5xx`

Retry with backoff, respecting `Retry-After`. A `503` with the code
`backend_unavailable` or `overloaded` is usually brief. If it persists,
[contact support](contact.md) with the request IDs and timestamps.

<!-- TODO: add symptoms as real support tickets come in — this page should be driven
     by ticket volume, not guesswork. -->
