import type { AxiosResponse } from 'axios'
import axiosClient, { authHeader } from './axiosClient'
import type { User } from '../types'

export interface LoginForm {
  email: string
  password: string
}

export interface LoginResponse {
  payload: User
  token: string
}

export const login = (form: LoginForm): Promise<AxiosResponse<LoginResponse>> =>
  axiosClient.post('/login', form)

export const register = (form: {
  email: string
  password: string
}): Promise<AxiosResponse<unknown>> => axiosClient.post('/register', form)

export const currentUser = (token: string): Promise<AxiosResponse<{ message: string }>> =>
  axiosClient.post('/current-user', {}, authHeader(token))

export const currentAdmin = (token: string): Promise<AxiosResponse<{ message: string }>> =>
  axiosClient.post('/current-admin', {}, authHeader(token))
