# Core concepts

The vocabulary below is used consistently throughout these docs and in the Portal.

## Organisation

Everything you do on Thatch belongs to an organisation: its members, its API
keys, its usage, and its bill. One login can belong to several organisations.
See [Accounts & organisations](../account/accounts.md).

## API key

The credential your code uses to call the API. A key belongs to an
organisation, and every request made with it is metered to that organisation.
See [Authentication](authentication.md) and [API keys](../account/api-keys.md).

## Portal

The web app at <https://app.thatch.cloud> where members sign in to manage keys,
members, usage and billing. The Portal is for people; the API is for code.

## Model

A model Thatch serves, identified by its `id`. A model is either a **chat**
model, for [chat completions](../api/chat-completions.md), or an **embedding**
model, for [embeddings](../api/embeddings.md). The models being served right now
are listed by [`GET /v1/models`](../api/models.md).

## How a request is served

Your code sends a request to the API at `api.thatch.cloud`. Thatch's **control
plane** — the coordinating layer behind the API — authenticates it, checks your
limits, and sends it to a machine in Thatch's fleet that is currently serving
the model you asked for. The response comes back the same way, and the tokens
it used are metered to your organisation.

You call the API; Thatch decides which machine serves each request. If no
machine serving that model can take the request, the API answers with an error
you can retry — see [Errors](../api/errors.md).

## Tokens and usage

Models read and write text as **tokens** — fragments of words. Every request
reports the tokens it used, and usage is metered on them. See
[Usage & metering](../account/usage.md).

## Region and residency

Each model in [`GET /v1/models`](../api/models.md) carries a `region` label. What
Thatch commits to about where your data is processed is on
[Data residency](../account/residency.md).
