import { fetchCategories } from '@/lib/microcms';
import ClientCategoryPage from './ClientCategoryPage';
import { getProductsByCategory } from '@/firebase/productService';
import { convertToMicroCMSFormat } from '@/lib/adapters';

// 同期的なカテゴリの静的パラメータ生成
// export async function generateMetadata({ params }: PageProps) {
//   const categoryId = params.category;
//   return {
//     title: `${categoryId} | カテゴリ`,
//   };
// }

// export async function generateStaticParams() {
//   const categories = await fetchCategories();
//   return categories.map((category) => ({
//     category: category.id,
//   }));
// }

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const categoryId = (await params).category;

  // カテゴリ一覧を取得してカテゴリ名を取得
  const categories = await fetchCategories();
  const matchedCategory = categories.find((cat) => cat.id === categoryId);
  const displayCategory = matchedCategory ? matchedCategory.category : 'Unknown Category';

  // カテゴリに一致する商品をFirebaseから取得
  const firebaseProducts = await getProductsByCategory(displayCategory);
  
  // Firebase ProductをMicroCMSProduct形式に変換
  const products = firebaseProducts.map(convertToMicroCMSFormat);

  const categoryDescription =
    categoryId === 'original'
      ? 'オリジナル商品のコレクションです。当店だけで購入できる限定アイテムを多数取り揃えています。'
      : 'さまざまなスタイルとデザインをご用意しております。ぜひお気に入りの商品をお探しください。';

  return (
    <ClientCategoryPage
      displayCategory={displayCategory}
      products={products}
      categoryDescription={categoryDescription}
      categories={categories}
    />
  );
}
