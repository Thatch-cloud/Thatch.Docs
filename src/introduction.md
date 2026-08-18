# Thatch Documentation

> [!NOTE]
> **Draft.** This site is being written alongside the platform. Pages marked
> _To be written_ are placeholders — the structure is settled, the detail is not.

**Thatch** pools independently-owned, heterogeneous compute and storage nodes into a
single coordinated, sovereign-by-region fabric for AI inference. You get one API and
one bill; the fabric handles placement, health, and residency across the fleet.

## Where to start

| If you want to… | Go to |
| --- | --- |
| Send your first request | [Quickstart](getting-started/quickstart.md) |
| Understand the moving parts | [Core concepts](getting-started/concepts.md) |
| Wire up credentials | [Authentication](getting-started/authentication.md) |
| Read the endpoint reference | [API overview](api/overview.md) |
| Manage keys, usage, or invoices | [Account & billing](account/accounts.md) |
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
