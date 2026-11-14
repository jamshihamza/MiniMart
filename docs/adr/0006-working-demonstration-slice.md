# ADR 0006: Working demonstration slice and its provisional decisions

- Status: Provisional (owner-delegated; pending owner review)
- Decision date: 2026-11-14
- Scope: demonstration build only (`pnpm demo`); not production behaviour

## Context

The owner asked for the project to be brought to a working demonstration without
further intervention, and explicitly delegated the authority to make or change
decisions on the way, subject to later review. Until then the repository held frozen
specifications, the Phase-0 foundation and visual references, but no business code.

Several things a runnable sale needs are either OPEN in the Decision Register, belong
to later backlog items, or depend on work that has not been built (authentication,
the contract-conformant Store API, tax policy). This ADR records what the
demonstration does in each of those places so that nothing provisional is mistaken
for an approved decision.

This ADR does not amend any frozen specification, the frozen backlog or the Decision
Register. Where it conflicts with frozen authority, frozen authority wins and the
demonstration code must change.

## Decision

A vertical slice was built on the frozen v1.2 database schema, unchanged:
catalog → pricing → inventory ledger → sale posting → payments → cash, shift and
Business Day, with a POS client and a Back Office client.

Structure:

- Domain modules (`packages/modules/*`) own their SQL behind public functions that take
  a `Sql` port from `@minimart/shared-kernel`.
- Coordinators (`packages/application/coordinators`) post each business operation in one
  database transaction together with its idempotency record, audit event and outbox
  message.
- `packages/query` composes read models.
- `packages/service-runtime` hosts a demonstration HTTP API under `/api/demo/v0`.
- `apps/store-node/src/demo.ts` starts a private PostgreSQL instance, migrates, seeds a
  demo store and serves the API with the built POS (`/pos/`) and Back Office
  (`/backoffice/`).

Provisional decisions (each one is a placeholder for the real decision):

| Area             | Demonstration behaviour                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| API              | `/api/demo/v0` is **not** the frozen Store API contract. It exists only to drive the demo clients.               |
| Authentication   | None. The actor is taken from the `X-MiniMart-User` header, default `demo.cashier`. No roles, PINs or approvals. |
| Network exposure | Loopback (`127.0.0.1`) only; the launcher refuses to start when `NODE_ENV=production`.                           |
| Tax              | Not calculated. Tax is recorded as 0 and the shelf price is the final price.                                     |
| Cash rounding    | None. Totals are exact to two decimals.                                                                          |
| Business date    | The store-local calendar date. The Business Day opens with the first shift and cannot be reopened once closed.   |
| Shifts           | One open shift per counter. A Business Day cannot be closed while a shift is open.                               |
| Negative stock   | Blocked. A sale or adjustment that would take on-hand below zero is rejected.                                    |
| Costing          | Moving weighted average cost, updated on inbound movements.                                                      |
| Card and DuitNow | Recorded as manually confirmed tenders with an optional reference. No payment provider is contacted.             |
| Receipt numbers  | `<counter>-NNNNNN`, sequential per counter.                                                                      |
| Money arithmetic | Exact decimals on the server; the clients never compute money (totals come from a server quote).                 |
| Embedded DB      | `embedded-postgres` with a fixed local-only demo password, data under `.demo-data/` (git-ignored).               |

Not implemented in the demonstration: returns and refunds, discounts and promotions,
customers and credit, procurement, accounting-lite, reports, country policy,
cloud sync, receipt printing on hardware, the Tauri POS wiring of the live screens
(the live POS runs in a browser; the existing Tauri shell is unchanged).

## Consequences

- The demonstration can be run and shown end to end on one PC.
- Every row above must be revisited against the Decision Register and the frozen
  specifications before any of this code is treated as product behaviour. The
  demonstration API must be replaced by the contract-conformant Store API, with
  authentication, before any non-loopback use.
- The live POS and Back Office screens follow the existing shell styling. They are not
  an implementation of the design packages, and the POS, Back Office and Inventory
  design packages are still not approved visual references.
- No physical hardware (printer, scanner, cash drawer) was exercised.
