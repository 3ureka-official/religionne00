'use client'

import { Box, Container, Typography, Button, Divider, Grid, Paper, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useCart } from '@/features/cart/components/CartContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { addOrder } from '@/firebase/orderService'
import { OrderItem } from '@/firebase/orderService'

export default function ConfirmPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  
  // 注文情報（sessionStorageから取得）
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    postalCode: '',
    address: '',
    email: '',
    phone: '',
    paymentMethod: '',
    isIslandAddress: false
  })
  
  // 支払い情報（Stripe用、sessionStorageから取得）
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  
  // セッションストレージから注文情報を取得
  useEffect(() => {
    const storedOrderInfo = sessionStorage.getItem('orderInfo')
    const storedPaymentInfo = sessionStorage.getItem('paymentInfo')
    
    if (storedOrderInfo) {
      const parsedOrderInfo = JSON.parse(storedOrderInfo);
      // 顧客情報をorderInfoに設定
      setOrderInfo({
        name: `${parsedOrderInfo.customerInfo.lastName} ${parsedOrderInfo.customerInfo.firstName}`,
        postalCode: parsedOrderInfo.customerInfo.postalCode,
        address: `${parsedOrderInfo.customerInfo.prefecture}${parsedOrderInfo.customerInfo.city}${parsedOrderInfo.customerInfo.address}${parsedOrderInfo.customerInfo.building ? ` ${parsedOrderInfo.customerInfo.building}` : ''}`,
        email: parsedOrderInfo.customerInfo.email,
        phone: parsedOrderInfo.customerInfo.phone,
        paymentMethod: parsedOrderInfo.paymentMethod,
        isIslandAddress: parsedOrderInfo.isIslandAddress
      });
    } else {
      // 注文情報がない場合はチェックアウトページにリダイレクト
      router.push('/checkout')
    }
    
    if (storedPaymentInfo) {
      setPaymentInfo(JSON.parse(storedPaymentInfo))
    }
  }, [router])
  
  // 小計金額
  const subtotal = getTotalPrice()
  // 送料
  const shippingFee = items.length > 1 ? 0 : 500
  // 手数料（代引きの場合）
  const codFee = orderInfo.paymentMethod === '代引き' ? 300 : 0
  // 合計金額
  const total = subtotal + shippingFee + codFee

  // 注文完了処理 - 代引きの場合
  const handleCompleteCodOrder = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // 注文アイテムの作成
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.id || '',
        name: item.name,
        price: Number(item.price.replace(/,/g, '') || 0),
        quantity: item.quantity,
        image: item.image,
        size: item.size
      }));
      
      // 住所情報の構築
      const addressParts = orderInfo.address.split(/[,、\s]+/);
      const prefecture = addressParts[0] || '';
      const city = addressParts[1] || '';
      const line1 = addressParts.slice(2).join(' ') || '';
      
      // 注文データの作成
      const orderData = {
        customer: orderInfo.name,
        email: orderInfo.email,
        phone: orderInfo.phone,
        total: total,
        items: orderItems,
        address: {
          postalCode: orderInfo.postalCode,
          prefecture,
          city,
          line1,
          line2: ''
        },
        paymentMethod: orderInfo.paymentMethod
      };
      
      // 注文データをFirestoreに保存
      await addOrder(orderData);
      
      // 成功したらカートをクリアし、セッションストレージの注文情報も削除
      clearCart();
      localStorage.removeItem(SHIPPING_FORM_STORAGE_KEY);
      localStorage.removeItem(PAYMENT_METHOD_STORAGE_KEY);
      sessionStorage.removeItem('orderInfo');
      sessionStorage.removeItem('paymentInfo');
      
      // 完了ページへ遷移
      router.push('/checkout/complete');
    } catch (error) {
      console.error('注文処理中にエラーが発生しました:', error);
      alert('注文処理中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Stripe決済ページへ遷移する処理
  const handleStripeCheckout = async () => {
    if (isProcessing || !paymentInfo) return;
    
    try {
      setIsProcessing(true);
      
      // Stripeチェックアウトセッション作成APIを呼び出し
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentInfo)
      });
      
      if (!response.ok) {
        throw new Error('決済処理の準備に失敗しました');
      }
      
      const result = await response.json();
      
      if (result.url) {
        // カート情報をセッションストレージに保存（成功時に復元するため）
        const cartInfo = {
          items: paymentInfo.items,
          subtotal,
          shippingFee,
          total
        };
        sessionStorage.setItem('cartInfo', JSON.stringify(cartInfo));
        
        // Stripeチェックアウトページにリダイレクト
        window.location.href = result.url;
      } else {
        throw new Error('決済URLが取得できませんでした');
      }
    } catch (error) {
      console.error('決済ページへの遷移に失敗しました:', error);
      alert('決済処理の準備中にエラーが発生しました。もう一度お試しいただくか、代引きをご利用ください。');
    } finally {
      setIsProcessing(false);
    }
  };

  // 注文確定処理
  const handleCompleteOrder = async () => {
    if (orderInfo.paymentMethod === '代引き') {
      // 代引きの場合はFirestoreに保存して完了ページへ
      await handleCompleteCodOrder();
    } else {
      // クレジットカードまたはPayPayの場合はStripe決済ページへ
      await handleStripeCheckout();
    }
  };

  // カート内に商品がない場合はトップページへリダイレクト
  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items, router])

  // ローカルストレージのキー
  const SHIPPING_FORM_STORAGE_KEY = 'shipping_form_data';
  const PAYMENT_METHOD_STORAGE_KEY = 'payment_method_data';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF'
      }}
    >
      <Header />
      <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 4 }}>
        {/* ヘッダー */}
        <Box 
          sx={{ 
            color: 'black', 
            py: 2,
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            borderBottom: '1px solid black'
          }}
        >
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '16px', sm: '18px' },
              fontWeight: 500
            }}
          >
            ご注文内容の確認
          </Typography>
        </Box>

        {/* メインコンテンツ */}
        <Box sx={{ mb: 4 }}>
          {/* 注文内容セクション */}
          <Typography 
            sx={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              mb: 2
            }}
          >
            注文内容
          </Typography>

          {/* 商品リスト */}
          <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
            {items.map((item, index) => (
              <Box key={`${item.id}-${item.size}`} sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ 
                    position: 'relative', 
                    width: { xs: '100%', sm: '80px' }, 
                    height: { xs: '120px', sm: '80px' },
                    alignSelf: 'flex-start'
                  }}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'medium' }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 0.5 }}>
                      サイズ: {item.size}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                      数量: {item.quantity}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', mt: 1, fontWeight: 'medium' }}>
                      ¥{Number(item.price || 0) * item.quantity}
                    </Typography>
                  </Box>
                </Box>
                {index < items.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Paper>

          {/* 配送先・連絡先セクション */}
          <Typography 
            sx={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              mb: 2, 
              mt: 4 
            }}
          >
            配送先・連絡先
          </Typography>

          <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
            <Box sx={{ py: 1 }}>
              <Typography variant="body1">
                {orderInfo.name}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                〒{orderInfo.postalCode}<br />
                {orderInfo.address}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {orderInfo.email}<br />
                {orderInfo.phone}
              </Typography>
              
              {/* 離島の場合の注意表示 */}
              {orderInfo.isIslandAddress && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#FFF9C4', borderRadius: '4px' }}>
                  <Typography variant="body2" fontWeight="bold" color="warning.dark">
                    離島への配送について
                  </Typography>
                  <Typography variant="body2" color="warning.dark" sx={{ mt: 0.5 }}>
                    ご指定の住所は離島のため、お届けまでに通常より日数がかかる場合があります。
                    また、天候や交通状況により配送が遅れる場合がございます。予めご了承ください。
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* お支払い情報 */}
          <Typography 
            sx={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              mb: 2
            }}
          >
            お支払い方法
          </Typography>

          <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
            <Typography sx={{ fontSize: '14px' }}>
              {orderInfo.paymentMethod}
            </Typography>
          </Paper>

          {/* 金額明細 */}
          <Typography 
            sx={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              mb: 2
            }}
          >
            お支払い金額
          </Typography>

          <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 0.5 }}>
                  商品合計
                </Typography>
                <Typography sx={{ fontSize: '14px' }}>
                  ¥{subtotal.toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 0.5 }}>
                  送料
                </Typography>
                <Typography sx={{ fontSize: '14px' }}>
                  ¥{shippingFee.toLocaleString()}
                </Typography>
              </Box>

              {orderInfo.paymentMethod === '代引き' && (
                <Box>
                  <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 0.5 }}>
                    代引き手数料
                  </Typography>
                  <Typography sx={{ fontSize: '14px' }}>
                    ¥{codFee.toLocaleString()}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mb: 0.5 }}>
                  合計（税込）
                </Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  ¥{total.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* 戻るボタンと注文確定ボタン */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          mt: 2 
        }}>
          <Box sx={{ flex: { xs: '100%', sm: 1 } }}>
            <Link href="/checkout" style={{ textDecoration: 'none', display: 'block' }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  borderRadius: 0,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'black',
                    opacity: 0.7
                  }
                }}
              >
                戻る
              </Button>
            </Link>
          </Box>
          <Box sx={{ flex: { xs: '100%', sm: 1 } }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: 'black',
                color: 'white',
                borderRadius: 0,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)'
                }
              }}
              onClick={handleCompleteOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                orderInfo.paymentMethod === '代引き' ? '注文を確定する' : '決済ページへ進む'
              )}
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
} 