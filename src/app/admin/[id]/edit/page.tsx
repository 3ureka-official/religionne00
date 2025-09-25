'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CircularProgress, Box } from '@mui/material'
import ProductForm, { SizeInventory } from '@/components/admin/ProductForm'
import { Product, getProduct, updateProduct, uploadProductImage, deleteProductImage } from '@/firebase/productService'

export default function EditProductPage() {
  const params = useParams()
  const productId = params?.id as string
  
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // 商品データの取得
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productData = await getProduct(productId)
        
        if (!productData) {
          setError('商品が見つかりません')
          return
        }
        
        setProduct(productData)
      } catch (err) {
        console.error('商品の取得に失敗しました:', err)
        setError('商品の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    
    if (productId) {
      fetchProduct()
    }
  }, [productId])
  
  const handleSubmit = async (data: {
    formData: Omit<Product, 'id' | 'images'>;
    sizeInventories: SizeInventory[];
    uploadingImages: File[];
    imagesToDelete?: string[];
  }) => {
      // 既存の画像を削除
    if (data.imagesToDelete) {
      for (const imageUrl of data.imagesToDelete) {
        try {
          await deleteProductImage(imageUrl)
        } catch (err) {
          console.error('画像の削除に失敗しました:', err)
        }
        }
      }
      
      // 新しい画像をアップロード
      const uploadedImageUrls: string[] = []
      
    if (data.uploadingImages.length > 0) {
      for (const file of data.uploadingImages) {
          const imageUrl = await uploadProductImage(file, productId)
          uploadedImageUrls.push(imageUrl)
        }
      }
      
      // 商品データの更新
    const remainingImages = (product?.images || []).filter(img => !data.imagesToDelete?.includes(img))
      const updatedImages = [...remainingImages, ...uploadedImageUrls]
      
      await updateProduct(productId, {
      ...data.formData,
      price: Number(data.formData.price),
        images: updatedImages,
      sizeInventories: data.sizeInventories
          .filter(item => item.size !== '')
          .map(item => ({
            size: item.size,
            stock: Number(item.stock) || 0
          }))
      })
  }
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    )
  }
  
  if (error) {
  return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <div>{error}</div>
      </Box>
    )
  }

  if (!product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <div>商品が見つかりません</div>
              </Box>
    )
  }

  return (
    <ProductForm
      mode="edit"
      initialData={product}
      onSubmit={handleSubmit}
      title="商品の編集ページ"
      submitButtonText="商品を更新"
    />
  )
} 