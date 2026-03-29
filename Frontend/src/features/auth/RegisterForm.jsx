import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import authService from '../../services/authService'
import Input  from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import { validators } from '../../utils/validators'

export default function RegisterForm() {
  const { login }  = useAuth()
  const { toast }  = useToast()
  const navigate   = useNavigate()
  const [showPwd, setShowPwd] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      const { confirm_password, ...payload } = data
      const res = await authService.registerOwner(payload)
      login(res.user, res.token)
      toast.success('Account created successfully!')
      navigate('/owner/dashboard', { replace: true })
    } catch (err) {
      toast.error(err?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 animate-fade-in w-full">
      
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Juan Dela Cruz"
          icon={<User size={18} className="text-[#84BABF]" />}
          error={errors.full_name?.message}
          {...register('full_name', {
            required: 'Full name is required',
            validate: validators.minLength(2),
          })}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={18} className="text-[#84BABF]" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            validate: validators.email,
          })}
        />

        <Input
          label="Password"
          type={showPwd ? 'text' : 'password'}
          placeholder="Min. 8 characters"
          icon={<Lock size={18} className="text-[#84BABF]" />}
          iconRight={
            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              className="p-1.5 rounded-lg text-[#84BABF] hover:text-[#E0EDE9] hover:bg-[#085558]/40 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#006F73]"
              title={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            validate: validators.password,
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          icon={<Lock size={18} className="text-[#84BABF]" />}
          error={errors.confirm_password?.message}
          {...register('confirm_password', {
            required: 'Please confirm your password',
            validate: validators.confirmPassword(password),
          })}
        />
      </div>

      <Button
        type="submit"
        variant="primary" // Changed from generic gradient to fit standard theming
        fullWidth
        loading={isSubmitting}
        size="lg"
        icon={!isSubmitting && <UserPlus size={18} />}
        className="mt-2 shadow-[0_0_20px_rgba(0,111,115,0.25)] hover:shadow-[0_0_30px_rgba(0,111,115,0.4)] border border-[#84BABF]/20 transition-all duration-300"
      >
        <span className="tracking-wide font-semibold text-[#E0EDE9]">
          Create Account
        </span>
      </Button>
    </form>
  )
}