# AI Agent Execution Rules

Before implementing an issue, the coding agent must: 1. read AGENTS.md
and the linked frozen specification; 2. identify exact UI/API/domain/DB
contracts involved; 3. state files/modules it intends to change; 4.
implement only the issue scope; 5. add/modify tests without weakening
existing tests; 6. run formatter/typecheck/tests; 7. summarize changes
and unresolved questions.

If accounting, inventory, payment, tax, country compliance, transaction
boundaries, sync conflict rules, money representation or security is
ambiguous, **stop and raise the ambiguity**. Do not invent a rule.

Codex may be the primary implementation agent; a second reviewer can
perform read-only review. Do not allow multiple agents to edit the same
files concurrently.
