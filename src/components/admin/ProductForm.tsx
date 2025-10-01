'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography, Button, TextField, FormControl, Select, MenuItem, Divider, IconButton, CircularProgress, Alert } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { Product } from '@/firebase/productService'
import { fetchCategories } from '@/lib/microcms'
import { MicroCMSCategory } from '@/lib/microcms'
import { productSchema, ProductFormData, sizeInventorySchema } from '@/schemas/productSchema'
import * as yup from 'yup'
import ImageUploader from './ImageUploader'

export interface ProductFormProps {
  mode: 'new' | 'edit';
  initialData?: Product;
  onSubmit: (data: {
    formData: Omit<Product, 'id' | 'images'>;
    sizeInventories: yup.InferType<typeof sizeInventorySchema>[];
    uploadingImages: File[];
    imagesToDelete?: string[];
  }) => Promise<void>;
  title: string;
  submitButtonText: string;
}

export default function ProductForm({ mode, initialData, onSubmit, title, submitButtonText }: ProductFormProps) {
  const router = useRouter()
  
  // React Hook Form の設定
  const { 
    control, 
    handleSubmit: handleFormSubmit, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      link: '',
      price: 0,
      category: '',
      isPublished: false,
      sizeInventories: [{ size: '', stock: 0 }],
    }
  })

  // サイズと在庫のフィールド配列管理
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sizeInventories',
  })

  // フォームの値を監視
  const formValues = watch()
  
  // カテゴリーの状態
  const [categories, setCategories] = useState<MicroCMSCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true)
  
  // UI状態
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState<File[]>([])
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

  // 初期データの設定（編集モードの場合）
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setValue('name', initialData.name || '')
      setValue('description', initialData.description || '')
      setValue('link', initialData.link || '')
      setValue('price', initialData.price || 0)
      setValue('category', initialData.category || '')
      setValue('isPublished', initialData.isPublished || false)
      
      // 画像プレビューを設定
      if (initialData.images && initialData.images.length > 0) {
        setImagesPreviews(initialData.images)
      }
      
      // サイズ在庫情報を設定
      if (initialData.sizeInventories && initialData.sizeInventories.length > 0) {
        setValue('sizeInventories', initialData.sizeInventories.map((item) => ({
          size: item.size,
          stock: item.stock
        })))
      }
    }
  }, [mode, initialData, setValue])
  
  // カテゴリーデータの取得
  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        setLoadingCategories(true)
        const data = await fetchCategories()
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
  
  // サイズと在庫の追加
  const handleAddInventory = () => {
    append({ size: '', stock: 0 })
  }

  const handleImagesChange = (newFiles: File[]) => {
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setUploadingImages(prev => [...prev, ...newFiles])
    setImagesPreviews(prev => [...prev, ...newPreviews])
  }
  
  // 画像削除のハンドラ
  const handleImageRemove = (index: number) => {
    if (mode === 'new') {
      URL.revokeObjectURL(imagesPreviews[index])
      setUploadingImages(prev => prev.filter((_, i) => i !== index))
      setImagesPreviews(prev => prev.filter((_, i) => i !== index))
    } else {
      const imageIndexInAll = index - (initialData?.images?.length || 0) + imagesToDelete.length
      if (imageIndexInAll >= 0) {
        URL.revokeObjectURL(imagesPreviews[index])
        setUploadingImages(prev => prev.filter((_, i) => i !== imageIndexInAll))
        setImagesPreviews(prev => prev.filter((_, i) => i !== index))
      } else {
        const imageUrl = (initialData?.images || [])[index + imagesToDelete.length]
        setImagesToDelete(prev => [...prev, imageUrl])
        setImagesPreviews(prev => prev.filter((_, i) => i !== index))
      }
    }
  }
  
  // フォーム送信処理
  const onFormSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true)
      setError(null)
      
      const formDataToSubmit = {
        name: data.name,
        description: data.description || '',
        link: data.link || '',
        price: data.price,
        category: data.category,
        images: initialData?.images || [],
        isPublished: data.isPublished,
      }
      
      await onSubmit({
        formData: formDataToSubmit,
        sizeInventories: data.sizeInventories || [],
        uploadingImages,
        imagesToDelete: mode === 'edit' ? imagesToDelete : undefined
      })
      
      setSuccess(mode === 'new' ? '商品が正常に追加されました' : '商品が正常に更新されました')
      
      setTimeout(() => {
        router.push('/admin/')
      }, 1500)
      
    } catch (err) {
      console.error('商品処理エラー:', err)
      setError(mode === 'new' ? '商品の登録に失敗しました' : '商品の更新に失敗しました')
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
          {title}
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
      
      {/* 商品フォーム */}
      <form onSubmit={handleFormSubmit(onFormSubmit)}>
        {/* 出品画像 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1, fontSize: '14px' }}>
              出品画像
            </Typography>
            <Typography variant="body2" color="text.secondary">
              （最大15枚）
            </Typography>
          </Box>

          <ImageUploader
            images={imagesPreviews}
            onImagesChange={handleImagesChange}
            onImageRemove={handleImageRemove}
            maxImages={15}
          />
        </Box>
        
        {/* 商品名 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, fontSize: '14px' }}>
            商品名
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="商品名"
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
                InputProps={{
                  inputProps: { maxLength: 40 },
                  endAdornment: (
                    <Typography variant="caption" sx={{ color: 'text.primary', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {field.value?.length || 0}/40
                    </Typography>
                  ),
                }}
                sx={{
                  fontSize: '14px',
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
            )}
          />
        </Box>
        
        {/* 販売価格 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, fontSize: '14px' }}>
            販売価格
          </Typography>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                placeholder="0"
                error={!!errors.price}
                helperText={errors.price?.message}
                size="small"
                InputProps={{
                  startAdornment: (
                    <Typography sx={{ mr: 1 }}>¥</Typography>
                  ),
                  inputProps: { min: 0 }
                }}
                sx={{
                  fontSize: '14px',
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
            )}
          />
        </Box>
        
        {/* カテゴリー */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, fontSize: '14px' }}>
            カテゴリー
          </Typography>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <Select
                  {...field}
                  displayEmpty
                  size="small"
                  sx={{
                    fontSize: '14px',
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
                      return <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>カテゴリーを選択してください</Typography>;
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
                {errors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.category.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Box>
        
        {/* 商品説明 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
              商品説明
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.primary', whiteSpace: 'nowrap', fontSize: '12px' }}>
              {formValues.description?.length || 0}/1000
            </Typography>
          </Box>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                minRows={5}
                placeholder="商品の説明を入力してください"
                error={!!errors.description}
                helperText={errors.description?.message}
                inputProps={{ maxLength: 1000 }}
                size="small"
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
            )}
          />
        </Box>

        {/* リンク */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, fontSize: '14px' }}>
            リンク
          </Typography>
          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="https://example.com"
                error={!!errors.link}
                helperText={errors.link?.message}
                size="small"
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
            )}
          />
        </Box>
        
        {/* サイズと在庫 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
              サイズと在庫
            </Typography>
            <Button 
              startIcon={<AddIcon />} 
              onClick={handleAddInventory}
              type="button"
              variant="outlined"
              sx={{ 
                color: '#007AFF',
                borderRadius: 1,
                borderColor: '#007AFF',
                alignItems: 'center',
                '&:hover': { bgcolor: 'rgba(0, 122, 255, 0.08)' }
              }}
            >
              <Typography sx={{ fontSize: '14px' }}>
                サイズを追加
              </Typography>
            </Button>
          </Box>
          
          {/* サイズ配列のエラーメッセージ */}
          {errors.sizeInventories && typeof errors.sizeInventories.message === 'string' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.sizeInventories.message}
            </Alert>
          )}
          
          {fields.map((field, index) => (
            <Box 
              key={field.id}
              sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 2,
                alignItems: 'flex-start'
              }}
            >
              <Controller
                name={`sizeInventories.${index}.size`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="サイズ"
                    error={!!errors.sizeInventories?.[index]?.size}
                    helperText={errors.sizeInventories?.[index]?.size?.message}
                    size="small"
                    sx={{ 
                      flexBasis: '60%',
                      fontSize: '14px',
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
                )}
              />
              <Controller
                name={`sizeInventories.${index}.stock`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    placeholder="在庫数"
                    error={!!errors.sizeInventories?.[index]?.stock}
                    helperText={errors.sizeInventories?.[index]?.stock?.message}
                    size="small"
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ 
                      flexBasis: '30%',
                      fontSize: '14px',
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
                )}
              />
              {fields.length > 1 && (
                <IconButton 
                  onClick={() => remove(index)}
                  type="button"
                  sx={{ color: 'error.main', mt: 0.5 }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>

        <Divider sx={{ mt: 3 }} />
        
        {/* 送信ボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            type="button"
            sx={{
              minWidth: 150,
              borderColor: '#007AFF',
              color: '#007AFF',
              borderRadius: 1,
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#007AFF',
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
              minWidth: 150,
              bgcolor: '#006AFF',
              color: 'white',
              borderRadius: 1,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#006ADD'
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                保存中...
              </>
            ) : submitButtonText}
          </Button>
        </Box>
      </form>
    </Box>
  )
} 