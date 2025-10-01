import ProductDetailClient from './ProductDetailClient';
import { getProduct, getProductsByCategory } from '@/firebase/productService';
import { convertToProductDetailFormat, convertToMicroCMSFormat } from '@/lib/adapters';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  // Firebaseから商品詳細を取得
  const firebaseProduct = await getProduct(id);
  
  // 商品が見つからない場合は404ページを表示
  if (!firebaseProduct) {
    notFound();
  }
  
  // 商品詳細用のフォーマットに変換
  const transformedProduct = convertToProductDetailFormat(firebaseProduct);

  // 同じカテゴリの関連商品をFirebaseから取得
  const firebaseRelatedProducts = await getProductsByCategory(firebaseProduct.category);
  
  // Firebase ProductをMicroCMSProduct形式に変換
  const relatedProducts = firebaseRelatedProducts.map(convertToMicroCMSFormat);
  
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
      category: {
        id: product.category.id,
        category: product.category.category
      },
    }));

  return <ProductDetailClient product={transformedProduct} relatedProducts={filteredRelatedProducts} />;
}
