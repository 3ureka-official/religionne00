'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Button, TextField, FormControl, Select, MenuItem, Divider, IconButton, CircularProgress, Alert } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { Product } from '@/firebase/productService'
// import { createProductWithStripe } from '@/firebase/productService'
import { fetchCategories } from '@/lib/microcms'
import { MicroCMSCategory } from '@/lib/microcms'
// import { Timestamp } from 'firebase/firestore'

// サイズごとの在庫を管理するインターフェース
interface SizeInventory {
  size: string;
  stock: string | number;
}

export default function NewProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // カテゴリーの状態
  const [categories, setCategories] = useState<MicroCMSCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true)
  
  // サイズごとの在庫管理
  const [sizeInventories, setSizeInventories] = useState<SizeInventory[]>([
    { size: '', stock: '' }
  ])
  
  // フォームの状態
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'sizes'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    isPublished: false
  })
  
  // UI状態
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState<File[]>([])
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([])
  
  // カテゴリーデータの取得
  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        setLoadingCategories(true)
        const data = await fetchCategories()
        console.log(data)
        if (data.length > 0) {
          setCategories(data)
        }
      } catch (err) {
        console.error('カテゴリーの取得に失敗しました:', err)
      } finally {
        setLoadingCategories(false)
      }
    }
    
    getCategoriesData()
  }, [])
  
  // テキストフィールドの変更ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // 数値フィールドの処理
    if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  // セレクトボックスの変更ハンドラ
  const handleSelectChange = (e: React.ChangeEvent<Omit<HTMLInputElement, "value"> & { value: string; }> | (Event & { target: { value: string; name: string; }; })) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  
  // サイズと在庫の変更ハンドラ
  const handleInventoryChange = (id: string, field: 'size' | 'stock', value: string | number) => {
    setSizeInventories(prev => 
      prev.map((item, index) => 
        index === Number(id) 
          ? { ...item, [field]: value } 
          : item
      )
    )
  }
  
  // サイズと在庫の追加
  const handleAddInventory = () => {
    const newId = Date.now().toString()
    setSizeInventories(prev => [...prev, { id: newId, size: '', stock: '' }])
  }
  
  // サイズと在庫の削除
  const handleRemoveInventory = (id: string) => {
    if (sizeInventories.length > 1) {
      setSizeInventories(prev => prev.filter((_, index) => index !== Number(id)))
    }
  }
  
  // 画像のアップロード処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // 最大15枚まで
      const newFiles = Array.from(e.target.files).slice(0, 15 - uploadingImages.length)
      
      // プレビュー用のURL生成
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      
      setUploadingImages(prev => [...prev, ...newFiles])
      setImagesPreviews(prev => [...prev, ...newPreviews])
    }
  }
  
  // 画像の削除
  const handleRemoveImage = (index: number) => {
    // プレビューURL開放
    URL.revokeObjectURL(imagesPreviews[index])
    
    setUploadingImages(prev => prev.filter((_, i) => i !== index))
    setImagesPreviews(prev => prev.filter((_, i) => i !== index))
  }
  
  // アップロードボタンのクリック
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  // 商品登録処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // バリデーション
    if (!formData.name || !formData.category || !formData.price) {
      setError('商品名、カテゴリ、価格は必須です')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // 商品データの準備
      // const productData: Omit<Product, 'id' | 'images'> = {
      //   name: formData.name,
      //   description: formData.description,
      //   price: Number(formData.price),
      //   category: formData.category,
      //   isPublished: true,
      //   createdAt: Timestamp.now(),
      //   updatedAt: Timestamp.now(),
      //   sizeInventories: sizeInventories
      //     .filter(item => item.size !== '')
      //     .map(item => ({
      //       size: item.size,
      //       stock: Number(item.stock) || 0
      //     }))
      // }
      
      // 画像データの準備
      // const imageFilesToUpload = Array.from(uploadingImages)
      
      // Stripe連携を利用する場合（本番環境での出品）
      // let newProduct = await createProductWithStripe(productData, imageFilesToUpload);
      
      setSuccess('商品が正常に追加されました')
      
      // 一覧ページに戻る
      setTimeout(() => {
        router.push('/admin/')
      }, 1500)
      
    } catch (err) {
      console.error('商品登録エラー:', err)
      setError('商品の登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }
  
  // 前のページに戻る
  const handleBack = () => {
    router.back()
  }
  
  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', pb: 8 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, pt: 2 }}>
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
          商品の編集ページ
        </Typography>
      </Box>
      
      {/* エラー/成功メッセージ */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {success}
        </Alert>
      )}
      
      {/* 商品登録フォーム */}
      <form onSubmit={handleSubmit}>
        {/* 出品画像 */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
              出品画像
            </Typography>
            <Typography variant="body2" color="text.secondary">
              （最大15枚）
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {/* 画像プレビュー */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              {imagesPreviews.map((preview, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 120,
                    height: 120,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={preview}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      bgcolor: 'rgba(0, 0, 0, 0.34)',
                      color: 'white',
                      p: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.54)',
                      }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              
              {/* 画像追加ボタン */}
              <Box
                onClick={handleUploadClick}
                sx={{
                  width: 120,
                  height: 120,
                  border: '1px solid #aaa',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#007AFF',
                    color: '#007AFF',
                  }
                }}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 32, mb: 1 }} />
                <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: '#007AFF' }}>
                  画像を選択する
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 5 }} />
        
        {/* 商品名 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            商品名
          </Typography>
          <TextField
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            placeholder="商品名"
            InputProps={{
              endAdornment: (
                <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {formData.name.length} / 40
                </Typography>
              ),
            }}
            inputProps={{ maxLength: 40 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': {
                  borderColor: '#aaa'
                },
                '&:hover fieldset': {
                  borderColor: '#000'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000',
                  borderWidth: 1
                }
              }
            }}
          />
        </Box>
        
        {/* 販売価格 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            販売価格
          </Typography>
          <TextField
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <Typography sx={{ mr: 1, fontWeight: 'bold' }}>¥</Typography>
              ),
              inputProps: { min: 0 }
            }}
            fullWidth
            required
            placeholder="0"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': {
                  borderColor: '#aaa'
                },
                '&:hover fieldset': {
                  borderColor: '#000'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000',
                  borderWidth: 1
                }
              }
            }}
          />
        </Box>
        
        {/* カテゴリー */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            カテゴリー
          </Typography>
          <FormControl fullWidth>
            <Select
              name="category"
              value={formData.category}
              onChange={handleSelectChange}
              displayEmpty
              sx={{
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#aaa'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#000'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#000',
                  borderWidth: 1
                }
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'text.secondary', fontWeight: 'bold' }}>カテゴリー</Typography>;
                }
                return selected;
              }}
            >
              {loadingCategories ? (
                <MenuItem disabled>
                  <Typography>読み込み中...</Typography>
                </MenuItem>
              ) : (
                categories.map(category => (
                  <MenuItem key={category.id} value={category.category}>
                    {category.category}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>
        
        {/* 商品説明 */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              商品説明
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              {formData.description.length} / 1000
            </Typography>
          </Box>
          <TextField
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={8}
            placeholder="商品の説明を入力してください"
            inputProps={{ maxLength: 1000 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': {
                  borderColor: '#aaa'
                },
                '&:hover fieldset': {
                  borderColor: '#000'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000',
                  borderWidth: 1
                }
              }
            }}
          />
        </Box>
        
        <Divider sx={{ mb: 5 }} />
        
        {/* サイズと在庫 */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              サイズと在庫
            </Typography>
            <Button 
              startIcon={<AddIcon />} 
              onClick={handleAddInventory}
              sx={{ 
                color: '#007AFF',
                '&:hover': { bgcolor: 'rgba(0, 122, 255, 0.08)' }
              }}
            >
              サイズを追加
            </Button>
          </Box>
          
          {sizeInventories.map((item, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 2,
                alignItems: 'center'
              }}
            >
              <TextField
                placeholder="サイズ"
                value={item.size}
                onChange={(e) => handleInventoryChange(String(index), 'size', e.target.value)}
                sx={{ 
                  flexBasis: '60%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    '& fieldset': {
                      borderColor: '#aaa'
                    },
                    '&:hover fieldset': {
                      borderColor: '#000'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#000',
                      borderWidth: 1
                    }
                  }
                }}
              />
              <TextField
                type="number"
                placeholder="在庫数"
                value={item.stock}
                onChange={(e) => handleInventoryChange(String(index), 'stock', e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ 
                  flexBasis: '30%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    '& fieldset': {
                      borderColor: '#aaa'
                    },
                    '&:hover fieldset': {
                      borderColor: '#000'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#000',
                      borderWidth: 1
                    }
                  }
                }}
              />
              {sizeInventories.length > 1 && (
                <IconButton 
                  onClick={() => handleRemoveInventory(String(index))}
                  sx={{ color: 'error.main' }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
        
        {/* 送信ボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 6 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              minWidth: 120,
              py: 1.5,
              borderColor: 'black',
              color: 'black',
              borderRadius: 1,
              fontWeight: 'bold',
              '&:hover': {
                borderColor: 'black',
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 120,
              py: 1.5,
              bgcolor: 'black',
              color: 'white',
              borderRadius: 1,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                保存中...
              </>
            ) : '商品を登録'}
          </Button>
        </Box>
      </form>
    </Box>
  )
} 