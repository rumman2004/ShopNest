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
import { Trash2, Receipt, Store, ShoppingCart } from 'lucide-react'

export default function PosTerminal() {
  const { shopId } = useShop()
  const { addItem, clearCart, totals } = useCart()

  const [search, setSearch]           = useState('')
  const [lastSale, setLastSale]       = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)
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
    clearCart()
  }

  // --- No Shop Selected Guard ---
  if (!shopId) {
    return (
      <div className="animate-fade-in py-10">
        <EmptyState
          icon={<Store size={56} className="text-[#84BABF]" />}
          title="No Shop Selected"
          message="Please select a shop to use the POS terminal."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 h-[calc(100vh-7rem)] animate-fade-in pb-4">

      {/* --- Left: Products Panel --- */}
      <div className="flex-1 flex flex-col gap-5 min-w-0 bg-[#06363D]/40 border border-[#84BABF]/10 rounded-[2rem] p-4 sm:p-6 backdrop-blur-xl shadow-lg shadow-[#06363D]/30">
        
        {/* Top Search Bar */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search products by name or SKU..."
              className="w-full shadow-inner"
            />
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#085558]/40 border border-[#006F73]/50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="text-xs font-bold text-[#84BABF] uppercase tracking-wider whitespace-nowrap">
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
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col gap-5 shrink-0 min-h-0">

        {/* Cart Items Area */}
        <div className="bg-[#085558]/20 border border-[#84BABF]/20 backdrop-blur-xl rounded-[2rem] p-5 sm:p-6 shadow-lg flex flex-col flex-1 min-h-[300px] lg:min-h-0 overflow-hidden">
          
          {/* Cart Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#84BABF]/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#006F73]/20 rounded-xl border border-[#006F73]/30">
                <ShoppingCart size={18} className="text-[#84BABF]" />
              </div>
              <h3 className="text-lg font-bold text-[#E0EDE9] tracking-wide">
                Current Order
              </h3>
              <span className="px-2.5 py-0.5 bg-[#006F73]/30 text-[#E0EDE9] text-xs font-bold rounded-lg border border-[#006F73]/50 shadow-inner">
                {totals.itemCount}
              </span>
            </div>
            
            {totals.itemCount > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all border border-transparent hover:border-rose-500/20 focus:outline-none"
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
                <ShoppingCart size={48} className="text-[#006F73]/50 mb-4" />
                <p className="text-sm font-semibold text-[#84BABF]">Your cart is empty</p>
                <p className="text-xs text-[#006F73] mt-1.5 max-w-[200px]">Scan or tap products on the left to add them to the order.</p>
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
              className="w-full border-[#006F73]/50 text-[#84BABF] hover:text-[#E0EDE9] hover:bg-[#006F73]/20 transition-all shadow-md py-3"
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