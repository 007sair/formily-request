/**
 * 封装fetch请求
 */
import qs, { StringifiableRecord } from "query-string";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * @description: 声明请求头header的类型
 */
interface IHeaderConfig {
  Accept?: string;
  "Content-Type"?: string;
  [propName: string]: any;
}

interface Options extends RequestInit {
  /**
   * URL前缀，一般为反代前缀 或 http协议开头完整接口url
   */
  baseURL?: string; // "http" or "/mock/xxx"
  headers?: IHeaderConfig;
  method?: HttpMethod;
  /** GET时使用，POST使用body，但不需要序列化了 */
  params?: unknown;
}

type Res<T> = {
  code: number;
  data?: T;
  message: string;
};

const defaultOptions: Options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const baseURL = import.meta.env.VITE_BASIC_API; // "/api" or "http://xxx.xxx"

// 函数重载，判断返回的类型
function request<T>(url: string, options?: Options): Promise<T | undefined>;
function request<T>(url: string, options?: Options, all?: boolean): Promise<T>;

// resData: 为true时，request函数会返回带有code、message、data的数据结构
async function request<T>(url: string, options?: Options, all?: boolean) {
  try {
    options = Object.assign({}, defaultOptions, options);
    const { params } = options;

    url = /^http(s?):\/\//i.test(url)
      ? url
      : (options.baseURL || baseURL) + url;

    if (options.method === "GET") {
      url = qs.stringifyUrl({
        url,
        query: params as StringifiableRecord,
      });
    } else {
      /**
       * 处理参数中存在二进制文件时，不需要加content-type
       * 浏览器发现是二进制文件，会自动加content-type和boundary
       * 手动加content-type的话 boundary中的内容会丢失
       */
      if (params instanceof FormData && options.headers?.["Content-Type"]) {
        delete options.headers["Content-Type"];
      }
      options.body =
        params instanceof FormData ? params : JSON.stringify(params);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      // 请求失败，返回解析之后的失败的数据
      return Promise.reject(response);
    }

    const result: Res<T> = await response.json();

    // const contentType = response.headers.get('Content-type')

    // // 判定返回的内容类型，做不同的处理
    // if (contentType) {
    //   if (contentType.indexOf("json") > -1) {
    //     result = await response.json();
    //   }
    //   if (contentType.indexOf("text") > -1) {
    //     result = await response.text();
    //   }
    //   if (contentType.indexOf("form") > -1) {
    //     result = await response.formData();
    //   }
    //   if (contentType.indexOf("video") > -1) {
    //     result = await response.blob();
    //   }
    // } else {
    //   result = await response.text();
    // }

    if (all) {
      return result;
    } else {
      switch (result.code) {
        case 200:
          return result.data;
        default:
          return Promise.reject({
            code: result.code || -1,
            message: result.message || "接口请求失败",
          });
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

export default request;
