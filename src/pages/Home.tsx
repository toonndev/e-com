import BestSeller from '../components/home/BestSeller'
import ContentCarousel from '../components/home/ContentCarousel'
import NewProduct from '../components/home/NewProduct'

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      <ContentCarousel />

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">สินค้าขายอย่างดี</h2>
        <BestSeller />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">สินค้าใหม่</h2>
        <NewProduct />
      </section>
    </div>
  )
}

export default Home
