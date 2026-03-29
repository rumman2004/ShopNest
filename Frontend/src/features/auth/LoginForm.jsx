import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import authService from '../../services/authService'
import Input  from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Mail, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { validators } from '../../utils/validators'

export default function LoginForm({ role = 'owner' }) {
  const { login }    = useAuth()
  const { toast }    = useToast()
  const navigate     = useNavigate()
  const location     = useLocation()
  const [showPwd, setShowPwd] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      let response;
      
      // Use appropriate login service based on role
      if (role === 'owner') {
        response = await authService.loginOwner({
          email: data.email,
          password: data.password
        })
      } else {
        response = await authService.loginCashier({
          username: data.username,
          password: data.password
        })
      }
      
      // Handle different response structures from backend
      const userData = response.data?.user || response.user
      const tokenData = response.data?.accessToken || response.accessToken || response.token
      
      if (!userData || !tokenData) {
        throw new Error('Invalid response from server')
      }

      // Verify user type matches expected role
      if (role === 'owner' && userData.type !== 'owner') {
        throw new Error('Please use the owner login form')
      }
      if (role === 'cashier' && userData.type !== 'cashier') {
        throw new Error('Please use the cashier login form')
      }
      
      // Login user
      login(userData, tokenData)
      toast.success(`Welcome back, ${userData.full_name}!`)
      
      // Handle redirection based on user type and previous location
      const from = location.state?.from?.pathname
      let defaultPath
      
      if (userData.type === 'owner') {
        defaultPath = '/owner/dashboard'
      } else if (userData.type === 'cashier') {
        defaultPath = '/cashier/pos'
      } else {
        defaultPath = '/'
      }
      
      // Navigate to destination
      const destination = from || defaultPath
      navigate(destination, { replace: true })
      
    } catch (err) {
      console.error('Login error:', err)
      
      // Handle different error formats
      const errorMessage = err?.message || err?.error?.message || 'Login failed. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 animate-fade-in w-full">
      
      <div className="space-y-4">
        {role === 'owner' ? (
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
        ) : (
          <Input
            label="Username"
            type="text"
            placeholder="Your username"
            icon={<User size={18} className="text-[#84BABF]" />}
            error={errors.username?.message}
            {...register('username', {
              required: 'Username is required',
              validate: validators.minLength(3),
            })}
          />
        )}

        <Input
          label="Password"
          type={showPwd ? 'text' : 'password'}
          placeholder="••••••••"
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
      </div>

      <Button
        type="submit"
        variant="primary" // Changed from generic gradient to fit standard theming
        fullWidth
        loading={isSubmitting}
        size="lg"
        icon={!isSubmitting && <LogIn size={18} />}
        className="mt-2 shadow-[0_0_20px_rgba(0,111,115,0.25)] hover:shadow-[0_0_30px_rgba(0,111,115,0.4)] border border-[#84BABF]/20 transition-all duration-300"
      >
        <span className="tracking-wide font-semibold text-[#E0EDE9]">
          Sign In as {role === 'owner' ? 'Owner' : 'Cashier'}
        </span>
      </Button>
    </form>
  )
}