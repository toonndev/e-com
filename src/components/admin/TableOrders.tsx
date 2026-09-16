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
    <div className="container mx-auto p-4 bg-white shadow-md">
      <div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 border">
              <th>ลำดับ</th>
              <th>ผู้ใช้งาน</th>
              <th>วันที่</th>
              <th>สินค้า</th>
              <th>รวม</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((item, index) => {
              return (
                <tr key={item.id} className="border">
                  <td className="text-center">{index + 1}</td>
                  <td>
                    <p>{item.orderedBy.email}</p>
                    <p>{item.orderedBy.address}</p>
                  </td>

                  <td>{dateFormat(item.createdAt)}</td>

                  <td className="px-2 py-4">
                    {item.products?.map((product, i) => (
                      <li key={i}>
                        {product.product.title} {'  '}
                        <span className="text-sm">
                          {product.count} x {numberFormat(product.product.price)}
                        </span>
                      </li>
                    ))}
                  </td>

                  <td>{numberFormat(item.cartTotal)}</td>

                  <td>
                    <span
                      className={`${getStatusColor(item.orderStatus)} px-2 py-1
rounded-full`}
                    >
                      {item.orderStatus}
                    </span>
                  </td>

                  <td>
                    <select
                      value={item.orderStatus}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        token &&
                        handleChangeOrderStatus(token, item.id, e.target.value as OrderStatus)
                      }
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
