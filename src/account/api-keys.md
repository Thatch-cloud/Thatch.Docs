# API keys

> [!NOTE]
> **Partly written.** Creating a key and who may manage one is settled below; the
> rest of this page is still to come.

## Creating a key

In the Portal, open **Developers** and click **Create API key**.

The key's secret is shown once, at creation, and cannot be retrieved afterwards.
Copy it somewhere safe before you leave the page — if you lose it, the only way
forward is to rotate the key. See [Authentication](../getting-started/authentication.md).

Who can manage a key:

- Any member of an organisation can create keys for it, and can rotate or revoke
  the keys they created.
- Organisation admins can manage every key in the organisation, including keys
  created by other members.
- A key with no recorded creator is admin-only: an organisation's admins — and
  Thatch's own — can manage it, but a member cannot.
- An API key can never manage keys. Creating, rotating and revoking happen in the
  Portal as a signed-in member, never by authenticating with a key.

<!-- TODO: Portal walkthrough in full — naming, per-key settings, and what the
     key list shows. -->

## Rotating a key

Create the replacement first, deploy it, confirm traffic has moved, then revoke the old
key. Revoking before the replacement is live causes an outage.

## Revoking a key

<!-- TODO: how fast revocation takes effect. -->

## If a key leaks

Revoke it immediately, then rotate. Anything committed to a public repository, pasted
into a ticket, or printed in a CI log should be treated as leaked even if you deleted it
afterwards — assume it was scraped.
