# Glossary

**Admin** — an organisation role that can manage members and every API key in the
organisation. See [Accounts & organisations](account/accounts.md#roles).

**API key** — the credential code uses to call the API, prefixed `thatch_sk_`. It
belongs to an organisation. See [API keys](account/api-keys.md).

**Cached input** — prompt tokens served from the model's prompt cache, metered at
their own rate, currently lower than other input. See [Usage & metering](account/usage.md).

**Control plane** — the coordinating layer behind the API. It authenticates
requests, applies limits, decides which machine serves each request, and meters
usage. Customers talk only to its API.

**Member** — an organisation role that can use the organisation, create API keys,
and manage the keys they created. See [Accounts & organisations](account/accounts.md#roles).

**Model ID** — the `id` of a model in [`GET /v1/models`](api/models.md), passed as
`model` in a request.

**Node** — one machine in Thatch's fleet, serving one or more models.

**Organisation** — what members, API keys, usage, and billing belong to. One login
can belong to several. See [Accounts & organisations](account/accounts.md).

**Portal** — the web app at <https://app.thatch.cloud> where members manage their
organisation.

**Region** — a label on each model in [`GET /v1/models`](api/models.md) naming where
it is served. See [Data residency](account/residency.md).

**Request ID** — the `x-request-id` header on API responses. Quote it to support.

**Token** — the unit models read and write text in, and the unit usage is metered
in.

<!-- TODO: keep this list to terms a customer will actually meet in the API, the
     Portal, or a support conversation. Internal crate and service names do not
     belong here. -->
