import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />

      <main className="h-full">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
