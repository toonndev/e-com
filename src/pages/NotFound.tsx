import { CompassIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-4">
          <CompassIcon size={22} />
        </div>
        <p className="text-3xl font-bold text-gray-900">404</p>
        <h1 className="text-lg font-semibold text-gray-900 mt-1">ไม่พบหน้านี้</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือไม่มีอยู่จริง</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-lg"
        >
          กลับไปหน้าแรก
        </Link>
      </div>
    </div>
  )
}

export default NotFound
