import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from '../../utils/toast'
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

const Register = () => {
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
      const res = await registerApi(data)
      toast.success(String(res.data))
    } catch (err) {
      if (axios.isAxiosError<{ message: string }>(err)) {
        toast.error(err.response?.data.message)
      }
    }
  }

  return (
    <div
      className="min-h-screen flex
    items-center justify-center bg-gray-100"
    >
      <div className="w-full shadow-md bg-white p-8 max-w-md">
        <h1 className="text-2xl text-center my-4 font-bold">Register</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                {...register('email')}
                placeholder="Email"
                className={`border w-full px-3 py-2 rounded
            focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-transparent
            ${errors.email && 'border-red-500'}
            `}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative">
                <input
                  {...register('password')}
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  className={`border w-full px-3 py-2 pr-10 rounded
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent
              ${errors.password && 'border-red-500'}
              `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
              {password?.length > 0 && (
                <div className="flex mt-2">
                  {Array.from(Array(5).keys()).map((_item, index) => (
                    <span className="w-1/5 px-1" key={index}>
                      <div
                        className={`rounded h-2 ${
                          passwordScore <= 2
                            ? 'bg-red-500'
                            : passwordScore < 4
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }
              `}
                      ></div>
                    </span>
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
                  className={`border w-full px-3 py-2 pr-10 rounded
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent
                ${errors.confirmPassword && 'border-red-500'}
                `}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              className="bg-blue-500 rounded-md
             w-full text-white font-bold py-2 shadow
             hover:bg-blue-700
             "
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
