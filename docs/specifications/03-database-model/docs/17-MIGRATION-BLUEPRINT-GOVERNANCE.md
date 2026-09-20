# Migration Blueprint Governance --- Database Model v1.2

The file `schema/V1_2__final_persistence_alignment.sql` is a **design
blueprint**, not a production-ready migration script.

It documents the required target transformations and migration
obligations. It must not be run blindly against a production MiniMart
database.

Before a production upgrade is released, the implementation team must
create a concrete migration for the supported source version and prove
that its resulting amended schema is equivalent to the frozen v1.2
reference DDL. The migration must include the required data backfills
and retirement of superseded write authorities, even where those
operations are represented only as comments in the design blueprint.

Production migration approval requires representative restored-data
testing, integrity checks, application compatibility tests, Posting
Envelope tests, Audit + Outbox tests, sync tests, and a demonstrated
rollback or restore path. Database migrations remain human-reviewed
artifacts under the MiniMart AI-development guardrails.
