import axios from 'axios'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from '../../utils/toast'
import { Link, useNavigate } from 'react-router-dom'
import useEcomStore from '../../store/ecom-store'

const Login = () => {
  const navigate = useNavigate()
  const actionLogin = useEcomStore((state) => state.actionLogin)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

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
      toast.success('เข้าสู่ระบบสำเร็จ')
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <LogIn size={22} />
        </div>
        <h1 className="text-xl font-semibold text-center text-gray-900">Login</h1>
        <p className="text-sm text-gray-500 text-center mt-1 mb-6">ยินดีต้อนรับกลับมา</p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              placeholder="Email"
              className="border border-gray-300 w-full px-3 py-2 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-transparent"
              onChange={handleOnChange}
              name="email"
              type="email"
            />

            <div className="relative">
              <input
                placeholder="Password"
                className="border border-gray-300 w-full px-3 py-2 pr-10 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-transparent"
                onChange={handleOnChange}
                name="password"
                type={showPassword ? 'text' : 'password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button className="bg-blue-600 rounded-lg w-full text-white font-medium text-sm py-2.5 hover:bg-blue-700 transition-colors">
              Login
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
