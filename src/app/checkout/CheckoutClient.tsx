'use client'

import { Box, Container, Typography, Button, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material'
import { useState, useEffect } from 'react'
import { useCart } from '@/features/cart/components/CartContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import { MicroCMSSettings } from '@/lib/microcms'

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

const isValidPhone = (phone: string): boolean => {
  // ハイフンありの入力を許可
  // 数字とハイフンのみであることを確認
  if (!/^[\d-]+$/.test(phone)) {
    return false;
  }
  
  // ハイフンを除去した数字が10桁または11桁であることを確認
  const digitsOnly = phone.replace(/-/g, '');
  // 先頭が0で、10桁または11桁であることを確認
  return /^0\d{9,10}$/.test(digitsOnly);
}

const isValidPostalCode = (postalCode: string): boolean => {
  // ハイフンありの入力を許可
  // 数字とハイフンのみであることを確認
  if (!/^[\d-]+$/.test(postalCode)) {
    return false;
  }
  
  // ハイフンを除去した数字が7桁であることを確認
  const digitsOnly = postalCode.replace(/-/g, '');
  return digitsOnly.length === 7;
}

// ローカルストレージのキー
const SHIPPING_FORM_STORAGE_KEY = 'shipping_form_data';
const PAYMENT_METHOD_STORAGE_KEY = 'payment_method_data';

export default function CheckoutClientPage({ settings }: { settings: MicroCMSSettings }) {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [formattedProductTotal, setFormattedProductTotal] = useState('0円')
  const [formattedShippingCost, setFormattedShippingCost] = useState('0円')
  const [formattedTotal, setFormattedTotal] = useState('0円')
  // 離島かどうかの状態
  const [isIslandAddress, setIsIslandAddress] = useState(false);
  const [islandWarning, setIslandWarning] = useState(false);
  
  // 配送先情報のフォーム状態
  const [shippingForm, setShippingForm] = useState({
    lastName: '',
    firstName: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    email: '',
    phone: '',
  })

  // 通貨フォーマット関数
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString()}円`;
  };
  
  // 合計金額の計算
  const calculateTotal = (isIslandAddress: boolean) => {
    let productTotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    
    // 基本送料
    let shippingCost = isIslandAddress ? Number(settings.islandFee) : Number(settings.NationwideFee);
    
    // 送料無料の条件をチェック
    if (settings.FreeLowerLimit && productTotal >= Number(settings.FreeLowerLimit)) {
      shippingCost = 0;
    }
    
    return {
      productTotal,
      shippingCost,
      total: productTotal + shippingCost
    };
  };

  // ページ読み込み時にローカルストレージから復元
  useEffect(() => {
    // フォームデータの復元
    const savedFormData = localStorage.getItem(SHIPPING_FORM_STORAGE_KEY);
    if (savedFormData) {
      try {
        const parsedFormData = JSON.parse(savedFormData);
        setShippingForm(parsedFormData);
      } catch (e) {
        console.error('保存されたフォームデータの解析に失敗しました:', e);
      }
    }

    // 支払い方法の復元
    const savedPaymentMethod = localStorage.getItem(PAYMENT_METHOD_STORAGE_KEY);
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod);
    }
    
    // 金額表示の更新
    updateFormattedPrices();
  }, []);
  
  // 金額が変更されたときに表示を更新
  useEffect(() => {
    updateFormattedPrices();
  }, [items, isIslandAddress]);
  
  // 金額表示を更新する関数
  const updateFormattedPrices = () => {
    const { productTotal, shippingCost, total } = calculateTotal(isIslandAddress);
    setFormattedProductTotal(formatCurrency(productTotal));
    setFormattedShippingCost(formatCurrency(shippingCost));
    setFormattedTotal(formatCurrency(total));
  };

  // 小計金額（商品合計）
  const subtotal = getTotalPrice()
  // 送料
  const shippingFee = items.length > settings.FreeLowerLimit ? 0 : settings.NationwideFee
  // 合計金額
  const total = subtotal + shippingFee

  // フォーム入力値の更新
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedForm = {
      ...shippingForm,
      [name]: value
    };
    setShippingForm(updatedForm);
    
    // ローカルストレージに保存
    localStorage.setItem(SHIPPING_FORM_STORAGE_KEY, JSON.stringify(updatedForm));
  }

  // 決済方法の変更
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPaymentMethod = e.target.value;
    setPaymentMethod(newPaymentMethod);
    
    // ローカルストレージに保存
    localStorage.setItem(PAYMENT_METHOD_STORAGE_KEY, newPaymentMethod);
  }

  // 離島かどうかのバリデーション
  const validateIslandAddress = () => {
    // 住所が入力されていない場合は早期リターン
    if (!shippingForm.prefecture || !shippingForm.address) {
      return;
    }
    
    import('@/const/island').then(({ isIsland, AddressType, getAddressType }) => {
      // 入力された都道府県と住所が離島かどうかを判定
      const addressType = getAddressType(shippingForm.prefecture, shippingForm.address);
      
      if (addressType === AddressType.DOMESTIC_ISLAND) {
        // 離島の場合、追加の送料や配送情報を表示
        return true;
      } else {
        return false;
      }
    }).catch(error => {
      console.error('離島判定エラー:', error);
    });
  };

  // 次へ進むボタンのクリック
  const handleProceed = async () => {
    // フォーム検証
    if (!shippingForm.lastName || !shippingForm.firstName) {
      alert('お名前を入力してください。');
      return;
    }

    if (!shippingForm.postalCode || !isValidPostalCode(shippingForm.postalCode)) {
      alert('有効な郵便番号を入力してください。');
      return;
    }

    if (!shippingForm.email || !isValidEmail(shippingForm.email)) {
      alert('有効なメールアドレスを入力してください。');
      return;
    }

    if (!shippingForm.phone || !isValidPhone(shippingForm.phone)) {
      alert('有効な電話番号を入力してください。');
      return;
    }

    // 離島判定を確実に行う
    let islandStatus = false;

    try {
      if (shippingForm.prefecture && shippingForm.address) {
        const islandModule = await import('@/const/island');
        const addressType = islandModule.getAddressType(shippingForm.prefecture, shippingForm.address);
        console.log(addressType);
        islandStatus = addressType === islandModule.AddressType.DOMESTIC_ISLAND;
      }
    } catch (error) {
      console.error('離島判定エラー:', error);
    }

    const totalCost = calculateTotal(islandStatus)

    // 注文情報をセッションストレージに保存
    const orderInfo = {
      customerInfo: shippingForm,
      items: items,
      paymentMethod: paymentMethod,
      shippingFee: totalCost.shippingCost,
      total: totalCost.total,
      isIslandAddress: islandStatus
    };
    
    sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo));

    // カート内のアイテムをセッションストレージに保存（Stripe決済用）
    if (paymentMethod === 'credit' || paymentMethod === 'paypay') {
      const cartItems = items.map(item => ({
        name: item.name,
        description: undefined, // 商品説明がない場合は省略
        price: Number(item.price.replace(/,/g, '')),
        quantity: item.quantity,
        image: item.image,
        id: item.id,
        size: item.size
      }));
      
      // 支払い情報をセッションストレージに保存
      const paymentInfo = {
        items: cartItems,
        customerEmail: shippingForm.email,
        shippingFee: items.length >= settings.FreeLowerLimit ? 0 : settings.NationwideFee,
        paymentMethod,
        customerInfo: {
          name: `${shippingForm.lastName} ${shippingForm.firstName}`,
          phone: shippingForm.phone, // ハイフン付きの電話番号を保持
          postalCode: shippingForm.postalCode, // ハイフン付きの郵便番号を保持
          prefecture: shippingForm.prefecture,
          city: shippingForm.city,
          address: `${shippingForm.prefecture}${shippingForm.city}${shippingForm.address}`,
          building: shippingForm.building
        }
      };
      
      sessionStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
    }
    
    // 確認ページへ遷移
    router.push('/checkout/confirm');
  }

  return (
    <ThemeProvider theme={theme}>
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
              ご購入手続き
            </Typography>
          </Box>

          {/* メインコンテンツ */}
          <Box sx={{ position: 'relative', pb: 6 }}>
            {/* お届け先情報 */}
            <Typography 
              sx={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                mb: 2
              }}
            >
              お届け先
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 1, sm: 2 }, 
              mb: 4,
              '& .MuiFormControl-root': { 
                mb: { xs: 1, sm: 1 } 
              }
            }}>
              {/* 姓と名を横並びに */}
              <Box sx={{ 
                display: 'flex', 
                width: '100%', 
                gap: { xs: 1, sm: 2 }, 
                flexDirection: { xs: 'column', sm: 'row' } 
              }}>
                <TextField
                  label="姓 / Last Name"
                  name="lastName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={shippingForm.lastName}
                  onChange={handleInputChange}
                  sx={{ 
                    flex: { xs: '100%', sm: 1 },
                    mb: { xs: 0, sm: 0 },
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'rgba(217, 217, 217, 0.87)' 
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '13px'
                    }
                  }}
                />
                <TextField
                  label="名 / First Name"
                  name="firstName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={shippingForm.firstName}
                  onChange={handleInputChange}
                  sx={{ 
                    flex: { xs: '100%', sm: 1 },
                    mb: { xs: 0, sm: 0 },
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'rgba(217, 217, 217, 0.87)' 
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '13px'
                    }
                  }}
                />
              </Box>
              
              {/* 郵便番号と都道府県を横並びに */}
              <Box sx={{ 
                display: 'flex', 
                width: '100%', 
                gap: { xs: 1, sm: 2 }, 
                flexDirection: { xs: 'column', sm: 'row' },
                mt: { xs: 0, sm: 0 }
              }}>
                <TextField
                  label="郵便番号 / Postal Code"
                  name="postalCode"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={shippingForm.postalCode}
                  onChange={handleInputChange}
                  sx={{ 
                    flex: { xs: '100%', sm: 1 },
                    mb: { xs: 0, sm: 0 },
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'rgba(217, 217, 217, 0.87)' 
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '13px'
                    }
                  }}
                  placeholder="例: 123-4567"
                />
                <TextField
                  label="都道府県 / Prefecture"
                  name="prefecture"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={shippingForm.prefecture}
                  onChange={handleInputChange}
                  sx={{ 
                    flex: { xs: '100%', sm: 1 },
                    mb: { xs: 0, sm: 0 },
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'rgba(217, 217, 217, 0.87)' 
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '13px'
                    }
                  }}
                />
              </Box>
              
              <TextField
                label="市区町村 / City"
                name="city"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.city}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '13px'
                  }
                }}
              />
              <TextField
                label="番地 / Street Address"
                name="address"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.address}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '13px'
                  }
                }}
              />
              <TextField
                label="建物名・部屋番号など / Building, Room #"
                name="building"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.building}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '13px'
                  }
                }}
              />
              <TextField
                label="メールアドレス / Email"
                name="email"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.email}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '13px'
                  }
                }}
              />
              <TextField
                label="携帯電話番号 / Phone Number"
                name="phone"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.phone}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '13px'
                  }
                }}
                placeholder="例: 090-1234-5678"
              />
            </Box>

            {/* 離島警告メッセージ */}
            {islandWarning && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-800">
                <p className="font-semibold">離島への配送について</p>
                <p className="text-sm mt-1">離島への配送は追加料金がかかる場合や、配送に時間がかかる場合があります。</p>
              </div>
            )}

            <Divider sx={{ my: 3 }} />

            {/* お支払い方法 */}
            <Typography 
              sx={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                mb: 2
              }}
            >
              お支払い方法
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 4 }}>
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel 
                  value="credit" 
                  control={<Radio />} 
                  label="クレジットカード" 
                  sx={{ '& .MuiTypography-root': { fontSize: '14px', fontWeight: 500 } }}
                />
                <FormControlLabel 
                  value="paypay" 
                  control={<Radio />} 
                  label="PayPay" 
                  sx={{ '& .MuiTypography-root': { fontSize: '14px', fontWeight: 500 } }}
                />
                <FormControlLabel 
                  value="cod" 
                  control={<Radio />} 
                  label="代引き" 
                  sx={{ '& .MuiTypography-root': { fontSize: '14px', fontWeight: 500 } }}
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {/* 配送方法 */}
            <Typography 
              sx={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                mb: 2
              }}
            >
              配送方法
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                ヤマト運輸
              </Typography>
              <Typography sx={{ fontSize: '13px', mt: 1, color: 'text.primary' }}>
                送料全国一律 500円<br />
                離島 1200円<br />
                2点以上送料無料
              </Typography>
              <Typography sx={{ fontSize: '13px', mt: 2, color: 'text.primary' }}>
                Shipped with Japan Post International ePacket (includes tracking).<br />
                Tracking number will be provided after shipping.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 次へ進むボタン */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  borderRadius: 0,
                  py: 1.5,
                  maxWidth: 400,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)'
                  }
                }}
                onClick={handleProceed}
              >
                次へ進む
              </Button>
            </Box>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
} 