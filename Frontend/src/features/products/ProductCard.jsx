import { Package, Edit2, Trash2, Image as ImageIcon, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import Badge  from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function ProductCard({ product, onAddToCart, onEdit, onDelete, onUploadImage }) {
  const name     = product.product_name ?? product.name ?? 'Unknown'
  const price    = Number(product.price ?? 0)
  const stock    = Number(product.stock_quantity ?? 0)
  const imageUrl = product.image_url ?? null
  const category = product.category ?? null

  const isOutOfStock = stock === 0
  const isLowStock   = stock > 0 && stock <= 5

  return (
    <div 
      className={`
        group relative flex flex-col bg-[#06363D]/60 backdrop-blur-xl 
        border border-[#84BABF]/20 rounded-2xl overflow-hidden 
        transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,111,115,0.25)] hover:border-[#84BABF]/40 hover:-translate-y-1
        ${isOutOfStock ? 'opacity-80 grayscale-[0.2]' : ''}
      `}
    >
      {/* --- Image Section --- */}
      <div className="relative h-48 w-full overflow-hidden bg-[#06363D]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className={`
              w-full h-full object-cover transition-transform duration-700 
              ${isOutOfStock ? 'grayscale-[0.5]' : 'group-hover:scale-110'}
            `}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#085558] to-[#06363D]">
            <Package size={40} className="text-[#84BABF] transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}    

        {/* Stock Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {isOutOfStock && <Badge variant="red" className="shadow-lg shadow-red-500/20">Sold Out</Badge>}
          {isLowStock   && <Badge variant="yellow" className="shadow-lg shadow-amber-500/20">Low Stock</Badge>}
        </div>

        {/* Management Actions (Slide in on hover) */}
        {(onEdit || onDelete || onUploadImage) && (
          <div className="absolute top-3 left-3 flex flex-col gap-2 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="p-2 rounded-xl bg-[#06363D]/60 backdrop-blur-md border border-[#84BABF]/30 text-[#E0EDE9] hover:bg-[#006F73] hover:border-[#006F73] hover:shadow-[0_0_15px_rgba(0,111,115,0.5)] transition-all"
                title="Edit product"
              >
                <Edit2 size={16} strokeWidth={2.5} />
              </button>
            )}
            {onUploadImage && (
              <button
                type="button"
                onClick={() => onUploadImage(product)}
                className="p-2 rounded-xl bg-[#06363D]/60 backdrop-blur-md border border-[#84BABF]/30 text-[#E0EDE9] hover:bg-[#085558] hover:border-[#84BABF] hover:shadow-[0_0_15px_rgba(8,85,88,0.5)] transition-all"
                title="Upload image"
              >
                <ImageIcon size={16} strokeWidth={2.5} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="p-2 rounded-xl bg-[#06363D]/60 backdrop-blur-md border border-[#84BABF]/30 text-[#E0EDE9] hover:bg-red-500 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
                title="Remove product"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* --- Product Info Section --- */}
      <div className="p-5 flex flex-col flex-grow relative">
        {/* Category */}
        {category && (
          <p className="text-[10px] font-bold text-[#84BABF] uppercase tracking-widest mb-1.5">
            {category}
          </p>
        )}

        {/* Title */}
        <h4 className="text-base font-semibold text-[#E0EDE9] leading-tight mb-4 line-clamp-2" title={name}>
          {name}
        </h4>

        {/* Push price/cart to the bottom if title is short */}
        <div className="mt-auto flex items-end justify-between gap-3">
          
          {/* Price & Stock */}
          <div>
            <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E0EDE9] to-[#84BABF]">
              {formatCurrency(price)}
            </p>
            <p className={`text-[11px] font-medium tracking-wide mt-0.5 ${
              isOutOfStock ? 'text-red-400' : 
              isLowStock   ? 'text-amber-400 animate-pulse' : 
              'text-[#84BABF]'
            }`}>
              {isOutOfStock ? '0 Available' : `${stock} in stock`}
            </p>
          </div>

          {/* Add to Cart Button */}
          {onAddToCart && (
            <Button
              variant={isOutOfStock ? 'ghost' : 'primary'}
              size="sm"
              icon={<ShoppingCart size={16} strokeWidth={2.5} />}
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
              className={`rounded-xl px-4 py-2.5 transition-transform ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-[#085558]/30' : ''}`}
            >
              Add
            </Button>
          )}
        </div>
      </div>

    </div>
  )
}