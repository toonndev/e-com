import { useEffect, useState, type FormEvent } from 'react'
import { toast } from 'react-toastify'
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
      toast.warning('Please fill data')
      return
    }
    try {
      const res = await createCategory(token, { name })
      toast.success(`Add Category ${res.data.name} success!!!`)
      getCategory()
    } catch (err) {
      console.log(err)
    }
  }

  const handleRemove = async (id: number) => {
    if (!token) return
    try {
      const res = await removeCategory(token, id)
      toast.success(`Deleted ${res.data.name} success`)
      getCategory()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <h1>Category Management</h1>
      <form className="my-4" onSubmit={handleSubmit}>
        <input onChange={(e) => setName(e.target.value)} className="border" type="text" />
        <button className="bg-blue-500">Add Category</button>
      </form>

      <hr />

      <ul className="list-none">
        {categories.map((item) => (
          <li className="flex justify-between my-2" key={item.id}>
            <span>{item.name}</span>

            <button className="bg-red-500" onClick={() => handleRemove(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FormCategory
