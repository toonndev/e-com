import { CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from '../../utils/toast'
import { useNavigate } from 'react-router-dom'
import { listUserCart, saveAddress, type UserCartResponse } from '../../api/user'
import useEcomStore from '../../store/ecom-store'
import { numberFormat } from '../../utils/number'

const SummaryCard = () => {
  const token = useEcomStore((state) => state.token)
  const [products, setProducts] = useState<UserCartResponse['products']>([])
  const [cartTotal, setCartTotal] = useState(0)

  const [address, setAddress] = useState('')
  const [addressSaved, setAddressSaved] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return
    hdlGetUserCart(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hdlGetUserCart = (token: string) => {
    listUserCart(token)
      .then((res) => {
        setProducts(res.data.products)
        setCartTotal(res.data.cartTotal)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const hdlSaveAddress = () => {
    if (!address) {
      toast.warning('กรุณากรอกที่อยู่จัดส่ง')
      return
    }
    if (!token) return
    saveAddress(token, address)
      .then((res) => {
        toast.success(res.data.message)
        setAddressSaved(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const hdlGoToPayment = () => {
    if (!addressSaved) {
      toast.warning('กรุณาบันทึกที่อยู่จัดส่งก่อนดำเนินการชำระเงิน')
      return
    }
    navigate('/user/payment')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">สรุปคำสั่งซื้อ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3 h-fit">
          <h2 className="font-semibold text-gray-900">ที่อยู่ในการจัดส่ง</h2>
          <textarea
            required
            onChange={(e) => setAddress(e.target.value)}
            placeholder="กรุณากรอกที่อยู่"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={hdlSaveAddress}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white
              px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"
          >
            {addressSaved && <CheckCircle2 size={16} />}
            {addressSaved ? 'บันทึกแล้ว' : 'Save Address'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">คำสั่งซื้อของคุณ</h2>

          <div className="space-y-3">
            {products?.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-gray-900">{item.product.title}</p>
                  <p className="text-xs text-gray-500">
                    จำนวน : {item.count} x {numberFormat(item.product.price)}
                  </p>
                </div>

                <p className="text-sm font-semibold text-gray-900">
                  {numberFormat(item.count * item.product.price)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-sm text-gray-500">
            <div className="flex justify-between">
              <p>ค่าจัดส่ง:</p>
              <p>0.00</p>
            </div>
            <div className="flex justify-between">
              <p>ส่วนลด:</p>
              <p>0.00</p>
            </div>
          </div>

          <hr className="border-gray-100" />
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-900">ยอดรวมสุทธิ:</p>
            <p className="font-semibold text-gray-900 text-lg">{numberFormat(cartTotal)}</p>
          </div>

          <button
            onClick={hdlGoToPayment}
            className="bg-blue-600 hover:bg-blue-700 transition-colors w-full py-2.5 rounded-lg
              text-white font-medium text-sm"
          >
            ดำเนินการชำระเงิน
          </button>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
