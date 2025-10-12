import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Typography } from '@mui/material';
import { Order } from '@/firebase/orderService';
import { Timestamp, FieldValue } from 'firebase/firestore';

// Firebase Timestampの型定義
interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

// Timestampをフォーマットする関数
const formatTimestamp = (timestamp: Timestamp | FieldValue | null | undefined): string => {
  if (!timestamp) return '-';
  
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
  
  // FirebaseTimestamp型の場合
  if (typeof timestamp === 'object' && 'seconds' in timestamp && 'nanoseconds' in timestamp && 'toDate' in timestamp) {
    return (timestamp as unknown as FirebaseTimestamp).toDate().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
  
  return '-';
};

interface ShippedProductTableProps {
  shippedOrders: Order[];
  onDetail: (order: Order) => void;
}

export const ShippedProductTable = ({ shippedOrders, onDetail }: ShippedProductTableProps) => (
  <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 0, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
    <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
          <TableCell>注文ID</TableCell>
          <TableCell>顧客名</TableCell>
          <TableCell>メールアドレス</TableCell>
          <TableCell>注文日</TableCell>
          <TableCell>配送日</TableCell>
          <TableCell>商品数</TableCell>
          <TableCell>合計金額</TableCell>
          <TableCell>支払方法</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shippedOrders.length > 0 ? (
          shippedOrders.map(order => (
            <TableRow onClick={() => onDetail(order)} key={order.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' }, cursor: 'pointer', height: '60px' }}>
              <TableCell>{order?.id || '不明'}</TableCell>
              <TableCell>{order?.customer || '不明'}</TableCell>
              <TableCell>{order?.email || '不明'}</TableCell>
              <TableCell>{formatTimestamp(order?.createdAt)}</TableCell>
              <TableCell>{formatTimestamp(order?.shippedDate)}</TableCell>
              <TableCell>{order?.items && Array.isArray(order.items) ? order.items.length : 0}点</TableCell>
              <TableCell>¥{order?.total ? Number(order.total).toLocaleString() : 0}</TableCell>
              <TableCell>{order.paymentMethod === 'stripe_credit_card' ? 'クレジットカード' : order.paymentMethod === 'cod' ? '代引き' : 'PayPay'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
              <Typography color="text.secondary">配送済み商品がありません</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
); 