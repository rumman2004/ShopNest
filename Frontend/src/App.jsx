import AppRouter      from './router/AppRouter'
import { AuthProvider }  from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ShopProvider }  from './context/ShopContext'
import { CartProvider }  from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import ToastContainer    from './components/ui/Toast'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ShopProvider>
            <CartProvider>
              {/* Liquid glass background */}
              <div className="liquid-bg" aria-hidden="true">
                <div className="liquid-blob liquid-blob-1" />
                <div className="liquid-blob liquid-blob-2" />
                <div className="liquid-blob liquid-blob-3" />
              </div>

              {/* App */}
              <div className="relative z-10">
                <AppRouter />
              </div>

              {/* Global toast container */}
              <ToastContainer />
            </CartProvider>
          </ShopProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}