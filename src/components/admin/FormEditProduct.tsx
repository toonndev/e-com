import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { readProduct, updateProduct, type ProductForm } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import Uploadfile from './Uploadfile'

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
    <div className="container mx-auto p-4 bg-white shadow-md">
      <form onSubmit={handleSubmit}>
        <h1>เพิ่มข้อมูลสินค้า</h1>
        <input
          className="border"
          value={form.title}
          onChange={handleOnChange}
          placeholder="Title"
          name="title"
        />
        <input
          className="border"
          value={form.description}
          onChange={handleOnChange}
          placeholder="Description"
          name="description"
        />
        <input
          type="number"
          className="border"
          value={form.price}
          onChange={handleOnChange}
          placeholder="price"
          name="price"
        />
        <input
          type="number"
          className="border"
          value={form.quantity}
          onChange={handleOnChange}
          placeholder="quantity"
          name="quantity"
        />
        <select
          className="border"
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
        <hr />
        <Uploadfile form={form} setForm={setForm} />

        <button className="bg-blue-500">แก้ไขสินค้า</button>

        <hr />
        <br />
      </form>
    </div>
  )
}

export default FormEditProduct
