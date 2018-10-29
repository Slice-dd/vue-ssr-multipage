import axios from 'axios';
// import { Message } from 'element-ui';

const request = axios.create({
  baseURL: 'https://www.apiopen.top',
  timeout: 100000
});

// request.interceptors.request.use(
//   config => {
//       if (store.getters.token) {
//           // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
//       }
//       return config
//   },
//   error => {
//       // Do something with request error
//       console.log(error) // for debug
//       Promise.reject(error)
//   }
// )


export default request;

