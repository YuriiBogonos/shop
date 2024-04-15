import React, { useEffect } from "react";
import {
  getAllProducts,
  getProductCategories,
  getProductsByCategory,
  searchProducts,
} from "../api/client";
import { Product } from "../types/product/Product";
import { useDebounce } from "../hooks/useDebounce/UseDebounce";

interface ProductsContextProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const initialState: ProductsContextProps = {
  products: [],
  setProducts: () => [],
  categories: [],
  setSelectedCategory: () => "",
  selectedCategory: "All",
  page: 0,
  setPage: () => {},
  itemsPerPage: 5,
  setItemsPerPage: () => 5,
  totalItems: 0,
  searchQuery: "",
  setSearchQuery: () => "",
};

export const ProductsContext =
  React.createContext<ProductsContextProps>(initialState);
const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(5);
  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const categories = await getProductCategories();
        setCategories(categories.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    })();
  }, []);

  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    (async () => {
      let fetchedProducts = [];

      if (debouncedQuery) {
        try {
          setPage(0);
          const response = await searchProducts(debouncedQuery);
          fetchedProducts = response.data.products;
          setTotalItems(response.data.total);
          setProducts(
            fetchedProducts.filter((product: Product) =>
              product.title.toLowerCase().includes(debouncedQuery.toLowerCase())
            )
          );
          return;
        } catch (error) {
          console.error("Error fetching products", error);
          return;
        }
      }
      try {
        if (selectedCategory !== "All") {
          const response = await getProductsByCategory(
            selectedCategory,
            page * itemsPerPage,
            itemsPerPage,
            debouncedQuery
          );
          fetchedProducts = response.data.products;
          setTotalItems(response.data.total);
        } else {
          const response = await getAllProducts(
            page * itemsPerPage,
            itemsPerPage,
            debouncedQuery
          );
          setTotalItems(response.data.total);
          fetchedProducts = response.data.products;
        }

        setProducts(
          fetchedProducts.filter((product: Product) =>
            product.title.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
        );
      } catch (error) {
        console.error("Error fetching products", error);
      }
    })();
  }, [debouncedQuery, itemsPerPage, page, selectedCategory]);

  console.log("products", products);

  const value = {
    products,
    setProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    searchQuery,
    setSearchQuery,
  };
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
