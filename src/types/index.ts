export interface Category {
  id: number
  name: string
}

export interface ProductImage {
  asset_id?: string
  public_id: string
  url: string
  secure_url?: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  sold?: number
  quantity: number
  categoryId?: number | string
  category?: Category
  images: ProductImage[]
  createdAt?: string
  updatedAt?: string
}

export type CartItem = Product & { count: number }

export interface User {
  id: number
  email: string
  name?: string
  picture?: string
  role: 'user' | 'admin'
  enabled: boolean
  address?: string
}

export interface OrderProductItem {
  count: number
  price: number
  product: Pick<Product, 'title' | 'price'>
}

export type OrderStatus = 'Not Process' | 'Processing' | 'Completed' | 'Cancelled'

export interface Order {
  id: number
  cartTotal: number
  amount?: number
  status?: string
  currentcy?: string
  orderStatus: OrderStatus
  orderedBy: { email: string; address: string }
  products: OrderProductItem[]
  createdAt: string
  updatedAt?: string
}
