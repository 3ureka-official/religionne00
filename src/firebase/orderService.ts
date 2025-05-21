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
  limit,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { adjustSizeInventory, addSoldProduct, SoldProductStatus } from './productService';

// 注文の型定義
export interface Order {
  id?: string;
  customer: string;
  email: string;
  phone?: string;
  date: any;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  address: {
    postalCode: string;
    prefecture: string;
    city: string;
    line1: string;
    line2?: string;
  };
  paymentMethod: string;
  createdAt?: any;
  updatedAt?: any;
}

// 注文アイテムの型定義
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
}

// コレクション名
const ORDERS_COLLECTION = 'orders';

// 全注文を取得
export const getAllOrders = async () => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders: ', error);
    throw error;
  }
};

// 最近の注文を取得
export const getRecentOrders = async (limitCount = 5) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting recent orders: ', error);
    throw error;
  }
};

// 注文を取得（ID指定）
export const getOrder = async (id: string) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error getting order: ', error);
    throw error;
  }
};

// ステータス別注文数を取得
export const getOrderCountsByStatus = async () => {
  try {
    const orders = await getAllOrders();
    
    const counts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      total: orders.length
    };
    
    orders.forEach(order => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });
    
    return counts;
  } catch (error) {
    console.error('Error getting order counts: ', error);
    throw error;
  }
};

// 合計売上を取得
export const getTotalSales = async () => {
  try {
    const orders = await getAllOrders();
    
    const total = orders.reduce((sum, order) => {
      // キャンセルされた注文は計算に含めない
      if (order.status !== 'cancelled') {
        return sum + order.total;
      }
      return sum;
    }, 0);
    
    return total;
  } catch (error) {
    console.error('Error calculating total sales: ', error);
    throw error;
  }
};

// 注文を追加
export const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status' | 'createdAt' | 'updatedAt'>) => {
  try {
    // 注文データを準備
    const newOrder = {
      ...orderData,
      date: serverTimestamp(),
      status: 'processing' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // 注文をFirestoreに追加
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
    const orderId = docRef.id;
    
    // 商品の在庫を減らし、販売済み商品として登録
    for (const item of orderData.items) {
      if (item.productId) {
        // サイズごとの在庫も減らす（サイズがある場合）
        if (item.size) {
          await adjustSizeInventory(item.productId, item.size, -item.quantity);
        }
        
        // 販売済み商品として登録
        const soldProductData: any = {
          productId: item.productId,
          name: item.name,
          description: '',
          price: item.price,
          category: '',
          customerName: orderData.customer,
          customerEmail: orderData.email,
          status: SoldProductStatus.PREPARING,
          orderId,
          orderDate: serverTimestamp()
        };
        if (item.size !== undefined) {
          soldProductData.size = item.size;
        }
        if (item.image !== undefined) {
          soldProductData.image = item.image;
        }
        await addSoldProduct(soldProductData);
      }
    }
    
    return { id: orderId, ...newOrder };
  } catch (error) {
    console.error('Error adding order: ', error);
    throw error;
  }
}; 