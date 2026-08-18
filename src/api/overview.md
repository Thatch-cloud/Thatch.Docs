# API overview

> [!NOTE]
> **To be written.** Freeze this against the published OpenAPI document rather than
> hand-maintaining endpoint tables.

## Base URL

```
https://api.thatch.cloud/v1
```

## Shape of a request

Every request carries a bearer API key ([Authentication](../getting-started/authentication.md)),
sends and receives JSON, and is scoped to one account.

## Endpoints

<!-- TODO: generate this section from the public OpenAPI spec so it can't drift.
     The control plane already produces an OpenAPI artifact; decide whether to
     vendor it here or fetch it at build time. -->

| Resource | Description |
| --- | --- |
| [Jobs](jobs.md) | Submit work and read its state |

## Versioning

<!-- TODO: version policy — what constitutes a breaking change, how long a version
     is supported, how deprecations are announced. -->
