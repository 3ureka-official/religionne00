import { createClient, MicroCMSImage } from "microcms-js-sdk";
import { JSX } from "react";

export type MicroCMSSNS = {
  service: string;
  icon: MicroCMSImage;
  username: string;
  url: string;
};

export type MicroCMSSettings = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  privacyPolicy: string;
  shoppingGuide: string;
  contact: string;
  brandImages: MicroCMSImage[],
  carouselImages: MicroCMSImage[],
  sns: MicroCMSSNS[],
  NationwideFee: number,
  islandFee: number,
  FreeLowerLimit: number;
};

export type MicroCMSSize = {
  fieldId: string;
  size: string;
  stock: number;
};

export type MicroCMSCategory = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  category: string;
  image: MicroCMSImage;
};

export type MicroCMSProduct = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  stripe_price_id: string;
  images: MicroCMSImage[];
  description: string;
  category: MicroCMSCategory;
  sizes: MicroCMSSize[];
};

export const microcms = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN ?? '',
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY ?? '',
});

export const fetchSettings = async (): Promise<MicroCMSSettings> => {
  const data = await microcms.getObject<MicroCMSSettings>({
    endpoint: 'settings',
  });
  return data;
};

export const fetchProducts = async (): Promise<MicroCMSProduct[]> => {
  const data = await microcms.getAllContents<MicroCMSProduct>({
    endpoint: 'products',
  });
  return data;
};

export const fetchProductById = async (id: string): Promise<MicroCMSProduct> => {
  const data = await microcms.getObject<MicroCMSProduct>({
    endpoint: `products/${id}`,
  });
  return data;
};

export const fetchCategories = async (): Promise<MicroCMSCategory[]> => {
  const data = await microcms.getList<MicroCMSCategory>({
    endpoint: 'categories',
  });
  return data.contents;
};

export const fetchProductsByCategory = async (categoryId: string): Promise<MicroCMSProduct[]> => {
  const data = await microcms.getList<MicroCMSProduct>({
    endpoint: 'products',
    queries: { filters: `category[equals]${categoryId}` },
  });
  return data.contents;
};

export const searchProducts = async (keyword: string): Promise<MicroCMSProduct[]> => {
  const data = await microcms.getList<MicroCMSProduct>({
    endpoint: 'products',
    queries: { 
      q: keyword,
      limit: 20
    },
  });
  return data.contents;
};
