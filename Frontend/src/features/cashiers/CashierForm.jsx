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
      <div className="p-5 rounded-2xl bg-[#085558]/10 border border-[#84BABF]/20 space-y-4 shadow-inner">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#84BABF]/10">
          <UserPlus size={18} className="text-[#84BABF]" />
          <h3 className="text-sm font-semibold text-[#E0EDE9] uppercase tracking-widest">
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
        <div className="p-5 rounded-2xl bg-[#085558]/10 border border-[#84BABF]/20 space-y-4 shadow-inner">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-[#84BABF]" />
            <h3 className="text-sm font-semibold text-[#E0EDE9] uppercase tracking-widest">
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
          <p className="text-[10px] text-[#84BABF]/80 px-1">
            Provide this temporary password to the cashier. They will use it to log into the POS terminal.
          </p>
        </div>
      )}

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
          {isEdit ? 'Save Changes' : 'Create Cashier Account'}
        </Button>
      </div>

    </form>
  )
}