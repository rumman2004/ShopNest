import { Link } from 'react-router-dom'
import { Store, ArrowLeft } from 'lucide-react'
import RegisterForm from '../../features/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#F0EDE5]">
      <div className="absolute inset-x-0 top-0 h-30 bg-white/50 border-b border-[#d9d4c8] pointer-events-none" />

      {/* ─── BACK TO HOME BUTTON ─── */}
      <Link
        to="/"
        className={`
          absolute top-6 left-6 md:top-8 md:left-8 z-50 
          flex items-center gap-2 px-4 py-2.5 rounded-xl 
          bg-white hover:bg-[#e5f2f1] 
          border border-[#d9d4c8] hover:border-[#004643]/35 
          text-[#004643] text-sm font-bold tracking-wide 
          shadow-sm transition-all duration-300 group
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
          <div className="w-16 h-16 rounded-xl bg-[#004643] flex items-center justify-center shadow-md border border-[#003734] mb-6 relative group">
             {/* Subtle Inner Glow on Hover */}
             <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <Store size={32} className="text-white relative z-10" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-[#182321] tracking-tight">
            Create Account
          </h1>
          <p className="text-[15px] font-medium text-[#697773] mt-2">
            Start your ShopNest journey today
          </p>
        </div>

        {/* ─── REGISTER FORM CARD ─── */}
        <div className="bg-white border border-[#d9d4c8] rounded-lg p-8 sm:p-10 shadow-lg shadow-[#d9d4c8]/40">
          
          <RegisterForm />

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-[#ebe6dc] text-center">
            <p className="text-sm font-medium text-[#697773]">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#004643] hover:text-[#003734] transition-colors font-bold underline underline-offset-4 decoration-[#004643]/40 hover:decoration-[#004643]"
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
