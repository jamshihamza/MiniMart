# Provider Adapter Contract v0.2

Normative machine contract: `contracts/provider-adapter-v1.schema.json`.

The port is provider-neutral and versioned. It supports capability
negotiation for payment initiate/query/cancel and refund initiate/query
where an adapter actually supports them.

Every request carries a stable MiniMart request identity and exact
decimal amount/currency. Results are
CONFIRMED/FAILED/PENDING/UNCERTAIN/CANCELLED and never expose provider
SDK DTOs to core modules.

Provider calls are outside PostgreSQL Posting Envelope transactions.
