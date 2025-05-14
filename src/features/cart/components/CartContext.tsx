'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// カート内の商品アイテムの型定義
export interface CartItem {
  id: string
  name: string
  price: string
  image: string
  quantity: number
  size?: string
}

// カートコンテキストの型定義
interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

// デフォルト値を持つカートコンテキストを作成
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0
})

// カートプロバイダーのpropsの型定義
interface CartProviderProps {
  children: ReactNode
}

// カートプロバイダーコンポーネント
export function CartProvider({ children }: CartProviderProps) {
  // ローカルストレージからカートアイテムを取得するか、空の配列を初期値とする
  const [items, setItems] = useState<CartItem[]>([])

  // コンポーネントがマウントされたときにローカルストレージからカートアイテムを読み込む
  useEffect(() => {
    const storedItems = localStorage.getItem('cart')
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems))
      } catch (error) {
        console.error('カートの読み込みに失敗しました:', error)
        setItems([])
      }
    }
  }, [])

  // カートアイテムが変更されたときにローカルストレージに保存する
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items])

  // カートに商品を追加する関数
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // 同じIDの商品が既にカートにあるか確認
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id && i.size === item.size)
      
      if (existingItemIndex !== -1) {
        // 既存のアイテムがある場合は数量を増やす
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        }
        return updatedItems
      } else {
        // 新しいアイテムを追加
        return [...prevItems, item]
      }
    })
  }

  // カートから商品を削除する関数
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
    
    // カートが空になった場合はローカルストレージからも削除
    if (items.length === 1) {
      localStorage.removeItem('cart')
    }
  }

  // 商品の数量を更新する関数
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  // カートを空にする関数
  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
  }

  // 合計金額を計算する関数
  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/,/g, ''))
      return total + (priceNum * item.quantity)
    }, 0)
  }

  // カート内のアイテム総数を計算する関数
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  // コンテキスト値の作成
  const contextValue: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

// カートコンテキストを使用するためのカスタムフック
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 