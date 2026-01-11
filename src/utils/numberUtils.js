
// Utility to assume all numbers are English by default and convert only if BN is active
export const convertPrice = (price, language) => {
    // Ensure the price is formatted with commas first (e.g., 2,500)
    const formattedPrice = price.toLocaleString('en-US'); // Always base formatting on English locale first

    if (language === 'bn') {
        const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return formattedPrice.toString().replace(/[0-9]/g, (d) => bengaliDigits[d]);
    }

    return formattedPrice;
};
