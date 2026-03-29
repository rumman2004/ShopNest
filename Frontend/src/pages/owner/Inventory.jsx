import { useState, useCallback, useEffect } from 'react'
import { useShop }      from '../../hooks/useShop'
import { useFetch }     from '../../hooks/useFetch'
import { useToast }     from '../../hooks/useToast'
import { useDebounce }  from '../../hooks/useDebounce'
import productService   from '../../services/productService'
import ProductList      from '../../features/products/ProductList'
import ProductForm      from '../../features/products/ProductForm'
import ImageUploader    from '../../features/products/ImageUploader'
import Modal            from '../../components/ui/Modal'
import Button           from '../../components/ui/Button'
import SearchBar        from '../../components/ui/SearchBar'
import ConfirmDialog    from '../../components/ui/ConfirmDialog'
import EmptyState       from '../../components/ui/EmptyState'
import { Plus, Store, Package }  from 'lucide-react'

export default function Inventory() {
  const { activeShop, shopId, setActiveShop } = useShop()
  const { toast }                             = useToast()

  const [search,   setSearch]   = useState('')
  const [modal,    setModal]    = useState({ open: false, product: null })
  const [imgModal, setImgModal] = useState({ open: false, product: null })
  const [confirm,  setConfirm]  = useState({ open: false, product: null })
  const [saving,   setSaving]   = useState(false)
  const dSearch = useDebounce(search, 350)

  // ── Fetch products ─────────────────────────────────────────────────
  const {
    data:  productData,
    loading,
    error: productError,
    refetch,
  } = useFetch(
    () => shopId
      ? productService.getAll(shopId, { search: dSearch })
      : Promise.resolve(null),
    [shopId, dSearch]
  )

  // ── Detect stale / deleted shop via 403 ───────────────────────────
  useEffect(() => {
    const status =
      productError?.response?.status ??
      productError?.status

    if (status === 403 && shopId) {
      const label = activeShop?.shop_name ?? `Shop #${shopId}`
      toast.error(`"${label}" is no longer accessible. Please select another shop.`)
      setActiveShop(null)
    }
  }, [productError]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Unwrap backend response ───────────────────────────────────────
  const products = productData?.data?.products ?? productData?.data ?? []

  const shopLabel = activeShop?.shop_name ?? `Shop #${shopId}`

  // ── Modal helpers ──────────────────────────────────────────────────
  const openCreate = ()  => setModal({ open: true,  product: null })
  const closeModal = ()  => setModal({ open: false, product: null })

  const openEdit = useCallback(
    (product) => setModal({ open: true, product }),
    []
  )

  const openImgModal = useCallback(
    (product) => setImgModal({ open: true, product }),
    []
  )

  // ── Create / Update ────────────────────────────────────────────────
  const handleSubmit = async (formData) => {
    if (!shopId) return
    setSaving(true)
    try {
      if (modal.product?.product_id) {
        await productService.update(shopId, modal.product.product_id, formData)
        toast.success('Product updated successfully.')
      } else {
        await productService.create(shopId, formData)
        toast.success('Product added to inventory.')
      }
      await refetch()
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Failed to save product details.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm.product || !shopId) return
    setSaving(true)
    try {
      await productService.delete(shopId, confirm.product.product_id)
      toast.success('Product removed successfully.')
      await refetch()
    } catch (err) {
      toast.error(err?.message || 'Failed to remove product.')
    } finally {
      setSaving(false)
      setConfirm({ open: false, product: null })
    }
  }

  // ── Image Upload ───────────────────────────────────────────────────
  const handleImageUpload = async (file) => {
    if (!imgModal.product || !shopId) return
    const fd = new FormData()
    fd.append('image', file)
    try {
      await productService.uploadImage(shopId, imgModal.product.product_id, fd)
      toast.success('Image uploaded successfully.')
      await refetch()
      setImgModal({ open: false, product: null })
    } catch (err) {
      toast.error(err?.message || 'Image upload failed.')
    }
  }

  // --- No Shop Selected State ---
  if (!shopId) {
    return (
      <EmptyState
        icon={<Store size={56} className="text-[#84BABF]" />}
        title="No Shop Selected"
        message="Please select a shop first from the Manage Shops page to view and edit your inventory."
      />
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in relative z-10 w-full pb-8">

      {/* --- Premium Glass Header --- */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 bg-[#0B2B26]/20 border border-[#84BABF]/20 p-6 sm:px-8 rounded-[2rem] backdrop-blur-xl shadow-lg shadow-[#06363D]/50">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E0EDE9] tracking-tight flex items-center gap-3">
            <Package size={28} className="text-[#84BABF] hidden sm:block" />
            Inventory Management
          </h2>
          <div className="flex items-center gap-2 mt-2 text-[#84BABF] text-sm sm:text-base font-medium">
            <span className="text-[#E0EDE9] drop-shadow-sm">{shopLabel}</span>
            <span className="text-[#006F73] opacity-60">•</span>
            <span>{products.length} product{products.length !== 1 ? 's' : ''} total</span>
          </div>
        </div>
        
        {/* Actions Container */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="w-full sm:w-72">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search products by name or category..."
              className="w-full"
            />
          </div>
          <Button 
            variant="gradient" 
            size="md"
            icon={<Plus size={18} strokeWidth={2.5} />} 
            onClick={openCreate}
            className="shadow-md shrink-0 w-full sm:w-auto"
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* --- Product Grid Component --- */}
      {/* Intentionally left un-wrapped so the individual ProductCards can visually float and pop on the dark background */}
      <ProductList
        products={products}
        loading={loading}
        onEdit={openEdit}
        onDelete={(p) => setConfirm({ open: true, product: p })}
        onUploadImage={openImgModal}
      />

      {/* --- Modals --- */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.product ? 'Edit Product Details' : 'Add New Product'}
        size="md"
      >
        <ProductForm
          onSubmit={handleSubmit}
          defaultValues={modal.product}
          loading={saving}
        />
      </Modal>

      <Modal
        isOpen={imgModal.open}
        onClose={() => setImgModal({ open: false, product: null })}
        title={`Upload Image — ${imgModal.product?.product_name ?? ''}`}
        size="sm"
      >
        <ImageUploader
          onUpload={handleImageUpload}
          currentUrl={imgModal.product?.image_url ?? null}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, product: null })}
        onConfirm={handleDelete}
        title="Remove Product?"
        message={`Are you sure you want to completely remove "${confirm.product?.product_name}" from your inventory? This cannot be undone.`}
        loading={saving}
      />
    </div>
  )
}