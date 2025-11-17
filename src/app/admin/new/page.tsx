'use client'

import { useState } from 'react'
import { CircularProgress, Box } from '@mui/material'
import ProductForm from '@/components/admin/ProductForm'
import { Product } from '@/firebase/productService'
import { sizeInventorySchema } from '@/schemas/productSchema'
import * as yup from 'yup'

export default function NewProductPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: {
    formData: Omit<Product, 'id' | 'images'>;
    sizeInventories: yup.InferType<typeof sizeInventorySchema>[];
    uploadingImages: File[];
  }) => {
    try {
      setLoading(true)
      
      // FormDataを作成
      const formData = new FormData()
      formData.append('name', data.formData.name)
      formData.append('description', data.formData.description || '')
      formData.append('link', data.formData.link || '')
      formData.append('price', String(data.formData.price))
      formData.append('category', JSON.stringify(data.formData.category))
      formData.append('isPublished', 'true')
      formData.append('sizeInventories', JSON.stringify(data.sizeInventories))
      
      // 画像ファイルを追加
      data.uploadingImages.forEach((file) => {
        formData.append('images', file)
      })
      
      // API Routeに送信
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '商品の作成に失敗しました')
      }
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('商品作成エラー:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    )
  }
  
  return (
    <ProductForm
      mode="new"
      onSubmit={handleSubmit}
      title="商品の登録ページ"
      submitButtonText="商品を登録"
    />
  )
} 