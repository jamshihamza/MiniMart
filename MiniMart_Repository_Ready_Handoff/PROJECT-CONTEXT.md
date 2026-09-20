# MiniMart Project Context

MiniMart is an offline-first retail POS and retail-management platform
designed to scale from one counter to multi-counter, multi-store and
later cloud management.

## Deployment model

A store has a local Store Node and PostgreSQL authority. In a
one-counter installation these may run on the POS PC. In a multi-counter
store a designated server/back-office PC runs Store Node + PostgreSQL
and counters connect over LAN. Cloud connectivity is optional for local
store operation.

## Primary product surfaces

-   POS desktop shell
-   Back Office desktop shell
-   Cloud management shell (no cloud checkout)

## Business coverage

Organization/IAM, catalog, pricing, suppliers/procurement, inventory,
POS sales, payments/recovery, returns/refunds, customer/credit, cashier
shifts/business day, Accounting-Lite, country policy, reporting, audit,
import/export, hardware, backup/recovery and support diagnostics.

## Country roadmap

Malaysia first, India next. Current legal/statutory values must be
verified from authoritative sources at implementation time. Core code
remains country-neutral and country behavior is versioned/configured
through country packs.

## Implementation principle

The specifications were deliberately frozen before coding. Coding agents
must implement them, not redesign them opportunistically.
