'use client'

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Pagination, TextField, InputAdornment, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'

// 注文データの型定義
interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  payment: string;
  items: number;
}

export default function AdminOrdersPage() {
  // 仮の注文データ（実際にはAPIから取得）
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-2023-001', customer: '山田 太郎', date: '2023-06-10', total: 12800, status: '発送済み', payment: 'クレジットカード', items: 2 },
    { id: 'ORD-2023-002', customer: '佐藤 花子', date: '2023-06-09', total: 24500, status: '準備中', payment: '代引き', items: 3 },
    { id: 'ORD-2023-003', customer: '鈴木 一郎', date: '2023-06-08', total: 18600, status: '完了', payment: 'PayPay', items: 1 },
    { id: 'ORD-2023-004', customer: '田中 誠', date: '2023-06-06', total: 32000, status: '発送済み', payment: 'クレジットカード', items: 4 },
    { id: 'ORD-2023-005', customer: '中村 明', date: '2023-06-05', total: 8900, status: '準備中', payment: '代引き', items: 1 },
    { id: 'ORD-2023-006', customer: '加藤 千尋', date: '2023-06-04', total: 15400, status: '完了', payment: 'クレジットカード', items: 2 },
    { id: 'ORD-2023-007', customer: '伊藤 大輔', date: '2023-06-03', total: 21800, status: '発送済み', payment: 'PayPay', items: 3 },
    { id: 'ORD-2023-008', customer: '高橋 幸子', date: '2023-06-02', total: 9600, status: '完了', payment: 'クレジットカード', items: 1 },
    { id: 'ORD-2023-009', customer: '渡辺 拓也', date: '2023-06-01', total: 28700, status: '発送済み', payment: '代引き', items: 3 },
    { id: 'ORD-2023-010', customer: '松本 奈美', date: '2023-05-31', total: 13500, status: '完了', payment: 'クレジットカード', items: 2 },
  ])
  
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const rowsPerPage = 5

  // 検索機能
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    if (value === '') {
      setFilteredOrders(orders)
    } else {
      const filtered = orders.filter(order => 
        order.id.toLowerCase().includes(value.toLowerCase()) ||
        order.customer.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredOrders(filtered)
    }
    
    setPage(1)
  }

  // ページネーション
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  // 表示する注文データ
  const displayOrders = filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  // 注文ステータスに応じたカラー設定
  const getStatusColor = (status: string) => {
    switch (status) {
      case '発送済み':
        return { bg: '#e3f2fd', color: '#1565c0', icon: <LocalShippingIcon fontSize="small" /> }
      case '準備中':
        return { bg: '#fff8e1', color: '#f57c00', icon: undefined }
      case '完了':
        return { bg: '#e8f5e9', color: '#2e7d32', icon: <CheckCircleIcon fontSize="small" /> }
      default:
        return { bg: '#f5f5f5', color: 'text.primary', icon: undefined }
    }
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        注文管理
      </Typography>
      
      {/* 検索フィルター */}
      <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
        <TextField
          placeholder="注文ID・顧客名を検索"
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
        <Button 
          variant="outlined" 
          startIcon={<FilterListIcon />}
          sx={{ 
            borderRadius: 0,
            borderColor: 'black',
            color: 'black',
            '&:hover': {
              borderColor: 'black',
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          フィルター
        </Button>
      </Box>
      
      {/* 注文テーブル */}
      <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 0, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>注文ID</TableCell>
              <TableCell>顧客名</TableCell>
              <TableCell>日付</TableCell>
              <TableCell>商品数</TableCell>
              <TableCell>決済方法</TableCell>
              <TableCell align="right">合計金額</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell align="center">詳細</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayOrders.map((order) => {
              const statusStyle = getStatusColor(order.status)
              
              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}点</TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell align="right">¥{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      icon={statusStyle.icon}
                      label={order.status}
                      size="small"
                      sx={{ 
                        bgcolor: statusStyle.bg, 
                        color: statusStyle.color,
                        fontWeight: 'medium',
                        borderRadius: '4px',
                        '& .MuiChip-icon': { 
                          ml: '4px',
                          mr: '-4px'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      startIcon={<VisibilityIcon />}
                      size="small"
                      sx={{ 
                        minWidth: 'auto',
                        color: 'black',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        textTransform: 'none'
                      }}
                    >
                      詳細
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* ページネーション */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={Math.ceil(filteredOrders.length / rowsPerPage)} 
          page={page}
          onChange={handlePageChange}
          color="standard"
          shape="rounded"
        />
      </Box>
      
      {/* 注文詳細モーダル（今回は省略） */}
    </Box>
  )
} 