import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'
import type { Product } from '../../types'
import { numberFormat } from '../../utils/number'

const ProductCard = ({ item }: { item: Product }) => {
  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart)

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md
        transition-shadow overflow-hidden w-48"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0].url}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            alt={item.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="font-medium text-gray-900 truncate">{item.title}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>

        <div className="flex justify-between items-center mt-3">
          <span className="font-semibold text-gray-900">{numberFormat(item.price)}</span>
          <button
            onClick={() => actionAddtoCart(item)}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg p-2"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
