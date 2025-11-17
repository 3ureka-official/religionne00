import { createClient, MicroCMSImage } from "microcms-js-sdk";

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
  nationwideFee: number,
  islandFee: number,
  freeLowerLimit: number,
  completeMessage: string;
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
  category: MicroCMSCategory[];
  sizes: MicroCMSSize[];
};

// サーバー側でのみmicroCMSクライアントを作成
// このファイルはServer Componentでのみ使用される
const getMicroCMSClient = () => {
  return createClient({
    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN ?? '',
    apiKey: process.env.MICROCMS_API_KEY ?? '',
  });
};

export const fetchSettings = async (): Promise<MicroCMSSettings> => {
  const client = getMicroCMSClient();
  const data = await client.getObject<MicroCMSSettings>({
    endpoint: 'settings',
  });

  return data;
};

export const fetchProducts = async (): Promise<MicroCMSProduct[]> => {
  const client = getMicroCMSClient();
  const data = await client.getAllContents<MicroCMSProduct>({
    endpoint: 'products',
  });
  return data;
};

export const fetchProductById = async (id: string): Promise<MicroCMSProduct> => {
  const client = getMicroCMSClient();
  const data = await client.getObject<MicroCMSProduct>({
    endpoint: `products/${id}`,
  });
  return data;
};

export const fetchCategories = async (): Promise<MicroCMSCategory[]> => {
  const client = getMicroCMSClient();
  const data = await client.getList<MicroCMSCategory>({
    endpoint: 'categories',
  });
  return data.contents;
};

export const fetchProductsByCategory = async (categoryId: string) => {
  const client = getMicroCMSClient();
  const data = await client.getList<MicroCMSProduct>({
    endpoint: 'products',
    queries: { filters: `category[equals]${categoryId}` },
  });
  return data.contents;
};

export const searchProducts = async (keyword: string): Promise<MicroCMSProduct[]> => {
  const client = getMicroCMSClient();
  const data = await client.getList<MicroCMSProduct>({
    endpoint: 'products',
    queries: { 
      q: keyword,
      limit: 20
    },
  });
  return data.contents;
};
