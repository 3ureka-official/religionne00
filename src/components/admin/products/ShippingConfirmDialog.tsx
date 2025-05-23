import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { Order } from '@/firebase/orderService';

export interface ShippingConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productToShip: Order | null;
}

export const ShippingConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  productToShip,
}: ShippingConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
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
        <Button onClick={onClose} sx={{ color: 'text.primary' }}>
          キャンセル
        </Button>
        <Button
          onClick={onConfirm}
          sx={{ 
            bgcolor: 'black',
            color: 'white',
            borderRadius: 0,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.8)'
            }
          }}
          autoFocus
        >
          配送済みにする
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 