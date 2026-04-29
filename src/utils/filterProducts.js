export const filterProducts = (products, filters) => {
  let result = [...products];

  //  convert price string → number
  const parsePrice = (price) => {
    if (price === "Free" || price === 0) return 0;
    if (typeof price === "number") return price;
    return Number(String(price).replace("$", ""));
  };

  // filter price
  if (filters.price === "Free") {
    result = result.filter((p) => parsePrice(p.price) === 0);
  } else if (filters.price === "Paid") {
    result = result.filter((p) => parsePrice(p.price) > 0);
  }

  // filter tag
  if (filters.tag && filters.tag !== "") {
    result = result.filter((p) => {
      // Ensure tags is an array
      const tagsArray = Array.isArray(p.tags) ? p.tags : [];
      return tagsArray.some(tag => 
        typeof tag === 'string' && tag.toLowerCase() === filters.tag.toLowerCase()
      );
    });
  }

  // sort
  if (filters.sort === "Price") {
    result = [...result].sort(
      (a, b) => parsePrice(a.price) - parsePrice(b.price)
    );
  }

  if (filters.sort === "Rating") {
    result = [...result].sort(
      (a, b) => b.rating - a.rating 
    );
  }

  return result;
};