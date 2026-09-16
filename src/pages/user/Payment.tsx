import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import { payment } from '../../api/stripe'
import CheckoutForm from '../../components/CheckoutForm'
import useEcomStore from '../../store/ecom-store'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

const Payment = () => {
  const token = useEcomStore((s) => s.token)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (!token) return
    payment(token)
      .then((res) => {
        setClientSecret(res.data.clientSecret)
      })
      .catch((err) => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const appearance = {
    theme: 'stripe' as const,
  }
  const loader = 'auto' as const

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">ชำระเงิน</h1>
      {clientSecret ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          กำลังโหลด...
        </div>
      )}
    </div>
  )
}

export default Payment
