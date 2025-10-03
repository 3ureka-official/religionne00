import { useState, useEffect, useMemo } from 'react';
import { getAllOrders, getOrdersByStatus, updateOrderStatus, Order, OrderItem } from '@/firebase/orderService';
import { Timestamp } from 'firebase/firestore';

// displayOrders, displayShipped の計算に必要
interface UseOrderManagementProps {
  searchTerm: string;
  page: number;
  rowsPerPage: number;
  tabValue: number;
}

export interface OrderManagementState {
  preparingOrders: Order[];
  shippedOrders: Order[];
  displayOrders: Order[];
  displayShipped: Order[];
  loadingOrders: boolean;
  errorOrders: string | null;
}

export interface OrderManagementActions {
  fetchOrdersAndShippedProducts: () => Promise<void>;
  handleMarkAsShipped: (order: Order, callback?: () => void) => Promise<void>;
}

export const useOrderManagement = ({
  searchTerm,
  page,
  rowsPerPage,
  tabValue
}: UseOrderManagementProps): [OrderManagementState, OrderManagementActions] => {
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([]);
  const [shippedOrders, setShippedOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);

  const fetchOrdersAndShippedProducts = async () => {
    try {
      setLoadingOrders(true);
      const ordersData = await getAllOrders();
      const processingOrdersData = ordersData.filter(order => order.status === 'processing' || order.status === 'pending');
      setPreparingOrders(processingOrdersData);

      const shippedData = await getOrdersByStatus('shipped');
      setShippedOrders(shippedData);
      setErrorOrders(null);
    } catch (err) {
      console.error('注文データまたは配送済み商品の取得に失敗しました:', err);
      setErrorOrders('注文データまたは配送済み商品の取得に失敗しました');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndShippedProducts();
  }, []);

  const displayOrders = useMemo(() => {
    if (tabValue !== 1) return [];
    let filtered = [...preparingOrders];
    if (searchTerm) {
      filtered = filtered.filter(order =>
        (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.items && order.items.some((item: OrderItem) => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    return filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [preparingOrders, searchTerm, page, rowsPerPage, tabValue]);

  const displayShipped = useMemo(() => {
    if (tabValue !== 2) return [];
    let filtered = [...shippedOrders];
    if (searchTerm) {
      filtered = filtered.filter(order => order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [shippedOrders, searchTerm, page, rowsPerPage, tabValue]);

  const handleMarkAsShipped = async (order: Order, callback?: () => void) => {
    const originalOrderId = order.id;
    if (!originalOrderId) {
      console.error('Error: ID is missing in order');
      if (callback) callback();
      return;
    }

    try {
      // ステータスを配送済みに更新
      await updateOrderStatus(originalOrderId, 'shipped');

      // 配送完了メール送信（失敗してもステータス更新は継続）
      try {
        await fetch('/api/send-shipping-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: originalOrderId })
        });
      } catch (emailError) {
        console.error('Shipping email sending failed:', emailError);
        // メール送信失敗はユーザーには通知しない（ログのみ）
      }

      // UIの状態を更新
      setPreparingOrders(prev => prev.filter(p => p.id !== originalOrderId));
      setShippedOrders(prev => {
        const filteredPrev = prev.filter(sp => sp.id !== originalOrderId);
        return [...filteredPrev, order].sort((a, b) => {
          const aSeconds = a.createdAt instanceof Timestamp ? a.createdAt.seconds : 0;
          const bSeconds = b.createdAt instanceof Timestamp ? b.createdAt.seconds : 0;
          return bSeconds - aSeconds;
        });
      });

      if (callback) callback();

    } catch (err) {
      console.error('配送ステータスの更新に失敗しました:', err);
      setErrorOrders('配送ステータスの更新に失敗しました: ' + (err instanceof Error ? err.message : String(err)));
      if (callback) callback();
    }
  };

  const state: OrderManagementState = {
    preparingOrders,
    shippedOrders,
    displayOrders,
    displayShipped,
    loadingOrders,
    errorOrders,
  };

  const actions: OrderManagementActions = {
    fetchOrdersAndShippedProducts,
    handleMarkAsShipped,
  };

  return [state, actions];
}; 