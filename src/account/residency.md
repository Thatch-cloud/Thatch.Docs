# Data residency

<!-- This page carries compliance weight — every claim on it must be something the
     platform actually enforces and can evidence. Do not add a claim here until
     it is both enforced and evidenced, and signed off for publication. -->

> [!IMPORTANT]
> **Not yet published.** Thatch has not published its residency commitments yet.
> Until this page states them, do not rely on these docs for a residency or
> compliance decision — [contact support](../support/contact.md) and ask for the
> commitment you need in writing.

## Region labels in the API

[`GET /v1/models`](../api/models.md) reports a `region` and a `residency` label for
each model: the region reported by the machines serving it. They are
informational — not a guarantee about where any particular request, or the data
in it, is processed.

## Choosing a region

<!-- TODO: available regions, how a region is selected, and whether it can be
     changed. -->

## What is enforced

<!-- TODO: exactly what the residency guarantee covers — request payloads in
     transit and at rest, model weights, logs, metadata, backups, and the
     third parties that handle traffic or billing data — and what it does not. -->

## Evidencing it

<!-- TODO: what a customer can pull to show where their work ran, in what format,
     and how they can verify it independently. -->
