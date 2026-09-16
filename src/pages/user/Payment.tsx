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
    <div>
      {clientSecret && (
        <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}

export default Payment
