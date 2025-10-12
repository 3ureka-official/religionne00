import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Typography, IconButton } from '@mui/material';
import { Order } from '@/firebase/orderService'; // Order型をインポート
import { Timestamp } from 'firebase/firestore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

// Firebase Timestampの型定義 (page.tsxからコピー)
interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

// Firebase Timestampの型検証関数 (page.tsxからコピー)
const isFirebaseTimestamp = (value: unknown): value is FirebaseTimestamp => {
  return value !== null && 
         typeof value === 'object' && 
         value !== null &&
         'seconds' in (value as Record<string, unknown>) &&
         typeof (value as FirebaseTimestamp).seconds === 'number' &&
         'toDate' in (value as Record<string, unknown>) &&
         typeof (value as FirebaseTimestamp).toDate === 'function';
};

// 日付をフォーマットする関数 (ProductTable.tsxからコピー)
const formatTimestamp = (timestamp: Date | FirebaseTimestamp | Timestamp | null | undefined): string => {
  if (!timestamp) return '未設定';
  
  if (timestamp instanceof Timestamp) { 
    return timestamp.toDate().toLocaleDateString();
  } else if (isFirebaseTimestamp(timestamp)) { 
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  } else if (timestamp instanceof Date) { 
    return timestamp.toLocaleDateString();
  }
  
  return '未設定';
};

interface PreparingOrderTableProps {
  orders: Order[];
  onDetail: (order: Order) => void;
  onShippingConfirm: (order: Order) => void;
}

export const PreparingOrderTable = ({ orders, onDetail, onShippingConfirm }: PreparingOrderTableProps) => {

  return(
    <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 0, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell>注文ID</TableCell>
            <TableCell>顧客名</TableCell>
            <TableCell>メールアドレス</TableCell>
            <TableCell>注文日</TableCell>
            <TableCell>商品数</TableCell>
            <TableCell>合計金額</TableCell>
            <TableCell>支払方法</TableCell>
            <TableCell align="center">アクション</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map(order => (
              <TableRow onClick={() => onDetail(order)} key={order.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' }, cursor: 'pointer', height: '60px' }}>
                <TableCell>{order?.id || '不明'}</TableCell>
                <TableCell>{order?.customer || '不明'}</TableCell>
                <TableCell>{order?.email || '不明'}</TableCell>
                <TableCell>{formatTimestamp(order?.createdAt)}</TableCell>
                <TableCell>{order?.items && Array.isArray(order.items) ? order.items.length : 0}点</TableCell>
                <TableCell>¥{order?.total ? Number(order.total).toLocaleString() : 0}</TableCell>
                <TableCell>{'paymentMethod' in order && order.paymentMethod === 'credit' ? 'クレジットカード' : order.paymentMethod === 'cod' ? '代引き' : 'その他'}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); onShippingConfirm(order)}} sx={{ color: 'text.primary' }} title="配送済みにする">
                    <LocalShippingIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body2" sx={{ py: 5 }}>
                  配送準備中の注文はありません
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ); 
}
