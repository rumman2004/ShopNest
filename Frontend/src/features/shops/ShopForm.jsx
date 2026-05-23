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
      <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#d9d4c8] space-y-4 shadow-sm">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#ebe6dc]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f2f1] text-[#004643]">
            <Store size={16} />
          </span>
          <h3 className="text-xs font-bold text-[#004643] uppercase tracking-wider">
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
      <div className="sticky bottom-0 z-10 -mx-5 sm:-mx-6 -mb-5 mt-1 border-t border-[#d9d4c8] bg-[#faf8f2]/95 px-5 sm:px-6 py-4 backdrop-blur">
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          size="lg"
          loading={loading}
          icon={<CheckCircle2 size={18} />}
          className="border border-[#004643]"
        >
          {defaultValues?.shop_id ? 'Save Changes' : 'Create Shop'}
        </Button>
      </div>

    </form>
  )
}
