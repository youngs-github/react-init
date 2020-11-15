import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * 自定义axios类型
 */
interface AxiosInstanceType {
  request(config: AxiosRequestConfig): Promise<IResponse>;
  get(url: string, config?: AxiosRequestConfig): Promise<IResponse>;
  delete(url: string, config?: AxiosRequestConfig): Promise<IResponse>;
  head(url: string, config?: AxiosRequestConfig): Promise<IResponse>;
  options(url: string, config?: AxiosRequestConfig): Promise<IResponse>;
  post(url: string, data?: object | string, config?: AxiosRequestConfig): Promise<IResponse>;
  put(url: string, data?: object | string, config?: AxiosRequestConfig): Promise<IResponse>;
  patch(url: string, data?: object | string, config?: AxiosRequestConfig): Promise<IResponse>;
}

/**
 * 配置处理
 * @param config
 */
const handle = (url: string | null, config: AxiosRequestConfig = {}): AxiosRequestConfig => {
  return config;
};

/**
 * 回调方法
 * @param promise
 */
const callback = (promise: Promise<AxiosResponse>): Promise<IResponse> => {
  return new Promise<IResponse>((resolve, reject) => {
    promise
      .then(({ data, status, statusText }: AxiosResponse) => {
        if (status >= 200 && status < 300) {
          // 成功
          resolve(data);
        }
        throw new Error(statusText);
      })
      .catch(reject);
  });
};

/**
 * 自定义axios实例
 * 暂不添加其他方法，需要时再加
 */
const selfAxios: AxiosInstanceType = {
  request: (config: AxiosRequestConfig) => callback(axios.request(handle(null, config))),
  get: (url: string, config?: AxiosRequestConfig) => callback(axios.get(url, handle(url, config))),
  delete: (url: string, config?: AxiosRequestConfig) => callback(axios.delete(url, handle(url, config))),
  head: (url: string, config?: AxiosRequestConfig) => callback(axios.head(url, handle(url, config))),
  options: (url: string, config?: AxiosRequestConfig) => callback(axios.options(url, handle(url, config))),
  post: (url: string, data?: object, config?: AxiosRequestConfig) => callback(axios.post(url, data, handle(url, config))),
  put: (url: string, data?: object, config?: AxiosRequestConfig) => callback(axios.put(url, data, handle(url, config))),
  patch: (url: string, data?: object, config?: AxiosRequestConfig) => callback(axios.patch(url, data, handle(url, config))),
};

export default selfAxios;
