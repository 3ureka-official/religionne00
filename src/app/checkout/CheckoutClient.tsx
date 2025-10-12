'use client'

import { Box, Container, Typography, Button, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { useCart } from '@/features/cart/components/CartContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import { MicroCMSSettings } from '@/lib/microcms'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { checkoutSchema, CheckoutFormData } from '@/schemas/checkoutSchema'
import { OrderInfo } from '@/types/Storage'

// ローカルストレージのキー
const SHIPPING_FORM_STORAGE_KEY = 'shipping_form_data';
const PAYMENT_METHOD_STORAGE_KEY = 'payment_method_data';

export default function CheckoutClientPage({ settings }: { settings: MicroCMSSettings }) {
  const { items } = useCart()
  const router = useRouter()
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      lastName: '',
      firstName: '',
      postalCode: '',
      prefecture: '',
      city: '',
      address: '',
      building: '',
      email: '',
      phone: '',
      paymentMethod: 'credit'
    },
    shouldFocusError: true
  })
  
  const watchedValues = watch()
  const [isRestored, setIsRestored] = useState(false)

  // 合計金額の計算
  const calculateTotal = (isIslandAddress: boolean) => {
    const productTotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    
    // 基本送料
    let shippingCost = isIslandAddress ? Number(settings.islandFee) : Number(settings.nationwideFee);
    
    // 送料無料の条件をチェック
    if (settings.freeLowerLimit && productTotal >= Number(settings.freeLowerLimit)) {
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
        Object.keys(parsedFormData).forEach((key) => {
          setValue(key as keyof CheckoutFormData, parsedFormData[key]);
        });
      } catch (e) {
        console.error('保存されたフォームデータの解析に失敗しました:', e);
      }
    }

    // 支払い方法の復元
    const savedPaymentMethod = localStorage.getItem(PAYMENT_METHOD_STORAGE_KEY);
    if (savedPaymentMethod) {
      setValue('paymentMethod', savedPaymentMethod as 'credit' | 'cod');
    }
    
    // 復元完了フラグを設定
    setIsRestored(true);
    
  }, [setValue]);

  // フォーム値の変更を監視してローカルストレージに保存（復元完了後のみ）
  useEffect(() => {
    if (isRestored) {
      localStorage.setItem(SHIPPING_FORM_STORAGE_KEY, JSON.stringify(watchedValues));
      localStorage.setItem(PAYMENT_METHOD_STORAGE_KEY, watchedValues.paymentMethod);
    }
  }, [watchedValues, isRestored]);

  // フォーム送信処理
  const onSubmit = async (data: CheckoutFormData) => {
    // 離島判定を確実に行う
    let islandStatus = false;

    try {
      if (data.prefecture && data.address) {
        const islandModule = await import('@/const/island');
        const addressType = islandModule.getAddressType(data.prefecture, data.address);

        islandStatus = addressType === islandModule.AddressType.DOMESTIC_ISLAND;
      }
    } catch (error) {
      console.error('離島判定エラー:', error);
    }

    const totalCost = calculateTotal(islandStatus)

    // 注文情報をセッションストレージに保存
    const orderInfo = {
      customerInfo: data,
      items: items,
      paymentMethod: data.paymentMethod,
      shippingFee: totalCost.shippingCost,
      total: totalCost.total,
      isIslandAddress: islandStatus
    };
    
    sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo));

    const cartItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price.toString().replace(/,/g, '')),
      quantity: item.quantity,
      image: item.image,
      size: item.size
    }));
    
    // バックエンドAPIに渡す支払い情報 (paymentMethod の形式を修正)
    let apiPaymentMethodType: string;
    switch (data.paymentMethod) {
      case 'credit':
        apiPaymentMethodType = 'stripe_credit_card';
        break;
      case 'cod':
        apiPaymentMethodType = 'cod';
        break;
      default:
        alert('不明な支払い方法です。');
        return;
    }

    const paymentInfoForAPI: OrderInfo = {
      customerInfo: {            // ← CustomerInfo型に合わせる
        lastName: data.lastName,
        firstName: data.firstName,
        postalCode: data.postalCode,
        prefecture: data.prefecture,
        city: data.city,
        address: data.address,
        building: data.building,
        email: data.email,
        phone: data.phone
      },
      items: items.map(item => ({  // ← Item型に合わせる
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size
      })),
      paymentMethod: data.paymentMethod,
      shippingFee: totalCost.shippingCost,
      total: totalCost.total
    };
    
    sessionStorage.setItem('paymentInfo', JSON.stringify(paymentInfoForAPI));
  
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="姓 / Last Name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
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
                    )}
                  />
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="名 / First Name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
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
                    )}
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
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="郵便番号 / Postal Code"
                        variant="outlined"
                        size="small"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        placeholder="例: 123-4567"
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
                    )}
                  />
                  <Controller
                    name="prefecture"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="都道府県 / Prefecture"
                        variant="outlined"
                        size="small"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
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
                    )}
                  />
                </Box>
                
                <Controller
                  name="city"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="市区町村 / City"
                      variant="outlined"
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{ 
                        '& .MuiOutlinedInput-notchedOutline': { 
                          borderColor: 'rgba(217, 217, 217, 0.87)' 
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '13px'
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  name="address"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="番地 / Street Address"
                      variant="outlined"
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{ 
                        '& .MuiOutlinedInput-notchedOutline': { 
                          borderColor: 'rgba(217, 217, 217, 0.87)' 
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '13px'
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  name="building"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="建物名・部屋番号など / Building, Room #"
                      variant="outlined"
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{ 
                        '& .MuiOutlinedInput-notchedOutline': { 
                          borderColor: 'rgba(217, 217, 217, 0.87)' 
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '13px'
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="メールアドレス / Email"
                      variant="outlined"
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{ 
                        '& .MuiOutlinedInput-notchedOutline': { 
                          borderColor: 'rgba(217, 217, 217, 0.87)' 
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '13px'
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="携帯電話番号 / Phone Number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      placeholder="例: 090-1234-5678"
                      sx={{ 
                        '& .MuiOutlinedInput-notchedOutline': { 
                          borderColor: 'rgba(217, 217, 217, 0.87)' 
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '13px'
                        }
                      }}
                    />
                  )}
                />
              </Box>

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
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <RadioGroup
                        {...field}
                        aria-label="payment-method"
                      >
                        <FormControlLabel 
                          value="credit" 
                          control={<Radio />} 
                          label="クレジットカード" 
                          sx={{ '& .MuiTypography-root': { fontSize: '14px', fontWeight: 500 } }}
                        />
                        <FormControlLabel 
                          value="cod" 
                          control={<Radio />} 
                          label="代引き" 
                          sx={{ '& .MuiTypography-root': { fontSize: '14px', fontWeight: 500 } }}
                        />
                      </RadioGroup>
                      {fieldState.error && (
                        <Typography color="error" sx={{ fontSize: '12px', mt: 1 }}>
                          {fieldState.error.message}
                        </Typography>
                      )}
                    </>
                  )}
                />

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
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
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
                >
                  {isSubmitting ? '処理中...' : '次へ進む'}
                </Button>
              </Box>
            </Box>
          </form>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
} 