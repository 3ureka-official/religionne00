import { Product } from '@/firebase/productService';
import { MicroCMSProduct } from '@/lib/microcms';

// Firebase Storage URLのパラメータを安全に追加する関数
const enhanceFirebaseStorageUrl = (url: string): string => {
  if (!url.includes('firebasestorage.googleapis.com')) {
    return url;
  }
  
  // 既にパラメータがある場合は&で、ない場合は?で追加
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}quality=100`;
};

// FirebaseのProductをMicroCMSProduct形式に変換するadapter
export const convertToMicroCMSFormat = (product: Product): MicroCMSProduct => {
  const categoryValue = Array.isArray(product.category) ? product.category : [product.category]
  console.log(categoryValue)
  return {
    id: product.id || '',
    name: product.name,
    description: product.description,
    stripe_price_id: String(product.price),
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
    revisedAt: '',
    images: product.images.map(url => ({
      url: enhanceFirebaseStorageUrl(url),
      width: 800,
      height: 800,
      alt: product.name
    })),
    category: categoryValue.map((category: any) => ({
      id: typeof category === 'string' ? category : category.id,
      category: typeof category === 'string' ? category : category.category,
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      revisedAt: '',
      image: { url: '', width: 0, height: 0 }
    })),
    sizes: (product.sizeInventories || []).map(item => ({
      fieldId: item.size,
      size: item.size,
      stock: Number(item.stock)
    }))
  }
}

// FirebaseのProductを商品詳細ページ用に変換
export const convertToProductDetailFormat = (product: Product) => {
  const categoryValue = Array.isArray(product.category) ? product.category : [product.category]
  
  return {
    id: product.id,
    name: product.name,
    stripe_price_id: String(product.price),
    description: product.description,
    images: product.images.map((url, index) => ({
      id: index + 1,
      src: enhanceFirebaseStorageUrl(url),
      width: 800,
      height: 800,
      alt: product.name || `Product image ${index + 1}`
    })),
    category: categoryValue.map((category: any) => ({
      id: typeof category === 'string' ? category : category.id,
      category: typeof category === 'string' ? category : category.category,
    })),
    sizeInventories: (product.sizeInventories || []).map(item => ({
      size: item.size,
      stock: Number(item.stock)
    })),
    link: product.link
  }
} 