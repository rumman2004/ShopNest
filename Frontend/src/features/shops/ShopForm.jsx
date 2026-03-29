import { useEffect }   from 'react'
import { useForm }     from 'react-hook-form'
import { Store, CheckCircle2 } from 'lucide-react'
import Input  from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ShopForm({ onSubmit, defaultValues = null, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // Populate form when editing an existing shop
  useEffect(() => {
    if (defaultValues) {
      reset({
        shop_name: defaultValues.shop_name ?? '',
        category:  defaultValues.category  ?? '',
        address:   defaultValues.address   ?? '',
      })
    } else {
      reset({ shop_name: '', category: '', address: '' })
    }
  }, [defaultValues, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 animate-fade-in">
      
      {/* ─── SHOP DETAILS CARD ─── */}
      <div className="p-5 rounded-2xl bg-[#085558]/10 border border-[#84BABF]/20 space-y-4 shadow-inner">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#84BABF]/10">
          <Store size={18} className="text-[#84BABF]" />
          <h3 className="text-sm font-semibold text-[#E0EDE9] uppercase tracking-widest">
            {defaultValues?.shop_id ? 'Edit Shop Profile' : 'New Shop Profile'}
          </h3>
        </div>

        <Input
          label="Shop Name *"
          placeholder="e.g. Main Street Store"
          error={errors.shop_name?.message}
          {...register('shop_name', { required: 'Shop name is required' })}
        />
        
        <Input
          label="Category"
          placeholder="e.g. Grocery, Pharmacy, Electronics"
          error={errors.category?.message}
          {...register('category')}
        />
        
        <Input
          label="Address"
          placeholder="e.g. 123 Main Street, City"
          error={errors.address?.message}
          {...register('address')}
        />
      </div>

      {/* ─── ACTION BUTTON ─── */}
      <div className="pt-3 pb-1 sticky bottom-0 bg-[#06363D]/80 backdrop-blur-md z-10 -mx-2 px-2">
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          size="lg"
          loading={loading}
          icon={<CheckCircle2 size={18} />}
          className="shadow-[0_0_20px_rgba(0,111,115,0.3)] border border-[#84BABF]/30"
        >
          {defaultValues?.shop_id ? 'Save Changes' : 'Create Shop'}
        </Button>
      </div>

    </form>
  )
}