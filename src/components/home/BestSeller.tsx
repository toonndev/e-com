import { useEffect, useState } from 'react'
import { SwiperSlide } from 'swiper/react'
import { listProductBy } from '../../api/product'
import type { Product } from '../../types'
import SwiperShowProduct from '../../utils/SwiperShowProduct'
import ProductCard from '../card/ProductCard'

const BestSeller = () => {
  const [data, setData] = useState<Product[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    listProductBy('sold', 'desc', 12)
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
        <SwiperSlide key={item.id}>
          <ProductCard item={item} />
        </SwiperSlide>
      ))}
    </SwiperShowProduct>
  )
}

export default BestSeller
