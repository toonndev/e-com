import type { AxiosResponse } from 'axios'
import axiosClient, { authHeader } from './axiosClient'

export interface PaymentIntentResponse {
  clientSecret: string
}

export const payment = (token: string): Promise<AxiosResponse<PaymentIntentResponse>> =>
  axiosClient.post('/user/create-payment-intent', {}, authHeader(token))
