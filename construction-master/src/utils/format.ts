/**
 * Formatação apenas para APRESENTAÇÃO. O motor de cálculo nunca arredonda
 * valores intermediários (ver docs/CALCULATION_ENGINE.md §12) — o
 * arredondamento acontece exclusivamente aqui.
 */

export function formatCurrency(
  value: number,
  locale = 'pt-BR',
  currency = 'BRL',
): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatPercent(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '—';
  return `${value.toFixed(decimals)}%`;
}

export function formatQuantity(value: number, unit: string, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Number(value.toFixed(decimals));
  return `${rounded.toLocaleString('pt-BR', { maximumFractionDigits: decimals })} ${unit}`;
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(decimals)).toLocaleString('pt-BR', {
    maximumFractionDigits: decimals,
  });
}
