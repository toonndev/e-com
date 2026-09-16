import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const LayoutUser = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />

      <main className="h-full">
        <Outlet />
      </main>
    </div>
  )
}

export default LayoutUser
