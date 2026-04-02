import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
// Khởi tạo một đối tượng Axios (AuthorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 resquest để 10p
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors
 */
// Interceptor Request: can thiệp vào giữa những các request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Interceptor response: can thiệp vào giữa những các response nhận về
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)
    /*
    Mọi mã http status code nằm ngoài khoảng 200-299 sẽ là error và rơi vào đây
     */
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }
    //Dùng tostify để hiển thị lỗi - ngoại trừ mã 410
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
