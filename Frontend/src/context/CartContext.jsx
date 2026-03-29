import { createContext, useState, useCallback, useMemo } from 'react'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = useCallback((product) => {
    setItems((prev) => {
      // ✅ FIX: use product_id instead of id
      const existing = prev.find((i) => i.product_id === product.product_id)
      if (existing) {
        if (existing.quantity >= product.stock_quantity) return prev
        return prev.map((i) =>
          i.product_id === product.product_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [
        ...prev,
        {
          ...product,
          // ✅ FIX: coerce price to number — backend returns it as a string
          price:    parseFloat(product.price) || 0,
          quantity: 1,
        },
      ]
    })
  }, [])

  // ✅ FIX: use product_id instead of id
  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) { removeItem(productId); return }
    setItems((prev) =>
      // ✅ FIX: use product_id instead of id
      prev.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
    )
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, i) => {
      // ✅ FIX: use price (already coerced to number on addItem), not selling_price
      const price    = parseFloat(i.price) || 0
      const quantity = parseInt(i.quantity) || 0
      return acc + price * quantity
    }, 0)
    return {
      subtotal,
      total:     subtotal,
      itemCount: items.reduce((a, i) => a + (parseInt(i.quantity) || 0), 0),
    }
  }, [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totals }}>
      {children}
    </CartContext.Provider>
  )
}