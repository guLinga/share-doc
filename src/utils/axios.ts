import axios,{ AxiosRequestConfig, AxiosResponse } from 'axios'
const apiUrl='http://localhost:3000/api'
/**
 * 网络请求
 */
axios.defaults.timeout=100000
axios.defaults.baseURL=apiUrl

/**
 * 请求拦截器
 */
axios.interceptors.request.use(
	(config:AxiosRequestConfig<string>) => {
		return config
	},
	(error:Error) => {
		return Promise.reject(error)
	}
)

/**
 * 响应拦截器
 */
axios.interceptors.response.use(
	(response:AxiosResponse<{code:number}>) => {
		console.log('response',response);
		return response
	},
	(error:Error) => {
		console.log('请求出错：', error)
	}
)

export default axios