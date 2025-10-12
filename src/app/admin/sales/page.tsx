'use client'

import { Box, Typography, CircularProgress, IconButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { getAllOrders, Order, OrderItem } from '@/firebase/orderService'
import { getAllProducts, Product } from '@/firebase/productService'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { SalesChart } from '@/features/admin/components/SalesChart';
import { SalesRanking } from '@/features/admin/components/SalesRanking';
import { TimeSeriesData, ProductRanking, CategoryRanking, RankingTab, RankingSort } from '@/types/sales';

// Chart.jsの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function AdminSalesPage() {
  const [loading, setLoading] = useState(true)
  const [rankingTab, setRankingTab] = useState<RankingTab>('products')
  const [rankingSort, setRankingSort] = useState<RankingSort>('salesWithoutShipping')
  const [includeShipping, setIncludeShipping] = useState(false)
  const [currentPeriod, setCurrentPeriod] = useState(new Date())
  
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [productRanking, setProductRanking] = useState<ProductRanking[]>([])
  const [categoryRanking, setCategoryRanking] = useState<CategoryRanking[]>([])
  
  // KPIサマリー
  const [totalSalesWithShipping, setTotalSalesWithShipping] = useState(0)
  const [totalSalesWithoutShipping, setTotalSalesWithoutShipping] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true)
        const [orders, products] = await Promise.all([
          getAllOrders(),
          getAllProducts()
        ])
        
        // 商品IDから商品情報へのマップを作成
        const productMap: { [key: string]: Product } = {}
        products.forEach(product => {
          if (product.id) {
            productMap[product.id] = product
          }
        })
        
        // 配送済みの注文のみ集計
        const shippedOrders = orders.filter(order => order.status === 'shipped')
        
        // 期間フィルタリング
        const filteredOrders = filterOrdersByPeriod(shippedOrders, currentPeriod)
        
        // 時系列データの作成
        const timeSeries = createTimeSeriesData(filteredOrders, currentPeriod)
        setTimeSeriesData(timeSeries)
        
        // 商品別ランキング
        const productRank = createProductRanking(filteredOrders, productMap)
        setProductRanking(productRank)
        
        // カテゴリ別ランキング
        const categoryRank = createCategoryRanking(filteredOrders, productMap)
        setCategoryRanking(categoryRank)
        
        // KPIサマリー
        const totalWithShipping = filteredOrders.reduce((sum, order) => sum + order.total, 0)
        const totalWithoutShipping = filteredOrders.reduce((sum, order) => {
          const itemTotal = order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)
          return sum + itemTotal
        }, 0)
        const totalOrderCount = filteredOrders.length
        const totalItemCount = filteredOrders.reduce((sum, order) => 
          sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
        
        setTotalSalesWithShipping(totalWithShipping)
        setTotalSalesWithoutShipping(totalWithoutShipping)
        setTotalOrders(totalOrderCount)
        setTotalItems(totalItemCount)
        
      } catch (error) {
        console.error('売上データの取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [currentPeriod])

  // 期間フィルタリング
  const filterOrdersByPeriod = (orders: Order[], period: Date): Order[] => {
    return orders.filter(order => {
      if (!order.createdAt) return false
      const orderDate = order.createdAt instanceof Date 
        ? order.createdAt 
        : order.createdAt.toDate()
      
      // 当月の注文のみ
      return orderDate.getFullYear() === period.getFullYear() && 
             orderDate.getMonth() === period.getMonth()
    })
  }

  // 時系列データ作成
  const createTimeSeriesData = (orders: Order[], period: Date): TimeSeriesData[] => {
    const salesByPeriod: { [key: string]: Order[] } = {}
    
    orders.forEach(order => {
      if (!order.createdAt) return
      const orderDate = order.createdAt instanceof Date 
        ? order.createdAt 
        : order.createdAt.toDate()
      
      const periodKey = `${orderDate.getFullYear()}/${String(orderDate.getMonth() + 1).padStart(2, '0')}/${String(orderDate.getDate()).padStart(2, '0')}`
      
      if (!salesByPeriod[periodKey]) {
        salesByPeriod[periodKey] = []
      }
      salesByPeriod[periodKey].push(order)
    })
    
    return Object.keys(salesByPeriod)
      .sort((a, b) => a.localeCompare(b))
      .map(period => {
        const periodOrders = salesByPeriod[period]
        const totalWithShipping = periodOrders.reduce((sum, order) => sum + order.total, 0)
        const totalWithoutShipping = periodOrders.reduce((sum, order) => {
          const itemTotal = order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)
          return sum + itemTotal
        }, 0)
        const totalItems = periodOrders.reduce((sum, order) => 
          sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
        const uniqueCustomers = new Set(periodOrders.map(order => order.email)).size
        
        return {
          date: period,
          orderCount: periodOrders.length,
          totalSalesWithShipping: totalWithShipping,
          totalSalesWithoutShipping: totalWithoutShipping,
          totalItems,
          uniqueCustomers
        }
      })
  }

  // 商品別ランキング作成
  const createProductRanking = (orders: Order[], productMap: { [key: string]: Product }): ProductRanking[] => {
    const productMap_data: { [key: string]: ProductRanking } = {}
    
    orders.forEach(order => {
      order.items.forEach((item: OrderItem) => {
        if (!productMap_data[item.productId]) {
          const product = productMap[item.productId]
          productMap_data[item.productId] = {
            productId: item.productId,
            productName: item.name,
            sku: product?.id,
            image: product?.images?.[0],
            orderCount: 0,
            totalItems: 0,
            totalSalesWithShipping: 0,
            totalSalesWithoutShipping: 0,
            avgPrice: 0
          }
        }
        
        productMap_data[item.productId].orderCount += 1
        productMap_data[item.productId].totalItems += item.quantity
        productMap_data[item.productId].totalSalesWithoutShipping += item.price * item.quantity
        
        // 送料込みの場合は注文の送料を按分
        const shippingPerItem = order.shippingFee / order.items.length
        productMap_data[item.productId].totalSalesWithShipping += (item.price * item.quantity) + shippingPerItem
      })
    })
    
    return Object.values(productMap_data).map(product => ({
      ...product,
      avgPrice: product.totalItems > 0 ? product.totalSalesWithoutShipping / product.totalItems : 0
    }))
  }

  // カテゴリ別ランキング作成
  const createCategoryRanking = (orders: Order[], productMap: { [key: string]: Product }): CategoryRanking[] => {
    const categoryMap: { [key: string]: CategoryRanking } = {}
    
    orders.forEach(order => {
      order.items.forEach((item: OrderItem) => {
        const product = productMap[item.productId]
        let category = 'その他'
        
        if (product && product.category) {
          if (Array.isArray(product.category)) {
            category = product.category.join(', ')
          }
        }
        
        if (!categoryMap[category]) {
          categoryMap[category] = {
            category,
            orderCount: 0,
            totalItems: 0,
            totalSalesWithShipping: 0,
            totalSalesWithoutShipping: 0,
            avgPrice: 0
          }
        }
        
        categoryMap[category].orderCount += 1
        categoryMap[category].totalItems += item.quantity
        categoryMap[category].totalSalesWithoutShipping += item.price * item.quantity
        
        // 送料込みの場合は注文の送料を按分
        const shippingPerItem = order.shippingFee / order.items.length
        categoryMap[category].totalSalesWithShipping += (item.price * item.quantity) + shippingPerItem
      })
    })
    
    return Object.values(categoryMap).map(category => ({
      ...category,
      avgPrice: category.totalItems > 0 ? category.totalSalesWithoutShipping / category.totalItems : 0
    }))
  }

  // 期間移動
  const movePeriod = (direction: 'prev' | 'next') => {
    const newPeriod = new Date(currentPeriod)
    newPeriod.setMonth(newPeriod.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentPeriod(newPeriod)
  }

  // ランキングソート
  const getSortedRanking = (): (ProductRanking | CategoryRanking)[] => {
    const data = rankingTab === 'products' ? productRanking : categoryRanking
    return [...data].sort((a, b) => {
      switch (rankingSort) {
        case 'salesWithShipping':
          return b.totalSalesWithShipping - a.totalSalesWithShipping
        case 'salesWithoutShipping':
          return b.totalSalesWithoutShipping - a.totalSalesWithoutShipping
        case 'items':
          return b.totalItems - a.totalItems
        case 'orders':
          return b.orderCount - a.orderCount
        case 'avgPrice':
          return b.avgPrice - a.avgPrice
        default:
          return 0
      }
    })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const avgOrderValue = totalOrders > 0 ? Math.round((includeShipping ? totalSalesWithShipping : totalSalesWithoutShipping) / totalOrders) : 0
  const avgItemsPerOrder = totalOrders > 0 ? (totalItems / totalOrders).toFixed(1) : '0.0'

  return (
    <Box>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          売上情報
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => movePeriod('prev')}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: 120, textAlign: 'center' }}>
            {`${currentPeriod.getFullYear()}年${currentPeriod.getMonth() + 1}月`}
          </Typography>
          <IconButton onClick={() => movePeriod('next')}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 売上・販売数グラフ */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mb: 4 }}>
        <SalesChart
          title="売上推移"
          data={timeSeriesData.map(d => includeShipping ? d.totalSalesWithShipping : d.totalSalesWithoutShipping)}
          labels={timeSeriesData.map(d => d.date)}
          yAxisTitle="売上金額（円）"
          color="rgba(25, 118, 210, 0.6)"
          headerStats={[
            { label: '総売上', value: `¥${(includeShipping ? totalSalesWithShipping : totalSalesWithoutShipping).toLocaleString()}` },
            { label: '平均注文単価', value: `¥${avgOrderValue.toLocaleString()}` }
          ]}
          showShippingToggle={true}
          includeShipping={includeShipping}
          onShippingToggle={setIncludeShipping}
        />
        <SalesChart
          title="販売数推移"
          data={timeSeriesData.map(d => d.totalItems)}
          labels={timeSeriesData.map(d => d.date)}
          yAxisTitle="個数"
          color="rgba(46, 125, 50, 0.6)"
          headerStats={[
            { label: '販売数', value: `${totalItems}個` },
            { label: '注文数', value: `${totalOrders}件` },
            { label: '平均購入個数', value: `${avgItemsPerOrder}個` }
          ]}
          secondaryData={{
            label: '注文数推移',
            data: timeSeriesData.map(d => d.orderCount),
            color: 'rgba(123, 31, 162, 0.6)'
          }}
        />
      </Box>

      {/* 商品別・カテゴリ別ランキング */}
      <SalesRanking
        rankingTab={rankingTab}
        setRankingTab={setRankingTab}
        getSortedRanking={getSortedRanking}
      />
    </Box>
  )
} 