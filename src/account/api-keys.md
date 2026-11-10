# API keys

API keys authenticate calls to the API. You manage them in the Portal, on the
**Developers** page. See [Authentication](../getting-started/authentication.md)
for how a key is sent and what it can do.

## Creating a key

In the Portal, open **Developers** and, under **Create API key**, click
**Create key**. Give the key a label that says where it will be used —
`billing-service-production`, say — so the key list stays readable.

The key's secret is shown once, at creation, and cannot be retrieved afterwards.
Copy it somewhere safe before you leave the page — if you lose it, the only way
forward is to rotate the key.

The key list shows each key's label, when it was created, and when it was last
used. It never shows a secret again.

Who can manage a key:

- Any member of an organisation can create keys for it, and can rotate or revoke
  the keys they created.
- Organisation admins can manage every key in the organisation, including keys
  created by other members.
- A key with no recorded creator is admin-only: an organisation's admins — and
  Thatch's own — can manage it, but a member cannot.
- An API key can never manage keys. Creating, rotating and revoking happen in the
  Portal as a signed-in member, never by authenticating with a key.

A key belongs to the organisation, not to the member who created it — the
creator is recorded so you know who to ask about it.

## Rotating a key

**Rotate** gives an existing key a new secret, keeping its label. The old secret
stops working **immediately** — there is no overlap — so anything still using it
starts getting `401`s until it has the new one.

To replace a key without an outage, use a second key instead: create the
replacement, deploy it, confirm traffic has moved (the old key's **last used**
time stops advancing), then revoke the old key. Revoking before the replacement
is live causes an outage.

## Revoking a key

Revoking is permanent, and takes effect on the next request: there is no cache
to wait out. Revoked keys are hidden from the list; **Show revoked keys** brings
them back, marked revoked.

## When a member leaves

Removing a member from the organisation does **not** revoke the keys they
created — those belong to the organisation, and may be in production. When you
remove someone, the Portal lists their keys and offers to revoke them. Decide
key by key: rotate or replace anything the person had a copy of.

## Restricting a key to particular models

By default a key can call every model Thatch serves. Thatch can restrict a key to
particular models; [contact support](../support/contact.md) to set this up. A
restricted key calling any other model gets `403` with the code
`model_not_allowed`.

## If a key leaks

Rotate or revoke it immediately — either stops the leaked secret working on the
next request. Anything committed to a public repository, pasted
into a ticket, or printed in a CI log should be treated as leaked even if you deleted it
afterwards — assume it was scraped.
