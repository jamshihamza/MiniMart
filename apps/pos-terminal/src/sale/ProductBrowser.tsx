import { Image, LayoutGrid, List, Loader, ScanBarcode, X } from "lucide-react";
import { useState } from "react";
import type { FormEvent, RefObject } from "react";

import { Glyph, StubButton } from "../components/StubButton.js";
import { CATEGORIES, PREVIEW_PRODUCTS } from "../fixtures.js";
import type { Category, PreviewProduct } from "../fixtures.js";
import type { PreviewView } from "../preview.js";

const SKELETON_TILES = Array.from({ length: 12 }, (_, index) => index);

/** Search field. The scanner capture in `PosApp` is wired to this input through `searchRef`. */
export function SearchBar({
  searchRef,
  query,
  disabled,
  onQuery,
  onSubmit,
  onClear,
}: {
  readonly searchRef: RefObject<HTMLInputElement | null>;
  readonly query: string;
  readonly disabled: boolean;
  readonly onQuery: (value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly onClear: () => void;
}) {
  return (
    <form className="searchbar" role="search" onSubmit={onSubmit}>
      <span className="searchbar__icon">
        <Glyph icon={ScanBarcode} size={22} />
      </span>
      <input
        ref={searchRef}
        id="item-search"
        type="search"
        className="searchbar__input"
        aria-label="Scan barcode or search item"
        aria-describedby="search-help"
        autoComplete="off"
        disabled={disabled}
        value={query}
        placeholder="Scan barcode or search products…"
        onChange={(event) => onQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && query !== "") onQuery("");
        }}
      />
      {query === "" ? null : (
        <button
          type="button"
          className="searchbar__clear"
          aria-label="Clear search"
          onClick={onClear}
        >
          <Glyph icon={X} size={17} />
        </button>
      )}
      <span className="kbdhint" aria-hidden="true">
        F2
      </span>
      <span id="search-help" className="sr-only">
        Preview input only. Item lookup is not available. Scanner input is captured as untrusted
        text and never triggers shortcuts.
      </span>
    </form>
  );
}

function ProductTile({ product }: { readonly product: PreviewProduct }) {
  const out = product.stockTone === "out";
  const content = (
    <>
      <div className="tile__art">
        <Glyph icon={Image} size={22} />
        <span className="tile__temp">TEMP</span>
      </div>
      <span className="tile__name">{product.name}</span>
      <span className="tile__detail">{product.detail}</span>
      <div className="tile__foot">
        <span className="tile__price">{product.price}</span>
        <span className={`stock stock--${product.stockTone}`}>{product.stockLabel}</span>
      </div>
    </>
  );
  // The reference disables an out-of-stock tile. Other tiles would add to the cart, which this
  // preview does not implement, so they are identified stubs.
  return out ? (
    <button type="button" className="tile is-out" disabled>
      {content}
    </button>
  ) : (
    <StubButton label={`Add ${product.name}`} className="tile">
      {content}
    </StubButton>
  );
}

function ProductTable({
  products,
  selectedId,
}: {
  readonly products: readonly PreviewProduct[];
  readonly selectedId: string | null;
}) {
  return (
    <div className="ptable" role="group" aria-label="Products, list view">
      <div className="ptable__head" aria-hidden="true">
        <span>PRODUCT</span>
        <span>SKU</span>
        <span>UNIT</span>
        <span className="is-right">PRICE</span>
        <span>STOCK</span>
      </div>
      {products.map((product) => {
        const out = product.stockTone === "out";
        const row = (
          <>
            <span className="ptable__name">{product.name}</span>
            <span className="ptable__sku">{product.sku}</span>
            <span className="ptable__unit">{product.detail}</span>
            <span className="ptable__price">{product.price}</span>
            <span className={`stock stock--${product.stockTone} stock--row`}>
              {product.stockLabel}
            </span>
          </>
        );
        const selected = product.id === selectedId ? " is-selected" : "";
        return out ? (
          <button
            key={product.id}
            type="button"
            className={`ptable__row is-out${selected}`}
            disabled
          >
            {row}
          </button>
        ) : (
          <StubButton
            key={product.id}
            label={`Add ${product.name}`}
            className={`ptable__row${selected}`}
          >
            {row}
          </StubButton>
        );
      })}
    </div>
  );
}

/** Category chips, view toggle and the product tiles or table. Filtering is local and visual. */
export function ProductBrowser({
  view: initialView,
  loading,
  selectedId,
  hasQuery = false,
  hideProducts = false,
}: {
  readonly view: PreviewView;
  readonly loading: boolean;
  readonly selectedId: string | null;
  /** True while the search field holds text: the reference then shows an "Esc clears" hint. */
  readonly hasQuery?: boolean;
  /** True while a result list or not-found card replaces the products (screens 03 and 04). */
  readonly hideProducts?: boolean;
}) {
  const [category, setCategory] = useState<Category>("All");
  const [view, setView] = useState<PreviewView>(initialView);
  const products =
    category === "All"
      ? PREVIEW_PRODUCTS
      : PREVIEW_PRODUCTS.filter((product) => product.category === category);

  return (
    <>
      <div className="chips">
        {CATEGORIES.map((name) => {
          const count =
            name === "All"
              ? PREVIEW_PRODUCTS.length
              : PREVIEW_PRODUCTS.filter((product) => product.category === name).length;
          const on = category === name;
          return (
            <button
              key={name}
              type="button"
              className={`chip${on ? " is-on" : ""}`}
              aria-pressed={on}
              onClick={() => setCategory(name)}
            >
              {name}
              <span className="chip__count">{count}</span>
            </button>
          );
        })}
        {hasQuery ? <span className="kbdhint">Esc clears</span> : null}
        <div className="viewtoggle" role="group" aria-label="Product browser view">
          <button
            type="button"
            className={`viewtoggle__btn${view === "tiles" ? " is-on" : ""}`}
            aria-pressed={view === "tiles"}
            title="Tile view"
            aria-label="Tile view"
            onClick={() => setView("tiles")}
          >
            <Glyph icon={LayoutGrid} size={16} />
          </button>
          <button
            type="button"
            className={`viewtoggle__btn${view === "grid" ? " is-on" : ""}`}
            aria-pressed={view === "grid"}
            title="Grid view"
            aria-label="Grid view"
            onClick={() => setView("grid")}
          >
            <Glyph icon={List} size={16} />
          </button>
        </div>
      </div>

      {hideProducts ? null : loading ? (
        <>
          <div className="loadnote">
            <Glyph icon={Loader} size={16} />
            Loading products from the Store Node…
          </div>
          <div className="tiles" aria-busy="true">
            {SKELETON_TILES.map((index) => (
              <div key={index} className="skeleton">
                <div className="skeleton__art" />
                <div className="skeleton__a" />
                <div className="skeleton__b" />
                <div className="skeleton__c" />
              </div>
            ))}
          </div>
        </>
      ) : view === "tiles" ? (
        <div className="tiles">
          {products.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <ProductTable products={products} selectedId={selectedId} />
      )}
    </>
  );
}
