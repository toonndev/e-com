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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Manage Users</h1>
        <p className="text-sm text-gray-500 mt-1">จัดการสิทธิ์และสถานะผู้ใช้งาน</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">ลำดับ</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">สิทธิ์</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  ยังไม่มีผู้ใช้งาน
                </td>
              </tr>
            )}
            {users?.map((el, i) => (
              <tr key={el.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{el.email}</td>

                <td className="px-4 py-3">
                  <select
                    onChange={(e) => handleChangeUserRole(el.id, e.target.value)}
                    value={el.role}
                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>user</option>
                    <option>admin</option>
                  </select>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      el.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {el.enabled ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition-colors ${
                      el.enabled
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
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
    </div>
  )
}

export default TableUsers
