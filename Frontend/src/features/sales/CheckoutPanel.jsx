import { useState } from 'react'
import { useCart }  from '../../hooks/useCart'
import { useShop }  from '../../hooks/useShop'
import { useToast } from '../../hooks/useToast'
import salesService from '../../services/salesService'
import Button  from '../../components/ui/Button'
import Input   from '../../components/ui/Input'
import { formatCurrency } from '../../utils/formatters'
import { CreditCard, Banknote, CheckCircle2 } from 'lucide-react'

export default function CheckoutPanel({ onSuccess }) {
  const { items, totals, clearCart } = useCart()
  const { shopId } = useShop()
  const { toast }  = useToast()
  
  const [tendered, setTendered] = useState('')
  const [loading,  setLoading]  = useState(false)

  // Math logic
  const tenderedNum = Number(tendered) || 0
  const change      = tendered !== '' ? tenderedNum - totals.total : 0
  const isShort     = change < 0
  const canCheckout = items.length > 0

  const handleCheckout = async () => {
    if (!canCheckout) return
    if (!tendered || tenderedNum < totals.total) {
      toast.error('Tendered amount must be equal to or greater than the total.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        // ✅ FIX: use product_id instead of id
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity:   i.quantity,
        })),
        tendered_amount: tenderedNum,
      }
      const res = await salesService.checkout(shopId, payload)

      toast.success('Sale completed successfully!')
      clearCart()
      setTendered('')

      // ✅ FIX: merge tendered into the sale response so ReceiptPreview can show change
      onSuccess?.(res?.data)
    } catch (err) {
      toast.error(err?.message || 'Checkout failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-5 sm:p-6 relative overflow-hidden animate-fade-in">
      {/* --- Header --- */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="p-2.5 bg-[#e5f2f1] rounded-lg border border-[#c8ddda]">
          <CreditCard size={20} className="text-[#004643]" />
        </div>
        <h3 className="text-xl font-extrabold text-[#182321] tracking-wide">
          Payment Center
        </h3>
      </div>

      <div className="space-y-4 relative z-10">
        
        {/* --- Amount Due Highlight --- */}
        <div className="bg-[#f7f4ed] border border-[#d9d4c8] rounded-lg p-4 flex flex-col justify-center items-center text-center">
          <span className="text-xs font-bold text-[#697773] uppercase tracking-widest mb-1.5">
            Total Amount Due
          </span>
          <span className="text-3xl font-black text-[#004643] tracking-tight">
            {formatCurrency(totals.total)}
          </span>
        </div>

        {/* --- Tendered Input --- */}
        <div className="pt-1">
          <Input
            label="Amount Tendered"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={tendered}
            onChange={(e) => setTendered(e.target.value)}
            icon={<Banknote size={18} className="text-[#004643]" />}
            disabled={!canCheckout}
          />
        </div>

        {/* --- Dynamic Change/Short Indicator --- */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          tendered !== '' ? 'max-h-20 opacity-100 mb-2' : 'max-h-0 opacity-0 m-0'
        }`}>
          <div className={`flex justify-between items-center p-3.5 rounded-xl border shadow-inner ${
            isShort 
              ? 'bg-rose-50 border-rose-200' 
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isShort ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {isShort ? 'Remaining Due' : 'Change Due'}
            </span>
            <span className={`text-xl font-extrabold tracking-tight ${
              isShort ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {formatCurrency(Math.abs(change))}
            </span>
          </div>
        </div>

        {/* --- Process Action --- */}
        <Button
          fullWidth
          size="lg"
          icon={loading ? null : <CheckCircle2 size={20} />}
          onClick={handleCheckout}
          loading={loading}
          disabled={!canCheckout || isShort}
          className={`py-4 mt-2 font-bold text-lg rounded-xl border shadow-lg transition-all ${
            canCheckout && !isShort && !loading
              ? 'bg-[#004643] hover:bg-[#003734] border-[#004643] text-white'
              : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing...' : 'Complete Sale'}
        </Button>

      </div>
    </div>
  )
}
