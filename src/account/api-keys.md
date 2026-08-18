# API keys

> [!NOTE]
> **To be written.**

## Creating a key

<!-- TODO: Portal walkthrough. Note that the secret is shown once and cannot be
     retrieved afterwards, if that's the behaviour. -->

## Rotating a key

Create the replacement first, deploy it, confirm traffic has moved, then revoke the old
key. Revoking before the replacement is live causes an outage.

## Revoking a key

<!-- TODO: how fast revocation takes effect. -->

## If a key leaks

Revoke it immediately, then rotate. Anything committed to a public repository, pasted
into a ticket, or printed in a CI log should be treated as leaked even if you deleted it
afterwards — assume it was scraped.
