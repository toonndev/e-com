import { ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const LoadingToRedirect = () => {
  const [count, setCount] = useState(5)
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => {
        if (currentCount === 1) {
          clearInterval(interval)
          setRedirect(true)
        }
        return currentCount - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (redirect) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={22} />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
        <p className="text-sm text-gray-500 mt-1">
          กำลังพากลับไปหน้าแรกใน {count} วินาที...
        </p>
      </div>
    </div>
  )
}

export default LoadingToRedirect
