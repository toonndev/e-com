import { Pencil, Trash } from 'lucide-react'
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

        <button
          className="bg-blue-500 p-2 rounded-md shadow-md
                hover:scale-105 hover:-translate-y-1 hover:duration-200
                "
        >
          เพิ่มสินค้า
        </button>

        <hr />
        <br />
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-200 border">
              <th scope="col">No.</th>
              <th scope="col">รูปภาพ</th>
              <th scope="col">ชื่อสินค้า</th>
              <th scope="col">รายละเอียด</th>
              <th scope="col">ราคา</th>
              <th scope="col">จำนวน</th>
              <th scope="col">จำนวนที่ขายได้</th>
              <th scope="col">วันที่อัปเดต</th>
              <th scope="col">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>

                  <td>
                    {item.images.length > 0 ? (
                      <img
                        className="w-24 h-24 rounded-lg shadow-md"
                        src={item.images[0].url}
                        alt={item.title}
                      />
                    ) : (
                      <div
                        className="w-24 h-24 bg-gray-200 rounded-md
                                                    flex items-center justify-center shadow-sm"
                      >
                        No Image
                      </div>
                    )}
                  </td>

                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{numberFormat(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{item.sold}</td>
                  <td>{item.updatedAt ? dateFormat(item.updatedAt) : ''}</td>
                  <td className="flex gap-2">
                    <p
                      className="bg-yellow-500 rounded-md p-1
                                            hover:scale-105 hover:-translate-y-1 hover:duration-200
                                            shadow-md"
                    >
                      <Link to={'/admin/product/' + item.id}>
                        <Pencil />
                      </Link>
                    </p>

                    <p
                      className="bg-red-500 rounded-md p-1 shadow-md
                                                hover:scale-105 hover:-translate-y-1 hover:duration-200
                                                "
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash />
                    </p>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default FormProduct
