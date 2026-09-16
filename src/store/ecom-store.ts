import _ from 'lodash'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { listCategory } from '../api/Category'
import { login, type LoginForm } from '../api/auth'
import { listProduct, searchFilters, type SearchFiltersArg } from '../api/product'
import type { CartItem, Category, Product, User } from '../types'

interface EcomState {
  user: User | null
  token: string | null
  categories: Category[]
  products: Product[]
  carts: CartItem[]
  logout: () => void
  actionAddtoCart: (product: Product) => void
  actionUpdateQuantity: (productId: number, newQuantity: number) => void
  actionRemoveProduct: (productId: number) => void
  getTotalPrice: () => number
  actionLogin: (form: LoginForm) => Promise<Awaited<ReturnType<typeof login>>>
  getCategory: () => Promise<void>
  getProduct: (count?: number) => Promise<void>
  actionSearchFilters: (arg: SearchFiltersArg) => Promise<void>
  clearCart: () => void
}

const ecomStore = (
  set: (partial: Partial<EcomState>) => void,
  get: () => EcomState,
): EcomState => ({
  user: null,
  token: null,
  categories: [],
  products: [],
  carts: [],
  logout: () => {
    set({
      user: null,
      token: null,
      categories: [],
      products: [],
      carts: [],
    })
  },
  actionAddtoCart: (product) => {
    const carts = get().carts
    const updateCart = [...carts, { ...product, count: 1 }]
    const uniqe = _.unionWith(updateCart, _.isEqual)
    set({ carts: uniqe })
  },
  actionUpdateQuantity: (productId, newQuantity) => {
    set({
      carts: get().carts.map((item) =>
        item.id === productId ? { ...item, count: Math.max(1, newQuantity) } : item,
      ),
    })
  },
  actionRemoveProduct: (productId) => {
    set({
      carts: get().carts.filter((item) => item.id !== productId),
    })
  },
  getTotalPrice: () => {
    return get().carts.reduce((total, item) => total + item.price * item.count, 0)
  },
  actionLogin: async (form) => {
    const res = await login(form)
    set({
      user: res.data.payload,
      token: res.data.token,
    })
    return res
  },
  getCategory: async () => {
    try {
      const res = await listCategory()
      set({ categories: res.data })
    } catch (err) {
      console.log(err)
    }
  },
  getProduct: async (count) => {
    try {
      const res = await listProduct(count)
      set({ products: res.data })
    } catch (err) {
      console.log(err)
    }
  },
  actionSearchFilters: async (arg) => {
    try {
      const res = await searchFilters(arg)
      set({ products: res.data })
    } catch (err) {
      console.log(err)
    }
  },
  clearCart: () => set({ carts: [] }),
})

const usePersist = {
  name: 'ecom-store',
  storage: createJSONStorage(() => localStorage),
}

const useEcomStore = create<EcomState>()(persist(ecomStore, usePersist))

export default useEcomStore
