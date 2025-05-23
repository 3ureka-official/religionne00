import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  where,
  UpdateData
} from 'firebase/firestore';
import { db } from './config';
import { adjustSizeInventory } from './productService';
import { Timestamp } from 'firebase/firestore';

// 注文の型定義
export interface Order {
  id?: string;
  customer: string;
  email: string;
  phone?: string;
  date: Timestamp | null;
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
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  shippingFee: number;
  // 配送関連の追加フィールド
  shippedDate?: Timestamp | null;
  deliveredDate?: Timestamp | null;
  trackingNumber?: string;
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
    
    // 商品の在庫を減らす
    for (const item of orderData.items) {
      if (item.productId && item.size) {
        // サイズごとの在庫を減らす（サイズがある場合）
        await adjustSizeInventory(item.productId, item.size, -item.quantity);
      }
    }
    
    return orderId;
  } catch (error: unknown) {
    console.error('Error adding order: ', error);
    throw error;
  }
};

// 注文IDで注文情報を取得する関数
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, 'orders', orderId); // 'orders' は実際のコレクション名
    const orderSnap = await getDoc(orderRef);
    if (orderSnap.exists()) {
      // 取得したデータとIDをOrder型として返す
      // 必要に応じて orderSnap.data() の内容を Order 型に適合させる処理を追加
      return { id: orderSnap.id, ...orderSnap.data() } as Order;
    } else {
      console.log(`No order found with ID: ${orderId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching order by ID (${orderId}):`, error);
    throw error; // エラーを呼び出し元に伝える
  }
};

// 注文ステータスを更新する関数
export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: UpdateData<Order> = {
      status: newStatus as Order['status'],
      updatedAt: serverTimestamp(),
    };
    
    // 配送済みの場合は配送日を追加
    if (newStatus === 'shipped') {
      updateData.shippedDate = serverTimestamp();
    }
    
    // 配達完了の場合は配達日を追加
    if (newStatus === 'delivered') {
      updateData.deliveredDate = serverTimestamp();
    }
    
    await updateDoc(orderRef, updateData);
    console.log(`Order status updated for ID: ${orderId} to ${newStatus}`);
  } catch (error) {
    console.error(`Error updating order status for ID (${orderId}):`, error);
    throw error;
  }
};

// ステータス別の注文を取得
export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error: unknown) {
    console.error('Error getting orders by status: ', error);
    throw error;
  }
};

// 売上データを取得（配送済み注文のみ）
export const getSalesData = async (): Promise<Order[]> => {
  try {
    const orders = await getAllOrders();
    return orders.filter(order => 
      order.status === 'shipped' || 
      order.status === 'delivered'
    );
  } catch (error: unknown) {
    console.error('Error getting sales data: ', error);
    throw error;
  }
};

// 商品別売上分析
export const getProductSalesAnalytics = async () => {
  try {
    const salesOrders = await getSalesData();
    const analytics = new Map();
    
    salesOrders.forEach(order => {
      order.items.forEach(item => {
        const key = `${item.productId}-${item.size || 'default'}`;
        const existing = analytics.get(key) || {
          productId: item.productId,
          name: item.name,
          size: item.size,
          totalQuantity: 0,
          totalRevenue: 0,
          orderCount: 0
        };
        
        existing.totalQuantity += item.quantity;
        existing.totalRevenue += item.price * item.quantity;
        existing.orderCount += 1;
        analytics.set(key, existing);
      });
    });
    
    return Array.from(analytics.values());
  } catch (error: unknown) {
    console.error('Error getting product sales analytics: ', error);
    throw error;
  }
};