# MiniMart

MiniMart is an offline-first retail POS and retail-management platform. This repository is
organized according to the frozen Architecture v1.0 monorepo structure.

## Foundation commands

- pnpm install --frozen-lockfile installs the JavaScript/TypeScript toolchain.
- pnpm format:check verifies formatting without changing files.
- pnpm lint runs ESLint.
- pnpm check:boundaries validates frozen package topology and dependency rules.
- pnpm test:boundaries exercises the boundary checker with valid and invalid graphs.
- pnpm typecheck builds the TypeScript project-reference graph.
- pnpm check:rust checks the Rust workspace boundaries.
- pnpm run ci runs the JavaScript/TypeScript MM-001/MM-002 validation suite.

The authoritative specifications are indexed by SPECIFICATION-INDEX.md. Files under
docs/specifications/ and docs/backlog/ are controlled specification artifacts.
