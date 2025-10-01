'use client'

import { Box, Typography, Button, Pagination, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { 
  Product, 
  getAllProducts, 
  deleteProduct, 
  updateProduct
} from '@/firebase/productService'
import { fetchCategories } from '@/lib/microcms'
// 新しく作成したテーブルコンポーネントをインポート
import { ProductTable } from '@/components/admin/products/ProductTable';
// 新しく作成したモーダルコンポーネントをインポート
import { ProductDetailModal } from '@/components/admin/products/ProductDetailModal';
import { OrderDetailModal } from '@/components/admin/products/OrderDetailModal';
import { DeleteProductDialog } from '@/components/admin/products/DeleteProductDialog';
import { ShippingConfirmDialog } from '@/components/admin/products/ShippingConfirmDialog';
// カスタムフックのインポート
import { useAdminPageUI } from '@/hooks/admin/useAdminPageUI';
import { useOrderManagement } from '@/hooks/admin/useOrderManagement';



export default function AdminProductsPage() {
  const router = useRouter()
  // UI状態とアクションをカスタムフックから取得
  const [
    { 
      searchTerm, 
      selectedCategory, 
      page, 
      rowsPerPage, 
      deleteDialogOpen, 
      productToDelete, 
      shippingConfirmOpen, 
      productToShip, 
      tabValue, 
      detailModalOpen, 
      selectedProduct, 
      selectedImageIndex 
    },
    {
      handleSearch,
      handleCategoryChange,
      handlePageChange,
      openDeleteDialog,
      closeDeleteDialog,
      closeShippingConfirm,
      openProductDetail,
      closeDetailModal,
      setSelectedImageIndex
    }
  ] = useAdminPageUI();

  // フィルター用の状態を追加
  const [publishFilter, setPublishFilter] = useState<string>('') // 'published' | 'unpublished'
  const [recommendedFilter, setRecommendedFilter] = useState<string>('') // 'recommended' | 'not-recommended'

  // ソート用の状態を追加
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // ソート順を切り替える
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  // 注文管理フックを使用
  const [
    {
      loadingOrders,
      errorOrders
    },
    {
      handleMarkAsShipped
    }
  ] = useOrderManagement({
    searchTerm,
    page,
    rowsPerPage,
    tabValue
  });

  // データ関連のState（商品のみ）
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  // 商品データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 公開中の商品を取得
        const productsData = await getAllProducts(false)
        setProducts(productsData)
        
      } catch (err) {
        console.error('データの取得に失敗しました:', err)
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // microCMSからカテゴリ一覧を取得
  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        const categoryData = await fetchCategories();
        if (categoryData && Array.isArray(categoryData)) {
          // カテゴリオブジェクトから'category'プロパティだけ抽出
          const categoryNames = categoryData.map(cat => cat.category);
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error('カテゴリデータの取得に失敗しました:', error);
      }
    };
    
    getCategoriesData();
  }, []);

  // フィルタリング結果をuseMemoで管理
  const displayProducts = useMemo(() => {
    if (tabValue !== 0) return [];

    let filtered = products.filter(product => {
      // 検索フィルター
      if (searchTerm && (!product.name || !product.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // カテゴリーフィルター
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      
      // 公開状態フィルター
      if (publishFilter === 'published' && !product.isPublished) {
        return false;
      }
      if (publishFilter === 'unpublished' && product.isPublished) {
        return false;
      }
      
      // おすすめフィルター
      if (recommendedFilter === 'recommended' && !product.isRecommended) {
        return false;
      }
      if (recommendedFilter === 'not-recommended' && product.isRecommended) {
        return false;
      }
      
      return true;
    });
    
    // 出品日でソート
    filtered = filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })
    
    return filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [products, searchTerm, selectedCategory, publishFilter, recommendedFilter, sortOrder, page, rowsPerPage, tabValue]);

  // CRUD操作関連のハンドラ (ここは変更なし、ただしUIフックのアクションを呼び出す場合がある)
  const togglePublishStatus = async (product: Product) => {
    if (!product.id) return
    try {
      // DB更新処理はここで行う (updateProductなど)
      await updateProduct(product.id, { isPublished: !product.isPublished });
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === product.id ? { ...p, isPublished: !p.isPublished } : p
        )
      )
    } catch (err) {
      console.error('商品の更新に失敗しました:', err)
      setError('商品の更新に失敗しました')
    }
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete?.id) return
    try {
      await deleteProduct(productToDelete.id)
      setProducts(prevProducts =>
        prevProducts.filter(p => p.id !== productToDelete.id)
      )
      closeDeleteDialog() // UIフックのアクション呼び出し
    } catch (err) {
      console.error('商品の削除に失敗しました:', err)
      setError('商品の削除に失敗しました')
      closeDeleteDialog() // UIフックのアクション呼び出し
    }
  }

  const handleAddProduct = () => {
    router.push('/admin/new')
  }

  const handleEditProduct = (productId: string) => {
    if (!productId) return;
    router.push(`/admin/${productId}/edit`);
  }

  const toggleRecommended = async (product: Product) => {
    if (!product.id) return;
    try {
      const isRecommended = product.isRecommended || false;
      await updateProduct(product.id, {
        isRecommended: !isRecommended
      });
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === product.id ? { ...p, isRecommended: !isRecommended } : p
        )
      );
    } catch (err) {
      console.error('商品の更新に失敗しました:', err);
      setError('おすすめ設定の更新に失敗しました');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          商品管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          sx={{
            bgcolor: '#006AFF',
            color: 'white',
            borderRadius: 0,
            '&:hover': {
              bgcolor: '#006ADD'
            }
          }}
        >
          新規商品追加
        </Button>
      </Box>

      {/* タブ */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {/* タブなし - 商品管理のみ */}
      </Box>

      {/* 検索とフィルタリング */}
      <Box sx={{ display: 'flex', mt: 3, mb: 3, gap: 2, flexWrap: 'wrap' }}>
          {/* 検索バー */}
          <TextField
            placeholder="商品名で検索"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ 
              flexGrow: 1,
              minWidth: '200px',
              '& .MuiOutlinedInput-root': {
                borderRadius: 0
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          {/* カテゴリーフィルター */}
          <FormControl 
            variant="outlined" 
            size="small" 
            sx={{ 
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0
              }
            }}
          >
            <InputLabel id="category-filter-label">カテゴリ</InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="カテゴリ"
              size="small"
            >
              <MenuItem value="">すべて</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* 公開状態フィルター */}
          <FormControl 
            variant="outlined" 
            size="small" 
            sx={{ 
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0
              }
            }}
          >
            <InputLabel id="publish-filter-label">公開状態</InputLabel>
            <Select
              labelId="publish-filter-label"
              value={publishFilter}
              onChange={(e) => setPublishFilter(e.target.value)}
              label="公開状態"
              size="small"
            >
              <MenuItem value="">すべて</MenuItem>
              <MenuItem value="published">公開中</MenuItem>
              <MenuItem value="unpublished">非公開</MenuItem>
            </Select>
          </FormControl>
          
          {/* おすすめフィルター */}
          <FormControl 
            variant="outlined" 
            size="small" 
            sx={{ 
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0
              }
            }}
          >
            <InputLabel id="recommended-filter-label">おすすめ</InputLabel>
            <Select
              labelId="recommended-filter-label"
              value={recommendedFilter}
              onChange={(e) => setRecommendedFilter(e.target.value)}
              label="おすすめ"
              size="small"
            >
              <MenuItem value="">すべて</MenuItem>
              <MenuItem value="recommended">おすすめ</MenuItem>
              <MenuItem value="not-recommended">通常</MenuItem>
            </Select>
          </FormControl>
        </Box>

      {loading || loadingOrders ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>読み込み中...</Typography>
        </Box>
      ) : error || errorOrders ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
          <Typography>{error || errorOrders}</Typography>
        </Box>
      ) : (
        <>
          <ProductTable
            products={displayProducts}
            selectedImageIndex={selectedImageIndex} // UIフックの状態
            onEdit={handleEditProduct}
            onDelete={openDeleteDialog} // UIフックのアクション
            onTogglePublish={togglePublishStatus}
            onToggleRecommended={toggleRecommended}
            onDetail={openProductDetail} // UIフックのアクション
            sortOrder={sortOrder} // 追加
            onSortChange={toggleSortOrder} // 追加
          />

          {products.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(products.length / rowsPerPage)}
                page={page} // UIフックの状態
                onChange={handlePageChange} // UIフックのアクション
                color="standard"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      <ProductDetailModal
        open={detailModalOpen} // UIフックの状態
        onClose={closeDetailModal} // UIフックのアクション
        product={selectedProduct} // UIフックの状態
        selectedImageIndex={selectedImageIndex} // UIフックの状態
        setSelectedImageIndex={setSelectedImageIndex} // UIフックのアクション
        onEditProduct={(productId) => { if (productId) handleEditProduct(productId); }}
      />

      <DeleteProductDialog
        open={deleteDialogOpen} // UIフックの状態
        onClose={closeDeleteDialog} // UIフックのアクション
        onConfirm={handleDeleteProduct}
        productToDelete={productToDelete} // UIフックの状態
      />

      <ShippingConfirmDialog
        open={shippingConfirmOpen} // UIフックの状態
        onClose={closeShippingConfirm} // UIフックのアクション
        onConfirm={() => productToShip && handleMarkAsShipped(productToShip, closeShippingConfirm)} // フックの関数を使用
        productToShip={productToShip} // UIフックの状態
      />
    </Box>
  )
} 