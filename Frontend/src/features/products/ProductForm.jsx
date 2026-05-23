import { useEffect }           from 'react'
import { useForm, Controller } from 'react-hook-form'
import { CheckCircle2, Package, Tag } from 'lucide-react'
import Input                   from '../../components/ui/Input'
import Select                  from '../../components/ui/Select'
import Button                  from '../../components/ui/Button'
import { validators }          from '../../utils/validators'



export default function ProductForm({
  onSubmit,
  defaultValues = null,
  loading,
  categories = [],
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_name:   '',
      price:          '',
      cost_price:     '',
      stock_quantity: '',
      category:       '',
      sku:            '',
      description:    '',
    },
  })

  useEffect(() => {
    reset({
      product_name:   defaultValues?.product_name    ?? '',
      price:          defaultValues?.price           ?? '',
      cost_price:     defaultValues?.cost_price      ?? '',
      stock_quantity: defaultValues?.stock_quantity  ?? '',
      category:       defaultValues?.category        ?? '',
      sku:            defaultValues?.sku             ?? '',
      description:    defaultValues?.description     ?? '',
    })
  }, [defaultValues, reset])

  const handleFormSubmit = (data) => {
    onSubmit({
      product_name:   data.product_name,
      price:          data.price          ? parseFloat(data.price)            : null,
      cost_price:     data.cost_price     ? parseFloat(data.cost_price)       : 0,
      stock_quantity: data.stock_quantity ? parseInt(data.stock_quantity, 10) : 0,
      category:       data.category       || null,
      sku:            data.sku?.trim()         || null,
      description:    data.description?.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 animate-fade-in">

      {/* ─── SECTION 1: GENERAL INFO (Grid Layout for Compactness) ─── */}
      <div className="p-4 rounded-lg bg-white border border-[#d9d4c8] flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e5f2f1] text-[#004643]">
            <Package size={14} />
          </span>
          <h3 className="text-xs font-bold text-[#004643] uppercase tracking-wider">
            General Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Product Name *"
              placeholder="e.g. Premium Blend Coffee 500g"
              error={errors.product_name?.message}
              {...register('product_name', {
                required:  'Product name is required',
                minLength: { value: 2,   message: 'At least 2 characters required' },
                maxLength: { value: 150, message: 'Cannot exceed 150 characters' },
              })}
            />
          </div>

          <Controller
            name="category"
            control={control}
            rules={{ required: 'Please select a category' }}
            render={({ field }) => (
              <Select
                label="Category *"
                options={[
                  { value: '', label: 'Select a category' },
                  ...categories.map((c) => ({ value: c.category_name, label: c.category_name })),
                ]}
                error={errors.category?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Input
            label="SKU (optional)"
            placeholder="e.g. SKU-001"
            error={errors.sku?.message}
            {...register('sku', {
              maxLength: { value: 50, message: 'SKU cannot exceed 50 characters' },
            })}
          />

          <div className="sm:col-span-2">
            <Input
              label="Description (optional)"
              placeholder="Brief product description..."
              error={errors.description?.message}
              {...register('description', {
                maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' },
              })}
            />
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: PRICING & STOCK (3-Column Grid) ─── */}
      <div className="p-4 rounded-lg bg-white border border-[#d9d4c8] flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e5f2f1] text-[#004643]">
            <Tag size={14} />
          </span>
          <h3 className="text-xs font-bold text-[#004643] uppercase tracking-wider">
            Financials & Inventory
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Input
            label="Selling Price (₹) *"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price', {
              required: 'Required',
              validate:  validators.positiveNumber,
            })}
          />
          <Input
            label="Cost Price (₹)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.cost_price?.message}
            {...register('cost_price', {
              validate: (val) => !val || validators.positiveNumber(val),
            })}
          />
          <Input
            label="Stock Qty *"
            type="number"
            min="0"
            placeholder="0"
            error={errors.stock_quantity?.message}
            {...register('stock_quantity', {
              required: 'Required',
              validate:  validators.nonNegativeNumber,
            })}
          />
        </div>
      </div>

      {/* ─── ACTION BUTTON ─── */}
      <div className="sticky bottom-0 z-10 -mx-5 sm:-mx-6 -mb-5 mt-1 border-t border-[#d9d4c8] bg-[#faf8f2]/95 px-5 sm:px-6 py-4 backdrop-blur">
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          size="md"
          loading={loading}
          icon={<CheckCircle2 size={18} />}
          className="border border-[#004643]"
        >
          {defaultValues?.product_id ? 'Save Changes' : 'Add to Inventory'}
        </Button>
      </div>

    </form>
  )
}
