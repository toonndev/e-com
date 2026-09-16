import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LayoutAdmin from '../layouts/LayoutAdmin'
import LayoutUser from '../layouts/LayoutUser'
import Layout from '../layouts/Layout'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Category from '../pages/admin/Category'
import Dashboard from '../pages/admin/Dashboard'
import EditProduct from '../pages/admin/EditProduct'
import Manage from '../pages/admin/Manage'
import ManageOrders from '../pages/admin/ManageOrders'
import Product from '../pages/admin/Product'
import History from '../pages/user/History'
import HomeUser from '../pages/user/HomeUser'
import Payment from '../pages/user/Payment'
import ProtectRouteAdmin from './ProtectRouteAdmin'
import ProtectRouteUser from './ProtectRouteUser'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'category', element: <Category /> },
      { path: 'product', element: <Product /> },
      { path: 'product/:id', element: <EditProduct /> },
      { path: 'manage', element: <Manage /> },
      { path: 'orders', element: <ManageOrders /> },
    ],
  },
  {
    path: '/user',
    element: <ProtectRouteUser element={<LayoutUser />} />,
    children: [
      { index: true, element: <HomeUser /> },
      { path: 'payment', element: <Payment /> },
      { path: 'history', element: <History /> },
    ],
  },
])

const AppRoutes = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
