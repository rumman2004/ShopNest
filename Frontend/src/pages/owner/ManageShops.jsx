import { useState }    from 'react'
import { useFetch }    from '../../hooks/useFetch'
import { useToast }    from '../../hooks/useToast'
import { useShop }     from '../../hooks/useShop'
import shopService     from '../../services/shopService'
import ShopCard        from '../../features/shops/ShopCard'
import ShopForm        from '../../features/shops/ShopForm'
import Modal           from '../../components/ui/Modal'
import Button          from '../../components/ui/Button'
import ConfirmDialog   from '../../components/ui/ConfirmDialog'
import Spinner         from '../../components/ui/Spinner'
import EmptyState      from '../../components/ui/EmptyState'
import { Plus, Store } from 'lucide-react'

export default function ManageShops() {
  const { toast }                  = useToast()
  const { activeShop, selectShop } = useShop()
  const [modal,   setModal]   = useState({ open: false, shop: null })
  const [confirm, setConfirm] = useState({ open: false, shop: null })
  const [saving,  setSaving]  = useState(false)

  const { data, loading, refetch } = useFetch(() => shopService.getAll(), [])
  const shops = data?.data ?? []

  const openCreate = ()     => setModal({ open: true,  shop: null })
  const openEdit   = (shop) => setModal({ open: true,  shop })
  const closeModal = ()     => setModal({ open: false, shop: null })

  // ✅ NEW: Wrapper that updates both UI and Database
  const handleSelectShop = async (shop) => {
    selectShop(shop) // 1. Update UI immediately (optimistic)
    try {
      await shopService.setActive(shop.shop_id) // 2. Sync with DB
      toast.success(`Switched to ${shop.shop_name}`)
    } catch (err) {
      toast.error('Failed to sync active shop with server.')
    }
  }

  const handleSubmit = async (formData) => {
    setSaving(true)
    try {
      if (modal.shop?.shop_id) {
        await shopService.update(modal.shop.shop_id, formData)
        toast.success('Shop successfully updated.')
      } else {
        await shopService.create(formData)
        toast.success('New shop created.')
      }
      await refetch()
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Failed to save shop details.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm.shop) return
    setSaving(true)
    try {
      await shopService.delete(confirm.shop.shop_id)
      toast.success('Shop deleted successfully.')
      await refetch()
    } catch (err) {
      toast.error(err?.message || 'Cannot delete shop due to existing sales records.')
    } finally {
      setSaving(false)
      setConfirm({ open: false, shop: null })
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in relative z-10 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-[#e5f2f1] border border-[#d9d4c8] p-6 sm:px-8 rounded-[2rem]  shadow-lg shadow-[#d9d4c8]/40">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182321] tracking-tight flex items-center gap-3">
            Manage Shops
          </h2>
          <p className="text-[#697773] text-sm sm:text-base font-medium mt-1">
            {shops.length} shop{shops.length !== 1 ? 's' : ''} currently registered
          </p>
        </div>
        <Button
          variant="gradient"
          size="md"
          icon={<Plus size={18} strokeWidth={2.5} />}
          onClick={openCreate}
          className="shadow-md shrink-0 w-full sm:w-auto"
        >
          Add New Shop
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#e5f2f1] border border-[#ebe6dc] rounded-[2rem]  shadow-sm">
          <Spinner size="lg" className="text-[#004643] mb-5" />
          <p className="text-[#697773] font-medium animate-pulse tracking-wide">Loading your stores...</p>
        </div>
      ) : shops.length === 0 ? (
        <div className="bg-[#e5f2f1] border border-[#d9d4c8] rounded-[2rem] p-10  shadow-lg shadow-[#d9d4c8]/30">
          <EmptyState
            icon={<Store size={56} className="text-[#697773]" />}
            title="No Shops Yet"
            message="Create your first shop to get started and unlock your dashboard."
            action={
              <Button variant="gradient" size="md" icon={<Plus size={18} />} onClick={openCreate} className="mt-4">
                Add Your First Shop
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {shops.map((shop) => (
            <ShopCard
              key={shop.shop_id}
              shop={shop}
              isActive={activeShop?.shop_id === shop.shop_id}
              onSelect={handleSelectShop} // ✅ FIXED: was selectShop (no DB call)
              onEdit={openEdit}
              onDelete={(s) => setConfirm({ open: true, shop: s })}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.shop ? 'Edit Shop' : 'Create New Shop'}
        eyebrow="Store Setup"
        description={modal.shop ? 'Update the store profile shown across dashboards and reports.' : 'Add a new store location to manage inventory and sales.'}
        icon={<Store size={20} />}
        size="sm"
      >
        <ShopForm onSubmit={handleSubmit} defaultValues={modal.shop} loading={saving} />
      </Modal>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, shop: null })}
        onConfirm={handleDelete}
        title="Delete Shop?"
        message={`Are you sure you want to permanently delete "${confirm.shop?.shop_name}"? This action cannot be undone if no sales exist.`}
        loading={saving}
      />
    </div>
  )
}
