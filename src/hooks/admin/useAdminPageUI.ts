import { useState } from 'react';
import { Product } from '@/firebase/productService';
import { Order } from '@/firebase/orderService';

export interface AdminPageUIState {
  searchTerm: string;
  selectedCategory: string;
  page: number;
  rowsPerPage: number;
  deleteDialogOpen: boolean;
  productToDelete: Product | null;
  shippingConfirmOpen: boolean;
  productToShip: Order | null;
  tabValue: number;
  detailModalOpen: boolean;
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  selectedShipped: Order | null;
  selectedImageIndex: number;
}

export interface AdminPageUIActions {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => void;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  openDeleteDialog: (product: Product) => void;
  closeDeleteDialog: () => void;
  openShippingConfirm: (product: Order) => void;
  closeShippingConfirm: () => void;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  openProductDetail: (product: Product) => void;
  openOrderDetail: (order: Order) => void;
  openShippedOrderDetail: (order: Order) => void;
  closeDetailModal: () => void;
  setSelectedImageIndex: (index: number) => void;
}

export const useAdminPageUI = (initialRowsPerPage: number = 10): [AdminPageUIState, AdminPageUIActions] => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const rowsPerPage = initialRowsPerPage; // 固定またはpropsで渡すように変更も可能
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [shippingConfirmOpen, setShippingConfirmOpen] = useState(false);
  const [productToShip, setProductToShip] = useState<Order | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedShipped, setSelectedShipped] = useState<Order | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // 検索時にページをリセット
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    setSelectedCategory(e.target.value as string);
    setPage(1); // カテゴリ変更時にページをリセット
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setProductToDelete(null);
    setDeleteDialogOpen(false);
  };

  const openShippingConfirm = (product: Order) => {
    setProductToShip(product);
    setShippingConfirmOpen(true);
  };

  const closeShippingConfirm = () => {
    setProductToShip(null);
    setShippingConfirmOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1);
    setSelectedCategory('');
    setSearchTerm('');
    closeDetailModal(); // タブ変更時に詳細モーダルを閉じる
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setSelectedOrder(null);
    setSelectedShipped(null);
    setDetailModalOpen(true);
    setSelectedImageIndex(0); 
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setSelectedProduct(null);
    setSelectedShipped(null);
    setDetailModalOpen(true);
    setSelectedImageIndex(0); 
  };

  const openShippedOrderDetail = (order: Order) => {
    setSelectedShipped(order);
    setSelectedProduct(null);
    setSelectedOrder(null);
    setDetailModalOpen(true);
    setSelectedImageIndex(0); 
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedProduct(null);
    setSelectedOrder(null);
    setSelectedShipped(null);
    setSelectedImageIndex(0);
  };

  const state: AdminPageUIState = {
    searchTerm,
    selectedCategory,
    page,
    rowsPerPage,
    deleteDialogOpen,
    productToDelete,
    shippingConfirmOpen,
    productToShip,
    tabValue,
    detailModalOpen,
    selectedProduct,
    selectedOrder,
    selectedShipped,
    selectedImageIndex,
  };

  const actions: AdminPageUIActions = {
    handleSearch,
    handleCategoryChange,
    handlePageChange,
    openDeleteDialog,
    closeDeleteDialog,
    openShippingConfirm,
    closeShippingConfirm,
    handleTabChange,
    openProductDetail,
    openOrderDetail,
    openShippedOrderDetail,
    closeDetailModal,
    setSelectedImageIndex,
  };

  return [state, actions];
}; 