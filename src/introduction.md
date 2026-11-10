# Thatch Documentation

> [!NOTE]
> **Draft.** This site is being written alongside the platform. Pages marked
> _Partly written_ or _Not yet published_ say what is still to come — what they do
> say is settled.

**Thatch** runs AI models on its fleet of machines and serves them through one
OpenAI-compatible API. You call one API and get one bill; Thatch's control plane
decides which machine serves each request and keeps the fleet healthy.

## Where to start

| If you want to… | Go to |
| --- | --- |
| Send your first request | [Quickstart](getting-started/quickstart.md) |
| Understand the moving parts | [Core concepts](getting-started/concepts.md) |
| Wire up credentials | [Authentication](getting-started/authentication.md) |
| Read the endpoint reference | [API overview](api/overview.md) |
| Move existing OpenAI code across | [SDKs](api/sdks.md), [OpenAI compatibility](api/openai-compatibility.md) |
| Manage keys, usage, or invoices | [API keys](account/api-keys.md), [Usage & metering](account/usage.md), [Billing & invoices](account/billing.md) |
| Fix something that's broken | [Troubleshooting](support/troubleshooting.md) |

## Conventions

- Shell examples assume a POSIX shell and `curl`.
- `$THATCH_API_KEY` stands in for your API key — never paste a real key into a shared
  document, issue, or support ticket.
- Anything under **Support** is safe to link to customers directly.

## Improving these docs

Every page has an edit link in the top-right corner that opens a pull request against
[`Thatch-cloud/Thatch.Docs`](https://github.com/Thatch-cloud/Thatch.Docs). Corrections
are welcome, including from outside the org.
