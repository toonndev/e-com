import { PackageOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getOrders } from '../../api/user'
import useEcomStore from '../../store/ecom-store'
import type { Order, OrderStatus } from '../../types'
import { dateFormat } from '../../utils/dateformat'
import { numberFormat } from '../../utils/number'

const HistoryCard = () => {
  const token = useEcomStore((state) => state.token)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!token) return
    hdlGetOrders(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hdlGetOrders = (token: string) => {
    getOrders(token)
      .then((res) => {
        setOrders(res.data.orders)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Not Process':
        return 'bg-gray-100 text-gray-700'
      case 'Processing':
        return 'bg-blue-100 text-blue-700'
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'Cancelled':
        return 'bg-red-100 text-red-700'
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">ประวัติการสั่งซื้อ</h1>

      {orders.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 flex flex-col items-center gap-2">
          <PackageOpen size={28} />
          <p className="text-sm">ยังไม่มีประวัติการสั่งซื้อ</p>
        </div>
      )}

      <div className="space-y-4">
        {orders?.map((item) => {
          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs text-gray-500">Order date</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {dateFormat(item.updatedAt ?? item.createdAt)}
                  </p>
                </div>
                <span
                  className={`${getStatusColor(item.orderStatus)} px-2.5 py-1 rounded-full text-xs font-medium`}
                >
                  {item.orderStatus}
                </span>
              </div>

              <div className="rounded-lg border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-left">
                      <th className="px-3 py-2 font-medium">สินค้า</th>
                      <th className="px-3 py-2 font-medium">ราคา</th>
                      <th className="px-3 py-2 font-medium">จำนวน</th>
                      <th className="px-3 py-2 font-medium">รวม</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {item.products?.map((product, index) => {
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2 text-gray-900">{product.product.title}</td>
                          <td className="px-3 py-2 text-gray-600">
                            {numberFormat(product.product.price)}
                          </td>
                          <td className="px-3 py-2 text-gray-600">{product.count}</td>
                          <td className="px-3 py-2 text-gray-900 font-medium">
                            {numberFormat(product.count * product.product.price)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="text-right mt-3">
                <p className="text-xs text-gray-500">ราคาสุทธิ</p>
                <p className="font-semibold text-gray-900">{numberFormat(item.cartTotal)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HistoryCard
