import { useEffect, useState, type ReactNode } from 'react'
import { currentUser } from '../api/auth'
import useEcomStore from '../store/ecom-store'
import LoadingToRedirect from './LoadingToRedirect'

const ProtectRouteUser = ({ element }: { element: ReactNode }) => {
  const [ok, setOk] = useState(false)
  const user = useEcomStore((state) => state.user)
  const token = useEcomStore((state) => state.token)

  useEffect(() => {
    if (user && token) {
      currentUser(token)
        .then(() => setOk(true))
        .catch(() => setOk(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ok ? element : <LoadingToRedirect />
}

export default ProtectRouteUser
