import type { ReactNode } from 'react'
import { Swiper } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

const SwiperShowProduct = ({ children }: { children: ReactNode }) => {
  return (
    <Swiper
      // ProductCard has a fixed width (w-48); a numeric slidesPerView forces
      // Swiper to divide the container into that many equal slots instead,
      // which doesn't match the card's real width and leaves cards looking
      // squeezed/cut off — especially with few products. "auto" makes each
      // slide size itself to its child's natural width instead.
      slidesPerView="auto"
      spaceBetween={16}
      pagination={true}
      navigation={true}
      modules={[Pagination, Autoplay, Navigation]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      className="mySwiper object-cover rounded-md"
    >
      {children}
    </Swiper>
  )
}

export default SwiperShowProduct
