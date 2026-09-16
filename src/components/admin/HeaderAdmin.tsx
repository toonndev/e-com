import { Bell } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'

const HeaderAdmin = () => {
  const user = useEcomStore((state) => state.user)

  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 border-b border-gray-200">
      <p className="text-sm text-gray-400">Welcome back</p>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
            {user?.email?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <span className="text-sm font-medium text-gray-700">{user?.email ?? 'Admin'}</span>
        </div>
      </div>
    </header>
  )
}

export default HeaderAdmin
