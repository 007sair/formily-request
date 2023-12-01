import { observe, observable, action } from "@formily/reactive";
import debounce from "lodash.debounce";
import { simpleFetch, isObject, isFunction } from "./utils";

import type { Field, FieldDataSource } from "@formily/core";
import type { RequestConfig, RequestObject, Caches } from "./type";

/**
 * formily-x-request
 */
class FXR {
  static _instance: FXR | null = null;

  // why any: Schema类型如果框定在这里，会出现版本差异导致外部使用时类型报错
  private Schema: any = null;

  private key: `x-${string}` = "x-request";

  static getInstance(): FXR {
    if (!this._instance) {
      this._instance = new FXR();
    }
    return this._instance;
  }

  /**
   * 使用外部的 Schema 构造函数
   * @example
   * ```
   * import { Schema } from "@formily/react" // or "@formily/vue"
   * ```
   */
  use(_Schema: any) {
    if (_Schema) {
      this.Schema = _Schema;
    } else {
      throw new Error("no Schema");
    }
    return this;
  }

  /**
   * 注册自定义字段、全局配置
   *
   * 函数类型如下:
   * - (): void
   * - (fieldKey: `x-${string}`): void;
   * - (baseConfig: RequestConfig): void;
   * - (fieldKey: string, baseConfig: RequestConfig): void;
   *
   * @param fieldKey {`x-${string}`} 自定义字段
   * @param baseConfig {RequestConfig} 全局配置
   */
  register(): void;
  register(fieldKey: `x-${string}`): void;
  register(baseConfig: RequestConfig): void;
  register(fieldKey: string, baseConfig: RequestConfig): void;
  register(...args: any) {
    if (!this.Schema) {
      console.error(
        `formily-request注册失败: 缺少Schema，请先使用"use"函数注入Schema`
      );
      return;
    }

    let baseConfig = {};

    if (args?.length === 1) {
      if (typeof args[0] === "string") {
        this.key = args[0] as `x-${string}`;
      } else {
        baseConfig = args[0];
      }
    }

    if (args?.length === 2) {
      this.key = args[0];
      baseConfig = args[1];
    }

    if (!this.key.startsWith("x-")) {
      console.warn(`${this.key}命名不规范，请使用x-开头的前缀`);
    }

    const flag = `${this.key}-registered` as `x-${string}`;

    this.Schema.registerPatches((schema: any) => {
      const x_request = schema[this.key];
      if (x_request && !schema[flag]) {
        const caches: Caches = {
          status: "init",
        };
        const reaction = this.createReaction(x_request, baseConfig, caches);
        const x_reactions = schema["x-reactions"];
        schema["x-reactions"] = [
          reaction,
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

  private createReaction = (
    config: RequestConfig,
    baseConfig: RequestObject = {},
    caches: Caches
  ) => {
    // 当schema有依赖、依赖发生变化时会执行x-reaction
    return (field: Field, scope: unknown) => {
      try {
        if (!isObject(config)) {
          throw TypeError(`${this.key}不是一个对象`);
        }
        const request = this.Schema.compile(config, scope) as RequestObject;
        const { format, mountLoad = true } = request;
        const debug = baseConfig.debug || request.debug; // 全局配置的debug会优先生效
        const obs = observable(request);

        /**
         * 处理组件最终接收到的`dataSource`数据
         * @link https://core.formilyjs.org/zh-CN/api/models/field#fielddatasource
         */
        const createDataSource = (data: unknown): FieldDataSource[] => {
          try {
            let _options = data;
            if (typeof format !== "undefined") {
              if (!isFunction(format)) {
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
          if (isFunction(request.customService)) {
            return request.customService(request);
          }

          // service仅在field层级生效
          if (isFunction(request.service)) {
            return request.service(request.params);
          }

          const t = (o: unknown) => (isObject(o) ? o : {});

          // 使用simpleFetch发起请求时，要求params必须是对象
          const params = Object.assign(
            t(baseConfig.params),
            t(request.staticParams),
            t(request.params)
          );

          const config = Object.assign({}, baseConfig, request, { params });

          // 使用内置fetch时，可以使用一些全局配置，但不应过度依赖
          return simpleFetch(config);
        };

        const asyncSetDataSource = (
          type?: "mounted" | "reaction" | "observe"
        ) => {
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
        };

        if (field.mounted) {
          // 生成field的更新状态
          caches.status = caches.status === "init" ? "mounted" : "reaction";
          if (mountLoad || caches.status !== "mounted") {
            asyncSetDataSource(
              caches.status === "mounted" ? "mounted" : "reaction"
            );
          }
        }

        if (isFunction(caches.dispose)) {
          caches.dispose();
        }

        caches.dispose = observe(obs, () => {
          asyncSetDataSource("observe");
        });

        field.inject({
          // debounce: 解决搜索时频繁触发请求问题
          updateRequest: debounce((fn: (request: RequestObject) => void) => {
            if (isFunction(fn)) {
              fn(obs);
            } else {
              throw new TypeError('调用"updateRequest"时，入参必须是函数');
            }
          }, 300),
        });

        if (field.unmounted) {
          if (isFunction(caches.dispose)) {
            caches.dispose();
            delete caches.dispose;
          }
          caches.status = "unmounted";
        }
      } catch (error) {
        console.error(`"${this.key}"运行错误，${error}`);
      }
    };
  };
}

export default FXR.getInstance();
