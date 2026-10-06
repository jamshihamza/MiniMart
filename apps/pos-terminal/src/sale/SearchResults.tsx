import { Image, Plus, ScanBarcode, Search } from "lucide-react";

import { Glyph, StubButton } from "../components/StubButton.js";
import { PREVIEW_PRODUCTS } from "../fixtures.js";

/**
 * Fictional results for the reference's "coffee" search (screen 03). The preview performs no
 * lookup: this list is a fixed fixture shown only while the field still holds the preset text.
 */
const COFFEE_RESULTS = PREVIEW_PRODUCTS.filter((product) =>
  ["coffee", "bcoffee", "creamer", "icoffee"].includes(product.id),
);

export function SearchResults({ query }: { readonly query: string }) {
  return (
    <div className="results">
      <div className="results__head">
        <span>
          <strong className="results__count">{COFFEE_RESULTS.length} results</strong> for “{query}”
        </span>
        <span>Select a row to add it to the cart</span>
      </div>
      <div className="results__cols" aria-hidden="true">
        <span />
        <span>PRODUCT</span>
        <span>BARCODE</span>
        <span>STOCK</span>
        <span className="is-right">PRICE</span>
        <span />
      </div>
      {COFFEE_RESULTS.map((product, index) => (
        <div key={product.id} className={`result${index === 0 ? " is-first" : ""}`}>
          <div className="result__art">
            <Glyph icon={Image} size={16} />
          </div>
          <div className="result__text">
            <span className="result__name">{product.name}</span>
            <span className="result__detail">
              {product.detail} · {product.category}
            </span>
          </div>
          <span className="result__sku">{product.sku}</span>
          <span className={`stock stock--${product.stockTone} stock--row`}>
            {product.stockLabel}
          </span>
          <span className="result__price">{product.price}</span>
          <StubButton label={`Add ${product.name}`} className="result__add">
            <Glyph icon={Plus} size={14} />
            Add
          </StubButton>
        </div>
      ))}
    </div>
  );
}

export function NotFound({
  query,
  onClear,
}: {
  readonly query: string;
  readonly onClear: () => void;
}) {
  return (
    <div role="alert" className="notfound">
      <div className="notfound__icon">
        <Glyph icon={ScanBarcode} size={20} />
      </div>
      <div className="notfound__body">
        <span className="notfound__title">
          No product matches <span className="notfound__mono">{query}</span>
        </span>
        <span className="notfound__text">
          This barcode isn&apos;t in the product list on the Store Node. Check the barcode on the
          pack, or search by product name. Nothing was added to the cart.
        </span>
        <div className="notfound__actions">
          <button type="button" className="dbtn dbtn--h36" onClick={onClear}>
            <Glyph icon={Search} size={15} />
            Search by name
          </button>
          <button type="button" className="dbtn dbtn--h36 dbtn--ghost" onClick={onClear}>
            Clear and scan again
          </button>
        </div>
      </div>
    </div>
  );
}
