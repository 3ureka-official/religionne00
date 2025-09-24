'use client'

import { Box, Typography, Button, Pagination, TextField, InputAdornment, Tabs, Tab, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
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
import { Order } from '@/firebase/orderService'
// 新しく作成したテーブルコンポーネントをインポート
import { ProductTable } from '@/components/admin/products/ProductTable';
import { PreparingOrderTable } from '@/components/admin/products/PreparingOrderTable';
import { ShippedProductTable } from '@/components/admin/products/ShippedProductTable';
// 新しく作成したモーダルコンポーネントをインポート
import { ProductDetailModal } from '@/components/admin/products/ProductDetailModal';
import { OrderDetailModal } from '@/components/admin/products/OrderDetailModal';
import { DeleteProductDialog } from '@/components/admin/products/DeleteProductDialog';
import { ShippingConfirmDialog } from '@/components/admin/products/ShippingConfirmDialog';
// カスタムフックのインポート
import { useAdminPageUI } from '@/hooks/admin/useAdminPageUI';
import { useOrderManagement } from '@/hooks/admin/useOrderManagement';

// タブパネルのインターフェース
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// タブパネルコンポーネント
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

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
      selectedOrder, 
      selectedShipped, 
      selectedImageIndex 
    },
    {
      handleSearch,
      handleCategoryChange,
      handlePageChange,
      openDeleteDialog,
      closeDeleteDialog,
      openShippingConfirm,
      closeShippingConfirm,
      handleTabChange,
      openProductDetail,
      openOrderDetail,
      openShippedOrderDetail,
      closeDetailModal,
      setSelectedImageIndex
    }
  ] = useAdminPageUI();

  // 注文管理フックを使用
  const [
    {
      preparingOrders,
      shippedOrders,
      displayOrders,
      displayShipped,
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
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(product => product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    return filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [products, searchTerm, selectedCategory, page, rowsPerPage, tabValue]);

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
            bgcolor: 'black',
            color: 'white',
            borderRadius: 0,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.8)'
            }
          }}
        >
          新規商品追加
        </Button>
      </Box>

      {/* タブ */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="product status tabs">
          <Tab 
            label="出品中" 
            sx={{ textTransform: 'none', fontWeight: tabValue === 0 ? 'bold' : 'normal' }} 
          />
          <Tab 
            label="配送準備中" 
            sx={{ textTransform: 'none', fontWeight: tabValue === 1 ? 'bold' : 'normal' }} 
          />
          <Tab 
            label="配送済み" 
            sx={{ textTransform: 'none', fontWeight: tabValue === 2 ? 'bold' : 'normal' }} 
          />
        </Tabs>
      </Box>

      {/* 検索とフィルタリング */}
      {tabValue === 0 && (
      <Box sx={{ display: 'flex', mt: 3, mb: 3, gap: 2 }}>
        <TextField
          placeholder="商品名で検索"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch} // UIフックのアクション
          sx={{ 
            flexGrow: 1,
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
        <FormControl 
          variant="outlined" 
          size="small" 
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0
            }
          }}
        >
          <InputLabel id="category-filter-label">カテゴリ</InputLabel>
          <Select
            labelId="category-filter-label"
            value={selectedCategory} // UIフックの状態
            onChange={handleCategoryChange} // UIフックのアクション
            label="カテゴリ"
          >
            <MenuItem value="">すべて</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    )}

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
          <TabPanel value={tabValue} index={0}>
            <ProductTable
              products={displayProducts}
              selectedImageIndex={selectedImageIndex} // UIフックの状態
              onEdit={handleEditProduct}
              onDelete={openDeleteDialog} // UIフックのアクション
              onTogglePublish={togglePublishStatus}
              onToggleRecommended={toggleRecommended}
              onDetail={openProductDetail} // UIフックのアクション
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <PreparingOrderTable
              orders={displayOrders}
              onDetail={openOrderDetail} // UIフックのアクション
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <ShippedProductTable
              shippedOrders={displayShipped}
              onDetail={openShippedOrderDetail} // UIフックのアクション
            />
          </TabPanel>

          {products.length > 0 && tabValue === 0 && (
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
          {preparingOrders.length > 0 && tabValue === 1 && (
             <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(preparingOrders.length / rowsPerPage)}
                page={page} // UIフックの状態
                onChange={handlePageChange} // UIフックのアクション
                color="standard"
                shape="rounded"
              />
            </Box>
          )}
          {shippedOrders.length > 0 && tabValue === 2 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(shippedOrders.length / rowsPerPage)}
                page={page} // UIフックの状態
                onChange={handlePageChange} // UIフックのアクション
                color="standard"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      {tabValue === 0 && (
        <ProductDetailModal
          open={detailModalOpen} // UIフックの状態
          onClose={closeDetailModal} // UIフックのアクション
          product={selectedProduct} // UIフックの状態
          selectedImageIndex={selectedImageIndex} // UIフックの状態
          setSelectedImageIndex={setSelectedImageIndex} // UIフックのアクション
          onEditProduct={(productId) => { if (productId) handleEditProduct(productId); }}
        />
      )}
      {tabValue === 1 && (
        <OrderDetailModal
          open={detailModalOpen} // UIフックの状態
          onClose={closeDetailModal} // UIフックのアクション
          order={selectedOrder as Order} // UIフックの状態
          tabValue={tabValue} // UIフックの状態
          onShippingConfirm={openShippingConfirm} // UIフックのアクションを直接渡す
        />
      )}
      {tabValue === 2 && (
        <OrderDetailModal
          open={detailModalOpen} // UIフックの状態
          onClose={closeDetailModal} // UIフックのアクション
          order={selectedShipped as Order} // UIフックの状態
          tabValue={tabValue} // UIフックの状態
        />
      )}

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