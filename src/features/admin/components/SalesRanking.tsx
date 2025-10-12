import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, Button } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { SalesDetailDialog } from './SalesDetailDialog';
import { ProductRanking, CategoryRanking } from '@/types/sales';

interface SalesRankingProps {
  rankingTab: 'products' | 'categories';
  setRankingTab: (tab: 'products' | 'categories') => void;
  getSortedRanking: () => (ProductRanking | CategoryRanking)[];
}

export const SalesRanking = ({ rankingTab, setRankingTab, getSortedRanking }: SalesRankingProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ productId?: string; productName?: string; category?: string } | null>(null);

  const handleDetailClick = (item: ProductRanking | CategoryRanking) => {
    if (rankingTab === 'products') {
      const product = item as ProductRanking;
      setSelectedItem({ productId: product.productId, productName: product.productName });
    } else {
      const category = item as CategoryRanking;
      setSelectedItem({ category: category.category });
    }
    setDialogOpen(true);
  };

  return (
    <>
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={rankingTab} onChange={(_, newValue) => setRankingTab(newValue)} sx={{ px: 2 }}>
          <Tab label="商品別" value="products" />
          <Tab label="カテゴリ別" value="categories" />
        </Tabs>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>順位</TableCell>
              {rankingTab === 'products' && <TableCell sx={{ fontWeight: 'bold' }}>画像</TableCell>}
              <TableCell sx={{ fontWeight: 'bold' }}>
                {rankingTab === 'products' ? '商品名' : 'カテゴリ'}
              </TableCell>
              {rankingTab === 'products' && <TableCell sx={{ fontWeight: 'bold' }}>商品ID</TableCell>}
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>販売数</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>売上（送料抜き）</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>詳細</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedRanking().map((item, index) => (
              <TableRow key={rankingTab === 'products' 
                ? (item as ProductRanking).productId 
                : (item as CategoryRanking).category}>
                <TableCell>{index + 1}</TableCell>
                {rankingTab === 'products' && (
                  <TableCell>
                    <Box sx={{ width: 40, height: 40, borderRadius: 1, overflow: 'hidden' }}>
                      <Image
                        src={(item as ProductRanking).image || '/images/logo.png'}
                        alt={(item as ProductRanking).productName}
                        width={40}
                        height={40}
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  </TableCell>
                )}
                <TableCell>
                  {rankingTab === 'products' 
                    ? (item as ProductRanking).productName 
                    : (item as CategoryRanking).category}
                </TableCell>
                {rankingTab === 'products' && <TableCell>{(item as ProductRanking).sku}</TableCell>}
                <TableCell align="right">{item.totalItems}個</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  ¥{item.totalSalesWithoutShipping.toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleDetailClick(item)}
                  >
                    詳細を見る
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

    <SalesDetailDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      title={selectedItem?.productName || selectedItem?.category || ''}
      productId={selectedItem?.productId}
      category={selectedItem?.category}
    />
    </>
  );
};


