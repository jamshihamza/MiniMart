# Original checkout preservation (archives and mockups, unapproved)

> **Preservation record only. Not product authority.** The frozen specifications, the frozen backlog
> and the registered design packages under `docs/design` are the authority. Nothing listed here is
> approved, promoted or accepted.

Why this branch exists: on 2026-10-06 the owner authorized preserving all pending MiniMart work on
GitHub so work can continue on another PC. This branch holds the pending work of the original
checkout, which was kept in its index and working tree on the Office PC: 27 staged entries and 12
untracked archives. It is preservation, not approval of any file.

## How it was built

- The commit was made with an isolated temporary index and Git plumbing on top of the then-current
  `main` (`1eb8e82e45c99bbac4cb01dd70ef6c57b71e8f67`). The original checkout's real index, working
  files and branch were not changed.
- The 27 staged entries use the exact blobs that were staged. The 12 untracked archives were added from
  their working-tree bytes. This record is the only added file besides them.
- Protected digest of the original staged set, taken before and after: SHA-256 of
  `path<TAB>index-blob<LF>` lines in `git diff --cached --name-only -z` order, sorted by path:
  `c7ac91711283565abda6ba071962cc8dadcc5025e123ecd9984a4a8dc7c11b64` over 27 entries.

## Classification

Every file below is an **archive** and **unapproved**. Duplicates are kept on purpose. Some old
`Mockups/` files are named like registered design sources; where a copy is byte-identical to a tracked
source, that is noted, and the copy still carries no approval of its own.

| Path | Original state | Bytes | SHA-256 | Kind | Classification | Duplicate note |
| --- | --- | --- | --- | --- | --- | --- |
| `.design-package-index.json` | staged | 2673 | `dc1a8865cac9a78c3e446fb8f4732111f250c7d8eb543acd18b95f92aaaac1b6` | local design-package index (tool metadata) | ARCHIVE. Not design authority. | none |
| `Incoming/MiniMart_Customers_Credit_ClaudeDesign_Source_v2-fixed.zip` | staged | 56354 | `9210f0a414adbb7832dc79963180435eb28717fa8cb2f83523dab100a391670c` | Claude Design source archive (zip), Customers + Credit (docs/design/customers, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/MiniMart_Customers_Credit_ClaudeDesign_Source_v2.zip` | staged | 57062 | `c2619cd63e3daa0eb16967ab8e952627972da134fd8844f24a56720f6d7d1fde` | Claude Design source archive (zip), Customers + Credit (docs/design/customers, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/MiniMart_Procurement_ClaudeDesign_Source.zip` | staged | 54984 | `5203215d9c76ae6c7300015a53fe16f69f7df2f680d32caf69c525968c2d692b` | Claude Design source archive (zip), Procurement (docs/design/procurement, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Mockups/MiniMart BO - CategoryBrand & Import.dc.html` | staged | 2572 | `36bb7cdea7aefe9baa9d3fe0456170c600d8efad35e8767c18db544053290e2c` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - CategoryBrand & Import.pdf` | staged | 681464 | `1f618c4c34b0d62b92786384ffcc8d65dc4e20e8dfdb3d0d0aeed59fa90a6203` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Create & Edit.dc.html` | staged | 2572 | `36887e3dc3cf4f4d1786110349f7db74112644ff9d9a439bac5fc23d5a251236` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Create & Edit.pdf` | staged | 924356 | `506dc4bd8b311b6a86b9c96e53758df230515b511384a46a062db0b57880281a` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Design System & Docs.dc.html` | staged | 8490 | `ebb1afe86423c2598860431da204fc29776d2acb376b2916f81b8218b327a43f` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Design System & Docs.pdf` | staged | 781760 | `d1eebec29f252372dd7abc661c62f1d002bd031df851f09fc5f9a21ed1c85121` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Detail & Skeleton.dc.html` | staged | 2792 | `32a21195648e1e2bbcbe03f7fd92f02025f98bcc48fb574da7050bceecd97487` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Detail & Skeleton.pdf` | staged | 949794 | `02d27d0b63be111723c40d0804d24542d506b6fa7ad5b26c101cfdd56f493ce5` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Foundation & Catalog.dc.html` | staged | 2969 | `1c082e8757b5cb30bc010a58de9a3db7e2af043e0313e2fd8c1f7662ca6ecb55` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Foundation & Catalog.pdf` | staged | 1070365 | `687726934da04fbc9b5c25684150715f35d01c6f171ba8ea4ddec5d88fc56a34` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Pricing & Bulk.dc.html` | staged | 2780 | `53cdc46c5e3362701a65b49bc0b4320e454c325643610129d844349dbc3cc7e2` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart BO - Pricing & Bulk.pdf` | staged | 1001745 | `dcd0b274b2cfa781276b19f47929734bbea4b2405767e6a7d2b1079e2db4d92b` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart Back Office Mockups.dc.html` | staged | 3243 | `4651586c8f4e20a493d1a3d1339e05f19aff1bf5c9bd63a8593560f712848bdc` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart Design System.dc.html` | staged | 44743 | `269d7a9746b9b272614a0aab3f1429b5762cbd5c06972cd8982e16dd109b66e5` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart INV - Adjustments & Opening Stock.pdf` | staged | 779153 | `7432a243f5fbaaa8dbffc82e8067f7a7aafbb5bc868559befa9d3dcb2598cab7` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart INV - Design System & Docs.pdf` | staged | 839896 | `60df3937012e0dd978939bc07e0de7d82c31294e03ac8d35759fc4ef7edbb53a` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart INV - Foundation & List.pdf` | staged | 763002 | `4acc5aeb87b79c5f423a507dd36325f383a1d8a5f07a3e846407fd3e6ad5e7d7` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart INV - Item & Movements.pdf` | staged | 700526 | `2ee6ba850a297990c4ad5234d195ee8d605a9edfd92f07f55b0f40477648836c` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart INV - Stock Count.pdf` | staged | 962663 | `0801524062121215bf0b0f0bde8bd1855ab58e2c88c9013b643659bd7058537c` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMart POS Mockups.dc.html` | staged | 4590 | `0306f802e49e5220291e1091c2316f36c69eabde90a44c205c26b2a2a2e87a1d` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMartBackOffice.dc.html` | staged | 94381 | `76b787dcfc0489d3fab11d9f409fe26c241fe8e7abf50f62d3b78dbef7d4fd79` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | Byte-identical to tracked `docs/design/back-office/source/MiniMartBackOffice.dc.html`; this copy carries no approval of its own. |
| `Mockups/MiniMartInventory.pdf` | staged | 306827 | `ddf7b45f9410c8f6c1ddb3d37d7546c080d5031ed671a65096cebbb6d3d617d3` | early local mockup PDF export | ARCHIVE, UNAPPROVED. Not design authority. | none |
| `Mockups/MiniMartPOS.dc.html` | staged | 117821 | `cdbcd1e0fc5d4d66da6fdac9101c7611fad327709443bbbc6bfec07389ab44e6` | early local mockup HTML export | ARCHIVE, UNAPPROVED. Not design authority. | Byte-identical to tracked `docs/design/pos/source/MiniMartPOS.dc.html`; this copy carries no approval of its own. |
| `Incoming/MiniMart_Cash_Business_Day_ClaudeDesign_Source.zip` | untracked | 52738 | `631d97bb93df13e5a367749dda9b380c32e5836ef7095521460f4a0e777203a0` | Claude Design source archive (zip), Cash / Business Day (docs/design/cash-shifts, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/MiniMart_Cash_Business_Day_ClaudeDesign_Source_v2.zip` | untracked | 71173 | `0fce9a171c322e10a5ea3a38859f59b87edeea26c10a2a3fb1d78fe3cb23224f` | Claude Design source archive (zip), Cash / Business Day (docs/design/cash-shifts, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/MiniMart_Inventory_ClaudeDesign_Source.zip` | untracked | 81587 | `f476c65607aae2507cf3fb9ada3b988915f35e627eecb5ae9e846cd17b998589` | Claude Design source archive (zip), Inventory (docs/design/inventory is draft on main; a candidate is on wip/inventory-visual-candidate-paused) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/MiniMart_Inventory_ClaudeDesign_Source_v2(batch3).zip` | untracked | 91949 | `b6ecf8a6282801f4d31322c9386502839e2fcb85bb999d9914a89e948c9df7fc` | Claude Design source archive (zip), Inventory (docs/design/inventory is draft on main; a candidate is on wip/inventory-visual-candidate-paused) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/MiniMart_Inventory_ClaudeDesign_Source_v2(batch4).zip` | untracked | 100269 | `1d36c2559a8ecdf13cfb31baa8e1203dc1627765f3bc2429639cb16b2bb326f3` | Claude Design source archive (zip), Inventory (docs/design/inventory is draft on main; a candidate is on wip/inventory-visual-candidate-paused) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/MiniMart_Inventory_ClaudeDesign_Source_v2.zip` | untracked | 86003 | `b244655f9548e1bcd65c908fb7fad12fd3599df01b6f766e2980e6267a34f467` | Claude Design source archive (zip), Inventory (docs/design/inventory is draft on main; a candidate is on wip/inventory-visual-candidate-paused) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/MiniMart_Reporting_ClaudeDesign_Source-V2.zip` | untracked | 90367 | `7fdd150f2eabc74685a151393d6ae9e6eb715c2b903bcfabc0dabf678d58a774` | Claude Design source archive (zip), Reporting (docs/design/reports, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/MiniMart_Reporting_ClaudeDesign_Source.zip` | untracked | 89911 | `0a9b9610e8d6c6acb6c0fbd54fb3489fa77798795d35de2023801e5a87217ad1` | Claude Design source archive (zip), Reporting (docs/design/reports, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/Minimart_Accounting_Lite_ClaudeDesign_Source.zip` | untracked | 56271 | `73d2dce78bb6bac1dbdfb3a5d4d11bcf62a921502e41c794cd9ec1e76d9a1b04` | Claude Design source archive (zip), Accounting-Lite (docs/design/accounting, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/Minimart_Accounting_Lite_ClaudeDesign_Source_v2-fixed.zip` | untracked | 58498 | `d91206298390053da7e5275314beab25ef1f0d1e89c6de2fce89c4c8a33e46bf` | Claude Design source archive (zip), Accounting-Lite (docs/design/accounting, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/Minimart_Accounting_Lite_ClaudeDesign_Source_v2.zip` | untracked | 58872 | `ce705e6258e6af26fed426f537e44a75847cbdce094ac8d7b8a9bd6faf8c3fb8` | Claude Design source archive (zip), Accounting-Lite (docs/design/accounting, approved-visual-reference on main) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |
| `Incoming/Minimart_Inventory_handoff_bundle.zip` | untracked | 11221 | `5a5fa13cc6a10e3b6a74ef6728f5e8cfa7c22245c292ae82583a8635ee0f249b` | Claude Design source archive (zip), Inventory (docs/design/inventory is draft on main; a candidate is on wip/inventory-visual-candidate-paused) | ARCHIVE, UNAPPROVED. Approval attaches only to the registered source bytes under docs/design, not to this archive. | none |

## Using this branch on another PC

- Do not merge this branch. Do not copy these files over a working tree. Use a separate worktree:
  `git worktree add ../mm-archives origin/wip/original-checkout-archives-unapproved`.
- To read an archive, extract it elsewhere. Registered design packages under `docs/design` stay the
  reference.
- The owner decides when this branch is deleted.
