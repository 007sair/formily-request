/* eslint-disable no-useless-catch */
import type { Field, FieldDataSource } from "@formily/core";
import { observe, observable, action } from "@formily/reactive";
import { Schema } from "@formily/react";
import merge from "lodash/merge";
import debounce from "lodash/debounce";

const field_key = "x-request" as `x-${string}`;
const obs_map: Record<string, () => void> = {};

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

const parseURL = (url: string, params: RequestObject["params"]) => {
  const [prefix, search] = url.split("?");
  const usp = new URLSearchParams(search);
  if (typeof params === "object") {
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "undefined" || value === null) return;
      usp.has(key) ? usp.set(key, value) : usp.append(key, value);
    });
  }
  const p = usp.toString();
  return p ? [prefix, p].join("?") : prefix;
};

export const simpleFetch = (config: RequestObject) => {
  const { url, baseURL = "", params, ...options } = config;
  const method = options.method || "GET";

  if (typeof url !== "string" || !url) {
    throw new TypeError("url must be required and of string type");
  }

  let fullUrl = /^http(s?):\/\//i.test(url) ? url : baseURL + url;

  if (method.toUpperCase() === "GET") {
    fullUrl = parseURL(fullUrl, params);
  } else {
    options.body = JSON.stringify(params);
  }

  return fetch(fullUrl, { ...options, method }).then((response) => {
    if (!response.ok) {
      Promise.reject(response);
    }
    return response.json();
  });
};

const createReaction = (
  fieldKey: string,
  requestConfig: RequestConfig,
  baseConfig: RequestObject = {}
) => {
  // 当schema有依赖、依赖发生变化时会执行x-reaction
  return (field: Field, scope: unknown) => {
    try {
      if (typeof requestConfig !== "object") {
        throw TypeError(`${fieldKey}不是一个对象`);
      }
      const fieldPath = field.address.toString();
      const request = Schema.compile(requestConfig, scope) as RequestObject;
      const { format, mountLoad = true } = request;
      const debug = baseConfig.debug || request.debug; // 全局配置的debug会优先生效

      /**
       * 处理组件最终接收到的`dataSource`数据
       * @link https://core.formilyjs.org/zh-CN/api/models/field#fielddatasource
       */
      const createDataSource = (data: unknown): FieldDataSource[] => {
        try {
          let _options = data;
          if (typeof format !== "undefined") {
            if (typeof format !== "function") {
              throw new TypeError("配置项format字段需要为函数");
            }
            _options = format(data);
          }
          if (!Array.isArray(_options)) {
            throw new TypeError(
              'dataSource不是数组，请检查接口返回或"format"配置'
            );
          }
          return _options;
        } catch (error) {
          throw error;
        }
      };

      const asyncLoader = (): Promise<unknown> => {
        // 本着配置就近原则，如果field的配置中使用了service、customService
        // 应当只在field层级生效，不应与全局配置混合使用，否则难以理解。

        // customService仅在field层级生效
        if (typeof request.customService === "function") {
          return request.customService(request);
        }

        // service仅在field层级生效
        if (typeof request.service === "function") {
          return request.service(request.params);
        }

        // 使用simpleFetch发起请求时，要求params必须是对象
        const params = merge(
          typeof request.staticParams === "object" ? request.staticParams : {},
          typeof request.params === "object" ? request.params : {}
        );
        const config = merge(baseConfig, { ...request, params });

        // 使用内置fetch时，可以使用一些全局配置，但不应过度依赖
        return simpleFetch(config);
      };

      const asyncSetDataSource = debounce((type?: string) => {
        if (debug) {
          console.log(`asyncSetDataSource type: ${type}`);
        }
        try {
          field.loading = true;
          return asyncLoader()
            .then(
              action.bound?.((res: unknown) => {
                field.dataSource = createDataSource(res);
              })
            )
            .catch((err) => {
              baseConfig.onError && baseConfig.onError(err);
              debug && console.error(`asyncLoader异步抛出异常，${err}`);
            })
            .finally(() => {
              field.loading = false;
            });
        } catch (err) {
          // 需要asyncLoader同步异常抛出的情况
          // 同步异常一般是配置时出现错误，需要打debug查看
          // 异步异常通常是接口错误，需要有ui界面查看
          debug && console.error(`"asyncSetDataSource"抛出异常，${err}`);
        }
      }, 50); // debounce=50: 解决 reaction -> mount 连续发起请求问题

      asyncSetDataSource("reaction");

      field.onMount = () => {
        if (mountLoad) {
          asyncSetDataSource("mount");
        }

        const obs = observable(request);

        obs_map[fieldPath] = observe(obs, () => {
          asyncSetDataSource("observe");
        });

        field.inject({
          // debounce: 解决搜索时频繁触发请求问题
          updateRequest: debounce(
            (callback: (request: RequestObject) => void) => {
              if (typeof callback !== "function") {
                throw new TypeError('调用"updateRequest"时，入参必须是函数');
              }
              callback(obs);
            },
            300
          ),
        });
      };

      field.onUnmount = () => {
        if (typeof obs_map[fieldPath] === "function") {
          obs_map[fieldPath]();
          delete obs_map[fieldPath];
        }
      };
    } catch (error) {
      console.error(`"${fieldKey}"运行错误，${error}`);
    }
  };
};

/**
 * formily-request核心函数
 * 将`x-request`字段注册到schema中
 */

function registerRequest(): void;
function registerRequest(fieldKey: `x-${string}`): void;
function registerRequest(baseConfig: RequestConfig): void;
function registerRequest(fieldKey: string, baseConfig: RequestConfig): void;
function registerRequest(...args: any) {
  let fieldKey = field_key,
    baseConfig = {};

  if (args?.length === 1) {
    if (typeof args[0] === "string") {
      fieldKey = args[0] as `x-${string}`;
    } else {
      baseConfig = args[0];
    }
  }

  if (args?.length === 2) {
    fieldKey = args[0];
    baseConfig = args[1];
  }

  if (!fieldKey.startsWith("x-")) {
    console.warn(`${fieldKey}命名不规范，请使用x-开头的前缀`);
  }

  const flag = `${fieldKey}-registered` as `x-${string}`;

  Schema.registerPatches((schema) => {
    const x_request = schema[fieldKey as `x-${string}`];
    if (x_request && !schema[flag]) {
      const request_reaction = createReaction(fieldKey, x_request, baseConfig);
      const x_reactions = schema["x-reactions"];
      schema["x-reactions"] = [
        request_reaction,
        ...(x_reactions
          ? Array.isArray(x_reactions)
            ? x_reactions
            : [x_reactions]
          : []),
      ];
      schema[flag] = true;
    }
    return schema;
  });
}

export default registerRequest;
