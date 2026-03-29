import { createContext, useState, useCallback, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { useToast } from '../hooks/useToast' 
import shopService from '../services/shopService' // Make sure this path is correct

export const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const { user } = useContext(AuthContext)
  const { toast } = useToast()

  const [activeShop, setActiveShopState] = useState(() => {
    try {
      const saved = localStorage.getItem('activeShop')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // ✅ NEW: Sync with Database when the user logs in or refreshes the page
  useEffect(() => {
    const fetchPreference = async () => {
      // Only fetch for owners (cashiers have a fixed shop)
      if (user?.type === 'owner') {
        try {
          const res = await shopService.getActivePreference();
          const dbShop = res?.data?.data || res?.data;
          
          if (dbShop) {
            setActiveShopState(dbShop);
            localStorage.setItem('activeShop', JSON.stringify(dbShop));
          }
        } catch (error) {
          console.error("Could not fetch shop preference from database");
        }
      }
    };

    fetchPreference();
  }, [user]); 


  // ── Local Memory Select/Clear ────────────────────────────────
  const selectShop = useCallback((shop) => {
    setActiveShopState(shop)
    if (shop) {
      localStorage.setItem('activeShop', JSON.stringify(shop))
    } else {
      localStorage.removeItem('activeShop')
    }
  }, [])

  const clearShop = useCallback(() => {
    setActiveShopState(null)
    localStorage.removeItem('activeShop')
  }, [])


  // ✅ NEW: Unified Setter (Now calls the Backend!)
  const setActiveShop = useCallback(async (shop) => {
    if (shop) {
      // 1. Update UI Instantly
      selectShop(shop) 
      
      // 2. Tell the database so it remembers for next time
      try {
        await shopService.setActive(shop.shop_id)
      } catch (err) {
        toast.error("Failed to sync shop preference with server.")
      }
    } else {
      clearShop()
    }
  }, [selectShop, clearShop, toast])


  // ── Derive shopId from user type ─────────────────────────────
  const shopId =
    user?.type === 'cashier'
      ? user?.shop_id                  
      : activeShop?.shop_id ?? null    

  return (
    <ShopContext.Provider value={{
      activeShop,
      shopId,         
      selectShop,     
      clearShop,      
      setActiveShop,  
    }}>
      {children}
    </ShopContext.Provider>
  )
}