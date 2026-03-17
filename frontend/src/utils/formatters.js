/**
 * Formats a number as BDT (Bangladeshi Taka)
 * Uses the Indian/Bangladeshi numbering system (Lakhs, Crores)
 * @param {number|string} amount 
 * @returns {string}
 */
export const formatBDT = (amount) => {
  if (amount === undefined || amount === null || amount === '') return 'N/A';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return 'N/A';

  // We'll use en-IN for the 2,2,3 grouping (Lakh/Crore) 
  // and manually add the symbol to be 100% sure of the visual style
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);

  return `৳ ${formatted}`;
};
