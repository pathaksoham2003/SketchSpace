import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import keycloak from '../utils/keycloak'

const useRequest = (): AxiosInstance => {
  const Request: AxiosInstance = axios.create({
    baseURL: "https://localhost:3000/api/",
    headers: {
      'Content-Type': 'application/json',
    },
  })

  Request.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (keycloak?.token) {
        config.headers.set('Authorization', `Bearer ${keycloak.token}`)
      }

      console.log("Sending Request:", config)
      return config;
    },
    (error) => {
      console.error("Request Error:", error)
      return Promise.reject(error)
    }
  )

  Request.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log("Received Response:", response)
      return response
    },
    (error) => {
      console.error("Response Error:", error)
      return Promise.reject(error)
    }
  )

  return Request
}

export default useRequest
