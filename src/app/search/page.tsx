import { searchProducts } from '@/firebase/productService';
import SearchResults from './SearchResults';
import { fetchCategories } from '@/lib/microcms';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  // searchParamsをawaitする
  const resolvedParams = await Promise.resolve(searchParams);
  const query = resolvedParams.q || '';
  
  // クエリが空の場合はSEO対策として商品を表示しない
  const products = query.trim() ? await searchProducts(query) : [];

  const categories = await fetchCategories();

  return <SearchResults query={query} products={products} categories={categories} />;
} 