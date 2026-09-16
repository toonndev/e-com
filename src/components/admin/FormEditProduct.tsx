import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { readProduct, updateProduct, type ProductForm } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import Uploadfile from './Uploadfile'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
const labelClass = 'block text-xs font-medium text-gray-500 mb-1'

const initialState: ProductForm = {
  title: 'Core i7',
  description: 'desc',
  price: 200,
  quantity: 20,
  categoryId: '',
  images: [],
}

const FormEditProduct = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const token = useEcomStore((state) => state.token)
  const getCategory = useEcomStore((state) => state.getCategory)
  const categories = useEcomStore((state) => state.categories)

  const [form, setForm] = useState<ProductForm>(initialState)

  useEffect(() => {
    getCategory()
    if (token && id) fetchProduct(token, id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProduct = async (token: string, id: string) => {
    try {
      const res = await readProduct(token, id)
      setForm({
        title: res.data.title,
        description: res.data.description,
        price: res.data.price,
        quantity: res.data.quantity,
        categoryId: String(res.data.categoryId ?? ''),
        images: res.data.images,
      })
    } catch (err) {
      console.log('Err fetch data', err)
    }
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token || !id) return
    try {
      const res = await updateProduct(token, id, form)
      toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`)
      navigate('/admin/product')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">แก้ไขข้อมูลสินค้า</h1>
        <p className="text-sm text-gray-500 mt-1">อัปเดตรายละเอียดสินค้า</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 max-w-2xl"
      >
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
              className={inputClass}
              value={form.price}
              onChange={handleOnChange}
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
              className={inputClass}
              value={form.quantity}
              onChange={handleOnChange}
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
          แก้ไขสินค้า
        </button>
      </form>
    </div>
  )
}

export default FormEditProduct
