# Cloud API Scope v0.2

Cloud API is explicit and intentionally smaller than Store API. It
exposes approved cross-store reporting plus versioned
configuration/country-pack distribution surfaces.

Cloud API does **not** expose Sale posting, payment posting, stock
posting, Return posting, shift posting or other Store transactional
authority. Store-origin transaction facts arrive through Sync and remain
non-rewritable.
