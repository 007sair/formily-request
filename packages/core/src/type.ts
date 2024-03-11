import type { Stringify } from "@formily/react";

/**
 * `x-request`编译后的类型
 * @description x-request中字符串表达式被编译后的真实类型
 */
export interface XRequest extends RequestInit {
  /**
   * 接口前缀，配合 `url` 字段使用
   */
  baseURL?: string;

  /**
   * 接口地址
   *
   * @description
   * 第`1`种配置接口方式，可以是绝对、相对地址，如果为相对，可配合 baseURL 一起使用。
   */
  url?: string;
  /**
   * 接口方法，配合 {@link XRequest.url} 使用
   */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /**
   * 接口参数
   * @description 与 url、method 一起使用时，params 需配置为 object；与 {@link XRequest.service} 使用时，如果 service 为函数名，params 可作为其入参。
   */
  params?: string | number | Record<string, any>;
  /**
   * 接口参考扩展字段
   * @description 一般情况下用不上，当接口参数一部分来自 scope，一部分来自 schema，可使用该配置与 params 进行合并使用。
   */
  staticParams?: string | number | Record<string, any>;
  /**
   * 接口返回数据格式化函数
   *
   * @description
   * 接口返回的数据可能无法直接应用与组件，需要转换为可使用的数据格式。
   * format 接收的 res，不关注来源，任何数据获取方式返回的结果都会经过 format，然后被应用到 field.dataSource。
   *
   * format 还能扩展如下用法：
   * @example
   * ```ts
   * // 1.定义 format 前置函数，返回函数（函数入参为原始数据）
   * const $beforeFormat = (format: RequestConfig["format"]) => {
   *   return function (res: any) {
   *     if (res.status !== 0) {
   *       throw new Error("接口数据异常");
   *     }
   *     return format && format(res);
   *   };
   * };
   * // 2.传入 scope
   * const scope = {{ $beforeFormat }}
   * // 3.在schema中应用
   * format: "{{ $beforeFormat((res) => res?.data || []) }}"
   * ```
   * 此时返回的 res 数据如果状态不是 200，会抛出异常，配合 onError 使用可以给出 ui 错误提示。
   * 当然，如果接口请求方式是 service、customService，无需这样使用，其内部可以自行管理错误提示方式。
   */
  format?: (data: unknown) => any[];
  /**
   * 自定义获取接口数据函数
   *
   * @description
   * 第`2`种配置接口方式，需将函数传入 scope 使用，相较于其他方式优先级最高。
   * 该函数返回 Promise。当内置的 fetch 无法满足需求时，可使用业务系统自带的函数发起请求，如下：
   *
   * @example
   * ```ts
   * request: {
   *   service: '{{ queryUser }}',
   *   params: 0 | "" | {}  // 参数可以是number、string、object，直接作为service参数
   * }
   * // 或者
   * request: {
   *   service: '{{ () => queryUser("sair") }}'
   * }
   * ```
   */
  service?: (params: XRequest["params"]) => Promise<unknown>;

  /**
   * 自定义获取接口数据函数
   *
   * @description
   * 第`3`种配置接口方式，使用场景介于 url、service 之间。既要使用配置，又要有自定义。
   * 参数为 request 配置，内部实现可基于入参自行实现，demo 中自行实现了 jsonp 的接口请求。
   *
   * 三种数据获取方式对比：
   * - `内置fetch`：完全使用 schema 配置，无需自定义函数；
   * - `service`：使用业务系统自带的函数，也可以配合 {@link XRequest.params} 使用；
   * - `customService`：完全自定义，使用了{@link XRequest}配置，但内部完全自己实现的接口请求。
   */
  customService?: (request: XRequest) => Promise<unknown>;
  /**
   * 是否在 mounted 阶段发起请求，默认为true
   */
  mountLoad?: boolean;
  /**
   * 是否开启debug模式，默认不开启
   */
  debug?: boolean;
  /**
   * 是否发起请求，为`false`时不会发起
   */
  ready?: boolean | ((request: XRequest) => boolean);
  /**
   * 接口请求成功的回调事件
   */
  onSuccess?: (data: unknown, request: XRequest) => void;
}

/**
 * `x-request`在 schema 中的配置
 * @description 部分字段的类型为字符串表达式，如：params、staticParams、format、service、customService
 */
export interface XRequestSchema extends Stringify<XRequest> {}

/**
 * 全局配置，用于`register`的入参
 */
export interface GlobalXRequest
  extends Pick<XRequest, "baseURL" | "debug" | "params"> {
  /**
   * 抛出接口异常信息，可以定制消息通知效果
   *
   * ⚠️ 注意：内置的fetch需要自行处理code状态
   */
  onError?: (err: Error) => void;
}

/**
 * @ignore
 */
export type Caches = {
  status: "init" | "mounted" | "reaction" | "unmounted";
  dispose?: () => void;
};

/**
 * @deprecated 即将废弃，请使用 {@link XRequestSchema} 代替
 */
export type RequestConfig = XRequestSchema;

/**
 * @deprecated 即将废弃，请使用 {@link XRequest} 代替
 */
export type RequestObject = XRequest;
