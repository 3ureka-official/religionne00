import { searchProducts } from '@/lib/microcms';
import SearchResults from './SearchResults';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  // searchParamsをawaitする
  const resolvedParams = await Promise.resolve(searchParams);
  const query = resolvedParams.q || '';
  
  // クエリが空の場合はSEO対策として商品を表示しない
  const products = query.trim() ? await searchProducts(query) : [];

  return <SearchResults query={query} products={products} />;
} 