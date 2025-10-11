import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { useEffect, useState } from 'react';
import { getAllOrders, Order } from '@/firebase/orderService';
import { getAllProducts, Product } from '@/firebase/productService';

interface SalesDetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  productId?: string;
  productName?: string;
  category?: string;
}

interface ChartData {
  date: string;
  sales: number;
  quantity: number;
  orderCount: number;
}

export const SalesDetailDialog = ({ open, onClose, title, productId, productName, category }: SalesDetailDialogProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(new Date());

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, productId, category, currentPeriod]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orders, products] = await Promise.all([
        getAllOrders(),
        getAllProducts()
      ]);
      
      // 商品IDから商品情報へのマップを作成
      const productMap: { [key: string]: Product } = {};
      products.forEach(product => {
        if (product.id) {
          productMap[product.id] = product;
        }
      });
      
      const shippedOrders = orders.filter(order => order.status === 'shipped');
      
      // 期間フィルタリング（当月のみ）
      const filteredOrders = shippedOrders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = order.createdAt instanceof Date 
          ? order.createdAt 
          : order.createdAt.toDate();
        
        return orderDate.getFullYear() === currentPeriod.getFullYear() && 
               orderDate.getMonth() === currentPeriod.getMonth();
      });
      
      // データを集計
      const salesByDate: { [key: string]: { sales: number; quantity: number; orderCount: number } } = {};
      
      filteredOrders.forEach(order => {
        if (!order.createdAt) return;
        
        const orderDate = order.createdAt instanceof Date 
          ? order.createdAt 
          : order.createdAt.toDate();
        const dateKey = `${orderDate.getFullYear()}/${String(orderDate.getMonth() + 1).padStart(2, '0')}/${String(orderDate.getDate()).padStart(2, '0')}`;
        
        order.items.forEach(item => {
          // 商品IDまたはカテゴリでフィルタリング
          const matchesProduct = productId ? item.productId === productId : true;
          
          // カテゴリマッチング（商品マップから取得）
          let matchesCategory = true;
          if (category && !productId) {
            const product = productMap[item.productId];
            if (product && product.category) {
              if (Array.isArray(product.category)) {
                matchesCategory = product.category.includes(category);
              } else {
                matchesCategory = product.category === category;
              }
            } else {
              matchesCategory = false;
            }
          }
          
          if (matchesProduct && matchesCategory) {
            if (!salesByDate[dateKey]) {
              salesByDate[dateKey] = { sales: 0, quantity: 0, orderCount: 0 };
            }
            salesByDate[dateKey].sales += item.price * item.quantity;
            salesByDate[dateKey].quantity += item.quantity;
            salesByDate[dateKey].orderCount += 1;
          }
        });
      });
      
      // チャートデータに変換
      const data = Object.keys(salesByDate)
        .sort((a, b) => a.localeCompare(b))
        .map(date => ({
          date,
          sales: salesByDate[date].sales,
          quantity: salesByDate[date].quantity,
          orderCount: salesByDate[date].orderCount
        }));
      
      setChartData(data);
      
      // 合計を計算
      const totals = data.reduce((acc, curr) => ({
        sales: acc.sales + curr.sales,
        quantity: acc.quantity + curr.quantity,
        orderCount: acc.orderCount + curr.orderCount
      }), { sales: 0, quantity: 0, orderCount: 0 });
      
      setTotalSales(totals.sales);
      setTotalQuantity(totals.quantity);
      setTotalOrders(totals.orderCount);
      
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const movePeriod = (direction: 'prev' | 'next') => {
    const newPeriod = new Date(currentPeriod);
    newPeriod.setMonth(newPeriod.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentPeriod(newPeriod);
  };

  const salesChartData = {
    labels: chartData.map(d => d.date),
    datasets: [
      {
        label: '売上',
        data: chartData.map(d => d.sales),
        borderColor: 'rgba(25, 118, 210, 0.6)',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const quantityChartData = {
    labels: chartData.map(d => d.date),
    datasets: [
      {
        label: '販売数',
        data: chartData.map(d => d.quantity),
        borderColor: 'rgba(46, 125, 50, 0.6)',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        tension: 0.4,
      },
      {
        label: '注文数',
        data: chartData.map(d => d.orderCount),
        borderColor: 'rgba(123, 31, 162, 0.6)',
        backgroundColor: 'rgba(123, 31, 162, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title} - 売上詳細
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => movePeriod('prev')} size="small">
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="body1" sx={{ minWidth: 100, textAlign: 'center' }}>
                {`${currentPeriod.getFullYear()}年${currentPeriod.getMonth() + 1}月`}
              </Typography>
              <IconButton onClick={() => movePeriod('next')} size="small">
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 8 }}>
            <CircularProgress size={48} />
            <Typography sx={{ mt: 2 }} color="text.secondary">
              データを読み込んでいます...
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* サマリー */}
            <Box sx={{ display: 'flex', gap: 4, mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">総売上</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>¥{totalSales.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">販売数</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{totalQuantity}個</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">注文数</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{totalOrders}件</Typography>
              </Box>
            </Box>

            {/* 売上グラフ */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>売上推移</Typography>
              <Box sx={{ height: 300 }}>
                <Line data={salesChartData} options={chartOptions} />
              </Box>
            </Box>

            {/* 販売数グラフ */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>販売数・注文数推移</Typography>
              <Box sx={{ height: 300 }}>
                <Line data={quantityChartData} options={chartOptions} />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
