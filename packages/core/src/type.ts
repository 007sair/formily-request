export interface RequestConfig extends RequestInit {
  baseURL?: string;
  url?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: string | number | Record<string, any>;
  staticParams?: string | number | Record<string, any>;
  format?: string;
  service?: string;
  customService?: string;
  mountLoad?: boolean;
  debug?: boolean;

  /**
   * 抛出接口异常信息，可以定制消息通知效果
   * 注意：内置的fetch发送请求后，如果返回的状态码为 404 或 500 等，fetch 并不会 reject，
   * 而是会 resolve，但是 res.ok 会返回 false，需要手动处理错误；
   */
  onError?: (err: unknown) => void;
}

type ExpressionKey = "format" | "service" | "customService";

export interface RequestObject extends Omit<RequestConfig, ExpressionKey> {
  format?: (data: unknown) => [];
  service?: (params: RequestObject["params"]) => Promise<unknown>;
  customService?: (config: RequestObject) => Promise<unknown>;
}

export type Caches = {
  status: "init" | "mounted" | "reaction" | "unmounted";
  dispose?: () => void;
};
