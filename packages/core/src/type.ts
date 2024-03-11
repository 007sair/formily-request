import type { Stringify } from "@formily/react";

/**
 * `x-request`编译后的类型
 * @description x-request中字符串表达式被编译后的真实类型
 */
export interface XRequest extends RequestInit {
  baseURL?: string;
  url?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: string | number | Record<string, any>;
  staticParams?: string | number | Record<string, any>;
  format?: (data: unknown) => any[];
  service?: (params: XRequest["params"]) => Promise<unknown>;
  customService?: (request: XRequest) => Promise<unknown>;
  mountLoad?: boolean;
  debug?: boolean;
  ready?: boolean | ((request: XRequest) => boolean);
  onSuccess?: (data: unknown, request: XRequest) => void;
}

/**
 * `x-request`在schema中的配置
 * @description 部分字段的类型为字符串表达式，如：params、staticParams、format、service、customService
 */
export type XRequestSchema = Stringify<XRequest>;

/**
 * 全局配置，用于`register`的入参
 */
export type GlobalXRequest = Pick<XRequest, "baseURL" | "debug" | "params"> & {
  /**
   * 抛出接口异常信息，可以定制消息通知效果
   * 注意：内置的fetch需要自行处理code状态
   */
  onError?: (err: Error) => void;
};

export type Caches = {
  status: "init" | "mounted" | "reaction" | "unmounted";
  dispose?: () => void;
};

/**
 * @deprecated 即将废弃，请使用`XRequest`代替
 */
export type RequestConfig = XRequestSchema;

/**
 * @deprecated 即将废弃，请使用`XRequest`代替
 */
export type RequestObject = XRequest;
