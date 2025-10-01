'use client'

import { useState } from 'react'
import { CircularProgress, Box } from '@mui/material'
import ProductForm from '@/components/admin/ProductForm'
import { Product, createProductWithStripe } from '@/firebase/productService'
import { sizeInventorySchema } from '@/schemas/productSchema'
import * as yup from 'yup'

export default function NewProductPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: {
    formData: Omit<Product, 'id' | 'images'>;
    sizeInventories: yup.InferType<typeof sizeInventorySchema>[];
    uploadingImages: File[];
  }) => {
      // 商品データの準備
      const productData: Omit<Product, 'id' | 'images'> = {
      name: data.formData.name,
      description: data.formData.description,
      link: data.formData.link,
      price: Number(data.formData.price),
      category: data.formData.category,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      sizeInventories: data.sizeInventories
          .filter(item => item.size !== '')
          .map(item => ({
            size: item.size,
            stock: Number(item.stock) || 0
          }))
      }
      
      // 画像データの準備
    const imageFilesToUpload = Array.from(data.uploadingImages)
      
      // Stripe連携を利用する場合（本番環境での出品）
      await createProductWithStripe(productData, imageFilesToUpload);
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