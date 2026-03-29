import { Link } from 'react-router-dom'
import { Store, ArrowLeft } from 'lucide-react'
import RegisterForm from '../../features/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#051F20]">
      
      {/* ─── AMBIENT BACKGROUND GLOW ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#006F73]/20 rounded-full blur-[120px] pointer-events-none" />

      {/* ─── BACK TO HOME BUTTON ─── */}
      <Link
        to="/"
        className={`
          absolute top-6 left-6 md:top-8 md:left-8 z-50 
          flex items-center gap-2 px-4 py-2.5 rounded-xl 
          bg-[#085558]/20 hover:bg-[#006F73]/40 
          border border-[#84BABF]/10 hover:border-[#84BABF]/40 
          text-[#84BABF] hover:text-[#E0EDE9] text-sm font-bold tracking-wide 
          backdrop-blur-md shadow-lg transition-all duration-300 group
          animate-fade-in
        `}
      >
        <ArrowLeft 
          size={18} 
          strokeWidth={2.5} 
          className="transition-transform duration-300 group-hover:-translate-x-1" 
        />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <div className="w-full max-w-[420px] relative z-10 animate-slide-up">
        
        {/* ─── BRANDING HEADER ─── */}
        <div className="flex flex-col items-center mb-10">
          
          {/* Logo Container */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#051F20] via-[#235347] to-[#8EB69B] flex items-center justify-center shadow-[0_0_40px_rgba(0,111,115,0.4)] border border-[#84BABF]/30 mb-6 relative group">
             {/* Subtle Inner Glow on Hover */}
             <div className="absolute inset-0 rounded-2xl bg-[#84BABF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <Store size={32} className="text-[#E0EDE9] relative z-10" />
          </div>
          
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#E0EDE9] via-white to-[#84BABF] bg-clip-text text-transparent tracking-tight">
            Create Account
          </h1>
          <p className="text-[15px] font-medium text-[#84BABF] mt-2">
            Start your ShopNest journey today
          </p>
        </div>

        {/* ─── REGISTER FORM CARD ─── */}
        <div className="bg-[#0B2B26]/80 backdrop-blur-2xl border border-[#84BABF]/20 rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-[#06363D]">
          
          <RegisterForm />

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-[#84BABF]/10 text-center">
            <p className="text-sm font-medium text-[#84BABF]">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#E0EDE9] hover:text-white transition-colors font-bold underline underline-offset-4 decoration-[#006F73] hover:decoration-[#84BABF]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  )
}