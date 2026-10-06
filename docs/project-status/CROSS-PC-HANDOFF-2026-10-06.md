# Cross-PC handoff, 2026-10-06

> **Handoff aid only. Not product authority.** `AGENTS.md`, the frozen specifications, the frozen
> backlog and Git state outrank this file. It never resolves a decision, approves a design or accepts a
> backlog item. Verify everything here against Git before relying on it.

## 1. Why this exists

On 2026-10-06 the owner authorized committing and pushing all pending MiniMart work, including
incomplete, paused, rejected and unapproved candidates, so work can continue from another PC today.
That is **preservation, not approval** of any quality or behavior. Workspace-switch visual approval
remains PENDING. Nothing was merged into `main`, and remote `main` is unchanged at
`1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67`.

Every branch below was pushed with a normal push (no force) and its remote SHA was read back with
`git ls-remote` and compared with the local SHA.

## 2. Branches (full SHAs at the time of preservation)

| Branch                                      | Full SHA                                   | Relation                                                   | Task and state                                                                                                                                                    |
| ------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`                                      | `1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67` | origin default                                             | Unchanged.                                                                                                                                                        |
| `wip/mm-008-scanner-spike`                  | `a30a1490b5d07e3c7ec45debd44bfa898421fb40` | 3 commits on `main`                                        | MM-008 keyboard-wedge scanner spike. Software-only. Acceptance INCOMPLETE.                                                                                        |
| `wip/mm-009-raster-spike`                   | `5f4cf1c0cd83de9e8e1a3125f59e6ca5f76eb7f8` | 1 commit on `main`                                         | MM-009 non-Latin raster receipt spike, software part. Acceptance INCOMPLETE.                                                                                      |
| `wip/mm-010-sync-proof`                     | `92421f0303718fe62adbb48297f1604e4288ad76` | 1 commit on `main`                                         | MM-010 test-only sync proof harness. Acceptance INCOMPLETE.                                                                                                       |
| `wip/visual-pos-ui`                         | `fcb253fa3e1624bd24fe980bc6c5f841cacda857` | on top of `wip/mm-008-scanner-spike` (4 commits on `main`) | Visual-only POS UI, 31 screens. Owner approved the visual implementation; production behavior and acceptance are not.                                             |
| `wip/workspace-switch-adr`                  | `15d6e64a13aca63c37151ee4d99a6dd746fe8bfc` | 1 commit on top of `wip/visual-pos-ui`                     | ADR 0009 and workspace-host preview. Switch design NOT approved.                                                                                                  |
| `wip/visual-reporting-ui`                   | `1f3e13c03449fc3596f540a1c844f4a9856d6281` | 1 commit on `main`                                         | Reporting visual-only first slice. Incomplete. Known failures. Not reviewed.                                                                                      |
| `wip/inventory-visual-candidate-paused`     | `6e786c2b5bac159693f59dc3fe8fd8d31dc20057` | 1 commit on `main`                                         | Inventory visual candidate, batch 4. Paused, unapproved.                                                                                                          |
| `reports-visual-design`                     | `8e842678dd3482509aafd48106488408087daaf0` | 1 commit on `a0350fe`, not merged                          | Earlier Reporting design package (review-ready). `main` later received Reporting V2 as the approved reference. Pushed earlier; unchanged.                         |
| `wip/original-checkout-archives-unapproved` | `be45314918ac26c58b508a319020176766ac72a2` | 1 commit on `main`                                         | The original checkout's 27 staged entries and 12 untracked archives, archive and unapproved. Do not merge.                                                        |
| `wip/cross-pc-handoff-2026-10-06`           | the tip of this branch                     | 1 commit on `main`                                         | This handoff and the preserved scratch material. Its own SHA is not written here: read it with `git ls-remote origin refs/heads/wip/cross-pc-handoff-2026-10-06`. |

No branch contains another branch's work except the stack `wip/mm-008-scanner-spike`, then
`wip/visual-pos-ui`, then `wip/workspace-switch-adr`. Unrelated worktrees were never mixed into one
commit.

## 3. Worktrees on the Office PC (names are relative to the original checkout's parent folder)

| Worktree                                     | State when preservation finished                                                                                                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| original checkout (`main`)                   | Not changed. Still 27 staged entries and 12 untracked archives in its index and working tree, now also preserved on `wip/original-checkout-archives-unapproved`. |
| `mm-impl`                                    | `wip/mm-008-scanner-spike`, clean.                                                                                                                               |
| `mm-009`                                     | `wip/mm-009-raster-spike`, clean.                                                                                                                                |
| `mm-010`                                     | `wip/mm-010-sync-proof`, clean.                                                                                                                                  |
| `mm-pos`                                     | `wip/visual-pos-ui`, clean.                                                                                                                                      |
| `mm-ws`                                      | `wip/workspace-switch-adr`, clean after the checkpoint.                                                                                                          |
| `mm-vis`                                     | `wip/visual-reporting-ui`, clean after the checkpoint.                                                                                                           |
| `mm-inv`                                     | was detached at `1eb8e82` with 25 pending paths. A branch `wip/inventory-visual-candidate-paused` was created at that HEAD, then checkpointed. Clean.            |
| `mm-rpt`                                     | `reports-visual-design`, clean.                                                                                                                                  |
| `mm-rpt2`                                    | detached at `1eb8e82`, clean. No branch was needed (nothing pending; the commit is on `main`).                                                                   |
| Codex worktree for supplementary design docs | detached at `a0350fe`, clean. No branch needed (the commit is on `main`).                                                                                        |
| `mm-handoff`                                 | this branch's worktree, clean after the push.                                                                                                                    |

There are no stashes. The development servers started for this preservation and its verification were
stopped. Other servers and containers were left alone.

## 4. Tasks: status, known gaps, next action

Every task is **incomplete**. Read each branch's `docs/project-status/ACTIVE-WORK.md` and verify it
against Git. `docs/project-status/CURRENT-STATE.md` on `main` is stale (it still lists POS as
review-ready and Accounting-Lite as the current module); it was not edited.

1. **MM-008 scanner spike** (`wip/mm-008-scanner-spike`). Software checkpoint. Not accepted: native
   WebView2 and physical-scanner acceptance are pending, the 50 ms burst threshold is provisional,
   and browser F-key default-action isolation is not independently verified. Next: owner review, then
   native and physical validation. See `docs/phase-0/mm-008-scanner-spike.md`.
2. **MM-009 raster receipt spike** (`wip/mm-009-raster-spike`). Software only. Acceptance INCOMPLETE:
   physical evidence on the exact pilot printer, which Architecture spike C requires, does not exist.
   ADR 0006 (raster renderer dependencies and fonts) is on this branch. Next: owner review of
   `docs/phase-0/mm-009-raster-receipt-spike.md`. Verification notes and logs are under
   `handoff-material/mm008-mm009-mm010`.
3. **MM-010 sync proof** (`wip/mm-010-sync-proof`). Test-only harness, validated against PostgreSQL 17
   in Docker (Testcontainers) during the session. No SQL or runtime acceptance is claimed. Acceptance
   INCOMPLETE. The PostgreSQL tests were not re-run in the fresh-clone verification below. Next: owner
   review of `docs/phase-0/mm-010-sync-proof-spike.md`.
4. **POS visual implementation** (`wip/visual-pos-ui`). 31 of 31 reference screens, fictional data.
   The owner reviewed and approved the visual implementation (recorded in
   `docs/design/pos/provenance.json`, bound to implementation hashes). Production and business
   functionality, MM-008 acceptance, native validation and remote CI remain incomplete. Known
   limitation: with the History detail open the STATUS header overflows, and at 1280x720 the CUSTOMER
   header is clipped on screens 17 and 28 (inherited from the reference). Next: none pending beyond
   the owner's later direction.
5. **Workspace switch** (`wip/workspace-switch-adr`). ADR 0009 plus a bounded preview host.
   - The owner rejected the first candidate (a floating control at the bottom left). The current
     candidate, a 32 px host header with the switch at the top right, is awaiting the owner's visual
     review and is **not approved**.
   - Proposed and not applied: change requests CR-0009-A (UI specification navigation text) and
     CR-0009-B (Architecture 05 and 09 wording). The frozen text does not affirmatively say one
     application may host both workspaces; that interpretation is not approved.
   - Open: where production workspace availability is configured, counter identity for a Back
     Office-only installation, production unfinished-sale switching policy, and the switch's final
     design. Availability in the preview is a URL parameter and authorizes nothing.
   - Two approved POS files changed additively (`App.tsx`, `flow.ts`); the recorded POS approval
     hashes were not edited, and the owner has not re-confirmed those two files.
   - A source-text test checks that Back Office source imports no Tauri code. It does not prove
     runtime isolation in the shared Tauri window; production capability and security design is
     pending. No production security claim is made.
   - Next: owner visual review of the header, then the decisions above. Details:
     `docs/phase-0/workspace-host-preview.md` and ADR 0009.
6. **Reporting visual implementation** (`wip/visual-reporting-ui`). First slice only: Reports Home and a
   daily-sales viewer in `apps/backoffice`, fictional data. **Known failures:** the Prettier check
   fails on five files, so `pnpm run ci` exits 1, and the app test script fails because no test file
   exists. Type check, ESLint on `apps/backoffice` and the Vite build pass. The fidelity note ADR 0007
   names was never written, no pixel comparison was recorded, and no owner review is recorded. It also
   edits `apps/backoffice/package.json`, `tsconfig.json` and the lockfile, as the workspace branch
   does, so combining them needs a deliberate merge. Next: owner review in the browser, then fix
   formatting, add tests and write the fidelity note.
7. **Inventory** (`wip/inventory-visual-candidate-paused`). Review-ready candidate, unapproved, paused
   by the owner, no implementation. Gates re-run at checkpoint: `design:validate`, `test:design-render`
   17 of 17, `pnpm run ci` exit 0; `git diff --check` reports one blank line at the end of a preserved
   upstream file. Design defects and approval-gated questions are in its `ACTIVE-WORK.md`. Next: owner
   chooses between a revision request to Claude Design, a validated checkpoint, or dropping it.
8. **Original checkout archives** (`wip/original-checkout-archives-unapproved`). See section 5.
9. **MM-007 printer spike.** The software checkpoint is on `main` (`dfc7cb4`). Physical validation is
   pending and DEC-HW-001 is open.

ADR numbers in use: 0001 to 0005 on `main`, 0006 on `wip/mm-009-raster-spike`, 0007 on
`wip/visual-reporting-ui`, 0008 on `wip/visual-pos-ui`, 0009 on `wip/workspace-switch-adr`. Use 0010
or later for a new one.

## 5. Original checkout preservation

- Branch: `wip/original-checkout-archives-unapproved`, one commit on `main` (`1eb8e82`), built with an
  isolated temporary index and Git plumbing. The original checkout's real index, working files and
  branch were not changed.
- Protected digest: SHA-256 of `path<TAB>index-blob<LF>` lines in `git diff --cached --name-only -z`
  order, sorted by path, over 27 entries:
  `c7ac91711283565abda6ba071962cc8dadcc5025e123ecd9984a4a8dc7c11b64`. It was computed before and after
  the work and matched both times.
- The commit holds exactly the 27 staged entries (blobs identical to the index), the 12 untracked
  archives (bytes identical to the working files) and one record,
  `docs/project-status/ORIGINAL-CHECKOUT-PRESERVATION.md`, which classifies every file as archive and
  unapproved and notes duplicates. Two staged files are byte-identical to the registered
  `docs/design/pos/source/MiniMartPOS.dc.html` and `docs/design/back-office/source/MiniMartBackOffice.dc.html`.
  The copies carry no approval.

Appendix A lists every preserved path with its size and SHA-256.

## 6. Scratch material

Copied to `handoff-material/` on this branch with a provenance map in `handoff-material/README.md`:
draft ADRs, verification notes and logs, review packages (Inventory and Reporting), analysis JSON,
allowlists, commit messages, capture and audit scripts, visual-review evidence, and the first design
handoff package. See that README for the exact mapping and for what stayed local.

Still only on the Office PC, on purpose: font files and MM-009 experiment output (bulk, and font
redistribution needs a licence decision), the other POS capture sets and the per-viewport design
renders (reproducible), extracted archives, one-off edit scripts, dependency trees, `target`
directories, build output, the ignored design renders and PDF exports under `docs/design/*`, and the
development certificates under `infra/mm-006/dev-certificates/` (never uploaded). Nothing was
deleted. No secret, credential, `.env` file, certificate, private key or database was found in any
preserved file; each was scanned for secret patterns and unsafe names.

## 7. Resume on the other PC

Prerequisites (from the repository): Git; Node `>=22 <25` (`engines` in `package.json`); pnpm `12.5.1`
(`packageManager`); Google Chrome for the design-render tests and screenshot scripts; Rust `1.85.0`
(`rust-toolchain.toml`) plus the Tauri prerequisites only for MM-007, MM-009 and native work; Docker
Desktop only for the MM-010 PostgreSQL tests.

```bash
git clone https://github.com/jamshihamza/MiniMart.git
cd MiniMart
git fetch --all --prune
git ls-remote origin
```

Use one worktree per branch, outside the clone's working tree, and never check a WIP branch out over
uncommitted work:

```bash
git worktree add -b wip/workspace-switch-adr ../mm-ws origin/wip/workspace-switch-adr
cd ../mm-ws
pnpm install --frozen-lockfile
pnpm --filter @minimart/pos-terminal test
pnpm --filter @minimart/pos-terminal exec vite --host 127.0.0.1 --port 1421
```

Then open `http://127.0.0.1:1421/#/pos` and `http://127.0.0.1:1421/#/back-office`. The same pattern
works for the other branches; replace the branch and folder names:

| Task             | Branch                                  | Check                                                                                                                | Preview                                                                                                                                       |
| ---------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| POS UI           | `wip/visual-pos-ui`                     | `pnpm --filter @minimart/pos-terminal test` (177 tests)                                                              | `pnpm --filter @minimart/pos-terminal exec vite --host 127.0.0.1 --port 1420`, then `http://127.0.0.1:1420/?screen=09` (ids 01 to 30 and 02b) |
| Workspace switch | `wip/workspace-switch-adr`              | same package test (214 tests), `pnpm run ci`, `pnpm design:validate`                                                 | as above, port 1421                                                                                                                           |
| Reporting        | `wip/visual-reporting-ui`               | `pnpm --filter @minimart/backoffice build` (the test script and `pnpm run ci` fail, see section 4)                   | `pnpm --filter @minimart/backoffice dev`, then `http://127.0.0.1:1430/`                                                                       |
| Inventory        | `wip/inventory-visual-candidate-paused` | `pnpm design:validate`; `MINIMART_DESIGN_BROWSER_PATH="<path to chrome.exe>" pnpm run test:design-render` (17 of 17) | none (design candidate only)                                                                                                                  |
| MM-008           | `wip/mm-008-scanner-spike`              | `pnpm run test:pos-shell`                                                                                            | POS preview as above                                                                                                                          |
| MM-009           | `wip/mm-009-raster-spike`               | `pnpm run check:rust` (needs the Rust toolchain)                                                                     | none                                                                                                                                          |
| MM-010           | `wip/mm-010-sync-proof`                 | `pnpm run test:sync-proof` (needs Docker Desktop; or set `MINIMART_TEST_POSTGRES_URL`)                               | none                                                                                                                                          |

Verified on 2026-10-06 in a fresh clone of the pushed branches, offline from the local pnpm store:
`wip/workspace-switch-adr` installed with `--frozen-lockfile`, passed all 214 POS-package tests and
served `/`, `/#/pos`, `/#/back-office` and `/?screen=09` with HTTP 200 on a Vite dev server;
`wip/visual-reporting-ui` installed, built, and its dev server answered HTTP 200 on port 1430;
`wip/inventory-visual-candidate-paused` installed, passed `design:validate` (8 manifests) and
`test:design-render` 17 of 17 with the Chrome path set. Without that path the browser-dependent
design-render tests fail where Playwright's bundled Chromium is not installed. The MM-008, MM-009
and MM-010 branches were not re-run in the clone; their commands are the scripts in `package.json`
on each branch.

Fast-forward only. A `wip/<task>` branch is never merged as-is. Its content returns to `main` as a
validated checkpoint, and the owner decides when a branch is deleted. Do not merge
`wip/original-checkout-archives-unapproved` or this branch.

## 8. Next resume action per task

- Workspace switch: owner reviews the header preview; then decisions in section 4, item 5.
- POS UI: nothing pending.
- Reporting: owner reviews the slice; then formatting, tests, fidelity note, merge order with the
  workspace branch.
- Inventory: owner decision (revise, checkpoint, or drop).
- MM-007, MM-008, MM-009, MM-010: owner review, then the physical, native and runtime validation each
  one still lacks.
- Archives branch: owner decides what, if anything, to register under `docs/design`.
- Every pull request, merge to `main`, approval, promotion and acceptance claim needs separate owner
  authorization.

## Appendix A. Preserved archives and mockups (original checkout)

All are archive and unapproved. Full classification and duplicate notes are in
`docs/project-status/ORIGINAL-CHECKOUT-PRESERVATION.md` on `wip/original-checkout-archives-unapproved`.

| Path                                                                  | Bytes   | SHA-256                                                            |
| --------------------------------------------------------------------- | ------- | ------------------------------------------------------------------ |
| `.design-package-index.json`                                          | 2673    | `dc1a8865cac9a78c3e446fb8f4732111f250c7d8eb543acd18b95f92aaaac1b6` |
| `Incoming/MiniMart_Customers_Credit_ClaudeDesign_Source_v2-fixed.zip` | 56354   | `9210f0a414adbb7832dc79963180435eb28717fa8cb2f83523dab100a391670c` |
| `Incoming/MiniMart_Customers_Credit_ClaudeDesign_Source_v2.zip`       | 57062   | `c2619cd63e3daa0eb16967ab8e952627972da134fd8844f24a56720f6d7d1fde` |
| `Incoming/MiniMart_Procurement_ClaudeDesign_Source.zip`               | 54984   | `5203215d9c76ae6c7300015a53fe16f69f7df2f680d32caf69c525968c2d692b` |
| `Mockups/MiniMart BO - CategoryBrand & Import.dc.html`                | 2572    | `36bb7cdea7aefe9baa9d3fe0456170c600d8efad35e8767c18db544053290e2c` |
| `Mockups/MiniMart BO - CategoryBrand & Import.pdf`                    | 681464  | `1f618c4c34b0d62b92786384ffcc8d65dc4e20e8dfdb3d0d0aeed59fa90a6203` |
| `Mockups/MiniMart BO - Create & Edit.dc.html`                         | 2572    | `36887e3dc3cf4f4d1786110349f7db74112644ff9d9a439bac5fc23d5a251236` |
| `Mockups/MiniMart BO - Create & Edit.pdf`                             | 924356  | `506dc4bd8b311b6a86b9c96e53758df230515b511384a46a062db0b57880281a` |
| `Mockups/MiniMart BO - Design System & Docs.dc.html`                  | 8490    | `ebb1afe86423c2598860431da204fc29776d2acb376b2916f81b8218b327a43f` |
| `Mockups/MiniMart BO - Design System & Docs.pdf`                      | 781760  | `d1eebec29f252372dd7abc661c62f1d002bd031df851f09fc5f9a21ed1c85121` |
| `Mockups/MiniMart BO - Detail & Skeleton.dc.html`                     | 2792    | `32a21195648e1e2bbcbe03f7fd92f02025f98bcc48fb574da7050bceecd97487` |
| `Mockups/MiniMart BO - Detail & Skeleton.pdf`                         | 949794  | `02d27d0b63be111723c40d0804d24542d506b6fa7ad5b26c101cfdd56f493ce5` |
| `Mockups/MiniMart BO - Foundation & Catalog.dc.html`                  | 2969    | `1c082e8757b5cb30bc010a58de9a3db7e2af043e0313e2fd8c1f7662ca6ecb55` |
| `Mockups/MiniMart BO - Foundation & Catalog.pdf`                      | 1070365 | `687726934da04fbc9b5c25684150715f35d01c6f171ba8ea4ddec5d88fc56a34` |
| `Mockups/MiniMart BO - Pricing & Bulk.dc.html`                        | 2780    | `53cdc46c5e3362701a65b49bc0b4320e454c325643610129d844349dbc3cc7e2` |
| `Mockups/MiniMart BO - Pricing & Bulk.pdf`                            | 1001745 | `dcd0b274b2cfa781276b19f47929734bbea4b2405767e6a7d2b1079e2db4d92b` |
| `Mockups/MiniMart Back Office Mockups.dc.html`                        | 3243    | `4651586c8f4e20a493d1a3d1339e05f19aff1bf5c9bd63a8593560f712848bdc` |
| `Mockups/MiniMart Design System.dc.html`                              | 44743   | `269d7a9746b9b272614a0aab3f1429b5762cbd5c06972cd8982e16dd109b66e5` |
| `Mockups/MiniMart INV - Adjustments & Opening Stock.pdf`              | 779153  | `7432a243f5fbaaa8dbffc82e8067f7a7aafbb5bc868559befa9d3dcb2598cab7` |
| `Mockups/MiniMart INV - Design System & Docs.pdf`                     | 839896  | `60df3937012e0dd978939bc07e0de7d82c31294e03ac8d35759fc4ef7edbb53a` |
| `Mockups/MiniMart INV - Foundation & List.pdf`                        | 763002  | `4acc5aeb87b79c5f423a507dd36325f383a1d8a5f07a3e846407fd3e6ad5e7d7` |
| `Mockups/MiniMart INV - Item & Movements.pdf`                         | 700526  | `2ee6ba850a297990c4ad5234d195ee8d605a9edfd92f07f55b0f40477648836c` |
| `Mockups/MiniMart INV - Stock Count.pdf`                              | 962663  | `0801524062121215bf0b0f0bde8bd1855ab58e2c88c9013b643659bd7058537c` |
| `Mockups/MiniMart POS Mockups.dc.html`                                | 4590    | `0306f802e49e5220291e1091c2316f36c69eabde90a44c205c26b2a2a2e87a1d` |
| `Mockups/MiniMartBackOffice.dc.html`                                  | 94381   | `76b787dcfc0489d3fab11d9f409fe26c241fe8e7abf50f62d3b78dbef7d4fd79` |
| `Mockups/MiniMartInventory.pdf`                                       | 306827  | `ddf7b45f9410c8f6c1ddb3d37d7546c080d5031ed671a65096cebbb6d3d617d3` |
| `Mockups/MiniMartPOS.dc.html`                                         | 117821  | `cdbcd1e0fc5d4d66da6fdac9101c7611fad327709443bbbc6bfec07389ab44e6` |
| `Incoming/MiniMart_Cash_Business_Day_ClaudeDesign_Source.zip`         | 52738   | `631d97bb93df13e5a367749dda9b380c32e5836ef7095521460f4a0e777203a0` |
| `Incoming/MiniMart_Cash_Business_Day_ClaudeDesign_Source_v2.zip`      | 71173   | `0fce9a171c322e10a5ea3a38859f59b87edeea26c10a2a3fb1d78fe3cb23224f` |
| `Incoming/MiniMart_Inventory_ClaudeDesign_Source.zip`                 | 81587   | `f476c65607aae2507cf3fb9ada3b988915f35e627eecb5ae9e846cd17b998589` |
| `Incoming/MiniMart_Inventory_ClaudeDesign_Source_v2(batch3).zip`      | 91949   | `b6ecf8a6282801f4d31322c9386502839e2fcb85bb999d9914a89e948c9df7fc` |
| `Incoming/MiniMart_Inventory_ClaudeDesign_Source_v2(batch4).zip`      | 100269  | `1d36c2559a8ecdf13cfb31baa8e1203dc1627765f3bc2429639cb16b2bb326f3` |
| `Incoming/MiniMart_Inventory_ClaudeDesign_Source_v2.zip`              | 86003   | `b244655f9548e1bcd65c908fb7fad12fd3599df01b6f766e2980e6267a34f467` |
| `Incoming/MiniMart_Reporting_ClaudeDesign_Source-V2.zip`              | 90367   | `7fdd150f2eabc74685a151393d6ae9e6eb715c2b903bcfabc0dabf678d58a774` |
| `Incoming/MiniMart_Reporting_ClaudeDesign_Source.zip`                 | 89911   | `0a9b9610e8d6c6acb6c0fbd54fb3489fa77798795d35de2023801e5a87217ad1` |
| `Incoming/Minimart_Accounting_Lite_ClaudeDesign_Source.zip`           | 56271   | `73d2dce78bb6bac1dbdfb3a5d4d11bcf62a921502e41c794cd9ec1e76d9a1b04` |
| `Incoming/Minimart_Accounting_Lite_ClaudeDesign_Source_v2-fixed.zip`  | 58498   | `d91206298390053da7e5275314beab25ef1f0d1e89c6de2fce89c4c8a33e46bf` |
| `Incoming/Minimart_Accounting_Lite_ClaudeDesign_Source_v2.zip`        | 58872   | `ce705e6258e6af26fed426f537e44a75847cbdce094ac8d7b8a9bd6faf8c3fb8` |
| `Incoming/Minimart_Inventory_handoff_bundle.zip`                      | 11221   | `5a5fa13cc6a10e3b6a74ef6728f5e8cfa7c22245c292ae82583a8635ee0f249b` |
