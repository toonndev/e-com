import { Tag, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { toast } from '../../utils/toast'
import { createCategory, removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'

const FormCategory = () => {
  const token = useEcomStore((state) => state.token)
  const [name, setName] = useState('')
  const categories = useEcomStore((state) => state.categories)
  const getCategory = useEcomStore((state) => state.getCategory)

  useEffect(() => {
    getCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !token) {
      toast.warning('กรุณากรอกชื่อหมวดหมู่')
      return
    }
    try {
      const res = await createCategory(token, { name })
      toast.success(`เพิ่มหมวดหมู่ "${res.data.name}" สำเร็จ`)
      setName('')
      getCategory()
    } catch (err) {
      console.log(err)
    }
  }

  const handleRemove = async (id: number) => {
    if (!token) return
    try {
      const res = await removeCategory(token, id)
      toast.success(`ลบหมวดหมู่ "${res.data.name}" สำเร็จ`)
      getCategory()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Category Management</h1>
        <p className="text-sm text-gray-500 mt-1">จัดการหมวดหมู่สินค้า</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อหมวดหมู่..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="text"
          />
          <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm">
            เพิ่มหมวดหมู่
          </button>
        </form>

        <ul className="mt-6 divide-y divide-gray-100">
          {categories.length === 0 && (
            <li className="py-6 text-center text-sm text-gray-400">ยังไม่มีหมวดหมู่</li>
          )}
          {categories.map((item) => (
            <li className="flex items-center justify-between py-3" key={item.id}>
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <Tag size={16} className="text-gray-400" />
                {item.name}
              </span>

              <button
                className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FormCategory
