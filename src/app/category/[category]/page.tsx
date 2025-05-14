import { Suspense } from 'react'
import ClientCategoryPage from './ClientCategoryPage'

// サーバーコンポーネントのメインページ
export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category
  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1)
  
  // 商品データ（実際のアプリではAPIから取得）
  const products = Array(9).fill(null).map((_, index) => ({
    id: index + 1,
    name: '商品名',
    price: '2,000',
    category: category,
    image: '/images/product/camera-icon-1.svg'
  }))

  const categoryDescription = category === 'original' 
    ? 'オリジナル商品のコレクションです。当店だけで購入できる限定アイテムを多数取り揃えています。' 
    : 'さまざまなスタイルとデザインをご用意しております。ぜひお気に入りの商品をお探しください。'

  // クライアントコンポーネントにデータを渡す
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientCategoryPage 
        category={category}
        displayCategory={displayCategory}
        products={products}
        categoryDescription={categoryDescription}
      />
    </Suspense>
  )
} 