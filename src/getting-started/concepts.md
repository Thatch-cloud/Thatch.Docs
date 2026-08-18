# Core concepts

The vocabulary below is used consistently throughout these docs and in the Portal.

## The fabric

Thatch is a **decentralised distributed data center**: a fleet of independently-owned
machines — in substations, towers, and homes — presented as one coordinated region.
Nodes are not assumed to be trustworthy; the control plane is what makes the pooled
result dependable.

## Node

A single participating machine. Each node runs an agent that registers it, reports its
capacity, health, and power, and executes the work scheduled onto it. Nodes are
heterogeneous: they differ in architecture, accelerators, and available resources.

## Control plane

The coordinating layer. It owns registration, scheduling and routing, billing, and
residency enforcement. As a customer you only ever talk to the control plane's API —
never to a node directly.

## Job

A unit of submitted work, with requirements attached (what it needs to run on). The
scheduler decides placement; the job then carries a state and, on completion, an exit
result.

## Region and residency

Work is pinned to a region so data stays inside the jurisdiction you selected. See
[Data residency](../account/residency.md).

<!-- TODO: expand each section once the public API's object model is frozen; add a
     diagram of request → control plane → node → response. -->
