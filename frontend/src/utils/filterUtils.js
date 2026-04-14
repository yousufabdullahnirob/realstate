/**
 * Utility to generate ranges for search filters based on min/max values from the database.
 */
export const FilterUtils = {
  /**
   * Generates price range intervals (e.g., 5M, 10M, 20M...)
   * @param {number} min - Minimum price in database
   * @param {number} max - Maximum price in database
   */
  generatePriceRanges: (min, max) => {
    if (!max) return [];
    
    // We want intervals that are easy to read
    const baseIntervals = [
      5000000,   // 5M
      10000000,  // 10M
      15000000,  // 15M
      20000000,  // 20M
      30000000,  // 30M
      40000000,  // 40M
      50000000,  // 50M
      60000000,  // 60M
      80000000,  // 80M
      100000000  // 100M
    ];

    return baseIntervals.filter(val => val >= min && val <= max + 5000000);
  },

  /**
   * Generates size range intervals (e.g., 500, 1000, 1500...)
   * @param {number} min 
   * @param {number} max 
   */
  generateSizeRanges: (min, max) => {
    if (!max) return [];
    
    // Size intervals in sqft
    const steps = [800, 1200, 1500, 2000, 2500, 3000, 4000];
    return steps.filter(val => val <= max + 500);
  },

  /**
   * Formats price for display (e.g., 10000000 -> 1 Crore or 10M)
   */
  formatPrice: (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)} Crore`;
    }
    return `${(price / 100000).toFixed(0)} Lakh`;
  }
};
