import axios from 'axios'
import { ListCheck } from 'lucide-react'
import { toast } from '../../utils/toast'
import { Link, useNavigate } from 'react-router-dom'
import { createUserCart } from '../../api/user'
import useEcomStore from '../../store/ecom-store'
import { numberFormat } from '../../utils/number'

const ListCart = () => {
  const cart = useEcomStore((state) => state.carts)
  const user = useEcomStore((s) => s.user)
  const token = useEcomStore((s) => s.token)
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice)

  const navigate = useNavigate()

  const handleSaveCart = async () => {
    if (!token) return
    await createUserCart(token, { cart })
      .then(() => {
        toast.success('บันทึกใส่ตะกร้าเรียบร้อยแล้วจ้า', {
          position: 'top-center',
        })
        navigate('/checkout')
      })
      .catch((err) => {
        if (axios.isAxiosError<{ message: string }>(err)) {
          toast.warning(err.response?.data.message)
        }
      })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <ListCheck size={20} />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">รายการสินค้า {cart.length} รายการ</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-2">
          {cart.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
              ยังไม่มีสินค้าในตะกร้า
            </div>
          )}
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex justify-between items-center"
            >
              <div className="flex gap-3 items-center min-w-0">
                {item.images && item.images.length > 0 ? (
                  <img
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    src={item.images[0].url}
                    alt={item.title}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                    No Image
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {numberFormat(item.price)} x {item.count}
                  </p>
                </div>
              </div>

              <div className="font-semibold text-gray-900 shrink-0">
                {numberFormat(item.price * item.count)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4 h-fit">
          <p className="text-lg font-semibold text-gray-900">ยอดรวม</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">รวมสุทธิ</span>
            <span className="text-xl font-semibold text-gray-900">
              {numberFormat(getTotalPrice())}
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <button
                disabled={cart.length < 1}
                onClick={handleSaveCart}
                className="bg-blue-600 w-full rounded-lg text-white py-2.5 font-medium text-sm
                  hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                สั่งซื้อ
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-blue-600 w-full rounded-lg text-white py-2.5 font-medium text-sm hover:bg-blue-700 transition-colors">
                  Login
                </button>
              </Link>
            )}

            <Link to="/shop">
              <button className="bg-gray-100 w-full rounded-lg text-gray-700 py-2.5 font-medium text-sm hover:bg-gray-200 transition-colors">
                แก้ไขรายการ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListCart
