
import { CURRENCIES } from "../constants/incentiveConstants";

// Find currency symbol for the selected currency
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  // Access the symbol property, if it exists, otherwise use a default
  return currency && 'symbol' in currency ? currency.symbol : '$';
};

// Format currency with 2 decimal places - ensure max 15 digits total including decimals
export const formatCurrency = (value: number | string): string => {
  // Ensure the value is a number
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  
  // Convert to string with 2 decimal places
  let formatted = numValue.toFixed(2);
  
  // Check if total length exceeds 15 (including decimal point)
  if (formatted.replace('.', '').length > 15) {
    // Truncate to 15 digits total (13 digits before decimal, 2 after)
    const maxBeforeDecimal = 13;
    const beforeDecimal = Math.floor(numValue).toString().slice(0, maxBeforeDecimal);
    formatted = parseFloat(beforeDecimal).toFixed(2);
  }
  
  return formatted;
};
