import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import useEcomStore from '../../store/ecom-store'
import { numberFormat } from '../../utils/number'

const CartCard = () => {
  const carts = useEcomStore((state) => state.carts)
  const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity)
  const actionRemoveProduct = useEcomStore((state) => state.actionRemoveProduct)
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice)

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-4">ตะกร้าสินค้า</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 space-y-2">
        {carts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <ShoppingBag size={28} className="mb-2" />
            <p className="text-sm">ตะกร้าว่างเปล่า</p>
          </div>
        )}

        {carts.map((item) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-2.5">
            <div className="flex justify-between mb-2">
              <div className="flex gap-2 items-center min-w-0">
                {item.images && item.images.length > 0 ? (
                  <img
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                    src={item.images[0].url}
                    alt={item.title}
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                    No Image
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => actionRemoveProduct(item.id)}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-md h-fit shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="bg-white border border-gray-200 rounded-lg flex items-center">
                <button
                  onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                  className="px-2 py-1 text-gray-500 hover:text-gray-900"
                >
                  <Minus size={14} />
                </button>

                <span className="px-3 text-sm font-medium">{item.count}</span>

                <button
                  onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                  className="px-2 py-1 text-gray-500 hover:text-gray-900"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="font-semibold text-sm text-gray-900">
                {numberFormat(item.price * item.count)}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center px-1 pt-2">
          <span className="text-sm text-gray-500">รวม</span>
          <span className="font-semibold text-gray-900">{numberFormat(getTotalPrice())}</span>
        </div>

        <Link to="/cart">
          <button className="mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white w-full py-2.5 rounded-lg font-medium text-sm">
            ดำเนินการชำระเงิน
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CartCard
