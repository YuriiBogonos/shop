import axios, { AxiosResponse } from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Category {
  name: string;
  // Add more fields as needed
}

// API endpoint URLs
const BASE_URL = 'https://dummyjson.com';

const endpoints = {
  PRODUCTS: '/products',
  PRODUCT_SEARCH: '/products/search',
  PRODUCT_CATEGORIES: '/products/categories',
  PRODUCT_CATEGORY: '/products/category',
  AUTH_PRODUCTS: '/auth/products',
};


export const getAllProducts = async (skip: number, limit: number, query: string): Promise<AxiosResponse<Product[]>> => {
  return await axios.get<Product[]>(`${BASE_URL}${endpoints.PRODUCTS}?skip=${skip}&limit=${limit}${query ? `&q=${query}` : ''}`);
};

export const getProductById = async (id: number): Promise<AxiosResponse<Product>> => {
  return await axios.get<Product>(`${BASE_URL}${endpoints.PRODUCTS}/${id}`);
};

export const searchProducts = async (query: string): Promise<AxiosResponse<Product[]>> => {
  return await axios.get<Product[]>(`${BASE_URL}${endpoints.PRODUCT_SEARCH}?q=${query}`);
};

export const getProductCategories = async (): Promise<AxiosResponse<Category[]>> => {
  return await axios.get<Category[]>(`${BASE_URL}${endpoints.PRODUCT_CATEGORIES}`);
};

export const getProductsByCategory = async (category: string, skip: number, limit: number, query: string): Promise<AxiosResponse<Product[]>> => {
  return await axios.get<Product[]>(`${BASE_URL}${endpoints.PRODUCT_CATEGORY}/${category}?skip=${skip}&limit=${limit}${query ? `&q=${query}` : ''}`);
};

export const addProduct = async (product: Product): Promise<AxiosResponse<Product>> => {
  return await axios.post<Product>(`${BASE_URL}${endpoints.PRODUCTS}/add`, product);
};

export const updateProduct = async (id: number, product: Product): Promise<AxiosResponse<Product>> => {
  return await axios.put<Product>(`${BASE_URL}${endpoints.PRODUCTS}/${id}`, product);
};

export const partialUpdateProduct = async (id: number, updates: Partial<Product>): Promise<AxiosResponse<Product>> => {
  return await axios.patch<Product>(`${BASE_URL}${endpoints.PRODUCTS}/${id}`, updates);
};

// export const getAuthProducts = async (token: string): Promise<AxiosResponse<Product[]>> => {
//   return await axios.get<Product[]>(`${BASE_URL}${endpoints.AUTH_PRODUCTS}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
