import { Package, Edit2, Trash2, Image as ImageIcon, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import Badge  from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function ProductCard({ product, onAddToCart, onEdit, onDelete, onUploadImage, compact = false }) {
  const name     = product.product_name ?? product.name ?? 'Unknown'
  const price    = Number(product.price ?? 0)
  const stock    = Number(product.stock_quantity ?? 0)
  const imageUrl = product.image_url ?? null
  const category = product.category ?? null

  const isOutOfStock = stock === 0
  const isLowStock   = stock > 0 && stock <= 5

  // ─── Compact POS Card ──────────────────────────────────────────────
  if (compact) {
    return (
      <button
        type="button"
        onClick={() => !isOutOfStock && onAddToCart?.(product)}
        disabled={isOutOfStock}
        className={`
          group relative flex items-center gap-3 p-2.5 w-full text-left
          bg-white border border-[#d9d4c8] rounded-xl
          transition-all duration-200
          ${isOutOfStock 
            ? 'opacity-60 cursor-not-allowed' 
            : 'hover:shadow-md hover:border-[#9bb7b2] hover:bg-[#faf8f2] active:scale-[0.98]'
          }
        `}
      >
        {/* Thumbnail */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#f7f4ed] shrink-0 border border-[#ebe6dc]">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-contain p-1" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={18} className="text-[#9bb7b2]" />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-[7px] font-black text-red-600 uppercase tracking-wider">Sold Out</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {category && (
            <p className="text-[8px] font-bold text-[#004643] uppercase tracking-widest mb-0.5 truncate">{category}</p>
          )}
          <p className="text-xs font-semibold text-[#182321] leading-tight truncate">{name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-extrabold text-[#004643]">{formatCurrency(price)}</span>
            {isLowStock && <span className="text-[8px] font-bold text-amber-600 animate-pulse">Low</span>}
          </div>
        </div>

        {/* Add indicator */}
        {!isOutOfStock && (
          <div className="shrink-0 w-8 h-8 rounded-lg bg-[#004643] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ShoppingCart size={14} />
          </div>
        )}
      </button>
    )
  }

  // ─── Standard Inventory Card ────────────────────────────────────────
  return (
    <div 
      className={`
        group relative flex flex-col bg-white
        border border-[#d9d4c8] rounded-2xl overflow-hidden 
        transition-all duration-300 hover:shadow-xl hover:shadow-[#d9d4c8]/50 hover:border-[#9bb7b2]
        hover:-translate-y-1
        ${isOutOfStock ? 'opacity-80' : ''}
      `}
    >
      {/* --- Image Section --- */}
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#f7f4ed]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className={`
              w-full h-full object-contain p-2 transition-transform duration-500 ease-out
              ${isOutOfStock ? 'grayscale-[0.4] opacity-70' : 'group-hover:scale-105'}
            `}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#f7f4ed] to-[#ede9df]">
            <div className="w-12 h-12 rounded-xl bg-[#e5f2f1] border border-[#d9d4c8] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Package size={22} className="text-[#004643]/60" />
            </div>
            <span className="text-[9px] font-semibold text-[#697773]/60 tracking-wider uppercase">No Image</span>
          </div>
        )}    

        {/* Stock Badges */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex flex-col gap-1.5 items-end">
          {isOutOfStock && <Badge variant="red" className="shadow-lg shadow-red-500/20 text-[10px] sm:text-xs">Sold Out</Badge>}
          {isLowStock   && <Badge variant="yellow" className="shadow-lg shadow-amber-500/20 text-[10px] sm:text-xs">Low Stock</Badge>}
        </div>

        {/* Management Actions (Slide in on hover) */}
        {(onEdit || onDelete || onUploadImage) && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="p-1.5 sm:p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-[#d9d4c8] text-[#004643] hover:bg-[#e5f2f1] transition-all shadow-sm"
                title="Edit product"
              >
                <Edit2 size={14} strokeWidth={2.5} />
              </button>
            )}
            {onUploadImage && (
              <button
                type="button"
                onClick={() => onUploadImage(product)}
                className="p-1.5 sm:p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-[#d9d4c8] text-[#004643] hover:bg-[#e5f2f1] transition-all shadow-sm"
                title="Upload image"
              >
                <ImageIcon size={14} strokeWidth={2.5} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="p-1.5 sm:p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-[#d9d4c8] text-red-700 hover:bg-red-50 transition-all shadow-sm"
                title="Remove product"
              >
                <Trash2 size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
      </div>

      {/* --- Product Info Section --- */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-grow">
        {category && (
          <p className="text-[8px] sm:text-[9px] font-bold text-[#004643] uppercase tracking-widest mb-0.5">
            {category}
          </p>
        )}

        <h4 className="text-xs sm:text-sm font-semibold text-[#182321] leading-snug mb-2 line-clamp-2" title={name}>
          {name}
        </h4>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-extrabold text-[#004643] tracking-tight">
              {formatCurrency(price)}
            </p>
            <p className={`text-[10px] sm:text-[11px] font-medium tracking-wide mt-0.5 ${
              isOutOfStock ? 'text-red-600' : 
              isLowStock   ? 'text-amber-700 animate-pulse' : 
              'text-[#697773]'
            }`}>
              {isOutOfStock ? '0 Available' : `${stock} in stock`}
            </p>
          </div>

          {onAddToCart && (
            <Button
              variant={isOutOfStock ? 'ghost' : 'primary'}
              size="sm"
              icon={<ShoppingCart size={14} strokeWidth={2.5} />}
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
              className={`rounded-lg px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm shrink-0 transition-transform ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              
            </Button>
          )}
        </div>
      </div>

    </div>
  )
}
