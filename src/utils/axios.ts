import { message } from 'antd';
import axios,{ AxiosRequestConfig, AxiosResponse } from 'axios'
import store from '../store';

const apiUrl= 
			process.env.NODE_ENV === 'development' ?
			'http://localhost:3000/api' :
			'http://localhost:8000'

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
		
		config.headers = {
			token: store.getState().user.userMsg ? 
			store.getState().user.userMsg.tokens : null
		}
		
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
	(response:AxiosResponse<{code:number,msg:string}>) => {
		if(response.data.code!==200){
			message.error(response.data.msg);
		}
		return response
	},
	(error:Error) => {
		console.log('请求出错：', error)
	}
)

export default axios