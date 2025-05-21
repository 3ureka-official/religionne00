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
  fixCartItemIds: () => void
}

// デフォルト値を持つカートコンテキストを作成
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0,
  fixCartItemIds: () => {}
})

// カートプロバイダーのpropsの型定義
interface CartProviderProps {
  children: ReactNode
}

// カートプロバイダーコンポーネント
export function CartProvider({ children }: CartProviderProps) {
  // ローカルストレージからカートアイテムを取得するか、空の配列を初期値とする
  const [items, setItems] = useState<CartItem[]>([])

  // カート内の商品IDがprice_idの場合にIDを修正する関数
  const fixCartItemIds = () => {
    // ローカルストレージからカートを取得
    const storedItems = localStorage.getItem('cart')
    if (!storedItems) return

    try {
      const cartItems = JSON.parse(storedItems) as CartItem[]
      let needsUpdate = false

      // カート内の各アイテムをチェック
      const updatedItems = cartItems.map(item => {
        // IDが価格（数値）かどうかを確認
        // 価格IDは通常数字のみかカンマを含む数字
        if (!isNaN(Number(item.id.replace(/,/g, '')))) {
          needsUpdate = true
          
          // ローカルストレージから商品情報を取得
          const productInfo = localStorage.getItem(`product_${item.name}`)
          let productId = '';
          
          // 保存された商品情報があれば使用し、なければ擬似IDを生成
          if (productInfo) {
            try {
              const info = JSON.parse(productInfo)
              productId = info.id
            } catch (e) {
              console.error('商品情報の解析に失敗:', e)
            }
          }
          
          // もし保存された商品IDが見つからない場合は擬似IDを生成
          if (!productId) {
            productId = `product-${item.name.toLowerCase().replace(/\s+/g, '-')}`
          }
          
          return {
            ...item,
            id: productId
          }
        }
        return item
      })

      if (needsUpdate) {
        localStorage.setItem('cart', JSON.stringify(updatedItems))
        setItems(updatedItems)
      } else {
        setItems(cartItems)
      }
    } catch (error) {
      console.error('カートの修正に失敗しました:', error)
    }
  }

  // コンポーネントがマウントされたときにローカルストレージからカートアイテムを読み込む
  useEffect(() => {
    // カートのIDを修正する
    fixCartItemIds()
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
    getTotalItems,
    fixCartItemIds
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