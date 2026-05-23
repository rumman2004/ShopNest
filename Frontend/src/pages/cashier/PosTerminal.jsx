import { useState }      from 'react'
import { useCart }       from '../../hooks/useCart'
import { useShop }       from '../../hooks/useShop'
import { useFetch }      from '../../hooks/useFetch'
import { useDebounce }   from '../../hooks/useDebounce'
import productService    from '../../services/productService'
import ProductList       from '../../features/products/ProductList'
import CartSummary       from '../../features/sales/CartSummary'
import CheckoutPanel     from '../../features/sales/CheckoutPanel'
import ReceiptPreview    from '../../features/sales/ReceiptPreview'
import SearchBar         from '../../components/ui/SearchBar'
import Button            from '../../components/ui/Button'
import Modal             from '../../components/ui/Modal'
import EmptyState        from '../../components/ui/EmptyState'
import { Trash2, Receipt, Store, ShoppingCart, Search, PanelRightOpen } from 'lucide-react'

export default function PosTerminal() {
  const { shopId } = useShop()
  const { addItem, clearCart, totals } = useCart()

  const [search, setSearch]           = useState('')
  const [lastSale, setLastSale]       = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [cartOpen, setCartOpen]       = useState(false)
  const dSearch = useDebounce(search, 300)

  const { data, loading } = useFetch(
    () => shopId
      ? productService.getAll(shopId, { search: dSearch })
      : Promise.resolve(null),
    [shopId, dSearch]
  )

  const products = data?.data?.products ?? []

  const handleSuccess = (sale) => {
    setLastSale(sale)
    setShowReceipt(true)
    setCartOpen(false)
    clearCart()
  }

  // --- No Shop Selected Guard ---
  if (!shopId) {
    return (
      <div className="animate-fade-in py-10">
        <EmptyState
          icon={<Store size={56} className="text-[#004643]" />}
          title="No Shop Selected"
          message="Please select a shop to use the POS terminal."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 min-h-[calc(100vh-7rem)] lg:h-[calc(100vh-7rem)] animate-fade-in pb-24 lg:pb-4">

      {/* --- Left: Products Panel --- */}
      <div className="flex-1 flex flex-col gap-5 min-w-0 glass-card p-4 sm:p-6">
        
        {/* Top Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <div className="flex-1 min-w-0">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search products by name or SKU..."
              className="w-full shadow-inner"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#e5f2f1] border border-[#c8ddda] rounded-lg">
            <Search size={15} className="text-[#004643]" />
            <span className="text-xs font-bold text-[#004643] uppercase tracking-wider whitespace-nowrap">
              {products.length} Items
            </span>
          </div>
        </div>

        {/* Scrollable Product List */}
        <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2 pb-2">
          <ProductList
            products={products}
            loading={loading}
            onAddToCart={addItem}
          />
        </div>
      </div>

      {/* --- Right: Cart & Checkout Panel --- */}
      <div className={`
        fixed inset-x-0 bottom-0 z-40 lg:static lg:z-auto
        w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-5 shrink-0 min-h-0
        bg-[#F0EDE5] lg:bg-transparent p-3 lg:p-0 border-t border-[#d9d4c8] lg:border-0
        ${cartOpen ? 'max-h-[88vh]' : 'max-h-[92px] lg:max-h-none'} overflow-hidden transition-all duration-300
      `}>

        {/* Cart Items Area */}
        <div className="glass-card p-5 sm:p-6 flex flex-col flex-1 min-h-[300px] lg:min-h-0 overflow-hidden">
          
          {/* Cart Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#ebe6dc] shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e5f2f1] rounded-lg border border-[#c8ddda]">
                <ShoppingCart size={18} className="text-[#004643]" />
              </div>
              <h3 className="text-lg font-bold text-[#182321] tracking-wide">
                Current Order
              </h3>
              <span className="px-2.5 py-0.5 bg-[#004643] text-white text-xs font-bold rounded-lg border border-[#004643]">
                {totals.itemCount}
              </span>
            </div>
            <button
              onClick={() => setCartOpen((value) => !value)}
              className="lg:hidden p-2 rounded-lg text-[#004643] hover:bg-[#e5f2f1]"
              aria-label="Toggle cart"
            >
              <PanelRightOpen size={18} />
            </button>
            
            {totals.itemCount > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-200 focus:outline-none"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>

          {/* Cart Items Scroll Container */}
          <div className="flex-1 overflow-y-auto no-scrollbar pr-1 relative">
            {totals.itemCount === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 opacity-70">
                <ShoppingCart size={48} className="text-[#c8ddda] mb-4" />
                <p className="text-sm font-semibold text-[#697773]">Your cart is empty</p>
                <p className="text-xs text-[#697773] mt-1.5 max-w-[220px]">Scan or tap products to add them to the order.</p>
              </div>
            ) : (
              <CartSummary />
            )}
          </div>
        </div>

        {/* Checkout Component Area */}
        <div className="shrink-0 flex flex-col gap-3">
          <CheckoutPanel onSuccess={handleSuccess} />

          {/* View Last Receipt Button */}
          {lastSale && (
            <Button
              variant="outline"
              icon={<Receipt size={16} />}
              onClick={() => setShowReceipt(true)}
              className="w-full py-3"
            >
              View Last Receipt
            </Button>
          )}
        </div>

      </div>

      {/* --- Receipt Modal --- */}
      <Modal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        title="Transaction Receipt"
        size="sm"
      >
        <div className="p-2">
          <ReceiptPreview sale={lastSale} />
        </div>
      </Modal>

    </div>
  )
}
