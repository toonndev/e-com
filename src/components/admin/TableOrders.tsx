import { useEffect, useState, type ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import { changeOrderStatus, getOrdersAdmin } from '../../api/admin'
import useEcomStore from '../../store/ecom-store'
import type { Order, OrderStatus } from '../../types'
import { dateFormat } from '../../utils/dateformat'
import { numberFormat } from '../../utils/number'

const TableOrders = () => {
  const token = useEcomStore((state) => state.token)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!token) return
    handleGetOrder(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGetOrder = (token: string) => {
    getOrdersAdmin(token)
      .then((res) => {
        setOrders(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleChangeOrderStatus = (token: string, orderId: number, orderStatus: OrderStatus) => {
    changeOrderStatus(token, orderId, orderStatus)
      .then(() => {
        toast.success('Update Status Success!!!')
        handleGetOrder(token)
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">จัดการคำสั่งซื้อทั้งหมด</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">ลำดับ</th>
              <th className="px-4 py-3 font-medium">ผู้ใช้งาน</th>
              <th className="px-4 py-3 font-medium">วันที่</th>
              <th className="px-4 py-3 font-medium">สินค้า</th>
              <th className="px-4 py-3 font-medium">รวม</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  ยังไม่มีคำสั่งซื้อ
                </td>
              </tr>
            )}
            {orders?.map((item, index) => {
              return (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors align-top">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{item.orderedBy.email}</p>
                    <p className="text-gray-500">{item.orderedBy.address}</p>
                  </td>

                  <td className="px-4 py-3 text-gray-500">{dateFormat(item.createdAt)}</td>

                  <td className="px-4 py-3 text-gray-600">
                    <ul className="space-y-0.5">
                      {item.products?.map((product, i) => (
                        <li key={i}>
                          {product.product.title}{' '}
                          <span className="text-gray-400">
                            {product.count} x {numberFormat(product.product.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900">
                    {numberFormat(item.cartTotal)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`${getStatusColor(item.orderStatus)} px-2.5 py-1 rounded-full text-xs font-medium`}
                    >
                      {item.orderStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={item.orderStatus}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        token &&
                        handleChangeOrderStatus(token, item.id, e.target.value as OrderStatus)
                      }
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Not Process</option>
                      <option>Processing</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableOrders
