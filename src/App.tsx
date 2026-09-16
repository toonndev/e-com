import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <AppRoutes />
    </>
  )
}

export default App
