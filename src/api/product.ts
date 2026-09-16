import type { AxiosResponse } from 'axios'
import axiosClient, { authHeader } from './axiosClient'
import type { Product, ProductImage } from '../types'

export interface ProductForm {
  title: string
  description: string
  price: number
  quantity: number
  categoryId: string
  images: ProductImage[]
}

export interface SearchFiltersArg {
  query?: string
  category?: string[]
  price?: [number, number]
}

export const createProduct = (
  token: string,
  form: ProductForm,
): Promise<AxiosResponse<Product>> => axiosClient.post('/product', form, authHeader(token))

export const listProduct = (count = 20): Promise<AxiosResponse<Product[]>> =>
  axiosClient.get(`/products/${count}`)

export const readProduct = (token: string, id: string): Promise<AxiosResponse<Product>> =>
  axiosClient.get(`/product/${id}`, authHeader(token))

export const deleteProduct = (token: string, id: string): Promise<AxiosResponse<Product>> =>
  axiosClient.delete(`/product/${id}`, authHeader(token))

export const updateProduct = (
  token: string,
  id: string,
  form: ProductForm,
): Promise<AxiosResponse<Product>> => axiosClient.put(`/product/${id}`, form, authHeader(token))

export const uploadFiles = (
  token: string,
  form: string,
): Promise<AxiosResponse<ProductImage>> =>
  axiosClient.post('/images', { image: form }, authHeader(token))

export const removeFiles = (
  token: string,
  public_id: string,
): Promise<AxiosResponse<{ message: string }>> =>
  axiosClient.post('/removeimages', { public_id }, authHeader(token))

export const searchFilters = (arg: SearchFiltersArg): Promise<AxiosResponse<Product[]>> =>
  axiosClient.post('/search/filters', arg)

export const listProductBy = (
  sort: string,
  order: 'asc' | 'desc',
  limit: number,
): Promise<AxiosResponse<Product[]>> => axiosClient.post('/productby', { sort, order, limit })
