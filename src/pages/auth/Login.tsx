import axios from 'axios'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import useEcomStore from '../../store/ecom-store'

const Login = () => {
  const navigate = useNavigate()
  const actionLogin = useEcomStore((state) => state.actionLogin)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const res = await actionLogin(form)
      const role = res.data.payload.role
      roleRedirect(role)
      toast.success('Welcome Back')
    } catch (err) {
      if (axios.isAxiosError<{ message: string }>(err)) {
        toast.error(err.response?.data.message)
      }
    }
  }

  const roleRedirect = (role: string) => {
    if (role === 'admin') {
      navigate('/admin')
    } else {
      navigate(-1)
    }
  }

  return (
    <div
      className="min-h-screen flex
  items-center justify-center bg-gray-100"
    >
      <div className="w-full shadow-md bg-white p-8 max-w-md">
        <h1 className="text-2xl text-center my-4 font-bold">Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              placeholder="Email"
              className="border w-full px-3 py-2 rounded
            focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-transparent"
              onChange={handleOnChange}
              name="email"
              type="email"
            />

            <input
              placeholder="Password"
              className="border w-full px-3 py-2 rounded
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-transparent"
              onChange={handleOnChange}
              name="password"
              type="password"
            />
            <button
              className="bg-blue-500 rounded-md
             w-full text-white font-bold py-2 shadow
             hover:bg-blue-700
             "
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
