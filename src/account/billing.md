# Billing & invoices

> [!NOTE]
> **Partly written.** Who can see your billing is settled below; the rest of this
> page is still to come.

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

<!-- TODO: plans, payment methods, billing period, invoice delivery, taxes/GST, and
     what happens when a payment fails. -->

For a billing question that isn't answered here, [contact support](../support/contact.md).
