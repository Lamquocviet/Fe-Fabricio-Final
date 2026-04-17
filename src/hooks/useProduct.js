import { useEffect, useState } from "react";
import { productService } from "../services/productService"; 
import { filterProducts } from "../utils/filterProducts";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    price: "All",
    tag: "",
    sort: "Newest",
  });

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await productService.getProducts(); 
      setProducts(data);
      setFilteredProducts(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = filterProducts(products, filters);
    setFilteredProducts(result);
  }, [filters, products]);
  

  return {
    filters,
    setFilters,
    filteredProducts,
  };
};