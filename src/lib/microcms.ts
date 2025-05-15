import { createClient, MicroCMSImage } from "microcms-js-sdk";
import { env } from "process";
import { JSX } from "react";

export type MicroCMSSettings = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  privacyPolicy: JSX.Element;
  shoppingGuide: JSX.Element;
  contact: JSX.Element;
  brandImages: MicroCMSImage[],
  carouselImages: MicroCMSImage[]
  pickUpProduct: MicroCMSProduct | undefined;
}

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
  serviceDomain: env.MICROCMS_SERVICE_DOMAIN ?? '',
  apiKey: env.MICROCMS_API_KEY ?? '',
});

export const fetchSettings = async (): Promise<MicroCMSSettings> => {
  const data = await microcms.getObject<MicroCMSSettings>({
    endpoint: 'settings',
  });
  return data;
};

export const fetchProducts = async (): Promise<MicroCMSProduct[]> => {
  const data = await microcms.getList<MicroCMSProduct>({
    endpoint: 'products',
  });
  return data.contents;
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
