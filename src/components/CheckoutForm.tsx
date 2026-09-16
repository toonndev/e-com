import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState, type FormEvent } from 'react'
import { toast } from '../utils/toast'
import { useNavigate } from 'react-router-dom'
import { saveOrder } from '../api/user'
import useEcomStore from '../store/ecom-store'
import '../stripe.css'

export default function CheckoutForm() {
  const token = useEcomStore((state) => state.token)
  const clearCart = useEcomStore((state) => state.clearCart)

  const navigate = useNavigate()

  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !token) {
      return
    }

    setIsLoading(true)

    const payload = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (payload.error) {
      setMessage(payload.error.message ?? null)
      toast.error(payload.error.message)
    } else if (payload.paymentIntent.status === 'succeeded') {
      saveOrder(token, payload)
        .then(() => {
          clearCart()
          toast.success('Payment Success!!!')
          navigate('/user/history')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      toast.warning('ชำระเงินไม่สำเร็จ')
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: 'tabs' as const,
  }

  return (
    <>
      <form className="space-y-6" id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button className="stripe-button" disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
          </span>
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  )
}
