import { useEffect } from 'react'
import CartCard from '../components/card/CartCard'
import ProductCard from '../components/card/ProductCard'
import SearchCard from '../components/card/SearchCard'
import useEcomStore from '../store/ecom-store'

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct)
  const products = useEcomStore((state) => state.products)

  useEffect(() => {
    getProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-100 h-screen">
        <SearchCard />
      </div>

      <div className="w-1/2 p-4 h-screen overflow-y-auto">
        <p className="text-2xl font-bold mb-4">สินค้าทั้งหมด</p>
        <div className="flex flex-wrap gap-4">
          {products.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="w-1/4 p-4 bg-gray-100 h-screen overflow-y-auto">
        <CartCard />
      </div>
    </div>
  )
}

export default Shop
