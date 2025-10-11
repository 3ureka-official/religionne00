export interface TimeSeriesData {
  date: string
  orderCount: number
  totalSalesWithShipping: number
  totalSalesWithoutShipping: number
  totalItems: number
  uniqueCustomers: number
}

export interface ProductRanking {
  productId: string
  productName: string
  sku?: string
  image?: string
  orderCount: number
  totalItems: number
  totalSalesWithShipping: number
  totalSalesWithoutShipping: number
  avgPrice: number
}

export interface CategoryRanking {
  category: string
  orderCount: number
  totalItems: number
  totalSalesWithShipping: number
  totalSalesWithoutShipping: number
  avgPrice: number
}

export type RankingTab = 'products' | 'categories'
export type RankingSort = 'salesWithShipping' | 'salesWithoutShipping' | 'items' | 'orders' | 'avgPrice'

