import type { AxiosResponse } from 'axios'
import axiosClient, { authHeader } from './axiosClient'
import type { CartItem, Order, Product } from '../types'

export interface UserCartResponse {
  products: { product: Product; count: number }[]
  cartTotal: number
}

export const createUserCart = (
  token: string,
  cart: { cart: CartItem[] },
): Promise<AxiosResponse<{ message: string }>> =>
  axiosClient.post('/user/cart', cart, authHeader(token))

export const listUserCart = (token: string): Promise<AxiosResponse<UserCartResponse>> =>
  axiosClient.get('/user/cart', authHeader(token))

export const saveAddress = (
  token: string,
  address: string,
): Promise<AxiosResponse<{ message: string }>> =>
  axiosClient.post('/user/address', { address }, authHeader(token))

export const saveOrder = (
  token: string,
  payload: unknown,
): Promise<AxiosResponse<Order>> => axiosClient.post('/user/order', payload, authHeader(token))

export const getOrders = (
  token: string,
): Promise<AxiosResponse<{ orders: Order[] }>> =>
  axiosClient.get('/user/order', authHeader(token))
