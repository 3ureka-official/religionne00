# Order/SoldProduct統合設計案

## 現在の問題
- OrderとSoldProductの二重管理
- データの重複と整合性の問題
- 複雑な処理フロー

## 提案: Orderのみで管理

### 1. Order型の拡張
```typescript
export interface Order {
  id?: string;
  customer: string;
  email: string;
  phone?: string;
  date: Timestamp | null;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  address: Address;
  paymentMethod: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  shippingFee: number;
  // 配送関連の追加フィールド
  shippedDate?: Timestamp | null;
  deliveredDate?: Timestamp | null;
  trackingNumber?: string;
}
```

### 2. 売上分析用のビュー関数
```typescript
// 売上データを取得（配送済み注文のみ）
export const getSalesData = async () => {
  const orders = await getAllOrders();
  return orders.filter(order => 
    order.status === 'shipped' || 
    order.status === 'delivered'
  );
};

// 商品別売上分析
export const getProductSalesAnalytics = async () => {
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
};
```

### 3. 管理画面の簡素化
```typescript
// 配送準備中の注文
const processingOrders = orders.filter(order => order.status === 'processing');

// 配送済みの注文
const shippedOrders = orders.filter(order => 
  order.status === 'shipped' || order.status === 'delivered'
);

// 配送処理
const markAsShipped = async (orderId: string) => {
  await updateOrderStatus(orderId, 'shipped');
  await updateDoc(doc(db, 'orders', orderId), {
    shippedDate: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};
```

## メリット
1. **シンプルな設計**: 単一のデータソース
2. **データ整合性**: 重複がないため整合性を保ちやすい
3. **保守性向上**: 管理するコレクションが1つ
4. **パフォーマンス**: 不要な同期処理がない

## 移行手順
1. 既存のSoldProductデータをOrderに統合
2. SoldProduct関連のコードを削除
3. 管理画面をOrder中心の設計に変更
4. 売上分析機能をOrder基準で再実装 