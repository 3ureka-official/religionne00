import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip, Grid, Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Image from 'next/image';
import { Product, SizeInventory } from '@/firebase/productService'; // Product型とSizeInventory型をインポート
import { Timestamp, FieldValue } from 'firebase/firestore'; // Timestamp型とFieldValue型をインポート

// Firebase Timestampの型定義 (page.tsxからコピー)
interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

export interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  onEditProduct?: (productId: string | undefined) => void;
}

export const ProductDetailModal = ({
  open,
  onClose,
  product,
  selectedImageIndex,
  setSelectedImageIndex,
  onEditProduct
}: ProductDetailModalProps) => {
  if (!product) return null;

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
        商品詳細
      </DialogTitle>
      <DialogContent sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {product && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 3,
              pt: 2
            }}
          >
            {/* 左側：商品画像 */}
            <Box sx={{ 
              width: { xs: '100%', sm: '30%' },
              flexShrink: 0 
            }}>
              <Box sx={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                position: 'relative', 
                bgcolor: '#f5f5f5', 
                border: '1px solid #eee', 
                borderRadius: 1, 
                overflow: 'hidden', 
                mb: 2,
                minHeight: 280
              }}>
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    sizes="(max-width: 600px) 100vw, 500px"
                    priority
                  />
                ) : (
                  <Box sx={{ width: '100%', height: '100%', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      画像なし
                    </Typography>
                  </Box>
                )}
              </Box>
              {product.images && product.images.length > 1 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {product.images.map((img, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        position: 'relative',
                        width: 64,
                        height: 64,
                        border: selectedImageIndex === idx ? '2px solid #1976d2' : '1px solid #eee',
                        borderRadius: 1,
                        overflow: 'hidden',
                        flex: '0 0 64px',
                        cursor: 'pointer',
                        boxShadow: selectedImageIndex === idx ? '0 0 0 2px #90caf9' : 'none',
                        transition: 'border 0.2s, box-shadow 0.2s',
                      }}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                        sizes="64px"
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            
            {/* 右側：情報エリア */}
            <Box sx={{ 
              width: { xs: '100%', sm: '70%' },
              flex: 1 
            }}>
              {/* 基本情報 */}
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                {product.name}
                {!product.isPublished && (
                  <Chip 
                    label="非公開" 
                    size="small" 
                    sx={{ ml: 1, bgcolor: '#ffebee', color: '#c62828' }} 
                  />
                )}
                {product.isRecommended && (
                  <Chip 
                    label="おすすめ商品" 
                    size="small" 
                    sx={{ ml: 1, bgcolor: '#e3f2fd', color: '#1976d2' }} 
                  />
                )}
              </Typography>
              <Box sx={{ my: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ¥{Number(product.price).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1">{product.category}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* サイズ・在庫情報 */}
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>サイズ・在庫</Typography>
              {product.sizeInventories && product.sizeInventories.length > 0 ? (
                <TableContainer sx={{ 
                  mb: 3, 
                  bgcolor: '#fafafa', 
                  borderRadius: 1, 
                  boxShadow: 'none', 
                  border: '1px solid #eee',
                  width: '100%'
                }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '50%', py: 1.5, px: 2 }}>サイズ</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '50%', py: 1.5, px: 2 }}>在庫</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.sizeInventories.map((item: SizeInventory, idx: number) => (
                        <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ py: 1.5, px: 2 }}>{item.size}</TableCell>
                          <TableCell sx={{ py: 1.5, px: 2 }}>{item.stock}点</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  サイズ・在庫情報はありません
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              {/* 商品説明 */}
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>商品説明</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {product.description || 'なし'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              {/* 出品日 */}
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>出品日</Typography>
              <Typography variant="body1">
                {product.createdAt?.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: { xs: 2, sm: 3 } }}>
        {onEditProduct && product.id && (
          <Button 
            onClick={() => onEditProduct(product.id)}
            sx={{ 
              bgcolor: 'black',
              color: 'white',
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          >
            編集する
          </Button>
        )}
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 