import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { Product } from '@/firebase/productService'; // Product型をインポート

export interface DeleteProductDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productToDelete: Product | null;
}

export const DeleteProductDialog = ({
  open,
  onClose,
  onConfirm,
  productToDelete,
}: DeleteProductDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>商品の削除</DialogTitle>
      <DialogContent>
        <Typography>
          本当に「{productToDelete?.name}」を削除しますか？
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          この操作は元に戻せません。
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'text.primary', minWidth: '120px' }}>
          キャンセル
        </Button>
        <Button
          onClick={onConfirm}
          sx={{ 
            minWidth: '120px',
            bgcolor: 'red',
            color: 'white',
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#B31B1B'
            }
          }}
          autoFocus
        >
          削除する
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 