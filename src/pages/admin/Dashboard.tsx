import { ListOrdered, ShoppingBasket, SquareChartGantt, UserCog } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'

const stats = [
  { label: 'Products', icon: ShoppingBasket, color: 'bg-blue-50 text-blue-600' },
  { label: 'Categories', icon: SquareChartGantt, color: 'bg-purple-50 text-purple-600' },
  { label: 'Orders', icon: ListOrdered, color: 'bg-amber-50 text-amber-600' },
  { label: 'Users', icon: UserCog, color: 'bg-emerald-50 text-emerald-600' },
]

const Dashboard = () => {
  const products = useEcomStore((state) => state.products)
  const categories = useEcomStore((state) => state.categories)

  const values = [products.length, categories.length, '-', '-']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">ภาพรวมระบบร้านค้า</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-4">{values[index]}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
