# Usage & metering

> [!NOTE]
> **Partly written.** Who can see your usage is settled below; the metering detail
> is still to come.

## Viewing your usage

Sign in to the Thatch Portal and open **Cost & Usage**. Signing in is enough: every
member of an organisation can see that organisation's usage there, and no API key
is required to view it. If your login belongs to more than one organisation, you
choose which one you are viewing, and the page shows that organisation's usage.

Reading usage over the API is different: `GET /v1/usage` always requires a
`thatch_sk_` API key, and what it returns is scoped to that key rather than to your
organisation. See [API overview](../api/overview.md) and [API keys](api-keys.md).

<!-- TODO: the billable unit, how it is measured, how often usage is aggregated, and
     how soon it appears in the Portal. Be precise here — metering questions are the
     most common source of billing disputes. -->
