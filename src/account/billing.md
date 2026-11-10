# Billing & invoices

> [!NOTE]
> **Partly written.** How and when you are billed is settled below; payment
> methods, overseas tax, and late payment are still to come.

## Viewing your billing

Sign in to the Thatch Portal and open **Billing**. Signing in is enough: every
member of an organisation can see that organisation's billing there, and no API
key is required to view it.

If your login belongs to more than one organisation, you choose which one you are
viewing, and the page shows that organisation's billing.

The API is a different surface. The inference endpoints — chat completions,
embeddings, models — always authenticate with a `thatch_sk_` API key; a sign-in
session is not a credential for them. See [API keys](api-keys.md) and
[Authentication](../getting-started/authentication.md).

## How you are billed

You are billed monthly, in arrears, for the usage metered during the month — see
[Usage & metering](usage.md).

- **Currency.** New Zealand dollars (NZD).
- **GST.** Prices and the amounts in the Portal exclude GST. For New Zealand
  customers, GST at 15% is added on the tax invoice.

<!-- TODO: billing customers outside New Zealand — currency and GST treatment. -->

## When a month closes

Billing runs in calendar months, and a month is not closed the instant it ends: a
billing month becomes closable at 00:00 New Zealand time on day 2 of the following
month, after a 24-hour grace period.

For example, September 2026 became closable at 00:00 NZDT on Friday 2 October 2026.

Until October 2026 the grace period was 48 hours, and a month became closable on
day 3 of the following month. A shorter grace cannot lose or double-bill usage.

Usage that reaches billing after its month has closed is not lost: it appears on
the next invoice as adjustment lines naming the earlier month.

## Invoices

After a month closes, its invoice is issued. Each line totals one model and rate
for the month.

- **Delivery.** The invoice is emailed to your organisation's billing email
  address, as a link to view it online. To change the address invoices go to,
  [contact support](../support/contact.md).
- **Due date.** Payment is due 7 days after the invoice is issued.
- **In the Portal.** **Billing** lists your issued invoices — number, period,
  status, and subtotal excluding GST — and exports them to CSV. The emailed
  invoice is the tax invoice.

<!-- TODO: payment methods, and what happens when a payment is late or fails. -->

For a billing question that isn't answered here, [contact support](../support/contact.md).
