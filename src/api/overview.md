# API overview

Thatch's customer-facing API is **OpenAI-compatible**. If you already have code
talking to an OpenAI-shaped endpoint, you point it at Thatch by changing the base
URL and the key — see [SDKs](sdks.md).

## Base URL

```
https://api.thatch.cloud/v1
```

## Authentication

A bearer API key, issued from the Portal and prefixed `thatch_sk_`:

```bash
curl https://api.thatch.cloud/v1/models \
  -H "Authorization: Bearer $THATCH_API_KEY"
```

A missing or invalid key is a `401`. See [Authentication](../getting-started/authentication.md)
and [Errors](errors.md).

## The surface

| Endpoint | Purpose |
| --- | --- |
| `POST /v1/chat/completions` | Generate a response to a conversation, whole or streamed — [Chat completions](chat-completions.md) |
| `POST /v1/embeddings` | Turn text into vectors — [Embeddings](embeddings.md) |
| `GET /v1/models` | The models being served right now — [Models](models.md) |
| `POST /v1/responses` | The Responses API request shape, served by the chat pipeline — [OpenAI compatibility](openai-compatibility.md#responses) |
| `POST /v1/completions` | The legacy text-completions request shape — [OpenAI compatibility](openai-compatibility.md#legacy-completions) |
| `GET /v1/usage` | The calling key's own usage to date — [Usage & metering](../account/usage.md#reading-usage-over-the-api) |

An OpenAI endpoint Thatch does not serve answers `404` with the code `unknown_url`.
[OpenAI compatibility](openai-compatibility.md) lists what is and isn't
supported compared with OpenAI's API.

Usage figures from `GET /v1/usage` are scoped to the calling key. Your
organisation's usage and billing are in the Portal — see
[Usage & metering](../account/usage.md).

## Request IDs

Every response from an API endpoint carries an `x-request-id` header, errors
included. Quote it when
you [contact support](../support/contact.md) — it is the fastest way for us to
find your request.

To correlate requests with your own logs, send an `X-Request-Id` header and the
same value is used and echoed back. It must be 1–128 characters of letters,
digits, `.`, `_`, `:` and `-`; anything else is replaced with a generated ID.

## Endpoint reference

The per-endpoint reference will be generated from the control plane's own
OpenAPI contract, filtered to the operations that are public, and committed to
this repository so it cannot silently disagree with what the API serves. The
tooling is in place; it is waiting on the control plane to emit a contract for
the serving surface. Until then, the pages in this chapter describe the
surface, and OpenAI's API reference is the field-by-field reference for the
request and response shapes.

## Versioning

The API is versioned in the path: every endpoint is under `/v1`.

<!-- TODO: version policy — what counts as a breaking change, how long a version
     is supported, and how deprecations are announced. None is stated yet. -->
