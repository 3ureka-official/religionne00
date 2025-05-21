'use client'

import { Box, Typography, Paper, Grid, Button, Divider, Chip, Stepper, Step, StepLabel } from '@mui/material'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Image from 'next/image'

// 注文データの型定義
interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderDetail {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  date: string;
  updateDate: string;
  total: number;
  subtotal: number;
  shipping: number;
  codFee: number;
  status: string;
  payment: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params?.id as string
  
  // 仮の注文詳細データ（実際にはAPIから取得）
  const [orderDetail, setOrderDetail] = useState<OrderDetail>({
    id: 'ORD-2023-001',
    customer: {
      name: '山田 太郎',
      email: 'yamada@example.com',
      phone: '090-1234-5678',
      address: '〒123-4567 東京都渋谷区神南1-1-1 マンション101',
    },
    date: '2023-06-10 14:30',
    updateDate: '2023-06-11 09:15',
    total: 12800,
    subtotal: 12300,
    shipping: 500,
    codFee: 0,
    status: '発送済み',
    payment: 'クレジットカード',
    items: [
      {
        id: 'ITEM-001',
        name: 'オーガニックコットンTシャツ',
        size: 'M',
        price: 6500,
        quantity: 1,
        image: '/images/products/tshirt.jpg',
      },
      {
        id: 'ITEM-002',
        name: 'リネンワイドパンツ',
        size: 'L',
        price: 5800,
        quantity: 1,
        image: '/images/products/pants.jpg',
      },
    ],
  })
  
  // 注文ステータスステップ
  const orderSteps = ['注文受付', '準備中', '発送済み', '完了']
  let activeStep = 0
  
  switch (orderDetail.status) {
    case '準備中':
      activeStep = 1
      break
    case '発送済み':
      activeStep = 2
      break
    case '完了':
      activeStep = 3
      break
    default:
      activeStep = 0
  }
  
  // 注文ステータスに応じたカラー設定
  const getStatusColor = (status: string) => {
    switch (status) {
      case '発送済み':
        return { bg: '#e3f2fd', color: '#1565c0', icon: <LocalShippingIcon fontSize="small" /> }
      case '準備中':
        return { bg: '#fff8e1', color: '#f57c00', icon: undefined }
      case '完了':
        return { bg: '#e8f5e9', color: '#2e7d32', icon: <CheckCircleIcon fontSize="small" /> }
      default:
        return { bg: '#f5f5f5', color: 'text.primary', icon: undefined }
    }
  }
  
  const statusStyle = getStatusColor(orderDetail.status)
  
  // 戻るボタン
  const handleBack = () => {
    router.back()
  }
  
  // 注文ステータスの更新
  const updateOrderStatus = (newStatus: string) => {
    setOrderDetail(prev => ({
      ...prev,
      status: newStatus,
      updateDate: new Date().toLocaleString(),
    }))
  }
  
  return (
    <Box>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ 
              marginRight: 2,
              color: 'black',
              fontWeight: 'medium',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
            }}
          >
            戻る
          </Button>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            注文詳細 - {orderDetail.id}
          </Typography>
        </Box>
        <Chip
          icon={statusStyle.icon}
          label={orderDetail.status}
          sx={{ 
            bgcolor: statusStyle.bg, 
            color: statusStyle.color,
            fontWeight: 'medium',
            borderRadius: '4px',
            py: 0.5,
            '& .MuiChip-icon': { 
              ml: '4px',
              mr: '-4px'
            }
          }}
        />
      </Box>
      
      {/* 注文進捗状況 */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          注文進捗状況
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {orderSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {activeStep < 1 && (
            <Button 
              variant="outlined"
              onClick={() => updateOrderStatus('準備中')}
              sx={{ 
                borderRadius: 0,
                borderColor: 'black',
                color: 'black',
                '&:hover': {
                  borderColor: 'black',
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              準備中にする
            </Button>
          )}
          {activeStep < 2 && (
            <Button 
              variant="outlined"
              onClick={() => updateOrderStatus('発送済み')}
              sx={{ 
                borderRadius: 0,
                borderColor: 'black',
                color: 'black',
                '&:hover': {
                  borderColor: 'black',
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              発送済みにする
            </Button>
          )}
          {activeStep < 3 && (
            <Button 
              variant="contained"
              onClick={() => updateOrderStatus('完了')}
              sx={{ 
                borderRadius: 0,
                bgcolor: 'black',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)'
                }
              }}
            >
              完了にする
            </Button>
          )}
        </Box>
      </Paper>
      
      {/* 注文情報エリア */}
      <Grid container spacing={3}>
        {/* 左側：顧客情報と注文概要 */}
        <Grid xs={12} md={4}>
          {/* 顧客情報 */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              顧客情報
            </Typography>
            <Typography sx={{ mb: 1 }}>
              {orderDetail.customer.name}
            </Typography>
            <Typography sx={{ mb: 1, color: 'text.secondary' }}>
              {orderDetail.customer.email}
            </Typography>
            <Typography sx={{ mb: 1, color: 'text.secondary' }}>
              {orderDetail.customer.phone}
            </Typography>
          </Paper>
          
          {/* 配送先 */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              配送先
            </Typography>
            <Typography>
              {orderDetail.customer.address}
            </Typography>
          </Paper>
          
          {/* 注文概要 */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              注文概要
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">注文ID</Typography>
              <Typography variant="body2">{orderDetail.id}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">注文日時</Typography>
              <Typography variant="body2">{orderDetail.date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">最終更新</Typography>
              <Typography variant="body2">{orderDetail.updateDate}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">支払い方法</Typography>
              <Typography variant="body2">{orderDetail.payment}</Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* 右側：注文商品と金額 */}
        <Grid item xs={12} md={8}>
          {/* 注文商品 */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              注文商品
            </Typography>
            {orderDetail.items.map((item, index) => (
              <Box key={item.id}>
                <Box sx={{ display: 'flex', py: 2 }}>
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      width: 80, 
                      height: 80, 
                      flexShrink: 0 
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography sx={{ fontWeight: 'medium' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      サイズ: {item.size}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        数量: {item.quantity}
                      </Typography>
                      <Typography sx={{ fontWeight: 'medium' }}>
                        ¥{item.price.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {index < orderDetail.items.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
          
          {/* 金額詳細 */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              金額詳細
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>小計</Typography>
              <Typography>¥{orderDetail.subtotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>送料</Typography>
              <Typography>¥{orderDetail.shipping.toLocaleString()}</Typography>
            </Box>
            {orderDetail.codFee > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>代引き手数料</Typography>
                <Typography>¥{orderDetail.codFee.toLocaleString()}</Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 'bold' }}>合計</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>
                ¥{orderDetail.total.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
} 