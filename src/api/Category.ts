import type { AxiosResponse } from 'axios'
import axiosClient, { authHeader } from './axiosClient'
import type { Category } from '../types'

export const createCategory = (
  token: string,
  form: { name: string },
): Promise<AxiosResponse<Category>> => axiosClient.post('/category', form, authHeader(token))

export const listCategory = (): Promise<AxiosResponse<Category[]>> =>
  axiosClient.get('/category')

export const removeCategory = (
  token: string,
  id: number,
): Promise<AxiosResponse<Category>> => axiosClient.delete(`/category/${id}`, authHeader(token))
