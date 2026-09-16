import {
  LayoutDashboard,
  ListOrdered,
  LogOut,
  ShoppingBasket,
  SquareChartGantt,
  UserCog,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import useEcomStore from '../../store/ecom-store'

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-white text-gray-900 shadow-sm'
      : 'text-gray-400 hover:bg-white/5 hover:text-white'
  }`

const SidebarAdmin = () => {
  const logout = useEcomStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="bg-gray-900 w-64 text-gray-100 flex flex-col h-screen shrink-0">
      <div className="h-16 flex items-center gap-2 px-6 border-b border-white/10">
        <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-sm font-bold">
          E
        </div>
        <span className="text-lg font-semibold tracking-tight">Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavLink to="/admin" end className={navItemClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="manage" className={navItemClass}>
          <UserCog size={18} />
          Manage
        </NavLink>

        <NavLink to="category" className={navItemClass}>
          <SquareChartGantt size={18} />
          Category
        </NavLink>

        <NavLink to="product" className={navItemClass}>
          <ShoppingBasket size={18} />
          Product
        </NavLink>

        <NavLink to="orders" className={navItemClass}>
          <ListOrdered size={18} />
          Orders
        </NavLink>
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default SidebarAdmin
