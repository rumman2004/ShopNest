import ProductCard from './ProductCard'
import EmptyState  from '../../components/ui/EmptyState'
import { Package } from 'lucide-react'

// ─── Premium Skeleton Loader ─────────────────────────────────────
// Matches the exact dimensions and layout of the real ProductCard
// to prevent layout shifting and provide a premium UX.
function SkeletonCard() {
  return (
    <div className="relative flex flex-col bg-[#085558]/10 backdrop-blur-xl border border-[#84BABF]/10 rounded-2xl overflow-hidden animate-pulse">
      
      {/* Image Placeholder */}
      <div className="relative h-48 w-full bg-[#085558]/20">
        {/* Fake top badge */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <div className="w-16 h-5 bg-[#84BABF]/20 rounded-full" />
        </div>
      </div>

      {/* Info Placeholder */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Fake Category */}
        <div className="w-1/3 h-2.5 bg-[#84BABF]/15 rounded-full mb-3" />
        
        {/* Fake Title (2 lines) */}
        <div className="w-4/5 h-4 bg-[#84BABF]/20 rounded-full mb-2" />
        <div className="w-1/2 h-4 bg-[#84BABF]/20 rounded-full mb-6" />

        {/* Bottom Row (Price & Button) */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            {/* Fake Price */}
            <div className="w-20 h-6 bg-[#84BABF]/20 rounded-md mb-1.5" />
            {/* Fake Stock */}
            <div className="w-12 h-2.5 bg-[#84BABF]/15 rounded-full" />
          </div>
          {/* Fake Add Button */}
          <div className="w-16 h-9 bg-[#84BABF]/15 rounded-xl" />
        </div>
      </div>
      
    </div>
  )
}

export default function ProductList({
  products     = [],
  loading      = false,
  onAddToCart,
  onEdit,
  onDelete,
  onUploadImage,
}) {
  
  // ─── Loading State ───
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 xl:gap-6 animate-fade-in">
        {/* Render 10 skeletons to fill a typical screen */}
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  // ─── Empty State ───
  if (!products.length) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={<Package size={48} className="text-[#84BABF]" />}
          title="No Products Found"
          message="Add products to your inventory to get started and start selling."
        />
      </div>
    )
  }

  // ─── Data State ───
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 xl:gap-6 animate-fade-in">
      {products.map((p) => (
        <ProductCard
          key={p.product_id}
          product={p}
          onAddToCart={onAddToCart}
          onEdit={onEdit}
          onDelete={onDelete}
          onUploadImage={onUploadImage}
        />
      ))}
    </div>
  )
}