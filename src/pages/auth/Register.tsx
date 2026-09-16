import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from '../../utils/toast'
import { Link, useNavigate } from 'react-router-dom'
import zxcvbn from 'zxcvbn'
import { z } from 'zod'
import { register as registerApi } from '../../api/auth'

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email!!!' }),
    password: z.string().min(8, { message: 'Password ต้องมากกว่า 8 ตัวอักษร' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password มันบ่ตรงกันเด้อ',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const inputClass = (hasError: boolean) =>
  `border w-full px-3 py-2 pr-10 rounded-lg text-sm
   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
   ${hasError ? 'border-red-400' : 'border-gray-300'}`

const Register = () => {
  const navigate = useNavigate()
  const [passwordScore, setPasswordScore] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password')

  useEffect(() => {
    setPasswordScore(zxcvbn(password ? password : '').score)
  }, [password])

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerApi(data)
      toast.success('สมัครสมาชิกสำเร็จ')
      navigate('/login')
    } catch (err) {
      if (axios.isAxiosError<{ message: string }>(err)) {
        toast.error(err.response?.data.message)
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <UserPlus size={22} />
        </div>
        <h1 className="text-xl font-semibold text-center text-gray-900">Register</h1>
        <p className="text-sm text-gray-500 text-center mt-1 mb-6">สมัครสมาชิกใหม่</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                {...register('email')}
                placeholder="Email"
                className={inputClass(!!errors.email)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative">
                <input
                  {...register('password')}
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  className={inputClass(!!errors.password)}
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

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
              {password?.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {Array.from(Array(5).keys()).map((_item, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-full h-1.5 ${
                        passwordScore <= 2
                          ? 'bg-red-500'
                          : passwordScore < 4
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  className={inputClass(!!errors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button className="bg-blue-600 rounded-lg w-full text-white font-medium text-sm py-2.5 hover:bg-blue-700 transition-colors">
              Register
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
