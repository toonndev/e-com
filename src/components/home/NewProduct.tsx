import { useEffect, useState } from 'react'
import { SwiperSlide } from 'swiper/react'
import { listProductBy } from '../../api/product'
import type { Product } from '../../types'
import SwiperShowProduct from '../../utils/SwiperShowProduct'
import ProductCard from '../card/ProductCard'

const NewProduct = () => {
  const [data, setData] = useState<Product[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    listProductBy('updatedAt', 'desc', 12)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <SwiperShowProduct>
      {data?.map((item) => (
        // Explicit width instead of relying on Swiper's "auto" JS measurement,
        // which was unreliable here (measured ~full container width instead
        // of the card's real 192px, leaving one huge empty-looking slide).
        <SwiperSlide key={item.id} style={{ width: '192px' }}>
          <ProductCard item={item} />
        </SwiperSlide>
      ))}
    </SwiperShowProduct>
  )
}

export default NewProduct
