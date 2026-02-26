export function formatPrice(price: number, locale = 'it-IT', currency = 'EUR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}