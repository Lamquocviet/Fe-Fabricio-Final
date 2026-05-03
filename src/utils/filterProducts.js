export const filterProducts = (products, filters, purchasedIds = []) => {
  let result = [...products];

  // ✅ PRICE
  if (filters.price === "Free") {
    result = result.filter((p) => p.price === 0);
  } else if (filters.price === "Paid") {
    result = result.filter((p) => p.price > 0);
  }

  // ✅ TAG
  if (filters.tag) {
    result = result.filter((p) =>
      p.gameTags?.some(
        (tag) =>
          tag.name.toLowerCase() === filters.tag.toLowerCase()
      )
    );
  }

  // ✅ PURCHASE FILTER (🔥 cái bạn cần)
  if (filters.ownership === "Purchased") {
    result = result.filter((p) =>
      purchasedIds.includes(String(p.id))
    );
  }

  if (filters.ownership === "NotPurchased") {
    result = result.filter((p) =>
      !purchasedIds.includes(String(p.id))
    );
  }

  // ✅ SORT
  if (filters.sort === "Price") {
    result = [...result].sort((a, b) => a.price - b.price);
  }

  if (filters.sort === "Rating") {
    result = [...result].sort(
      (a, b) => b.averageRating - a.averageRating
    );
  }

  return result;
};