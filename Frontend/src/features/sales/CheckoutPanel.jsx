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
    <div className="bg-[#085558]/30 border border-[#84BABF]/20 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] shadow-xl shadow-[#06363D]/50 relative overflow-hidden animate-fade-in">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#006F73]/20 rounded-full blur-3xl pointer-events-none" />

      {/* --- Header --- */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="p-2.5 bg-[#006F73]/30 rounded-xl border border-[#006F73]/50 shadow-inner">
          <CreditCard size={20} className="text-[#84BABF]" />
        </div>
        <h3 className="text-xl font-extrabold text-[#E0EDE9] tracking-wide">
          Payment Center
        </h3>
      </div>

      <div className="space-y-4 relative z-10">
        
        {/* --- Amount Due Highlight --- */}
        <div className="bg-[#06363D]/60 border border-[#84BABF]/10 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-inner">
          <span className="text-xs font-bold text-[#84BABF] uppercase tracking-widest mb-1.5">
            Total Amount Due
          </span>
          <span className="text-3xl font-black text-[#E0EDE9] tracking-tight drop-shadow-md">
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
            icon={<Banknote size={18} className="text-[#84BABF]" />}
            disabled={!canCheckout}
          />
        </div>

        {/* --- Dynamic Change/Short Indicator --- */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          tendered !== '' ? 'max-h-20 opacity-100 mb-2' : 'max-h-0 opacity-0 m-0'
        }`}>
          <div className={`flex justify-between items-center p-3.5 rounded-xl border shadow-inner ${
            isShort 
              ? 'bg-rose-500/10 border-rose-500/20' 
              : 'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isShort ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {isShort ? 'Remaining Due' : 'Change Due'}
            </span>
            <span className={`text-xl font-extrabold tracking-tight ${
              isShort ? 'text-rose-400' : 'text-emerald-400'
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
              ? 'bg-gradient-to-r from-[#006F73] to-[#085558] hover:from-[#008A8F] hover:to-[#0A6C70] border-[#84BABF]/20 text-[#E0EDE9] shadow-[#006F73]/30'
              : 'bg-[#06363D] border-[#84BABF]/10 text-slate-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing...' : 'Complete Sale'}
        </Button>

      </div>
    </div>
  )
}