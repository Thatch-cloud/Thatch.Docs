# Glossary

**Control plane** — the coordinating layer that owns registration, scheduling and
routing, billing, and residency enforcement. Customers talk only to its API.

**DDDC** — decentralised distributed data center. The category Thatch is in: pooling
independently-owned, heterogeneous machines into one coordinated fabric.

**Fabric** — the pooled fleet presented as a single coordinated region.

**Job** — a unit of submitted work with requirements attached; the scheduler places it
and it carries a state through to completion. Jobs are how the fabric schedules work
internally; as a customer you submit requests to the [API](api/overview.md) rather than
creating jobs directly.

**Node** — one participating machine, running the node agent that registers it, reports
capacity, health, and power, and executes scheduled work.

**Node agent** — the software running on a node that connects it to the control plane.

**Placement** — the scheduler's decision about which node runs a given job.

**Region** — the jurisdictional boundary work is pinned to. See
[Data residency](account/residency.md).

**Residency** — the guarantee that work and its data stay inside a chosen region.

**Trust-minimised** — the fleet is coordinated without requiring the individual nodes,
or their owners, to be trusted.

<!-- TODO: keep this list to terms a customer will actually meet in the API, the
     Portal, or a support conversation. Internal crate and service names do not
     belong here. -->
