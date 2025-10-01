import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Image from 'next/image';
import { Order, OrderItem } from '@/firebase/orderService'; // Order型とOrderItem型をインポート
import { Timestamp, FieldValue } from 'firebase/firestore'; // Timestamp型とFieldValue型をインポート

// Firebase Timestampの型定義 (page.tsxからコピー)
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
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // FirebaseTimestamp型の場合
  if (typeof timestamp === 'object' && 'seconds' in timestamp && 'nanoseconds' in timestamp && 'toDate' in timestamp) {
    return (timestamp as unknown as FirebaseTimestamp).toDate().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return '-';
};

export interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  tabValue: number; // 1: 配送準備中, 2: 配送済み
  onShippingConfirm?: (order: Order) => void;
}

export const OrderDetailModal = ({
  open,
  onClose,
  order,
  tabValue,
  onShippingConfirm
}: OrderDetailModalProps) => {
  if (!order) return null;

  // モーダルタイトルを取得
  const getModalTitle = () => {
    return '注文詳細';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          maxWidth: '900px',
          width: '100%',
          m: { xs: 2, sm: 3 },
          borderRadius: 1
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', pb: 2 }}>
        {getModalTitle()}
      </DialogTitle>
      <DialogContent sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {order && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 3,
              pt: 2
            }}
          >
            {/* 右側：情報エリア */}
            <Box sx={{ 
              width: { xs: '100%', sm: '70%' },
              flex: 1 
            }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                お客様情報
              </Typography>
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">お名前</Typography>
                  <Typography variant="body1">{order.customer || ''}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                  <Typography variant="body1">{order.email || '未設定'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">電話番号</Typography>
                  <Typography variant="body1">{order.phone || '未設定'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">お届け先</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      〒{order.address.postalCode || ''} <br />
                      {order.address.prefecture || ''} 
                      {order.address.city || ''} 
                      {order.address.line1 || ''} 
                      {order.address.line2 || ''}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                注文内容
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">注文ID</Typography>
                  <Typography variant="body1">
                    {order.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">注文日</Typography>
                  <Typography variant="body1">
                    {formatTimestamp(order.createdAt)}
                  </Typography>
                </Box>
                {order.shippedDate && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">配送日</Typography>
                    <Typography variant="body1">
                      {formatTimestamp(order.shippedDate)}
                    </Typography>
                  </Box>
                )}
                {/* 注文商品一覧 */}
                {order.items && order.items.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>注文商品</Typography>
                    <TableContainer sx={{ 
                      mb: 2, 
                      bgcolor: '#fafafa', 
                      borderRadius: 1, 
                      boxShadow: 'none', 
                      border: '1px solid #eee'
                    }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }}>商品画像</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }}>商品名</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }}>サイズ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }}>数量</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }} align="right">金額</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(order.items as OrderItem[]).map((item, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell sx={{ py: 1.5, px: 2 }}>
                                {item.image &&
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    style={{ objectFit: 'cover', borderRadius: 4, aspectRatio: 1 }}
                                  />
                                }
                              </TableCell>
                              <TableCell sx={{ py: 1.5, px: 2 }}>{item.name}</TableCell>
                              <TableCell sx={{ py: 1.5, px: 2 }}>{item.size || '-'}</TableCell>
                              <TableCell sx={{ py: 1.5, px: 2 }}>{item.quantity}点</TableCell>
                              <TableCell sx={{ py: 1.5, px: 2 }} align="right">¥{Number(item.price).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                          {/* 送料と合計金額の行を追加 */}
                          <TableRow>
                            <TableCell colSpan={3} />
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }} align="right">送料</TableCell>
                            <TableCell sx={{ py: 1.5, px: 2 }} align="right">
                                {typeof order.shippingFee === 'number' ? `¥${Number(order.shippingFee).toLocaleString()}` : '別途計算'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={3} />
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }} align="right">合計金額</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }} align="right">
                              ¥{Number(order.total || 0).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" color="text.secondary">支払い方法</Typography>
                  <Typography variant="body1">{order.paymentMethod === 'credit' ? 'クレジットカード' : order.paymentMethod === 'cod' ? '代引き' : 'その他'}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: { xs: 2, sm: 3 } }}>
        <Button onClick={onClose} sx={{ width: 150, borderRadius: 0, color: '#006AFF', border: '1px solid #006AFF' }}>
          閉じる
        </Button>
        {tabValue === 1 && onShippingConfirm && (
          <Button 
            variant="contained"
            onClick={() => {
              onShippingConfirm(order);
              onClose()
            }}
            sx={{ 
              bgcolor: '#006AFF',
              color: 'white',
              borderRadius: 0,
              width: 150,
              '&:hover': {
                bgcolor: '#006ADD'
              }
            }}
          >
            配送済みにする
          </Button>
        )}
        
      </DialogActions>
    </Dialog>
  );
}; 