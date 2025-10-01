import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

interface LogoutConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export const LogoutConfirmDialog = ({ open, onClose, onConfirm }: LogoutConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>ログアウト確認</DialogTitle>
      <DialogContent sx={{ minWidth: '300px' }}>
        <Typography variant="body2">
          ログアウトしますか？
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
          ログアウト
        </Button>
      </DialogActions>
    </Dialog>
  )
} 