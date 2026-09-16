import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export default axiosClient
