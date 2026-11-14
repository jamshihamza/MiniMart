// Exact decimal arithmetic over decimal strings. Values are held as BigInt scaled by 10^8,
// matching numeric(24,8) in the store database. No binary floating point is used.
export const DECIMAL_SCALE = 8;
const UNIT = 10n ** BigInt(DECIMAL_SCALE);

export type Dec = bigint;

export class InvalidDecimalError extends Error {
  constructor(value: string) {
    super(`Invalid decimal string: ${value}`);
    this.name = "InvalidDecimalError";
  }
}

export function parseDec(value: string): Dec {
  const match = /^(-?)(\d{1,16})(?:\.(\d{1,8}))?$/.exec(value.trim());
  if (match === null) throw new InvalidDecimalError(value);
  const whole = BigInt(match[2] ?? "0") * UNIT;
  const fraction = BigInt((match[3] ?? "").padEnd(DECIMAL_SCALE, "0"));
  const magnitude = whole + fraction;
  return match[1] === "-" ? -magnitude : magnitude;
}

export function formatDec(value: Dec, places = 2): string {
  if (places < 0 || places > DECIMAL_SCALE) throw new RangeError("places must be 0..8");
  const rounded = roundDec(value, places);
  const negative = rounded < 0n;
  const magnitude = negative ? -rounded : rounded;
  const whole = magnitude / UNIT;
  const fraction = (magnitude % UNIT).toString().padStart(DECIMAL_SCALE, "0").slice(0, places);
  const text = places === 0 ? whole.toString() : `${whole.toString()}.${fraction}`;
  return negative && magnitude !== 0n ? `-${text}` : text;
}

/** Round half away from zero to the given number of decimal places. */
export function roundDec(value: Dec, places: number): Dec {
  const step = 10n ** BigInt(DECIMAL_SCALE - places);
  const negative = value < 0n;
  const magnitude = negative ? -value : value;
  const rounded = ((magnitude + step / 2n) / step) * step;
  return negative ? -rounded : rounded;
}

export function mulDec(left: Dec, right: Dec): Dec {
  const product = left * right;
  const negative = product < 0n;
  const magnitude = negative ? -product : product;
  const scaled = (magnitude + UNIT / 2n) / UNIT;
  return negative ? -scaled : scaled;
}

export function divDec(left: Dec, right: Dec): Dec {
  if (right === 0n) throw new RangeError("Division by zero");
  const numerator = left * UNIT;
  const negative = numerator < 0n !== right < 0n;
  const a = numerator < 0n ? -numerator : numerator;
  const b = right < 0n ? -right : right;
  const scaled = (a + b / 2n) / b;
  return negative ? -scaled : scaled;
}

export const ZERO: Dec = 0n;
