import { useState }      from 'react'
import { useShop }       from '../../hooks/useShop'
import { useFetch }      from '../../hooks/useFetch'
import { useToast }      from '../../hooks/useToast'
import cashierService    from '../../services/cashierService'
import CashierList       from '../../features/cashiers/CashierList'
import CashierForm       from '../../features/cashiers/CashierForm'
import Modal             from '../../components/ui/Modal'
import Button            from '../../components/ui/Button'
import ConfirmDialog     from '../../components/ui/ConfirmDialog'
import EmptyState        from '../../components/ui/EmptyState'
import { Plus, Store, Users } from 'lucide-react'

export default function ManageCashiers() {
  const { shopId } = useShop()
  const { toast }  = useToast()
  const [modal,   setModal]   = useState({ open: false, cashier: null })
  const [confirm, setConfirm] = useState({ open: false, cashier: null })
  const [saving,  setSaving]  = useState(false)

  const { data, loading, refetch } = useFetch(
    () => shopId ? cashierService.getAll(shopId) : Promise.resolve(null),
    [shopId]
  )
  
  // ✅ FIX: Extract correctly based on standard response { success: true, data: [...] }
  const cashiers = data?.data ?? []

  const openCreate = () => setModal({ open: true, cashier: null })
  const openEdit   = (c) => setModal({ open: true, cashier: c })
  const closeModal = () => setModal({ open: false, cashier: null })

  const handleSubmit = async (formData) => {
    if (!shopId) return
    setSaving(true)
    try {
      if (modal.cashier?.cashier_id) { 
        await cashierService.update(modal.cashier.cashier_id, formData)
        toast.success('Cashier updated successfully.')
      } else {
        await cashierService.create(shopId, formData)
        toast.success('New cashier added.')
      }
      await refetch()
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Failed to save cashier details.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    if (!confirm.cashier || !shopId) return
    setSaving(true)
    try {
      await cashierService.deactivate(confirm.cashier.cashier_id)
      toast.success('Cashier deactivated successfully.')
      await refetch()
    } catch (err) {
      toast.error(err?.message || 'Failed to deactivate cashier.')
    } finally {
      setSaving(false)
      setConfirm({ open: false, cashier: null })
    }
  }

  // --- No Shop Selected State ---
  if (!shopId) {
    return (
      <EmptyState
        icon={<Store size={56} className="text-[#84BABF]" />}
        title="No Shop Selected"
        message="Please select a shop first from the Manage Shops page to view and manage your staff."
      />
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in relative z-10 w-full pb-8">
      
      {/* --- Premium Glass Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-[#0B2B26]/20 border border-[#84BABF]/20 p-6 sm:px-8 rounded-[2rem] backdrop-blur-xl shadow-lg shadow-[#06363D]/50">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E0EDE9] tracking-tight flex items-center gap-3">
            <Users size={28} className="text-[#84BABF] hidden sm:block" />
            Manage Cashiers
          </h2>
          <p className="text-[#84BABF] text-sm sm:text-base font-medium mt-1">
            {cashiers.length} staff member{cashiers.length !== 1 ? 's' : ''} currently registered
          </p>
        </div>
        
        <Button 
          variant="gradient" 
          size="md"
          icon={<Plus size={18} strokeWidth={2.5} />} 
          onClick={openCreate}
          className="shadow-md shrink-0 w-full sm:w-auto"
        >
          Add Cashier
        </Button>
      </div>

      {/* --- Cashier List Section --- */}
      <div className="bg-[#085558]/10 border border-[#84BABF]/20 rounded-[2rem] p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-[#06363D]/30">
        <CashierList
          cashiers={cashiers}
          loading={loading}
          onEdit={openEdit}
          onDeactivate={(c) => setConfirm({ open: true, cashier: c })}
        />
      </div>

      {/* --- Modals --- */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.cashier ? 'Edit Cashier Details' : 'Register New Cashier'}
        size="sm"
      >
        <CashierForm
          onSubmit={handleSubmit}
          defaultValues={modal.cashier}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, cashier: null })}
        onConfirm={handleDeactivate}
        title="Deactivate Cashier?"
        message={`Are you sure you want to deactivate "${confirm.cashier?.full_name}"? They will no longer be able to log into the POS system.`}
        loading={saving}
      />
    </div>
  )
}