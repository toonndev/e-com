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
        return 'bg-gray-200'
      case 'Processing':
        return 'bg-blue-200'
      case 'Completed':
        return 'bg-green-200'
      case 'Cancelled':
        return 'bg-red-200'
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ประวัติการสั่งซื้อ</h1>
      <div className="space-y-4">
        {orders?.map((item) => {
          return (
            <div key={item.id} className="bg-gray-100 p-4 rounded-md shadow-md">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-sm">Order date</p>
                  <p className="font-bold">{dateFormat(item.updatedAt ?? item.createdAt)}</p>
                </div>
                <div>
                  <span
                    className={`${getStatusColor(item.orderStatus)}
                  px-2 py-1 rounded-full`}
                  >
                    {item.orderStatus}
                  </span>
                </div>
              </div>
              <div>
                <table className="border w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th>สินค้า</th>
                      <th>ราคา</th>
                      <th>จำนวน</th>
                      <th>รวม</th>
                    </tr>
                  </thead>

                  <tbody>
                    {item.products?.map((product, index) => {
                      return (
                        <tr key={index}>
                          <td>{product.product.title}</td>
                          <td>{numberFormat(product.product.price)}</td>
                          <td>{product.count}</td>
                          <td>{numberFormat(product.count * product.product.price)} </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="text-right">
                  <p>ราคาสุทธิ</p>
                  <p>{numberFormat(item.cartTotal)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HistoryCard
