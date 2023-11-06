import type { Field } from "@formily/core";
import type { DataChange, IAction } from "@formily/reactive";

export type ObjectParam = Record<string, any>;

export interface RequestConfig extends RequestInit {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: string | number | ObjectParam;
  format?: (data: unknown) => [];
  baseURL?: string;
  staticParams?: string | number | ObjectParam;
  service?: (params: unknown) => Promise<unknown>;
  mountLoad?: boolean;
  customService?: (config: RequestConfig) => Promise<unknown>;
  debug?: boolean;

  /**
   * 抛出接口异常信息，可以定制消息通知效果
   * 注意：内置的fetch发送请求后，如果返回的状态码为 404 或 500 等，fetch 并不会 reject，
   * 而是会 resolve，但是 res.ok 会返回 false，需要手动处理错误；
   */
  onError?: (err: any) => void;
}

export type StaticReactive = {
  action: IAction;
  observe: (
    target: object,
    observer?: (change: DataChange) => void,
    deep?: boolean
  ) => () => void;
} | null;

export interface FormilyRequest {
  reactive: StaticReactive;
  (baseConfig?: Partial<RequestConfig>): (field: Field) => void;
}
