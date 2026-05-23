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
