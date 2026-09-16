import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from '../../utils/toast'
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
const labelClass = 'block text-xs font-medium text-gray-500 mb-1'

const FormProduct = () => {
  const token = useEcomStore((state) => state.token)
  const getCategory = useEcomStore((state) => state.getCategory)
  const categories = useEcomStore((state) => state.categories)
  const getProduct = useEcomStore((state) => state.getProduct)
  const products = useEcomStore((state) => state.products)

  const [form, setForm] = useState<ProductForm>(initialState)
  const [priceInput, setPriceInput] = useState('')
  const [quantityInput, setQuantityInput] = useState('')

  useEffect(() => {
    getCategory()
    getProduct(100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPriceInput(value)
    setForm({ ...form, price: value === '' ? 0 : Number(value) })
  }

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setQuantityInput(value)
    setForm({ ...form, quantity: value === '' ? 0 : Number(value) })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      const res = await createProduct(token, form)
      setForm(initialState)
      setPriceInput('')
      setQuantityInput('')
      getProduct()
      toast.success(`เพิ่มสินค้า "${res.data.title}" แล้ว`)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!token) return
    if (window.confirm('ต้องการลบสินค้านี้ใช่ไหม?')) {
      try {
        await deleteProduct(token, String(id))
        toast.success('ลบสินค้าแล้ว')
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
          <div>
            <label htmlFor="title" className={labelClass}>
              ชื่อสินค้า
            </label>
            <input
              id="title"
              className={inputClass}
              value={form.title}
              onChange={handleOnChange}
              placeholder="Title"
              name="title"
            />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>
              รายละเอียดสินค้า
            </label>
            <input
              id="description"
              className={inputClass}
              value={form.description}
              onChange={handleOnChange}
              placeholder="Description"
              name="description"
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClass}>
              ราคา (บาท)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              className={inputClass}
              value={priceInput}
              onChange={handlePriceChange}
              onFocus={(e) => e.target.select()}
              placeholder="price"
              name="price"
            />
          </div>
          <div>
            <label htmlFor="quantity" className={labelClass}>
              จำนวนคงเหลือ
            </label>
            <input
              id="quantity"
              type="number"
              step="1"
              min="0"
              inputMode="numeric"
              className={inputClass}
              value={quantityInput}
              onChange={handleQuantityChange}
              onFocus={(e) => e.target.select()}
              placeholder="quantity"
              name="quantity"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="categoryId" className={labelClass}>
              หมวดหมู่สินค้า
            </label>
            <select
              id="categoryId"
              className={inputClass}
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
