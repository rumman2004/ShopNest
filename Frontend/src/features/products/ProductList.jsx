import ProductCard from './ProductCard'
import EmptyState  from '../../components/ui/EmptyState'
import { Package } from 'lucide-react'

// ─── Premium Skeleton Loader ─────────────────────────────────────
function SkeletonCard({ compact }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2.5 bg-white border border-[#d9d4c8] rounded-xl animate-pulse">
        <div className="w-14 h-14 rounded-lg bg-[#f0ede5] shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="w-1/3 h-2 bg-[#e5f2f1] rounded-full mb-2" />
          <div className="w-3/4 h-3 bg-[#d9d4c8]/60 rounded-full mb-2" />
          <div className="w-1/3 h-3.5 bg-[#e5f2f1] rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col bg-white border border-[#d9d4c8] rounded-2xl overflow-hidden animate-pulse">
      <div className="relative aspect-[5/4] w-full bg-gradient-to-br from-[#f0ede5] to-[#ede9df]">
        <div className="absolute top-3 right-3">
          <div className="w-14 h-5 bg-[#d9d4c8]/60 rounded-full" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#e5f2f1]/60 border border-[#d9d4c8]/40" />
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="w-1/3 h-2.5 bg-[#e5f2f1] rounded-full mb-2.5" />
        <div className="w-4/5 h-3.5 bg-[#d9d4c8]/60 rounded-full mb-1.5" />
        <div className="w-1/2 h-3.5 bg-[#d9d4c8]/40 rounded-full mb-5" />
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="w-20 h-5 bg-[#e5f2f1] rounded-md mb-1.5" />
            <div className="w-12 h-2.5 bg-[#d9d4c8]/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductList({
  products     = [],
  loading      = false,
  compact      = false,
  onAddToCart,
  onEdit,
  onDelete,
  onUploadImage,
}) {

  const gridClass = compact
    ? 'flex flex-col gap-2'
    : 'grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3'

  // ─── Loading State ───
  if (loading) {
    return (
      <div className={`${gridClass} animate-fade-in`}>
        {Array.from({ length: compact ? 8 : 10 }).map((_, i) => (
          <SkeletonCard key={i} compact={compact} />
        ))}
      </div>
    )
  }

  // ─── Empty State ───
  if (!products.length) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={<Package size={48} className="text-[#004643]" />}
          title="No Products Found"
          message="Add products to your inventory to get started and start selling."
        />
      </div>
    )
  }

  // ─── Data State ───
  return (
    <div className={`${gridClass} animate-fade-in`}>
      {products.map((p) => (
        <ProductCard
          key={p.product_id}
          product={p}
          compact={compact}
          onAddToCart={onAddToCart}
          onEdit={onEdit}
          onDelete={onDelete}
          onUploadImage={onUploadImage}
        />
      ))}
    </div>
  )
}
