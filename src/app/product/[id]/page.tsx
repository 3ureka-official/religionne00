import { fetchProductById } from '@/lib/microcms';
import ProductDetailClient from './ProductDetailClient';

export default async function Page({ params }: { params: { id: string } }) {
  const product = await fetchProductById(params.id);

  // MicroCMSから取得した画像データをProductImage型に変換
  const transformedProduct = {
    ...product,
    images: product.images.map((image, index) => ({
      id: index + 1,
      src: image.url,
      width: image.width,
      height: image.height,
      alt: image.alt,
    })),
    // サイズデータを変換
    sizes: product.sizes.map((size) => ({
      fieldId: size.fieldId,
      size: size.size,
      stock: size.stock,
    })),
    // カテゴリデータを変換
    category: {
      id: product.category.id,
      name: product.category.category,
    },
  };

  return <ProductDetailClient product={transformedProduct} />;
}
