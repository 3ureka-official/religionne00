'use client'

import { Box, Typography, Tabs, Tab, Pagination } from '@mui/material'
import { useState } from 'react'
import { Order } from '@/firebase/orderService'
import { PreparingOrderTable } from '@/components/admin/products/PreparingOrderTable'
import { ShippedProductTable } from '@/components/admin/products/ShippedProductTable'
import { OrderDetailModal } from '@/components/admin/products/OrderDetailModal'
import { ShippingConfirmDialog } from '@/components/admin/products/ShippingConfirmDialog'
import { useAdminPageUI } from '@/hooks/admin/useAdminPageUI'
import { useOrderManagement } from '@/hooks/admin/useOrderManagement'

// タブパネルコンポーネント
function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
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

export default function AdminOrdersPage() {
  const [tabValue, setTabValue] = useState(0)
  const [page, setPage] = useState(1)
  const rowsPerPage = 20

  const [
    { 
      shippingConfirmOpen, 
      productToShip, 
      detailModalOpen, 
      selectedOrder, 
      selectedShipped,
    },
    {
      openShippingConfirm,
      closeShippingConfirm,
      openOrderDetail,
      openShippedOrderDetail,
      closeDetailModal,
    }
  ] = useAdminPageUI()

  // 注文管理フックを使用（tabValueを1または2に設定）
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
    searchTerm: '',
    page,
    rowsPerPage,
    tabValue: tabValue + 1 // 0 → 1（配送準備中）, 1 → 2（配送済み）
  })

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setPage(1)
  }

  const handlePageChange = (_event: unknown, value: number) => {
    setPage(value)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          注文管理
        </Typography>
      </Box>

      {/* タブ */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="order tabs">
          <Tab 
            label={`配送準備中  (${preparingOrders.length})`}
            sx={{ textTransform: 'none', fontWeight: tabValue === 0 ? 'bold' : 'normal' }} 
          />
          <Tab 
            label={`配送済み  (${shippedOrders.length})`}
            sx={{ textTransform: 'none', fontWeight: tabValue === 1 ? 'bold' : 'normal' }} 
          />
        </Tabs>
      </Box>

      {loadingOrders ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>読み込み中...</Typography>
        </Box>
      ) : errorOrders ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
          <Typography>{errorOrders}</Typography>
        </Box>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            <PreparingOrderTable
              orders={displayOrders}
              onDetail={openOrderDetail}
              onShippingConfirm={openShippingConfirm}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <ShippedProductTable
              shippedOrders={displayShipped}
              onDetail={openShippedOrderDetail}
            />
          </TabPanel>

          {/* ページネーション */}
          {tabValue === 0 && preparingOrders.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(preparingOrders.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="standard"
                shape="rounded"
              />
            </Box>
          )}
          
          {tabValue === 1 && shippedOrders.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(shippedOrders.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="standard"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      {/* モーダル */}
      <OrderDetailModal
        open={detailModalOpen}
        onClose={closeDetailModal}
        order={(tabValue === 0 ? selectedOrder : selectedShipped) as Order}
        tabValue={tabValue === 0 ? 1 : 2}
        onShippingConfirm={tabValue === 0 ? openShippingConfirm : undefined}
      />

      <ShippingConfirmDialog
        open={shippingConfirmOpen}
        onClose={closeShippingConfirm}
        onConfirm={() => productToShip && handleMarkAsShipped(productToShip, closeShippingConfirm)}
        productToShip={productToShip}
      />
    </Box>
  )
} 