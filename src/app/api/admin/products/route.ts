import { NextRequest, NextResponse } from 'next/server';
import { createProductWithStripe } from '@/firebase/productService';
import { Product } from '@/firebase/productService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 商品データの取得
    const name = formData.get('name') as string;
    const description = formData.get('description') as string || '';
    const link = formData.get('link') as string || '';
    const price = Number(formData.get('price'));
    const categoryJson = formData.get('category') as string;
    const category = categoryJson ? JSON.parse(categoryJson) : [];
    const isPublished = formData.get('isPublished') === 'true';
    const sizeInventoriesJson = formData.get('sizeInventories') as string;
    const sizeInventories = sizeInventoriesJson ? JSON.parse(sizeInventoriesJson) : [];
    
    // 画像ファイルの取得
    const imageFiles: File[] = [];
    const imageFilesData = formData.getAll('images') as File[];
    for (const file of imageFilesData) {
      if (file instanceof File && file.size > 0) {
        imageFiles.push(file);
      }
    }
    
    // 商品データの準備
    const productData: Omit<Product, 'id' | 'images' | 'stripe_product_id' | 'stripe_price_id' | 'createdAt' | 'updatedAt'> = {
      name,
      description,
      link,
      price,
      category,
      isPublished,
      sizeInventories: sizeInventories
        .filter((item: { size: string; stock: number }) => item.size !== '')
        .map((item: { size: string; stock: number }) => ({
          size: item.size,
          stock: Number(item.stock) || 0
        }))
    };
    
    // 商品を作成
    const createdProduct = await createProductWithStripe(productData, imageFiles);
    
    return NextResponse.json({ 
      success: true, 
      product: createdProduct 
    });
  } catch (error) {
    console.error('商品作成エラー:', error);
    const errorMessage = error instanceof Error ? error.message : '商品の作成に失敗しました';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

