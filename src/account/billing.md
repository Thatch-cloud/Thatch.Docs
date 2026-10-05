# Billing & invoices

> [!NOTE]
> **Partly written.** Who can see your billing and when a month closes are settled
> below; the rest of this page is still to come.

## Viewing your billing

Sign in to the Thatch Portal and open **Billing**. Signing in is enough: every
member of an organisation can see that organisation's billing there, and no API
key is required to view it.

If your login belongs to more than one organisation, you choose which one you are
viewing, and the page shows that organisation's billing.

The API is a different surface. Calls to `/v1/chat/completions`, `/v1/models` and
`/v1/usage` always authenticate with a `thatch_sk_` API key — a sign-in session is
not a credential for them. See [API keys](api-keys.md) and
[Authentication](../getting-started/authentication.md).

<!-- TODO: plans, payment methods, when an invoice is delivered after a month closes,
     taxes/GST, and what happens when a payment fails. -->

## When a month closes

Billing runs in calendar months, and a month is not closed the instant it ends: a
billing month becomes closable at 00:00 New Zealand time on day 2 of the following
month, after a 24-hour grace period.

For example, September 2026 became closable at 00:00 NZDT on Friday 2 October 2026.

Until October 2026 the grace period was 48 hours, and a month became closable on
day 3 of the following month. A shorter grace cannot lose or double-bill usage.

For a billing question that isn't answered here, [contact support](../support/contact.md).
