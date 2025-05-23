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
  DocumentReference,
  FieldValue,
  UpdateData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { createStripeProductWithPrice } from '@/services/stripeService';
import { Timestamp } from 'firebase/firestore';


// 商品の型定義
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number; // 文字列許容をやめ、数値に統一
  category: string;
  images: string[];
  createdAt?: Timestamp | FieldValue | null;
  updatedAt?: Timestamp | FieldValue | null;
  isPublished: boolean;
  isRecommended?: boolean; // おすすめ商品かどうか
  condition?: string;
  sizeInventories?: SizeInventory[]; // サイズごとの在庫管理
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
}

// サイズごとの在庫情報
export interface SizeInventory {
  size: string;
  stock: number;
}

// 型安全なUpdateData型の定義
type ProductUpdateData = UpdateData<Omit<Product, 'id'>>;

// コレクション名
const PRODUCTS_COLLECTION = 'products';

// 商品を追加
export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product & {id: string}> => {
  try {
    const productData = {
      ...product,
      price: Number(product.price), // 数値であることを保証
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
    return { id: docRef.id, ...productData } as Product & {id: string};
  } catch (error: unknown) {
    console.error('Error adding product: ', error);
    throw error;
  }
};

// 商品を取得（ID指定）
export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      console.log('Product not found:', id);
      return null;
    }
  } catch (error: unknown) {
    console.error('Error getting product: ', error);
    throw error;
  }
};

// 全商品を取得
export const getAllProducts = async (onlyPublished = false): Promise<Product[]> => {
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
  } catch (error: unknown) {
    console.error('Error getting products: ', error);
    throw error;
  }
};

// カテゴリ別商品を取得
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
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
  } catch (error: unknown) {
    console.error('Error getting products by category: ', error);
    throw error;
  }
};

// 商品を更新
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product & {id: string}> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const updateData: ProductUpdateData = {
      ...productData,
      updatedAt: serverTimestamp()
    };
    
    if (productData.price !== undefined) {
      updateData.price = Number(productData.price);
    }
    
    await updateDoc(docRef, updateData);
    return { id, ...updateData } as Product & {id: string};
  } catch (error: unknown) {
    console.error('Error updating product: ', error);
    throw error;
  }
};

// 商品を削除
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error: unknown) {
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
    const metadata = { contentType: file.type };
    await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(storageRef);
  } catch (error: unknown) {
    console.error('Error uploading image: ', error);
    throw error;
  }
};

// 画像を削除
export const deleteProductImage = async (imageUrl: string): Promise<boolean> => {
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    return true;
  } catch (error: unknown) {
    console.error('Error deleting image: ', error);
    // 画像削除失敗はクリティカルではない場合もあるので、エラーを投げずにfalseを返すことも検討
    return false; 
  }
};

// バルク商品登録
export const bulkAddProducts = async (products: Omit<Product, 'id'>[]): Promise<string[]> => {
  try {
    const batch = writeBatch(db);
    const productRefs: DocumentReference[] = [];
    products.forEach(product => {
      const docRef = doc(collection(db, PRODUCTS_COLLECTION));
      productRefs.push(docRef);
      batch.set(docRef, {
        ...product,
        price: Number(product.price), // 数値であることを保証
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
    await batch.commit();
    return productRefs.map(ref => ref.id);
  } catch (error: unknown) {
    console.error('Error bulk adding products: ', error);
    throw error;
  }
};

// 商品登録 - 画像とデータを一括処理
export const createProductWithImages = async (
  productData: Omit<Product, 'id' | 'images' | 'stripe_product_id' | 'stripe_price_id' | 'createdAt' | 'updatedAt'>, 
  imageFiles: File[]
): Promise<Product & {id: string}> => {
  try {
    const tempId = 'temp_' + Date.now().toString();
    const imageUrls: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const imageUrl = await uploadProductImage(file, tempId);
        imageUrls.push(imageUrl);
      }
    }
    const completeProductData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      ...productData,
      images: imageUrls,
      price: Number(productData.price),
      isPublished: productData.isPublished !== undefined ? productData.isPublished : true, // デフォルト値を設定
    };
    return await addProduct(completeProductData);
  } catch (error: unknown) {
    console.error('Error creating product with images: ', error);
    throw error;
  }
};

// Stripeと連携した商品登録 - 画像とデータを一括処理
export const createProductWithStripe = async (
  productData: Omit<Product, 'id' | 'images' | 'stripe_product_id' | 'stripe_price_id' | 'createdAt' | 'updatedAt'>, 
  imageFiles: File[]
): Promise<Product & {id: string}> => {
  try {
    const tempId = 'temp_' + Date.now().toString();
    const imageUrls: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const imageUrl = await uploadProductImage(file, tempId);
        imageUrls.push(imageUrl);
      }
    }
    let stripeProductId = null;
    let stripePriceId = null;
    try {
      const stripeResult = await createStripeProductWithPrice(
        productData.name,
        productData.description || '',
        imageUrls,
        Number(productData.price)
      );
      stripeProductId = stripeResult.productId;
      stripePriceId = stripeResult.priceId;
    } catch (stripeError) {
      console.warn('Stripe連携に失敗しました。Stripe連携なしで商品を登録します:', stripeError);
    }
    const completeProductData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      ...productData,
      images: imageUrls,
      price: Number(productData.price),
      isPublished: productData.isPublished !== undefined ? productData.isPublished : true, // デフォルト値を設定
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId
    };
    return await addProduct(completeProductData);
  } catch (error: unknown) {
    console.error('Error creating product with Stripe: ', error);
    throw error;
  }
};

// 画像のバッチアップロード
export const batchUploadImages = async (files: File[], productId: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadProductImage(file, productId));
    return await Promise.all(uploadPromises);
  } catch (error: unknown) {
    console.error('Error batch uploading images: ', error);
    throw error;
  }
};

// サイズごとの在庫を調整
export const adjustSizeInventory = async (productId: string, size: string, adjustment: number): Promise<{success: boolean, sizeInventories?: SizeInventory[]}> => {
  try {
    const product = await getProduct(productId);
    if (!product) {
      throw new Error(`Product not found for ID: ${productId} in adjustSizeInventory`);
    }
    if (!product.sizeInventories || !Array.isArray(product.sizeInventories)) {
      product.sizeInventories = [];
    }
    let sizeInventory = product.sizeInventories.find(item => item.size === size);
    if (sizeInventory) {
      sizeInventory.stock = Math.max(0, sizeInventory.stock + adjustment);
    } else if (adjustment < 0) {
      sizeInventory = { size, stock: 0 };
      product.sizeInventories.push(sizeInventory);
    } else {
      sizeInventory = { size, stock: adjustment };
      product.sizeInventories.push(sizeInventory);
    }
    // updateProduct を使用して更新することで、updatedAtが正しく処理される
    await updateProduct(productId, { sizeInventories: product.sizeInventories });
    return {
      success: true,
      sizeInventories: product.sizeInventories
    };
  } catch (error: unknown) {
    console.error('Error adjusting size inventory: ', error);
    throw error;
  }
}; 