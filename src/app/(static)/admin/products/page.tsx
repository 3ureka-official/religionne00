'use client'

import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Pagination, TextField, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, Grid, Divider } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Product, 
  getAllProducts, 
  deleteProduct, 
  updateProduct,
  SoldProduct,
  SoldProductStatus,
  getAllSoldProducts,
  getSoldProductsByStatus,
  updateSoldProductStatus
} from '@/firebase/productService'
import { fetchCategories } from '@/lib/microcms'
import { getAllOrders, Order, OrderItem } from '@/firebase/orderService'

// 商品詳細モーダルコンポーネント
interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  onEditProduct?: (productId: string | undefined) => void;
}

// 注文詳細モーダルコンポーネント
interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: any; // Order型に近い情報を含む
  tabValue: number; // 1: 配送準備中, 2: 配送済み
  onShippingConfirm?: (product: SoldProduct) => void;
}

// 出品中商品の詳細モーダル
const ProductDetailModal = ({
  open,
  onClose,
  product,
  selectedImageIndex,
  setSelectedImageIndex,
  onEditProduct
}: ProductDetailModalProps) => {
  if (!product) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          maxWidth: '900px',
          width: '100%',
          m: { xs: 2, sm: 3 },
          borderRadius: 1
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', pb: 2 }}>
        商品詳細
      </DialogTitle>
      <DialogContent sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {product && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 3,
              pt: 2
            }}
          >
            {/* 左側：商品画像 */}
            <Box sx={{ 
              width: { xs: '100%', sm: '30%' },
              flexShrink: 0 
            }}>
              <Box sx={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                position: 'relative', 
                bgcolor: '#f5f5f5', 
                border: '1px solid #eee', 
                borderRadius: 1, 
                overflow: 'hidden', 
                mb: 2,
                minHeight: 280
              }}>
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    sizes="(max-width: 600px) 100vw, 500px"
                    priority
                  />
                ) : (
                  <Box sx={{ width: '100%', height: '100%', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      画像なし
                    </Typography>
                  </Box>
                )}
              </Box>
              {product.images && product.images.length > 1 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {product.images.map((img, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        position: 'relative',
                        width: 64,
                        height: 64,
                        border: selectedImageIndex === idx ? '2px solid #1976d2' : '1px solid #eee',
                        borderRadius: 1,
                        overflow: 'hidden',
                        flex: '0 0 64px',
                        cursor: 'pointer',
                        boxShadow: selectedImageIndex === idx ? '0 0 0 2px #90caf9' : 'none',
                        transition: 'border 0.2s, box-shadow 0.2s',
                      }}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                        sizes="64px"
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            
            {/* 右側：情報エリア */}
            <Box sx={{ 
              width: { xs: '100%', sm: '70%' },
              flex: 1 
            }}>
              {/* 基本情報 */}
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                {product.name}
                {!product.isPublished && (
                  <Chip 
                    label="非公開" 
                    size="small" 
                    sx={{ ml: 1, bgcolor: '#ffebee', color: '#c62828' }} 
                  />
                )}
                {product.isRecommended && (
                  <Chip 
                    label="おすすめ商品" 
                    size="small" 
                    sx={{ ml: 1, bgcolor: '#e3f2fd', color: '#1976d2' }} 
                  />
                )}
              </Typography>
              <Box sx={{ my: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ¥{Number(product.price).toLocaleString()}
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Box sx={{ p: 1.5, backgroundColor: '#fafafa', borderRadius: 1, border: '1px solid #f0f0f0', flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>カテゴリ</Typography>
                  <Typography variant="body1">{product.category}</Typography>
                </Box>
              </Grid>
              <Divider sx={{ my: 3 }} />
              {/* サイズ・在庫情報 */}
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>サイズ・在庫</Typography>
              {product.sizeInventories && product.sizeInventories.length > 0 ? (
                <TableContainer sx={{ 
                  mb: 3, 
                  bgcolor: '#fafafa', 
                  borderRadius: 1, 
                  boxShadow: 'none', 
                  border: '1px solid #eee',
                  width: '100%'
                }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '50%', py: 1.5, px: 2 }}>サイズ</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '50%', py: 1.5, px: 2 }}>在庫</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.sizeInventories.map((item, idx) => (
                        <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ py: 1.5, px: 2 }}>{item.size}</TableCell>
                          <TableCell sx={{ py: 1.5, px: 2 }}>{item.stock}点</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  サイズ・在庫情報はありません
                </Typography>
              )}
              
              <Divider sx={{ my: 3 }} />
              {/* 商品説明 */}
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>商品説明</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {product.description || 'なし'}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              {/* 出品日 */}
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>出品日</Typography>
              <Typography variant="body1">
                {product.createdAt 
                  ? new Date(product.createdAt.seconds * 1000).toLocaleDateString() 
                  : '未設定'}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: { xs: 2, sm: 3 } }}>
        {onEditProduct && product.id && (
          <Button 
            onClick={() => onEditProduct(product.id)}
            sx={{ 
              bgcolor: 'black',
              color: 'white',
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          >
            編集する
          </Button>
        )}
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 注文詳細モーダル（配送準備中・配送済み商品）
const OrderDetailModal = ({
  open,
  onClose,
  order,
  tabValue,
  onShippingConfirm
}: OrderDetailModalProps) => {
  if (!order) return null;

  // モーダルタイトルを取得
  const getModalTitle = () => {
    if (tabValue === 1) return '注文詳細';
    if (tabValue === 2) return '配送済み商品詳細';
    return '詳細';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          maxWidth: '900px',
          width: '100%',
          m: { xs: 2, sm: 3 },
          borderRadius: 1
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', pb: 2 }}>
        {getModalTitle()}
      </DialogTitle>
      <DialogContent sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {order && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 3,
              pt: 2
            }}
          >
            
            
            {/* 右側：情報エリア */}
            <Box sx={{ 
              width: { xs: '100%', sm: '70%' },
              flex: 1 
            }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {order.name}
              </Typography>
              
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, mb: 2 }}>
                ¥{Number(order.price).toLocaleString()}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                お客様情報
              </Typography>
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">お名前</Typography>
                  <Typography variant="body1">{order.customerName || '未設定'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                  <Typography variant="body1">{order.customerEmail || '未設定'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">電話番号</Typography>
                  <Typography variant="body1">{order.phone || '未設定'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">お届け先</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {order && order.address ? (
                      <>
                        〒{order.address.postalCode || ''} <br />
                        {order.address.prefecture || ''} 
                        {order.address.city || ''} 
                        {order.address.line1 || ''} 
                        {order.address.line2 || ''}
                      </>
                    ) : order.shippingAddress || '未設定'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                注文内容
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">注文ID</Typography>
                  <Typography variant="body1">{order.id || '未設定'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">注文日</Typography>
                  <Typography variant="body1">
                    {order.orderDate 
                      ? new Date(order.orderDate.seconds * 1000).toLocaleDateString() 
                      : '未設定'}
                  </Typography>
                </Box>
                {tabValue === 2 && order.shippedDate && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">配送日</Typography>
                    <Typography variant="body1">
                      {new Date(order.shippedDate.seconds * 1000).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                {order.size && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">サイズ</Typography>
                    <Typography variant="body1">{order.size}</Typography>
                  </Box>
                )}
                {order.quantity && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">数量</Typography>
                    <Typography variant="body1">{order.quantity}点</Typography>
                  </Box>
                )}
                {/* 注文商品一覧 */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>注文商品</Typography>
                    <TableContainer sx={{ 
                      mb: 2, 
                      bgcolor: '#fafafa', 
                      borderRadius: 1, 
                      boxShadow: 'none', 
                      border: '1px solid #eee'
                    }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }}>商品画像</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }}>商品名</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }}>サイズ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }}>数量</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 2 }} align="right">金額</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.orderItems.map((item: any, idx: number) => (
                            <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell sx={{ py: 1.5, px: 2 }}>
                                {item.image &&
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    style={{ objectFit: 'cover', borderRadius: 4, aspectRatio: 1 }}
                                  />
                                }
                              </TableCell>
                              <TableCell sx={{ py: 1.5, px: 2 }}>{item.name}</TableCell>
                              <TableCell sx={{ py: 1.5, px: 2 }}>{item.size || '-'}</TableCell>
                              <TableCell sx={{ py: 1.5, px: 2 }}>{item.quantity}点</TableCell>
                              <TableCell sx={{ py: 1.5, px: 2 }} align="right">¥{Number(item.price).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell sx={{ py: 1.5, px: 2 }}></TableCell>
                            <TableCell sx={{ py: 1.5, px: 2 }}>合計金額</TableCell>
                            <TableCell sx={{ py: 1.5, px: 2 }}></TableCell>
                            <TableCell sx={{ py: 1.5, px: 2 }}></TableCell>
                            <TableCell sx={{ py: 1.5, px: 2 }} align="right">¥{Number(order.price).toLocaleString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" color="text.secondary">支払い方法</Typography>
                  <Typography variant="body1">{order.paymentMethod || '未設定'}</Typography>
                </Box>
              </Box>
              
              {order.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">備考</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {order.notes}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: { xs: 2, sm: 3 } }}>
        {tabValue === 1 && onShippingConfirm && (
          <Button 
            variant="contained"
            onClick={() => onShippingConfirm(order as unknown as SoldProduct)}
            sx={{ 
              bgcolor: 'black',
              color: 'white',
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          >
            配送済みにする
          </Button>
        )}
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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

// 型定義を修正
interface OrderDetailProduct {
  id: string;
  name: string;
  price: string | number;
  category?: string;
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
  orderDate?: any;
  shippedDate?: any;
  image?: string;
  size?: string;
  quantity?: number;
  status?: string;
  orderItems?: Array<{
    name: string;
    price: string | number;
    image?: string;
    size?: string;
    quantity: number;
  }>;
  notes?: string;
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([])
  const [preparingProducts, setPreparingProducts] = useState<SoldProduct[]>([])
  const [shippedProducts, setShippedProducts] = useState<SoldProduct[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [processingOrders, setProcessingOrders] = useState<Order[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [page, setPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [shippingConfirmOpen, setShippingConfirmOpen] = useState(false)
  const [productToShip, setProductToShip] = useState<SoldProduct | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const rowsPerPage = 10
  const [categories, setCategories] = useState<string[]>([])

  // カテゴリリスト
  const categoriesList = [
    'トップス',
    'ボトムス',
    'アウター',
    'シューズ',
    'アクセサリー',
    'バッグ',
    'その他'
  ]

  // 商品データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 公開中の商品を取得
        const productsData = await getAllProducts(false)
        setProducts(productsData)
        
        // 販売済み商品を取得
        const soldProductsData = await getAllSoldProducts()
        setSoldProducts(soldProductsData)
        
        // 配送準備中の商品を取得
        const preparingData = await getSoldProductsByStatus(SoldProductStatus.PREPARING)
        setPreparingProducts(preparingData)
        
        // 配送済みの商品を取得
        const shippedData = await getSoldProductsByStatus(SoldProductStatus.SHIPPED)
        setShippedProducts(shippedData)
        
        // 注文データを取得
        const ordersData = await getAllOrders()
        setOrders(ordersData)
        
        // 配送準備中（processing）の注文を抽出
        const processingOrdersData = ordersData.filter(order => order.status === 'processing')
        setProcessingOrders(processingOrdersData)
        
        // 初期表示はすべての商品（非表示状態も含む）
        setFilteredProducts(productsData)
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
        // エラー時はデフォルトのカテゴリリストを使用
        setCategories(categoriesList);
      }
    };
    
    getCategoriesData();
  }, []);

  // フィルタを適用する関数（タブ・検索・カテゴリーのフィルタリング）
  const applyFilters = useCallback(() => {
    if (loading) return;
    
    // 現在のタブに応じた商品リストの取得
    let currentTabProducts: any[] = [];
    switch (tabValue) {
      case 0: // 出品中
        // すべての商品を表示（非表示状態も含む）
        currentTabProducts = products;
        break;
      case 1: // 配送準備中
        currentTabProducts = processingOrders;
        break;
      case 2: // 配送済み
        currentTabProducts = shippedProducts;
        break;
      default:
        currentTabProducts = products;
    }

    // データがない場合は早期リターン
    if (!currentTabProducts || currentTabProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }

    // 商品名で検索
    let filtered = [...currentTabProducts]; // 配列のコピーを作成
    if (searchTerm) {
      filtered = filtered.filter(product => {
        // タブに応じて検索対象を変更
        if (tabValue === 0) {
          return product.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (tabValue === 1) {
          // 配送準備中は注文データなので、顧客名やメールアドレスで検索
          return (
            product.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.items && product.items.some((item: OrderItem) => 
              item.name?.toLowerCase().includes(searchTerm.toLowerCase())
            ))
          );
        } else {
          return product.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
    }

    // カテゴリでフィルタリング（タブ0の場合のみ）
    if (selectedCategory && tabValue === 0) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
    setPage(1); // フィルタリング時にページをリセット
  }, [tabValue, searchTerm, selectedCategory, products, processingOrders, shippedProducts, loading]);

  // タブ、検索語、カテゴリが変更されたときにフィルタを適用
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // タブの変更ハンドラ
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1); // タブ切り替え時にページをリセット
    setSelectedCategory(''); // カテゴリもリセット
    setSearchTerm(''); // 検索語もリセット
  };

  // 検索機能
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // カテゴリ選択の変更ハンドラ
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    setSelectedCategory(e.target.value as string);
  };

  // ページネーション
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  // 表示/非表示切り替え
  const togglePublishStatus = async (product: Product) => {
    if (!product.id) return

    try {
      const updatedProduct = await updateProduct(product.id, {
        isPublished: !product.isPublished
      })
      
      // 商品リストを更新
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === product.id ? { ...p, isPublished: !p.isPublished } : p
        )
      )
      
      // 現在のタブが出品中の場合は、フィルタリングされた商品も更新
      if (tabValue === 0) {
        setFilteredProducts(prevFiltered => {
          return prevFiltered.map((p: any) =>
            p.id === product.id ? { ...p, isPublished: !p.isPublished } : p
          );
        });
      }
    } catch (err) {
      console.error('商品の更新に失敗しました:', err)
      setError('商品の更新に失敗しました')
    }
  }

  // 削除ダイアログを開く
  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  // 削除ダイアログを閉じる
  const closeDeleteDialog = () => {
    setProductToDelete(null)
    setDeleteDialogOpen(false)
  }

  // 商品削除
  const handleDeleteProduct = async () => {
    if (!productToDelete?.id) return

    try {
      await deleteProduct(productToDelete.id)
      
      // 商品リストを更新
      setProducts(prevProducts =>
        prevProducts.filter(p => p.id !== productToDelete.id)
      )
      
      setFilteredProducts(prevProducts =>
        prevProducts.filter(p => p.id !== productToDelete.id)
      )
      
      closeDeleteDialog()
    } catch (err) {
      console.error('商品の削除に失敗しました:', err)
      setError('商品の削除に失敗しました')
      closeDeleteDialog()
    }
  }

  // 新規商品追加ページへ遷移
  const handleAddProduct = () => {
    router.push('/admin/products/new')
  }

  // 編集ページへ遷移
  const handleEditProduct = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`)
  }

  // 配送済みステータスに更新
  const handleMarkAsShipped = async (soldProduct: SoldProduct) => {
    if (!soldProduct.id) return;
    
    try {
      await updateSoldProductStatus(soldProduct.id, SoldProductStatus.SHIPPED);
      
      // 状態を更新
      const updatedPreparingProducts = preparingProducts.filter(p => p.id !== soldProduct.id);
      setPreparingProducts(updatedPreparingProducts);
      
      const updatedShippedProducts = [...shippedProducts, {...soldProduct, status: SoldProductStatus.SHIPPED}];
      setShippedProducts(updatedShippedProducts);
      
      // 現在のタブが配送準備中なら表示も更新
      if (tabValue === 1) {
        setFilteredProducts(updatedPreparingProducts);
      }

      // 確認モーダルを閉じる
      closeShippingConfirm();
      
    } catch (err) {
      console.error('ステータス更新に失敗しました:', err);
      setError('ステータス更新に失敗しました');
    }
  };

  // 配送確認モーダルを開く
  const handleShippingConfirm = (product: SoldProduct) => {
    setProductToShip(product);
    setShippingConfirmOpen(true);
  };

  // 配送確認モーダルを閉じる
  const closeShippingConfirm = () => {
    setProductToShip(null);
    setShippingConfirmOpen(false);
  };

  // 商品詳細モーダルを開く
  const openDetailModal = (product: Product) => {
    setSelectedProduct(product)
    setDetailModalOpen(true)
  }

  // 商品詳細モーダルを閉じる
  const closeDetailModal = () => {
    setSelectedProduct(null)
    setDetailModalOpen(false)
    setSelectedImageIndex(0)
  }

  // 配送準備中の商品詳細モーダルを開く
  const openOrderDetail = (order: Order) => {
    if (!order) return;
    
    // 注文データを商品形式に変換してモーダルに表示
    const orderAsProduct: any = {
      id: order.id || '不明',
      name: `注文 #${order.id || '不明'}`,
      price: order.total || 0,
      customerName: order.customer || '不明',
      customerEmail: order.email || '不明',
      phone: order.phone || '',
      address: order.address || {},
      orderDate: order.createdAt || null,
      orderItems: Array.isArray(order.items) ? order.items : [],
      status: order.status || 'processing',
      paymentMethod: order.paymentMethod || '不明'
    };
    
    setSelectedProduct(orderAsProduct as unknown as Product);
    setDetailModalOpen(true);
  };

  // リコメンド（おすすめ）状態の切り替え
  const toggleRecommended = async (product: Product) => {
    if (!product.id) return;

    try {
      const isRecommended = product.isRecommended || false;
      await updateProduct(product.id, {
        isRecommended: !isRecommended
      });
      
      // 商品リストを更新
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === product.id ? { ...p, isRecommended: !isRecommended } : p
        )
      );
      
      // 現在のタブが出品中の場合は、フィルタリングされた商品も更新
      if (tabValue === 0) {
        setFilteredProducts(prevFiltered => {
          return prevFiltered.map((p: any) =>
            p.id === product.id ? { ...p, isRecommended: !isRecommended } : p
          );
        });
      }
    } catch (err) {
      console.error('商品の更新に失敗しました:', err);
      setError('おすすめ設定の更新に失敗しました');
    }
  };

  // 配送済み商品の詳細モーダルを開く
  const openShippedOrderDetail = (soldProduct: SoldProduct) => {
    setSelectedProduct(soldProduct as unknown as Product) // 型キャストで対応
    setDetailModalOpen(true)
  }

  // 表示する商品データ
  const displayProducts = filteredProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  // モーダルが閉じられた時にインデックスをリセット
  const handleCloseDetailModal = () => {
    setSelectedImageIndex(0);
    closeDetailModal();
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
      <Box sx={{ display: 'flex', mt: 3, mb: 3, gap: 2 }}>
        <TextField
          placeholder="商品名で検索"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
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
            value={selectedCategory}
            onChange={handleCategoryChange}
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

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>読み込み中...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            {/* 出品中の商品テーブル */}
            <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 0, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>画像</TableCell>
                    <TableCell>商品名</TableCell>
                    <TableCell>価格</TableCell>
                    <TableCell>カテゴリ</TableCell>
                    <TableCell>出品日</TableCell>
                    <TableCell>ステータス</TableCell>
                    <TableCell>おすすめ</TableCell>
                    <TableCell align="center">アクション</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayProducts.length > 0 ? (
                    displayProducts.map((product: any) => (
                      <TableRow 
                        key={product.id} 
                        sx={{ 
                          '&:hover': { bgcolor: '#f9f9f9' },
                          ...(product.isPublished ? {} : { bgcolor: 'rgba(255, 235, 238, 0.1)' }),
                          cursor: 'pointer'
                        }}
                        onClick={() => openShippedOrderDetail(product)}
                      >
                        <TableCell sx={{ width: 80 }}>
                          {(() => {
                            const images = product.images || [];
                            return (
                              <Box sx={{ width: '100%', aspectRatio: '1/1', position: 'relative', bgcolor: '#f5f5f5', border: '1px solid #eee', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                                {images.length > 0 ? (
                                  <Image
                                    src={images[selectedImageIndex]}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'cover', borderRadius: 4 }}
                                    sizes="(max-width: 600px) 100vw, 300px"
                                  />
                                ) : (
                                  <Box sx={{ width: '100%', height: '100%', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                      画像なし
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            );
                          })()}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </TableCell>
                        <TableCell>¥{Number(product.price).toLocaleString()}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          {product.createdAt ? new Date(product.createdAt.seconds * 1000).toLocaleDateString() : '未設定'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.isPublished ? '公開中' : '非公開'}
                            size="small"
                            sx={{ 
                              bgcolor: product.isPublished ? '#e8f5e9' : '#ffebee',
                              color: product.isPublished ? '#2e7d32' : '#c62828',
                              fontWeight: 'medium',
                              borderRadius: '4px'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.isRecommended ? 'おすすめ' : '-'}
                            size="small"
                            sx={{ 
                              bgcolor: product.isRecommended ? '#e3f2fd' : '#f5f5f5',
                              color: product.isRecommended ? '#1976d2' : 'text.secondary',
                              fontWeight: 'medium',
                              borderRadius: '4px'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); togglePublishStatus(product); }}
                              sx={{ color: 'text.primary' }}
                              title={product.isPublished ? '非公開にする' : '公開する'}
                            >
                              {product.isPublished ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); toggleRecommended(product); }}
                              sx={{ color: product.isRecommended ? '#1976d2' : 'text.secondary' }}
                              title={product.isRecommended ? 'おすすめから外す' : 'おすすめに設定'}
                            >
                              {product.isRecommended ? (
                                <CheckCircleIcon fontSize="small" />
                              ) : (
                                <CheckCircleIcon fontSize="small" />
                              )}
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); product.id && handleEditProduct(product.id); }}
                              sx={{ color: 'text.primary' }}
                              title="編集"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); openDeleteDialog(product); }}
                              sx={{ color: 'text.primary' }}
                              title="削除"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography variant="body2" sx={{ py: 5 }}>
                          商品がありません
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {/* 配送準備中の商品テーブル */}
            <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 0, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>注文ID</TableCell>
                    <TableCell>顧客名</TableCell>
                    <TableCell>メールアドレス</TableCell>
                    <TableCell>注文日</TableCell>
                    <TableCell>商品数</TableCell>
                    <TableCell>合計金額</TableCell>
                    <TableCell>支払方法</TableCell>
                    <TableCell align="center">アクション</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayProducts.length > 0 ? (
                    displayProducts.map((order: Order) => (
                      <TableRow key={order.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                        <TableCell>{order?.id || '不明'}</TableCell>
                        <TableCell>{order?.customer || '不明'}</TableCell>
                        <TableCell>{order?.email || '不明'}</TableCell>
                        <TableCell>
                          {order?.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : '未設定'}
                        </TableCell>
                        <TableCell>{order?.items && Array.isArray(order.items) ? order.items.length : 0}点</TableCell>
                        <TableCell>¥{order?.total ? Number(order.total).toLocaleString() : 0}</TableCell>
                        <TableCell>{order?.paymentMethod || '不明'}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => order && openOrderDetail(order)}
                              sx={{ 
                                borderColor: 'black',
                                color: 'black',
                                borderRadius: 0,
                                fontSize: '0.7rem',
                                minWidth: 'auto',
                                '&:hover': {
                                  borderColor: 'black',
                                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                                }
                              }}
                            >
                              詳細
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" sx={{ py: 5 }}>
                          配送準備中の注文はありません
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {/* 配送済みの商品テーブル */}
            <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 0, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>画像</TableCell>
                    <TableCell>商品名</TableCell>
                    <TableCell>価格</TableCell>
                    <TableCell>お客様</TableCell>
                    <TableCell>注文日</TableCell>
                    <TableCell>配送日</TableCell>
                    <TableCell>ステータス</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayProducts.length > 0 ? (
                    displayProducts.map((soldProduct: any) => (
                      <TableRow 
                        key={soldProduct.id} 
                        sx={{ '&:hover': { bgcolor: '#f9f9f9' }, cursor: 'pointer' }}
                        onClick={() => openShippedOrderDetail(soldProduct)}
                      >
                        <TableCell sx={{ width: 80 }}>
                          <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                            {soldProduct.image ? (
                              <Image
                                src={soldProduct.image}
                                alt={soldProduct.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <Box sx={{ width: 60, height: 60, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                  No Image
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{soldProduct.name}</TableCell>
                        <TableCell>¥{Number(soldProduct.price).toLocaleString()}</TableCell>
                        <TableCell>{soldProduct.customerName}</TableCell>
                        <TableCell>
                          {soldProduct.orderDate ? new Date(soldProduct.orderDate.seconds * 1000).toLocaleDateString() : '未設定'}
                        </TableCell>
                        <TableCell>
                          {soldProduct.shippedDate ? new Date(soldProduct.shippedDate.seconds * 1000).toLocaleDateString() : '未設定'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="配送済み"
                            size="small"
                            sx={{ 
                              bgcolor: '#e8f5e9',
                              color: '#2e7d32',
                              fontWeight: 'medium',
                              borderRadius: '4px'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" sx={{ py: 5 }}>
                          配送済みの商品はありません
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* ページネーション */}
          {filteredProducts.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(filteredProducts.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="standard"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      {/* タブの内容に基づいて適切なモーダルを表示 */}
      {tabValue === 0 ? (
        <ProductDetailModal
          open={detailModalOpen}
          onClose={handleCloseDetailModal}
          product={selectedProduct}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          onEditProduct={(productId) => productId && handleEditProduct(productId)}
        />
      ) : (
        <OrderDetailModal
          open={detailModalOpen}
          onClose={handleCloseDetailModal}
          order={selectedProduct}
          tabValue={tabValue}
          onShippingConfirm={handleShippingConfirm}
        />
      )}

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="xs">
        <DialogTitle>商品の削除</DialogTitle>
        <DialogContent>
          <Typography>
            本当に「{productToDelete?.name}」を削除しますか？
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} sx={{ color: 'text.primary' }}>
            キャンセル
          </Button>
          <Button
            onClick={handleDeleteProduct}
            sx={{ color: 'error.main' }}
            autoFocus
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>

      {/* 配送確認ダイアログ */}
      <Dialog open={shippingConfirmOpen} onClose={closeShippingConfirm} maxWidth="xs">
        <DialogTitle>配送済みに変更</DialogTitle>
        <DialogContent>
          <Typography>
            「{productToShip?.name}」を配送済みに変更しますか？
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            この操作により、注文ステータスが「配送済み」に更新されます。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeShippingConfirm} sx={{ color: 'text.primary' }}>
            キャンセル
          </Button>
          <Button
            onClick={() => productToShip && handleMarkAsShipped(productToShip)}
            sx={{ 
              bgcolor: 'black',
              color: 'white',
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
            autoFocus
          >
            配送済みにする
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
} 