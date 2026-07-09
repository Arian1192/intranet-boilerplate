/**
 * CRUDA currency format. Matches the reference app: 2 decimals, comma decimal
 * separator, and a thousands dot ONLY when the integer part has >= 5 digits
 * (i.e. value >= 10000). e.g. 6650 -> "6650,00 €", 15614.85 -> "15.614,85 €".
 */
export function eur(value: number): string {
  const sign = value < 0 ? '-' : '';
  const fixed = Math.abs(value).toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const grouped =
    intPart.length >= 5 ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : intPart;
  return `${sign}${grouped},${decPart} €`;
}
