import { useEffect } from 'react'
import { useForm }   from 'react-hook-form'
import { UserPlus, Shield, CheckCircle2 } from 'lucide-react'
import Input   from '../../components/ui/Input'
import Button  from '../../components/ui/Button'

export default function CashierForm({ onSubmit, defaultValues, loading }) {
  const isEdit = !!(defaultValues?.cashier_id || defaultValues?.id)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      full_name: '',
      username: '',
      password: ''
    }
  })

  useEffect(() => { 
    reset({
      full_name: defaultValues?.full_name || '',
      username: defaultValues?.username || '',
      password: '' // Never pre-fill password on edit
    }) 
  }, [defaultValues, reset])

  const handleFormSubmit = (data) => {
    const payload = {
      full_name: data.full_name,
      username: data.username,
    }
    // Only send password if we are creating a new cashier
    if (!isEdit) {
      payload.password = data.password
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5 animate-fade-in">
      
      {/* ─── CASHIER DETAILS CARD ─── */}
      <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#d9d4c8] space-y-4 shadow-sm">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#ebe6dc]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f2f1] text-[#004643]">
            <UserPlus size={16} />
          </span>
          <h3 className="text-xs font-bold text-[#004643] uppercase tracking-wider">
            {isEdit ? 'Edit Profile' : 'Staff Profile'}
          </h3>
        </div>

        <Input
          label="Full Name *"
          placeholder="e.g. Maria Santos"
          error={errors.full_name?.message}
          {...register('full_name', { required: 'Name is required' })}
        />

        <Input
          label="Username *"
          type="text"
          placeholder="e.g. mariasantos99"
          error={errors.username?.message}
          {...register('username', {
            required: 'Username is required',
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: 'Username can only contain letters and numbers'
            },
            minLength: { value: 3, message: 'Minimum 3 characters' }
          })}
        />
      </div>

      {/* ─── SECURITY SECTION (Only for New Cashiers) ─── */}
      {!isEdit && (
        <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#d9d4c8] space-y-4 shadow-sm">
          <div className="flex items-center gap-3 pb-3 border-b border-[#ebe6dc]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f2f1] text-[#004643]">
              <Shield size={16} />
            </span>
            <h3 className="text-xs font-bold text-[#004643] uppercase tracking-wider">
              Security
            </h3>
          </div>
          
          <Input
            label="Temporary Password *"
            type="password"
            placeholder="Min. 6 characters"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' }
            })}
          />
          <p className="text-[10px] text-[#697773]/80 px-1">
            Provide this temporary password to the cashier. They will use it to log into the POS terminal.
          </p>
        </div>
      )}

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
          {isEdit ? 'Save Changes' : 'Create Cashier Account'}
        </Button>
      </div>

    </form>
  )
}
