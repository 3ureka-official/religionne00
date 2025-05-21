import { Product } from '@/firebase/productService';
import { MicroCMSProduct } from '@/lib/microcms';

// FirebaseのProductをMicroCMSProduct形式に変換するadapter
export const convertToMicroCMSFormat = (product: Product): MicroCMSProduct => {
  return {
    id: product.id || '',
    name: product.name,
    description: product.description,
    stripe_price_id: String(product.price),
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
    revisedAt: '',
    images: product.images.map(url => {
      // 画質向上のために高品質パラメータを追加（Firebase Storageの場合）
      const enhancedUrl = url.includes('firebasestorage.googleapis.com') 
        ? `${url}?alt=media&quality=100` 
        : url;
      
      return {
        url: enhancedUrl,
        width: 800,
        height: 800,
        alt: product.name
      };
    }),
    category: {
      id: product.category,
      category: product.category,
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      revisedAt: '',
      image: { url: '', width: 0, height: 0 }
    },
    sizes: (product.sizeInventories || []).map(item => ({
      fieldId: item.size,
      size: item.size,
      stock: item.stock
    }))
  }
}

// FirebaseのProductを商品詳細ページ用に変換
export const convertToProductDetailFormat = (product: Product) => {
  return {
    id: product.id,
    name: product.name,
    stripe_price_id: String(product.price),
    description: product.description,
    images: product.images.map((url, index) => {
      // 画質向上のために高品質パラメータを追加（Firebase Storageの場合）
      const enhancedUrl = url.includes('firebasestorage.googleapis.com') 
        ? `${url}?alt=media&quality=100` 
        : url;
        
      return {
        id: index + 1,
        src: enhancedUrl,
        width: 800,
        height: 800,
        alt: product.name || `Product image ${index+1}`
      };
    }),
    category: {
      id: product.category,
      name: product.category
    },
    sizeInventories: (product.sizeInventories || []).map(item => ({
      size: item.size,
      stock: Number(item.stock)
    }))
  }
} 