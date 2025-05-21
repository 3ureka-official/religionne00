import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  writeBatch,
  DocumentReference
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { createStripeProductWithPrice } from '@/services/stripeService';

// 商品の型定義
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  images: string[];
  createdAt?: any;
  updatedAt?: any;
  isPublished: boolean;
  isRecommended?: boolean; // おすすめ商品かどうか
  condition?: string;
  sizeInventories?: SizeInventory[]; // サイズごとの在庫管理
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
}

// 販売済み商品のステータス
export enum SoldProductStatus {
  PREPARING = 'preparing', // 配送準備中
  SHIPPED = 'shipped'      // 配送済み
}

// 販売済み商品の型定義
export interface SoldProduct {
  id?: string;
  productId: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  size?: string;
  image?: string;
  customerName: string;
  customerEmail: string;
  status: SoldProductStatus;
  orderId: string;
  orderDate: any;
  shippedDate?: any;
  createdAt?: any;
  updatedAt?: any;
}

// サイズごとの在庫情報
export interface SizeInventory {
  size: string;
  stock: number;
}

// コレクション名
const PRODUCTS_COLLECTION = 'products';
const SOLD_PRODUCTS_COLLECTION = 'soldProducts';

// 商品を追加
export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const productData = {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};

// 商品を取得（ID指定）
export const getProduct = async (id: string) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product: ', error);
    throw error;
  }
};

// 全商品を取得
export const getAllProducts = async (onlyPublished = false) => {
  try {
    let q;
    
    if (onlyPublished) {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products: ', error);
    throw error;
  }
};

// カテゴリ別商品を取得
export const getProductsByCategory = async (category: string) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products by category: ', error);
    throw error;
  }
};

// 商品を更新
export const updateProduct = async (id: string, productData: Partial<Product>) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    
    const updateData = {
      ...productData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error('Error updating product: ', error);
    throw error;
  }
};

// 商品を削除
export const deleteProduct = async (id: string) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product: ', error);
    throw error;
  }
};

// 画像をアップロード
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${productId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `products/${fileName}`);
    
    // 画像品質を維持するためのメタデータを設定
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'quality': 'high'
      }
    };
    
    // メタデータを指定してアップロード
    await uploadBytes(storageRef, file, metadata);
    
    // 高画質パラメータを追加してダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);
    
    // URLに高品質パラメータを追加
    const enhancedURL = downloadURL.includes('?') 
      ? `${downloadURL}&quality=100` 
      : `${downloadURL}?quality=100`;
    
    return enhancedURL;
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
};

// 画像を削除
export const deleteProductImage = async (imageUrl: string) => {
  try {
    // Cloud Storage のURLからパスを抽出
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Error deleting image: ', error);
    throw error;
  }
};

// バルク商品登録
export const bulkAddProducts = async (products: Omit<Product, 'id'>[]) => {
  try {
    const batch = writeBatch(db);
    const productRefs: DocumentReference[] = [];

    // バッチ処理でFirestoreに追加
    products.forEach(product => {
      const docRef = doc(collection(db, PRODUCTS_COLLECTION));
      productRefs.push(docRef);
      
      batch.set(docRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    // バッチコミット
    await batch.commit();
    
    return productRefs.map(ref => ref.id);
  } catch (error) {
    console.error('Error bulk adding products: ', error);
    throw error;
  }
};

// 商品登録 - 画像とデータを一括処理
export const createProductWithImages = async (
  productData: Omit<Product, 'id' | 'images' | 'sizes'>, 
  imageFiles: File[]
) => {
  try {
    // 一時的なIDを生成（実際のIDはFirebaseが生成）
    const tempId = 'temp_' + Date.now().toString();
    
    // 画像のアップロード処理
    const imageUrls: string[] = [];
    
    // 画像がある場合のみアップロード処理
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const imageUrl = await uploadProductImage(file, tempId);
        imageUrls.push(imageUrl);
      }
    }
    
    // 商品データにアップロードした画像URLを追加
    const completeProductData = {
      ...productData,
      images: imageUrls,
      price: Number(productData.price),
      isPublished: true
    };
    
    // Firestoreに商品データを保存
    const newProduct = await addProduct(completeProductData);
    return newProduct;
  } catch (error) {
    console.error('Error creating product with images: ', error);
    throw error;
  }
};

// Stripeと連携した商品登録 - 画像とデータを一括処理
export const createProductWithStripe = async (
  productData: Omit<Product, 'id' | 'images' | 'sizes' | 'stripe_product_id' | 'stripe_price_id'>, 
  imageFiles: File[]
) => {
  try {
    // 一時的なIDを生成（実際のIDはFirebaseが生成）
    const tempId = 'temp_' + Date.now().toString();
    
    // 画像のアップロード処理
    const imageUrls: string[] = [];
    
    // 画像がある場合のみアップロード処理
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const imageUrl = await uploadProductImage(file, tempId);
        imageUrls.push(imageUrl);
      }
    }
    
    let stripeProductId = null;
    let stripePriceId = null;
    
    try {
      // Stripeに商品と価格を作成
      const stripeResult = await createStripeProductWithPrice(
        productData.name,
        productData.description || '',
        imageUrls,
        Number(productData.price)
      );
      
      stripeProductId = stripeResult.productId;
      stripePriceId = stripeResult.priceId;
    } catch (error) {
      console.warn('Stripe連携に失敗しました。Stripe連携なしで商品を登録します:', error);
      // Stripe連携なしで続行
    }
    
    // 商品データにアップロードした画像URLとStripe IDsを追加
    const completeProductData = {
      ...productData,
      images: imageUrls,
      price: Number(productData.price),
      isPublished: true,
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId
    };
    
    // Firestoreに商品データを保存
    const newProduct = await addProduct(completeProductData);
    return {
      ...newProduct,
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId
    };
  } catch (error) {
    console.error('Error creating product with Stripe: ', error);
    throw error;
  }
};

// 画像のバッチアップロード
export const batchUploadImages = async (files: File[], productId: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadProductImage(file, productId));
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error('Error batch uploading images: ', error);
    throw error;
  }
};

// 販売済み商品を追加
export const addSoldProduct = async (soldProduct: Omit<SoldProduct, 'id'>) => {
  try {
    const soldProductData = {
      ...soldProduct,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, SOLD_PRODUCTS_COLLECTION), soldProductData);
    return { id: docRef.id, ...soldProductData };
  } catch (error) {
    console.error('Error adding sold product: ', error);
    throw error;
  }
};

// すべての販売済み商品を取得
export const getAllSoldProducts = async () => {
  try {
    const q = query(
      collection(db, SOLD_PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const soldProducts: SoldProduct[] = [];
    
    querySnapshot.forEach((doc) => {
      soldProducts.push({ id: doc.id, ...doc.data() } as SoldProduct);
    });
    
    return soldProducts;
  } catch (error) {
    console.error('Error getting sold products: ', error);
    throw error;
  }
};

// ステータス別の販売済み商品を取得
export const getSoldProductsByStatus = async (status: SoldProductStatus) => {
  try {
    const q = query(
      collection(db, SOLD_PRODUCTS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const soldProducts: SoldProduct[] = [];
    
    querySnapshot.forEach((doc) => {
      soldProducts.push({ id: doc.id, ...doc.data() } as SoldProduct);
    });
    
    return soldProducts;
  } catch (error) {
    console.error('Error getting sold products by status: ', error);
    throw error;
  }
};

// 販売済み商品のステータスを更新
export const updateSoldProductStatus = async (id: string, status: SoldProductStatus) => {
  try {
    const docRef = doc(db, SOLD_PRODUCTS_COLLECTION, id);
    
    const updateData: any = { 
      status,
      updatedAt: serverTimestamp()
    };
    
    // 配送済みに変更する場合は配送日を追加
    if (status === SoldProductStatus.SHIPPED) {
      updateData.shippedDate = serverTimestamp();
    }
    
    await updateDoc(docRef, updateData);
    return { id, status };
  } catch (error) {
    console.error('Error updating sold product status: ', error);
    throw error;
  }
};

// サイズごとの在庫を調整
export const adjustSizeInventory = async (productId: string, size: string, adjustment: number) => {
  try {
    // 現在の商品情報を取得
    const product = await getProduct(productId);
    
    // サイズごとの在庫情報がない場合は作成
    if (!product.sizeInventories || !Array.isArray(product.sizeInventories)) {
      product.sizeInventories = [];
    }
    
    // 指定したサイズの在庫情報を検索
    let sizeInventory = product.sizeInventories.find(item => item.size === size);
    
    if (sizeInventory) {
      // 既存のサイズ情報がある場合は数量を調整
      sizeInventory.stock = Math.max(0, sizeInventory.stock + adjustment);
    } else if (adjustment < 0) {
      // 既存のサイズ情報がなく、数量を減らす場合は0として処理
      sizeInventory = { size, stock: 0 };
      product.sizeInventories.push(sizeInventory);
    } else {
      // 既存のサイズ情報がなく、数量を増やす場合
      sizeInventory = { size, stock: adjustment };
      product.sizeInventories.push(sizeInventory);
    }
    
    // 商品データを更新
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, { 
      sizeInventories: product.sizeInventories,
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      sizeInventories: product.sizeInventories
    };
  } catch (error) {
    console.error('Error adjusting size inventory: ', error);
    throw error;
  }
}; 