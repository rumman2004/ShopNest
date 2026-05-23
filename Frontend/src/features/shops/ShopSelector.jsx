import { useShop } from '../../hooks/useShop'
import { useToast } from '../../hooks/useToast' // Add your toast hook
import shopService from '../../services/shopService' // Add your service
import Select      from '../../components/ui/Select'
import { Store }   from 'lucide-react'

export default function ShopSelector({ shops = [], className = '' }) {
  const { activeShop, selectShop } = useShop()
  const { toast } = useToast()

  const options = shops.map((s) => ({
    value: s.shop_id,
    label: s.shop_name,
  }))

  const handleChange = async (e) => {
  const selectedId = Number(e.target.value);
  const shop = shops.find((s) => s.shop_id === selectedId);

  if (!shop) {
    toast.error('Shop not found');
    return;
  }

  // Optimistic UI update
  selectShop(shop);

  try {
    // Call backend to update DB
    await shopService.setActive(selectedId);
    toast.success(`Switched to ${shop.shop_name}`);
  } catch (error) {
    toast.error('Failed to update active shop');
    console.error('Error:', error); // 🔥 Add this to debug
  }
};

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#697773] group-hover:text-[#182321] transition-colors z-10">
        <Store size={16} strokeWidth={2.5} />
      </div>

      <Select
        options={options}
        value={activeShop?.shop_id ?? ''}
        onChange={handleChange}
        placeholder="Select a shop…"
        className="pl-10 bg-[#e5f2f1] border-[#d9d4c8] text-[#182321] hover:bg-[#e5f2f1] hover:border-[#004643]/30 transition-all duration-300 shadow-sm w-full"
      />
    </div>
  )
}