import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { changeUserRole, changeUserStatus, getListAllUsers } from '../../api/admin'
import useEcomStore from '../../store/ecom-store'
import type { User } from '../../types'

const TableUsers = () => {
  const token = useEcomStore((state) => state.token)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (!token) return
    handleGetUsers(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGetUsers = (token: string) => {
    getListAllUsers(token)
      .then((res) => {
        setUsers(res.data)
      })
      .catch((err) => console.log(err))
  }

  const handleChangeUserStatus = (userId: number, userStatus: boolean) => {
    if (!token) return
    const value = {
      id: userId,
      enabled: !userStatus,
    }
    changeUserStatus(token, value)
      .then(() => {
        handleGetUsers(token)
        toast.success('Update Status Success!!')
      })
      .catch((err) => console.log(err))
  }

  const handleChangeUserRole = (userId: number, userRole: string) => {
    if (!token) return
    const value = {
      id: userId,
      role: userRole,
    }
    changeUserRole(token, value)
      .then(() => {
        handleGetUsers(token)
        toast.success('Update Role Success!!')
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <table className="w-full">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>Email</th>
            <th>สิทธิ์</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>

        <tbody>
          {users?.map((el, i) => (
            <tr key={el.id}>
              <td>{i + 1}</td>
              <td>{el.email}</td>

              <td>
                <select
                  onChange={(e) => handleChangeUserRole(el.id, e.target.value)}
                  value={el.role}
                >
                  <option>user</option>
                  <option>admin</option>
                </select>
              </td>

              <td>{el.enabled ? 'Active' : 'Inactive'}</td>
              <td>
                <button
                  className="bg-yellow-500 text-white
                  p-1 rounded-md shadow-md"
                  onClick={() => handleChangeUserStatus(el.id, el.enabled)}
                >
                  {el.enabled ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableUsers
