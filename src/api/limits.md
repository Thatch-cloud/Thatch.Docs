# Rate limits & quotas

> [!NOTE]
> **To be written.**

## Limits

<!-- TODO: the actual numbers, per plan, and whether they're per key or per account. -->

## Reading your current usage

<!-- TODO: response headers that report remaining quota, if any. -->

## When you hit a limit

You get a `429` ([Errors](errors.md)). Back off exponentially rather than retrying
immediately. If you need a higher ceiling, [contact support](../support/contact.md).
