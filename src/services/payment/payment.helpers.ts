export const formatAmount = (amount: number, currency = '€'): string =>
  `${Number(amount).toFixed(0)} ${currency}`;
