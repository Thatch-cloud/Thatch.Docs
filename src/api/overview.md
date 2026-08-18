# API overview

> [!NOTE]
> **To be written.** The per-endpoint detail on this page is deliberately thin:
> it will be generated from the control plane's OpenAPI contract rather than
> written by hand, so that it cannot drift. See _Endpoint reference_ below.

Thatch's customer-facing API is **OpenAI-compatible**. If you already have code
talking to an OpenAI-shaped endpoint, you point it at Thatch by changing the base
URL and the key.

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

A missing or invalid credential is a `401`; a valid credential that is not
permitted on the route is a `403`. See [Authentication](../getting-started/authentication.md)
and [Errors](errors.md).

## The surface

| Endpoint | Purpose |
| --- | --- |
| `POST /v1/chat/completions` | Submit a completion request and get a response |
| `GET /v1/models` | The model catalogue available to your key |
| `GET /v1/usage` | Your own usage, scoped to the calling identity |

<!-- TODO: confirm availability before describing these as live — the serving
     backend behind /v1/chat/completions was still landing when this page was
     drafted. Add streaming behaviour, and the request/response shape, from the
     generated reference rather than by hand. -->

Usage figures here are scoped to the caller. Account-wide billing lives in the
Portal — see [Usage & metering](../account/usage.md).

## Endpoint reference

The per-endpoint reference is generated from the control plane's own OpenAPI
contract, filtered to the operations that are public, and committed to this
repository so it cannot silently disagree with what the API serves. The tooling
is in place; it is waiting on the control plane to emit a contract for the
serving surface. Until then, this page is the surface.

## Versioning

<!-- TODO: version policy — what counts as a breaking change, how long a version
     is supported, and how deprecations are announced. -->
