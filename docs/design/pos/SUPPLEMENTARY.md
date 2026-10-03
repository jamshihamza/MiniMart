# Supplementary MiniMart POS reference documentation

These files are unapproved supplementary reference/proposal material. They do not
inherit approval from the package source. Frozen specifications, Decision Register
and backlog govern product behavior. Existing source, runtime, manifest status and
historical fidelity report are unchanged.

See `supplementary-provenance.json` for original archive/path and byte hashes.
The preserved export manifest is historical provenance, not current approval.
Grouped pages reuse the existing registered source and tracked runtime. Cross-package
Back Office navigation uses the preserved reference index, never an archive replacement.

Runtime and fidelity validation results/gaps must accompany review before checkpoint.
No design-only concept, specimen amount, permission, threshold or open decision becomes
product behavior through preservation.

## Authority wording corrected with owner direction

The original `source/MiniMart Design System.dc.html` export implied that a manager
could approve voiding a posted Sale. On 2026-10-03, explicit owner direction
authorized a supplementary-reference text correction only. The candidate now
states that void/abandon applies only to an unposted active Sale and that
posted-sale corrections follow the authorized return/reversal workflow. The
adjacent action label is "Review authorized correction", not an approval request.
This follows frozen `FR-POS-046` (void/abandon an unposted active Sale), `FR-POS-047`
(posted completed Sale is not reopened/edited), the sale-lifecycle boundary note
(`VOID/ABANDONED` only before posting), domain `04-COMMERCE-LIFECYCLES`
and `API-POS-010` (abandon/void unposted Sale).

The wording conflict is resolved; no approval role, reversal mechanism or new
product decision is introduced. The original export hash is retained alongside
the corrected candidate hash and adjustment notes in provenance. The original
Office PC export is untouched. Missing `image-slot.js` still prevents full
visual/runtime fidelity, and this document remains an unapproved reference.

## Validation observed

On 2026-10-03, both inline scripts parsed/evaluated and both pages booted on the
existing genuine runtime in Chrome at 1366x768. Both local navigation links
resolved; no page errors, unresolved expressions or runtime logic errors occurred.
The wrapper imported the existing POS source and rendered its 31-artboard flow.
The count heading is corrected from 30 to 31; historical shortcut wording is
qualified and the grid example is labelled a concept, not implemented behavior.

The Design System requests missing `image-slot.js` and contains an undefined
`image-slot` custom element. This is an unresolved visual/runtime dependency,
not a fabricated fallback. Its rendering is incomplete despite successful boot.
Screenshots are temporary diagnostic outputs, not approved visual evidence.
The existing POS manifest stays `review-ready`, and its registered source hash
and historical fidelity report are unchanged.
