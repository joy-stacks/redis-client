/*
 * @Author: JOY
 * @Date: 2024-06-21 14:14:28
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-21 14:24:05
 * @Description:
 */
import axios from "axios";

const request = axios.create({
  baseURL: "http://127.0.0.1:3000/",
});
request.defaults.headers.post["Content-Type"] = "application/json";
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
