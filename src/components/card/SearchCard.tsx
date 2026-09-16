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
    <div>
      <h1 className="text-xl font-bold mb-4">ค้นหาสินค้า</h1>
      <input
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder="ค้นหาสินค้า...."
        className="border rounded-md w-full mb-4 px-2"
      />
      <hr />
      <div>
        <h1>หมวดหมู่สินค้า</h1>
        <div>
          {categories.map((item) => (
            <div key={item.id} className="flex gap-2">
              <input onChange={handleCheck} value={item.id} type="checkbox" />
              <label>{item.name}</label>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div>
        <h1>ค้นหาราคา</h1>
        <div>
          <div className="flex justify-between">
            <span>Min : {numberFormat(price[0])}</span>
            <span>Max : {numberFormat(price[1])}</span>
          </div>

          <Slider onChange={handlePrice} range min={0} max={100000} defaultValue={[1000, 30000]} />
        </div>
      </div>
    </div>
  )
}

export default SearchCard
