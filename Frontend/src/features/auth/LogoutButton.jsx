import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../../hooks/useAuth'
import { useToast }    from '../../hooks/useToast'
import Button          from '../../components/ui/Button'
import { LogOut }      from 'lucide-react'

export default function LogoutButton({ className = '', showText = true }) {
  const { logout } = useAuth()
  const { toast }  = useToast()
  const navigate   = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully. Have a great day!')
    navigate('/login')
  }

  return (
    <Button
      variant="secondary" // Use secondary as base so it blends with your theme
      size="sm"
      icon={<LogOut size={16} className="shrink-0 transition-transform group-hover:-translate-x-0.5" />}
      onClick={handleLogout}
      title="Securely sign out"
      className={`
        group
        /* Danger-on-Intent styling: Matches theme normally, glows red on hover */
        hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 
        hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] 
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {showText && (
        <span className="font-medium tracking-wide">
          Sign Out
        </span>
      )}
    </Button>
  )
}