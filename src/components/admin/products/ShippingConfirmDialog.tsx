import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';
import { Order } from '@/firebase/orderService';

export interface ShippingConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
  productToShip: Order | null;
  isProcessing?: boolean;
}

export const ShippingConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  productToShip,
  isProcessing = false,
}: ShippingConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={isProcessing ? undefined : onClose} maxWidth="xs">
      <DialogTitle>配送済みに変更</DialogTitle>
      <DialogContent>
        <Typography>
          「{productToShip ? productToShip.customer : 'お客様'}」の注文を配送済みに変更しますか？
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          この操作により、注文ステータスが「配送済み」に更新されます。
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          sx={{ color: 'text.primary' }}
          disabled={isProcessing}
        >
          キャンセル
        </Button>
        <Button
          onClick={(e) => onConfirm(e)}
          sx={{ 
            bgcolor: '#006AFF',
            color: 'white',
            borderRadius: 0,
            '&:hover': {
              bgcolor: '#006ADD'
            },
            '&:disabled': {
              bgcolor: '#ccc',
              color: '#666'
            }
          }}
          disabled={isProcessing}
          autoFocus
        >
          {isProcessing ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              処理中...
            </>
          ) : (
            '配送済みにする'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 