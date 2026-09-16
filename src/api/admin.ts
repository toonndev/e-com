import type { AxiosResponse } from 'axios'
import axiosClient, { authHeader } from './axiosClient'
import type { Order, OrderStatus, User } from '../types'

export const getOrdersAdmin = (token: string): Promise<AxiosResponse<Order[]>> =>
  axiosClient.get('/admin/orders', authHeader(token))

export const changeOrderStatus = (
  token: string,
  orderId: number,
  orderStatus: OrderStatus,
): Promise<AxiosResponse<Order>> =>
  axiosClient.put('/admin/order-status', { orderId, orderStatus }, authHeader(token))

export const getListAllUsers = (token: string): Promise<AxiosResponse<User[]>> =>
  axiosClient.get('/users', authHeader(token))

export const changeUserStatus = (
  token: string,
  value: { id: number; enabled: boolean },
): Promise<AxiosResponse<User>> => axiosClient.post('/change-status', value, authHeader(token))

export const changeUserRole = (
  token: string,
  value: { id: number; role: string },
): Promise<AxiosResponse<User>> => axiosClient.post('/change-role', value, authHeader(token))
