
export const getFullPrice = (basePriceUsd, shippingPrice) => {
    return (5.0 + (basePriceUsd * 1.2 + (shippingPrice && shippingPrice.currency === 'USD' ? shippingPrice.cost : 0)) / 100.0).toFixed(2);
}