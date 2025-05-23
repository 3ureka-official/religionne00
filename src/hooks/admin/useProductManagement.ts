import { useState, useEffect, useMemo } from 'react';
import { Product, getAllProducts, deleteProduct, updateProduct } from '@/firebase/productService';

export interface ProductManagementState {
  products: Product[];
  displayProducts: Product[];
  loadingProducts: boolean;
  errorProducts: string | null;
}

export interface ProductManagementActions {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  togglePublishStatus: (product: Product) => Promise<void>;
  handleDeleteProduct: (productToDelete: Product | null, callback?: () => void) => Promise<void>;
  toggleRecommended: (product: Product) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

interface UseProductManagementProps {
  searchTerm: string;
  selectedCategory: string;
  page: number;
  rowsPerPage: number;
  tabValue: number; // displayProducts の計算に必要
}

export const useProductManagement = ({
  searchTerm,
  selectedCategory,
  page,
  rowsPerPage,
  tabValue
}: UseProductManagementProps): [ProductManagementState, ProductManagementActions] => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const productsData = await getAllProducts(false);
      setProducts(productsData);
      setErrorProducts(null);
    } catch (err) {
      console.error('商品データの取得に失敗しました:', err);
      setErrorProducts('商品データの取得に失敗しました');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const displayProducts = useMemo(() => {
    if (tabValue !== 0) return [];
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(product => product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    return filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [products, searchTerm, selectedCategory, page, rowsPerPage, tabValue]);

  const togglePublishStatus = async (product: Product) => {
    if (!product.id) return;
    try {
      await updateProduct(product.id, { isPublished: !product.isPublished });
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === product.id ? { ...p, isPublished: !p.isPublished } : p
        )
      );
    } catch (err) {
      console.error('商品の公開状態の更新に失敗しました:', err);
      setErrorProducts('商品の公開状態の更新に失敗しました');
    }
  };

  const handleDeleteProduct = async (productToDelete: Product | null, callback?: () => void) => {
    if (!productToDelete?.id) return;
    try {
      await deleteProduct(productToDelete.id);
      setProducts(prevProducts =>
        prevProducts.filter(p => p.id !== productToDelete.id)
      );
      if (callback) callback();
    } catch (err) {
      console.error('商品の削除に失敗しました:', err);
      setErrorProducts('商品の削除に失敗しました');
      if (callback) callback(); // エラー時もダイアログを閉じるなど
    }
  };

  const toggleRecommended = async (product: Product) => {
    if (!product.id) return;
    try {
      const isRecommended = product.isRecommended || false;
      await updateProduct(product.id, {
        isRecommended: !isRecommended
      });
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === product.id ? { ...p, isRecommended: !isRecommended } : p
        )
      );
    } catch (err) {
      console.error('商品のおすすめ状態の更新に失敗しました:', err);
      setErrorProducts('商品のおすすめ状態の更新に失敗しました');
    }
  };

  const state: ProductManagementState = {
    products,
    displayProducts,
    loadingProducts,
    errorProducts,
  };

  const actions: ProductManagementActions = {
    setProducts,
    togglePublishStatus,
    handleDeleteProduct,
    toggleRecommended,
    fetchProducts,
  };

  return [state, actions];
}; 