import { useState }    from 'react'
import { useShop }     from '../../hooks/useShop'
import { useFetch }    from '../../hooks/useFetch'
import { useDebounce } from '../../hooks/useDebounce'
import productService  from '../../services/productService'
import Table           from '../../components/ui/Table'
import SearchBar       from '../../components/ui/SearchBar'
import Badge           from '../../components/ui/Badge'
import EmptyState      from '../../components/ui/EmptyState'
import StatCard        from '../../components/ui/StatCard'
import { formatCurrency } from '../../utils/formatters'
import { Package, AlertTriangle, CheckCircle, XCircle, Store } from 'lucide-react'

export default function StockCheck() {
  const { shopId } = useShop()
  const [search, setSearch] = useState('')
  const dSearch = useDebounce(search, 300)

  const { data, loading } = useFetch(
    () => shopId
      ? productService.getAll(shopId, { search: dSearch })
      : Promise.resolve(null),
    [shopId, dSearch]
  )

  const products = data?.data?.products ?? []

  const columns = [
    {
      header: 'Product',
      key:    'product_name',
      render: (v) => (
        <span className="font-semibold text-[#E0EDE9]">{v}</span>
      ),
    },
    {
      header: 'Category',
      key:    'category_name',
      render: (v) => (
        <span className="text-[#84BABF] text-sm">{v || '—'}</span>
      ),
    },
    {
      header: 'Price',
      key:    'price',
      render: (v) => (
        <span className="font-bold text-[#E0EDE9]">{formatCurrency(v)}</span>
      ),
    },
    {
      header: 'Stock Qty',
      key:    'stock_quantity',
      render: (v) => {
        const qty = parseInt(v, 10)
        return (
          <span className={`font-mono font-bold text-base ${
            qty === 0  ? 'text-rose-400'     :
            qty <= 10  ? 'text-amber-400'    :
                         'text-emerald-400'
          }`}>
            {qty}
          </span>
        )
      },
    },
    {
      header: 'Status',
      key:    'stock_quantity',
      render: (v) => {
        const qty = parseInt(v, 10)
        return qty === 0 ? <Badge variant="red">Out of Stock</Badge>   :
               qty <= 10 ? <Badge variant="yellow">Low Stock</Badge>   :
                           <Badge variant="green">In Stock</Badge>
      },
    },
  ]

  // Group counts for inventory health summary
  const outOfStock = products.filter((p) => parseInt(p.stock_quantity, 10) === 0).length
  const lowStock   = products.filter((p) => {
    const q = parseInt(p.stock_quantity, 10)
    return q > 0 && q <= 10
  }).length
  const inStock    = products.filter((p) => parseInt(p.stock_quantity, 10) > 10).length

  const stats = [
    {
      title: 'Out of Stock',
      value: outOfStock,
      icon:  <XCircle size={20} />,
      color: 'rose',
    },
    {
      title: 'Low Stock',
      value: lowStock,
      icon:  <AlertTriangle size={20} />,
      color: 'amber',
    },
    {
      title: 'In Stock',
      value: inStock,
      icon:  <CheckCircle size={20} />,
      color: 'emerald',
    },
    {
      title: 'Total Products',
      value: products.length,
      icon:  <Package size={20} />,
      color: 'teal',
    },
  ]

  // --- No Shop Selected Guard ---
  if (!shopId) {
    return (
      <div className="animate-fade-in py-10">
        <EmptyState
          icon={<Store size={56} className="text-[#84BABF]" />}
          title="No Shop Selected"
          message="Please select a shop to view inventory stock levels."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-8">
      
      {/* --- Premium Glass Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between bg-[#0B2B26]/20 border border-[#84BABF]/20 p-6 sm:px-8 rounded-[2rem] backdrop-blur-xl shadow-lg shadow-[#06363D]/50">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E0EDE9] tracking-tight flex items-center gap-3">
            <Package size={28} className="text-[#84BABF] hidden sm:block" />
            Inventory Stock Check
          </h2>
          <div className="text-[#84BABF] text-sm sm:text-base font-medium mt-2 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              {products.length} Total Products
            </span>
            {outOfStock > 0 && (
              <span className="flex items-center gap-1.5 text-rose-400">
                • {outOfStock} Out of Stock
              </span>
            )}
            {lowStock > 0 && (
              <span className="flex items-center gap-1.5 text-amber-400">
                • {lowStock} Low Stock
              </span>
            )}
          </div>
        </div>
        
        <div className="w-full sm:w-72 shrink-0">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
            className="w-full shadow-md"
          />
        </div>
      </div>

      {/* --- Inventory Health Stats --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} loading={loading} />
        ))}
      </div>

      {/* --- Products Table Section --- */}
      <div className="bg-[#085558]/10 border border-[#84BABF]/20 rounded-[2rem] p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-[#06363D]/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#006F73]/20 rounded-xl border border-[#006F73]/30">
            <Package size={20} className="text-[#84BABF]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#E0EDE9] tracking-wide">Product Inventory</h3>
            <p className="text-sm text-[#84BABF] mt-0.5">Real-time stock levels and availability status.</p>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={products}
          loading={loading}
          emptyMessage="No products found in inventory."
        />
      </div>
      
    </div>
  )
}