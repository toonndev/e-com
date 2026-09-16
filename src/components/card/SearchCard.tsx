import { Search } from 'lucide-react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import { numberFormat } from '../../utils/number'

const SearchCard = () => {
  const getProduct = useEcomStore((state) => state.getProduct)
  const actionSearchFilters = useEcomStore((state) => state.actionSearchFilters)

  const getCategory = useEcomStore((state) => state.getCategory)
  const categories = useEcomStore((state) => state.categories)

  const [text, setText] = useState('')
  const [categorySelected, setCategorySelected] = useState<string[]>([])

  const [price, setPrice] = useState<[number, number]>([1000, 30000])
  const [ok, setOk] = useState(false)

  useEffect(() => {
    getCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Step 1 Search Text
  useEffect(() => {
    const delay = setTimeout(() => {
      if (text) {
        actionSearchFilters({ query: text })
      } else {
        getProduct()
      }
    }, 300)

    return () => clearTimeout(delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  // Step 2 Search by Category
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inCheck = e.target.value
    const inState = [...categorySelected]
    const findCheck = inState.indexOf(inCheck)

    if (findCheck === -1) {
      inState.push(inCheck)
    } else {
      inState.splice(findCheck, 1)
    }
    setCategorySelected(inState)

    if (inState.length > 0) {
      actionSearchFilters({ category: inState })
    } else {
      getProduct()
    }
  }

  // Step 3 Search by Price
  useEffect(() => {
    actionSearchFilters({ price })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok])

  const handlePrice = (value: number | number[]) => {
    setPrice(value as [number, number])

    setTimeout(() => {
      setOk(!ok)
    }, 300)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-5">
      <h1 className="font-semibold text-gray-900">ค้นหาสินค้า</h1>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="ค้นหาสินค้า...."
          className="border border-gray-300 rounded-lg w-full pl-9 pr-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <hr className="border-gray-100" />

      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          หมวดหมู่สินค้า
        </p>
        <div className="space-y-1.5">
          {categories.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                onChange={handleCheck}
                value={item.id}
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          ค้นหาราคา
        </p>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>Min : {numberFormat(price[0])}</span>
          <span>Max : {numberFormat(price[1])}</span>
        </div>

        <Slider onChange={handlePrice} range min={0} max={100000} defaultValue={[1000, 30000]} />
      </div>
    </div>
  )
}

export default SearchCard
