import { ChevronDown, LogOut, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import useEcomStore from '../store/ecom-store'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

function MainNav() {
  const carts = useEcomStore((s) => s.carts)
  const user = useEcomStore((s) => s.user)
  const logout = useEcomStore((s) => s.logout)

  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 mr-4">
              LOGO
            </Link>

            <NavLink className={navLinkClass} to="/">
              Home
            </NavLink>

            <NavLink className={navLinkClass} to="/shop">
              Shop
            </NavLink>

            <NavLink className={navLinkClass} to="/cart">
              <span className="flex items-center gap-1.5">
                <ShoppingBag size={16} />
                Cart
                {carts.length > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    {carts.length}
                  </span>
                )}
              </span>
            </NavLink>
          </div>

          {user ? (
            <div className="relative flex items-center">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:bg-gray-100 px-2 py-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <User size={16} />
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isOpen && (
                <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-40 py-1 overflow-hidden">
                  <Link
                    to="/user/history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    History
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink className={navLinkClass} to="/register">
                Register
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`
                }
              >
                Login
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default MainNav
