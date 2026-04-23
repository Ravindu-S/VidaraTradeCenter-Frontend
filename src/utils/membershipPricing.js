const MAX_COMBINED = 35;

export function bulkDiscountPercent(quantity) {
  const q = Number(quantity) || 0;
  if (q < 5) return 0;
  if (q <= 9) return 3;
  if (q <= 24) return 7;
  if (q <= 49) return 10;
  return 15;
}

/** plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | null */
export function membershipProductDiscountPercent(plan) {
  if (!plan) return 0;
  switch (plan) {
    case "STARTER":
      return 5;
    case "PROFESSIONAL":
      return 12;
    case "ENTERPRISE":
      return 20;
    default:
      return 0;
  }
}

export function combinedDiscountPercent(bulkPct, memPct) {
  const b = bulkPct / 100;
  const m = memPct / 100;
  const factor = (1 - b) * (1 - m);
  return Math.round((1 - factor) * 10000) / 100;
}

export function effectiveUnitPrice(retailUnit, quantity, plan) {
  const bulk = bulkDiscountPercent(quantity);
  const mem = membershipProductDiscountPercent(plan);
  let factor = (1 - bulk / 100) * (1 - mem / 100);
  const discPct = (1 - factor) * 100;
  if (discPct > MAX_COMBINED) {
    factor = 1 - MAX_COMBINED / 100;
  }
  return Number(retailUnit) * factor;
}

export function retailUnitFromProduct(product) {
  if (!product) return 0;
  const base = Number(product.basePrice);
  const sale = product.salePrice != null ? Number(product.salePrice) : null;
  if (sale != null && !Number.isNaN(sale) && sale < base) return sale;
  return base;
}

export const BULK_TIERS = [
  { label: "5–9 units", bulk: 3 },
  { label: "10–24 units", bulk: 7 },
  { label: "25–49 units", bulk: 10 },
  { label: "50+ units", bulk: 15 },
];

export function withProCombinedPercent(bulkPct) {
  const mem = membershipProductDiscountPercent("PROFESSIONAL");
  const c = combinedDiscountPercent(bulkPct, mem);
  return Math.min(c, MAX_COMBINED);
}
