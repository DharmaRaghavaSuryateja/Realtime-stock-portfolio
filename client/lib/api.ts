import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { 
  Stock, 
  StockSearchResult, 
  UserStock, 
  User, 
  AuthTokens, 
  LoginCredentials, 
  RegisterCredentials, 
  AddToPortfolioData,
  StockType,
  ApiResponse,
  PortfolioResponse
} from '@/types'

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{ resolve: Function; reject: Function }> = []

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })
    
    this.failedQueue = []
  }

  private triggerLogout() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('forceLogout', {
        detail: { reason: 'Token refresh failed' }
      }))
    }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if ((error.response?.status === 403) && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return this.client(originalRequest)
            }).catch(err => {
              return Promise.reject(err)
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken)
              const newToken = response.data.data.accessToken
              localStorage.setItem('accessToken', newToken)
              
              this.processQueue(null, newToken)
              
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            } else {
              this.processQueue(new Error('No refresh token'))
              this.triggerLogout()
            }
          } catch (refreshError) {
            this.processQueue(refreshError)
            this.triggerLogout()
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  async login(credentials: LoginCredentials): Promise<AxiosResponse<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>> {
    return this.client.post('/auth/login', credentials)
  }

  async register(credentials: RegisterCredentials): Promise<AxiosResponse<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>> {
    return this.client.post('/auth/register', credentials)
  }

  async refreshToken(token: string): Promise<AxiosResponse<ApiResponse<{ accessToken: string }>>> {
    return this.client.post('/auth/refresh', { refreshToken: token })
  }

  async getStocks(type: StockType): Promise<AxiosResponse<ApiResponse<{ stocks: Stock[] }>>> {
    return this.client.get(`/stocks?type=${type}`)
  }

  async searchStocks(query: string): Promise<AxiosResponse<ApiResponse<Stock[]>>> {
    return this.client.get(`/stocks/search?query=${encodeURIComponent(query)}`)
  }

  async getProfile(): Promise<AxiosResponse<ApiResponse<{ user: User }>>> {
    return this.client.get('/users/me')
  }

  async getUserStocks(): Promise<AxiosResponse<ApiResponse<PortfolioResponse>>> {
    return this.client.get('/users/me/stocks')
  }

  async addToPortfolio(data: AddToPortfolioData): Promise<AxiosResponse<ApiResponse<{ stock: UserStock }>>> {
    return this.client.post('/users/me/stocks', data)
  }

  async removeFromPortfolio(stockId: number): Promise<AxiosResponse<ApiResponse<{}>>> {
    return this.client.delete(`/users/me/stocks/${stockId}`)
  }
}

export const apiClient = new ApiClient() 