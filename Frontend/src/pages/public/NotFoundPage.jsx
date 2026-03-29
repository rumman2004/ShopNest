import { Link } from 'react-router-dom'
import Button   from '../../components/ui/Button'
import { Home, Compass } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#0B2B26]">
      
      {/* ─── AMBIENT BACKGROUND GLOWS ─── */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#006F73]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#085558]/30 rounded-full blur-[120px] pointer-events-none" />

      {/* ─── MAIN CONTENT ─── */}
      <div className="text-center relative z-10 animate-fade-in max-w-lg w-full">
        
        {/* Animated Radar/Compass Icon */}
        <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center group cursor-default">
          {/* Pulsing radar ring */}
          <div 
            className="absolute inset-0 rounded-full bg-[#006F73]/30 animate-ping opacity-75" 
            style={{ animationDuration: '3s' }} 
          />
          {/* Frosted Glass Icon Wrapper */}
          <div className="relative w-full h-full rounded-full bg-[#085558]/40 backdrop-blur-xl border border-[#84BABF]/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,111,115,0.4)] transition-transform duration-500 group-hover:scale-110">
            <Compass 
              size={48} 
              className="text-[#84BABF] group-hover:text-[#E0EDE9] transition-all duration-500 group-hover:rotate-45" 
              strokeWidth={1.5} 
            />
          </div>
        </div>

        {/* Giant Gradient 404 Text */}
        <h1 className="text-[7rem] sm:text-[9rem] font-extrabold leading-none tracking-tighter mb-2 bg-gradient-to-b from-[#E0EDE9] via-[#84BABF] to-[#006F73] bg-clip-text text-transparent drop-shadow-2xl select-none">
          404
        </h1>
        
        {/* Subheadings */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#E0EDE9] mb-4 tracking-wide">
          Looks like you're lost.
        </h2>
        
        <p className="text-[#84BABF] mb-10 text-base sm:text-lg leading-relaxed px-2">
          We've explored everywhere, but couldn't find the page you were looking for. It might have been moved, deleted, or never existed at all.
        </p>
        
        {/* Call to Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link to="/" className="w-full sm:w-auto">
            <Button 
              variant="primary" 
              size="lg" 
              icon={<Home size={20} />}
              className="w-full sm:w-auto shadow-[0_0_20px_rgba(0,111,115,0.3)] hover:shadow-[0_0_40px_rgba(0,111,115,0.5)] border border-[#84BABF]/20 transition-all duration-300 py-3 sm:px-8"
            >
              <span className="tracking-wide font-semibold text-[#E0EDE9] text-base">
                Return to Safety
              </span>
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}