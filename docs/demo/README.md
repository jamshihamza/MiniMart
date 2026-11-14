# MiniMart working demonstration

A runnable end-to-end slice: sell at the POS, see stock, cash and sales move in the Back
Office. Demonstration only — see `docs/adr/0006-working-demonstration-slice.md` for what
is provisional and what is missing. Not for production use.

## Run

Requirements: Node 22, pnpm 12. No Docker and no PostgreSQL installation are needed; the
launcher downloads a private PostgreSQL binary through `pnpm install`.

```text
pnpm install
pnpm demo
```

Then open:

- POS: <http://127.0.0.1:4780/pos/>
- Back Office: <http://127.0.0.1:4780/backoffice/>

`pnpm demo` builds and starts. Afterwards `pnpm demo:start` starts without rebuilding.
Stop with Ctrl+C. Data is kept in `.demo-data/` between runs.

| Need                        | How                                         |
| --------------------------- | ------------------------------------------- |
| Start again with fresh data | `node apps/store-node/dist/demo.js --reset` |
| Another port                | set `MINIMART_DEMO_PORT`                    |
| Use your own PostgreSQL     | set `DATABASE_URL` (an empty database)      |
| Another data directory      | set `MINIMART_DEMO_DATA_DIR`                |

## Suggested walkthrough

1. POS → **Open Shift**, opening cash `200`.
2. POS → tap products or type a barcode (for example `9556001000042`) and press Enter.
3. Enter the amount received (or **Exact**) and press **F8** / **Complete Sale**. The
   receipt shows the change.
4. Take a second sale by **Card** with a reference.
5. POS → **History**, **Inventory**, **Cash & Shift** (cash in / cash out, close shift
   with a counted amount to see the variance).
6. Back Office → **Dashboard** (sales today, stock value, open shifts).
7. Back Office → **Inventory** → **Adjust** a product; the movement history shows the
   sale and the adjustment.
8. Back Office → **Products** → **New Product**; it appears on the POS at once.
9. Close the shift on the POS, then **Close Business Day** on the Back Office dashboard.

The seeded store is "MiniMart Central" (S01) with counters POS01 and POS02 and ten
products, MM-00101 to MM-00110.

## Tests

```text
pnpm test:domain            # shared kernel, modules, coordinators (needs PostgreSQL)
pnpm test:service-runtime   # includes the demonstration API
pnpm test:pos-shell         # POS shell and live POS
pnpm test:backoffice
```

The PostgreSQL-backed suites use Testcontainers (Docker), or an existing server when
`MINIMART_TEST_POSTGRES_URL` is set.
