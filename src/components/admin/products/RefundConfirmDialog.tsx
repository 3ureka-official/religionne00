import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box
} from '@mui/material';
import { Order } from '@/firebase/orderService';
import { useState, useEffect } from 'react';

export interface RefundConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount?: number) => void;
  order: Order | null;
  isProcessing?: boolean;
}

export const RefundConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  order,
  isProcessing = false,
}: RefundConfirmDialogProps) => {
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (open && order) {
      setRefundType('full');
      setPartialAmount('');
      setError('');
    }
  }, [open, order]);

  const handleConfirm = () => {
    if (!order) return;

    if (refundType === 'partial') {
      const amount = parseInt(partialAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('有効な金額を入力してください');
        return;
      }
      if (amount > order.total) {
        setError(`返金額は注文金額（¥${order.total.toLocaleString()}）を超えることはできません`);
        return;
      }
      onConfirm(amount);
    } else {
      onConfirm();
    }
  };

  const maxAmount = order ? order.total : 0;

  return (
    <Dialog open={open} onClose={isProcessing ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>返金確認</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          「{order ? order.customer : 'お客様'}」の注文を返金しますか？
        </Typography>
        
        {order && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">注文金額</Typography>
            <Typography variant="h6">¥{order.total.toLocaleString()}</Typography>
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          返金タイプを選択してください
        </Typography>

        <RadioGroup
          value={refundType}
          onChange={(e) => {
            setRefundType(e.target.value as 'full' | 'partial');
            setPartialAmount('');
            setError('');
          }}
        >
          <FormControlLabel 
            value="full" 
            control={<Radio />} 
            label={`全額返金（¥${maxAmount.toLocaleString()}）`}
            disabled={isProcessing}
          />
          <FormControlLabel 
            value="partial" 
            control={<Radio />} 
            label="一部返金"
            disabled={isProcessing}
          />
        </RadioGroup>

        {refundType === 'partial' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="返金額（円）"
              type="number"
              value={partialAmount}
              onChange={(e) => {
                setPartialAmount(e.target.value);
                setError('');
              }}
              fullWidth
              disabled={isProcessing}
              error={!!error}
              helperText={error || `最大返金額: ¥${maxAmount.toLocaleString()}`}
              inputProps={{
                min: 1,
                max: maxAmount,
              }}
            />
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          この操作により、注文ステータスが「返金済み」に更新されます。
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
          onClick={handleConfirm}
          sx={{ 
            bgcolor: '#d32f2f',
            color: 'white',
            borderRadius: 0,
            '&:hover': {
              bgcolor: '#b71c1c'
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
            '返金を実行'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

