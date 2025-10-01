import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Box, Typography, TableSortLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Image from 'next/image';
import { Product } from '@/firebase/productService'; // Product型をインポート
import { Timestamp, FieldValue } from 'firebase/firestore'; // Timestamp型とFieldValue型をインポート

// Firebase Timestampの型定義 (page.tsxから移動)
interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

// Firebase Timestampの型検証関数 (page.tsxから移動)
const isFirebaseTimestamp = (value: unknown): value is FirebaseTimestamp => {
  return value !== null && 
         typeof value === 'object' && 
         value !== null &&
         'seconds' in (value as Record<string, unknown>) &&
         typeof (value as FirebaseTimestamp).seconds === 'number' &&
         'toDate' in (value as Record<string, unknown>) &&
         typeof (value as FirebaseTimestamp).toDate === 'function';
};

// 日付をフォーマットする関数 (page.tsxから移動)
const formatTimestamp = (timestamp: Date | FirebaseTimestamp | Timestamp | FieldValue | null | undefined): string => {
  if (!timestamp) return '未設定';
  
  // FieldValueの場合は未設定として扱う
  if (timestamp && typeof timestamp === 'object' && 'isEqual' in timestamp) {
    return '未設定';
  }
  
  // instanceof Timestamp を最初にチェックする
  if (timestamp instanceof Timestamp) { // Firestore Timestamp (firebase/firestore)
    return timestamp.toDate().toLocaleDateString();
  } else if (isFirebaseTimestamp(timestamp)) { // 独自定義の FirebaseTimestamp
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  } else if (timestamp instanceof Date) { // JavaScript Date Object
    return timestamp.toLocaleDateString();
  }
  
  return '未設定';
};

interface ProductTableProps {
  products: Product[];
  selectedImageIndex: number; // ProductDetailModalと共有しているため、page.tsxから渡す
  onEdit: (id: string) => void;
  onDelete: (product: Product) => void;
  onTogglePublish: (product: Product) => void;
  onToggleRecommended: (product: Product) => void;
  onDetail: (product: Product) => void;
  sortOrder: 'asc' | 'desc'; // 追加
  onSortChange: () => void; // 追加
}

export const ProductTable = ({ 
  products, 
  selectedImageIndex, 
  onEdit, 
  onDelete, 
  onTogglePublish, 
  onToggleRecommended, 
  onDetail,
  sortOrder, // 追加
  onSortChange // 追加
}: ProductTableProps) => (
  <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 0, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
    <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
          <TableCell>画像</TableCell>
          <TableCell>商品名</TableCell>
          <TableCell>価格</TableCell>
          <TableCell>カテゴリ</TableCell>
          <TableCell>
            <TableSortLabel
              active={true}
              direction={sortOrder}
              onClick={onSortChange}
              sx={{
                '&:hover': {
                  color: 'text.primary',
                },
                '&.MuiTableSortLabel-root': {
                  color: 'text.primary',
                },
                '&.MuiTableSortLabel-root.Mui-active': {
                  color: 'text.primary',
                },
                '& .MuiTableSortLabel-icon': {
                  color: 'text.primary !important',
                }
              }}
            >
              出品日
            </TableSortLabel>
          </TableCell>
          <TableCell>在庫</TableCell>
          <TableCell>ステータス</TableCell>
          <TableCell>おすすめ</TableCell>
          <TableCell align="center">アクション</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.length > 0 ? (
          products.map((product) => (
            <TableRow 
              key={product.id} 
              sx={{ 
                '&:hover': { bgcolor: '#f9f9f9' },
                ...(product.isPublished ? {} : { bgcolor: 'rgba(255, 235, 238, 0.1)' }),
                cursor: 'pointer'
              }}
              onClick={() => onDetail(product)}
            >
              <TableCell sx={{ width: 80 }}>
                {(() => {
                  const images = product.images || [];
                  // selectedImageIndex が images 配列の範囲内にあるか確認
                  const imageIndexToShow = images.length > selectedImageIndex ? selectedImageIndex : 0;
                  return (
                    <Box sx={{ width: '100%', aspectRatio: '1/1', position: 'relative', bgcolor: '#f5f5f5', border: '1px solid #eee', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                      {images.length > 0 ? (
                        <Image
                          src={images[imageIndexToShow]} // 安全なインデックスを使用
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                          sizes="(max-width: 600px) 100vw, 300px"
                        />
                      ) : (
                        <Box sx={{ width: '100%', height: '100%', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            画像なし
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );
                })()}
              </TableCell>
              <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {product.name}
              </TableCell>
              <TableCell>¥{Number(product.price).toLocaleString()}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{formatTimestamp(product.createdAt)}</TableCell>
              <TableCell sx={{ color: product.sizeInventories?.reduce((acc, curr) => acc + curr.stock, 0) === 0 ? 'red' : 'black' }}>{product.sizeInventories?.reduce((acc, curr) => acc + curr.stock, 0) === 0 ? '在庫切れ' : product.sizeInventories?.reduce((acc, curr) => acc + curr.stock, 0)}</TableCell>
              <TableCell>
                <Chip
                  label={product.isPublished ? '公開中' : '非公開'}
                  size="small"
                  sx={{ bgcolor: product.isPublished ? '#e8f5e9' : '#ffebee', color: product.isPublished ? '#2e7d32' : '#c62828', fontWeight: 'medium', borderRadius: '4px' }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={product.isRecommended ? 'おすすめ' : '-'}
                  size="small"
                  sx={{ bgcolor: product.isRecommended ? '#e3f2fd' : '#f5f5f5', color: product.isRecommended ? '#1976d2' : 'text.secondary', fontWeight: 'medium', borderRadius: '4px' }}
                />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <IconButton size="small" onClick={e => { e.stopPropagation(); onTogglePublish(product); }} sx={{ color: 'text.primary' }} title={product.isPublished ? '非公開にする' : '公開する'}>
                    {product.isPublished ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" onClick={e => { e.stopPropagation(); onToggleRecommended(product); }} sx={{ color: product.isRecommended ? '#1976d2' : 'text.secondary' }} title={product.isRecommended ? 'おすすめから外す' : 'おすすめに設定'}>
                    <CheckCircleIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={e => { e.stopPropagation(); onEdit(product.id || ''); }} sx={{ color: 'text.primary' }} title="編集">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={e => { e.stopPropagation(); onDelete(product); }} sx={{ color: 'text.primary' }} title="削除">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} align="center">
              <Typography variant="body2" sx={{ py: 5 }}>
                商品がありません
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
); 