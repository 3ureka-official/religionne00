import ProductDetailClient from './ProductDetailClient';
import { getProduct, getProductsByCategory } from '@/firebase/productService';
import { convertToProductDetailFormat, convertToMicroCMSFormat } from '@/lib/adapters';
import { notFound } from 'next/navigation';
import { fetchCategories } from '@/lib/microcms';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  // Firebaseから商品詳細を取得
  const firebaseProduct = await getProduct(id);
  
  // 商品が見つからない場合は404ページを表示
  if (!firebaseProduct) {
    notFound();
  }

  const categories = await fetchCategories();
  
  // 商品詳細用のフォーマットに変換
  const transformedProduct = convertToProductDetailFormat(firebaseProduct);
  
  // 各カテゴリーの商品を取得して結合
  const relatedProductsPromises = firebaseProduct.category.map(category => {
    return getProductsByCategory(category);
  });
  
  const relatedProductsArrays = await Promise.all(relatedProductsPromises);
  const allRelatedProducts = relatedProductsArrays.flat();
  
  // 重複を削除（同じIDの商品は1つだけ）
  const uniqueRelatedProducts = Array.from(
    new Map(allRelatedProducts.map(product => [product.id, product])).values()
  );
  
  // Firebase ProductをMicroCMSProduct形式に変換
  const relatedProducts = uniqueRelatedProducts.map(convertToMicroCMSFormat);
  
  // 現在の商品を除外し、最大4件に制限
  const filteredRelatedProducts = relatedProducts
    .filter(relatedProduct => relatedProduct.id !== firebaseProduct.id)
    .slice(0, 4)
    .map(product => ({
      id: product.id,
      name: product.name,
      stripe_price_id: product.stripe_price_id,
      images: product.images.map(image => ({
        url: image.url,
        width: image.width ?? 0,
        height: image.height ?? 0,
        alt: image.alt ?? ''
      })),
      category: product.category.map((category: {id: string, category: string}) => ({
        id: category.id,
        category: category.category
      })),
    }));

  return <ProductDetailClient product={transformedProduct} relatedProducts={filteredRelatedProducts} categories={categories} />;
}
