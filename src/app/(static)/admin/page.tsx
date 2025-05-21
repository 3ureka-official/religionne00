'use client'

import { Box, Typography, Paper, Divider } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState, useEffect } from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import GroupIcon from '@mui/icons-material/Group'
import Link from 'next/link'
import { getRecentOrders, getOrderCountsByStatus, getTotalSales, Order } from '@/firebase/orderService'
import { getAllProducts } from '@/firebase/productService'
import { formatDate } from '@/utils/formatters'

// Gridの型問題を回避するための型アサーション
const GridItem = Grid as any;

// 日本語の注文ステータス変換
const statusMap: Record<string, string> = {
  'pending': '受付済み',
  'processing': '準備中',
  'shipped': '発送済み',
  'delivered': '完了',
  'cancelled': 'キャンセル'
};

// ダッシュボードデータの型定義
interface DashboardData {
  totalOrders: number;
  totalProducts: number;
  totalSales: number;
  totalCustomers: number;
  recentOrders: Order[];
}

export default function AdminDashboardPage() {
  // ダッシュボードのデータ状態
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalOrders: 0,
    totalProducts: 0,
    totalSales: 0,
    totalCustomers: 0,
    recentOrders: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データの取得
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 注文関連のデータを取得
        const orderCounts = await getOrderCountsByStatus();
        const recentOrders = await getRecentOrders(4);
        const salesTotal = await getTotalSales();
        
        // 商品データを取得
        const products = await getAllProducts();
        
        // 顧客数の集計（実際にはユーザーコレクションから取得すべき）
        // ここでは仮に注文の一意なお客様数を集計
        const uniqueCustomers = new Set();
        recentOrders.forEach(order => {
          uniqueCustomers.add(order.email);
        });
        
        setDashboardData({
          totalOrders: orderCounts.total,
          totalProducts: products.length,
          totalSales: salesTotal,
          totalCustomers: uniqueCustomers.size,
          recentOrders: recentOrders
        });
        
      } catch (err) {
        console.error('ダッシュボードデータの取得に失敗しました:', err);
        setError('データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        ダッシュボード
      </Typography>
      
      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4 }}>データを読み込み中...</Typography>
      ) : error ? (
        <Typography sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>{error}</Typography>
      ) : (
        <>
          {/* サマリーカード */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <GridItem item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ShoppingCartIcon sx={{ color: 'black', mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    注文数
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {dashboardData.totalOrders}
                </Typography>
              </Paper>
            </GridItem>
            <GridItem item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InventoryIcon sx={{ color: 'black', mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    商品数
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {dashboardData.totalProducts}
                </Typography>
              </Paper>
            </GridItem>
            <GridItem item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MonetizationOnIcon sx={{ color: 'black', mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    売上高
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ¥{dashboardData.totalSales.toLocaleString()}
                </Typography>
              </Paper>
            </GridItem>
            <GridItem item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, borderRadius: 0, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <GroupIcon sx={{ color: 'black', mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    顧客数
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {dashboardData.totalCustomers}
                </Typography>
              </Paper>
            </GridItem>
          </Grid>
          
          {/* 最近の注文 */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                最近の注文
              </Typography>
              <Link href="/admin/orders" style={{ textDecoration: 'none' }}>
                <Typography 
                  sx={{ 
                    color: 'black', 
                    fontSize: '0.875rem',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  すべて表示
                </Typography>
              </Link>
            </Box>
            
            <Paper sx={{ borderRadius: 0, border: '1px solid #e0e0e0' }}>
              <Box sx={{ 
                display: 'flex', 
                bgcolor: '#f5f5f5', 
                p: 2 
              }}>
                <Typography sx={{ flex: 1, fontWeight: 'medium', fontSize: '0.875rem' }}>
                  注文番号
                </Typography>
                <Typography sx={{ flex: 1, fontWeight: 'medium', fontSize: '0.875rem' }}>
                  顧客名
                </Typography>
                <Typography sx={{ flex: 1, fontWeight: 'medium', fontSize: '0.875rem' }}>
                  日付
                </Typography>
                <Typography sx={{ flex: 1, fontWeight: 'medium', fontSize: '0.875rem', textAlign: 'right' }}>
                  金額
                </Typography>
                <Typography sx={{ flex: 1, fontWeight: 'medium', fontSize: '0.875rem', textAlign: 'center' }}>
                  ステータス
                </Typography>
              </Box>
              
              <Divider />
              
              {dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order, index) => (
                  <Box key={order.id}>
                    <Box sx={{ 
                      display: 'flex', 
                      p: 2,
                      alignItems: 'center',
                      '&:hover': { bgcolor: '#f9f9f9' }
                    }}>
                      <Typography sx={{ flex: 1, fontSize: '0.875rem' }}>
                        {order.id}
                      </Typography>
                      <Typography sx={{ flex: 1, fontSize: '0.875rem' }}>
                        {order.customer}
                      </Typography>
                      <Typography sx={{ flex: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                        {order.date ? formatDate(order.date.toDate()) : '不明'}
                      </Typography>
                      <Typography sx={{ flex: 1, fontSize: '0.875rem', textAlign: 'right', fontWeight: 'medium' }}>
                        ¥{order.total.toLocaleString()}
                      </Typography>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Box sx={{ 
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 'medium',
                          bgcolor: 
                            order.status === 'shipped' ? '#e3f2fd' : 
                            order.status === 'processing' ? '#fff8e1' : 
                            order.status === 'delivered' ? '#e8f5e9' :
                            order.status === 'cancelled' ? '#ffebee' : '#f5f5f5',
                          color:
                            order.status === 'shipped' ? '#1565c0' : 
                            order.status === 'processing' ? '#f57c00' : 
                            order.status === 'delivered' ? '#2e7d32' :
                            order.status === 'cancelled' ? '#c62828' : 'text.primary',
                        }}>
                          {statusMap[order.status] || order.status}
                        </Box>
                      </Box>
                    </Box>
                    {index < dashboardData.recentOrders.length - 1 && <Divider />}
                  </Box>
                ))
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    注文データがありません
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </>
      )}
    </Box>
  )
} 