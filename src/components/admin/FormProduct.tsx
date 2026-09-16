import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { createProduct, deleteProduct, type ProductForm } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import { dateFormat } from '../../utils/dateformat'
import { numberFormat } from '../../utils/number'
import Uploadfile from './Uploadfile'

const initialState: ProductForm = {
  title: '',
  description: '',
  price: 0,
  quantity: 0,
  categoryId: '',
  images: [],
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

const FormProduct = () => {
  const token = useEcomStore((state) => state.token)
  const getCategory = useEcomStore((state) => state.getCategory)
  const categories = useEcomStore((state) => state.categories)
  const getProduct = useEcomStore((state) => state.getProduct)
  const products = useEcomStore((state) => state.products)

  const [form, setForm] = useState<ProductForm>(initialState)

  useEffect(() => {
    getCategory()
    getProduct(100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      const res = await createProduct(token, form)
      setForm(initialState)
      getProduct()
      toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!token) return
    if (window.confirm('จะลบจริงๆ หรอ')) {
      try {
        await deleteProduct(token, String(id))
        toast.success('Deleted สินค้าเรียบร้อยแล้ว')
        getProduct()
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">เพิ่มข้อมูลสินค้า</h1>
        <p className="text-sm text-gray-500 mt-1">จัดการรายการสินค้าทั้งหมด</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className={inputClass}
            value={form.title}
            onChange={handleOnChange}
            placeholder="Title"
            name="title"
          />
          <input
            className={inputClass}
            value={form.description}
            onChange={handleOnChange}
            placeholder="Description"
            name="description"
          />
          <input
            type="number"
            className={inputClass}
            value={form.price}
            onChange={handleOnChange}
            placeholder="price"
            name="price"
          />
          <input
            type="number"
            className={inputClass}
            value={form.quantity}
            onChange={handleOnChange}
            placeholder="quantity"
            name="quantity"
          />
          <select
            className={`${inputClass} sm:col-span-2`}
            name="categoryId"
            onChange={handleOnChange}
            required
            value={form.categoryId}
          >
            <option value="" disabled>
              Please Select
            </option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <hr className="border-gray-100" />
        <Uploadfile form={form} setForm={setForm} />

        <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm">
          เพิ่มสินค้า
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-500">
              <th scope="col" className="px-4 py-3 font-medium">No.</th>
              <th scope="col" className="px-4 py-3 font-medium">รูปภาพ</th>
              <th scope="col" className="px-4 py-3 font-medium">ชื่อสินค้า</th>
              <th scope="col" className="px-4 py-3 font-medium">รายละเอียด</th>
              <th scope="col" className="px-4 py-3 font-medium">ราคา</th>
              <th scope="col" className="px-4 py-3 font-medium">จำนวน</th>
              <th scope="col" className="px-4 py-3 font-medium">ขายได้</th>
              <th scope="col" className="px-4 py-3 font-medium">วันที่อัปเดต</th>
              <th scope="col" className="px-4 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  ยังไม่มีสินค้า
                </td>
              </tr>
            )}
            {products.map((item, index) => {
              return (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>

                  <td className="px-4 py-3">
                    {item.images.length > 0 ? (
                      <img
                        className="w-14 h-14 rounded-lg object-cover shadow-sm"
                        src={item.images[0].url}
                        alt={item.title}
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{numberFormat(item.price)}</td>
                  <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-700">{item.sold}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.updatedAt ? dateFormat(item.updatedAt) : ''}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link
                        to={'/admin/product/' + item.id}
                        className="text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors p-1.5 rounded-md"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-md"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FormProduct
