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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
        <div>
          <SearchCard />
        </div>

        <div>
          <p className="text-xl font-semibold text-gray-900 mb-4">สินค้าทั้งหมด</p>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
              ไม่พบสินค้า
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {products.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div>
          <CartCard />
        </div>
      </div>
    </div>
  )
}

export default Shop
