import axios from 'axios'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

interface PicsumImage {
  id: string
  download_url: string
}

const ContentCarousel = () => {
  const [data, setData] = useState<PicsumImage[]>([])
  useEffect(() => {
    hdlGetImage()
  }, [])

  const hdlGetImage = () => {
    axios
      .get<PicsumImage[]>('https://picsum.photos/v2/list?page=1&limit=20')
      .then((res) => setData(res.data))
      .catch((error) => console.log(error))
  }

  return (
    <div>
      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper h-80 object-cover
        rounded-xl shadow-sm mb-4"
      >
        {data?.map((item) => (
          <SwiperSlide key={item.id}>
            <img src={item.download_url} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        slidesPerView={5}
        spaceBetween={10}
        pagination={true}
        navigation={true}
        modules={[Pagination, Autoplay, Navigation]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper object-cover rounded-xl"
      >
        {data?.map((item) => (
          <SwiperSlide key={item.id}>
            <img className="rounded-md" src={item.download_url} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ContentCarousel
