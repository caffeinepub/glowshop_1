/**
 * Format a price in whole rupees to Indian Rupee display string.
 * Prices are stored as whole rupee amounts (bigint or number).
 * e.g. 1299 → ₹1,299
 *
 * @param price - Price in rupees as bigint or number
 * @returns Formatted string with ₹ symbol and Indian locale separators
 */
export function formatINR(price: bigint | number): string {
  const rupees = Number(price);
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
