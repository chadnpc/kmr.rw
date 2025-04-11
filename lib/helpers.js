export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper function to serialize bike data
export const serializeBikeData = (bike, wishlisted = false) => {
  return {
    ...bike,
    price: bike.price ? parseFloat(bike.price.toString()) : 0,
    createdAt: bike.createdAt?.toISOString(),
    updatedAt: bike.updatedAt?.toISOString(),
    wishlisted: wishlisted,
  };
};
