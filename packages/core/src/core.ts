import { observe, observable, action } from "@formily/reactive";
import debounce from "lodash.debounce";
import { simpleFetch, is } from "./utils";
import type { Field, FieldDataSource } from "@formily/core";
import type { XRequest, XRequestSchema, GlobalXRequest, Caches } from "./type";

/**
 * formily-request 核心类
 *
 * @description 默认导出为该类是实例（单例）
 */
class FormilyRequest {
  /** @ignore */
  static _instance: FormilyRequest | null = null;

  // Why `any`: Schema类型如果框定在这里，会出现版本差异导致外部使用时类型报错
  /** @ignore */
  private Schema: any = null;

  /** @ignore */
  private key: `x-${string}` = "x-request";

  static getInstance(): FormilyRequest {
    if (!this._instance) {
      this._instance = new FormilyRequest();
    }
    return this._instance;
  }

  /**
   * 使用`Schema`构造函数：
   *
   * @description 由于 react 和 vue 有各自的 Schema 包依赖，插件内部不再导入 Schema，需要使用 use 从外部注入。
   * @example
   * ```
   * import fxr from "formily-request"
   * import { Schema } from "@formily/react" // or "@formily/vue"
   *
   * fxr.use(Schema) // Schema 作为`use`的入参使用
   * ```
   */
  use(_Schema: any) {
    if (!_Schema) throw new Error("请传入Schema配置");
    this.Schema = _Schema;
    return this;
  }

  /**
   * 没有参数的调用
   * @description 该函数可以运行在组件外，当需要依赖组件状态时，可以像使用 formily 的 `createForm()` 一样在组件内使用。
   */
  register(): void;

  /** 仅有1个参数，参数为自定义扩展名 */
  register(fieldKey: `x-${string}`): void;

  /** 仅有1个参数，参数为全局配置 */
  register(globalConfig: GlobalXRequest): void;

  /**
   * 有2个参数，第1个为自定义扩展名；第2个为全局配置
   */
  register(fieldKey: `x-${string}`, globalConfig: GlobalXRequest): void;

  register(...args: any) {
    if (!this.Schema) {
      console.error(
        `formily-request注册失败: 缺少Schema，请先使用"use"函数注入Schema`
      );
      return;
    }

    let globalConfig = {};

    if (args?.length === 1) {
      if (typeof args[0] === "string") {
        this.key = args[0] as `x-${string}`;
      } else {
        globalConfig = args[0];
      }
    }

    if (args?.length === 2) {
      this.key = args[0];
      globalConfig = args[1];
    }

    if (!this.key.startsWith("x-")) {
      console.warn(`${this.key}命名不规范，请使用x-开头的前缀`);
    }

    const flag = `${this.key}-registered` as `x-${string}`;

    this.Schema.registerPatches((schema: any) => {
      const x_request: XRequestSchema = schema[this.key];
      if (x_request && !schema[flag]) {
        const caches: Caches = {
          status: "init",
        };
        const reaction = this.createReaction(x_request, globalConfig, caches);
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

  /** @ignore */
  private createReaction = (
    schema: XRequestSchema,
    globalConfig: GlobalXRequest = {},
    caches: Caches
  ) => {
    // 当schema有依赖、依赖发生变化时会执行x-reaction
    return (field: Field, scope: unknown) => {
      try {
        if (!is.object(schema)) {
          throw TypeError(`${this.key}不是一个对象`);
        }
        const request: XRequest = this.Schema.compile(schema, scope);
        const { format, mountLoad = true, ready, onSuccess } = request;
        const debug = globalConfig.debug || request.debug; // 全局配置的debug会优先生效
        const obs = observable(request);

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

          const t = (o: unknown) => (is.object(o) ? o : {});

          // 使用simpleFetch发起请求时，要求params必须是对象
          const params = Object.assign(
            t(globalConfig.params),
            t(request.staticParams),
            t(request.params)
          );

          const config = Object.assign({}, globalConfig, request, { params });

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
            if (typeof schema.ready !== "undefined") {
              if (typeof ready === "function" && !ready(request)) return;
              if (!ready) return;
            }

            field.loading = true;
            return asyncLoader()
              .then(
                action.bound?.((res: unknown) => {
                  field.dataSource = createDataSource(res);
                  if (typeof onSuccess === "function") {
                    onSuccess(res, request);
                  }
                })
              )
              .catch((err) => {
                globalConfig.onError && globalConfig.onError(err);
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

        if (typeof caches.dispose === "function") {
          caches.dispose();
        }

        caches.dispose = observe(obs, () => {
          asyncSetDataSource("observe");
        });

        field.inject({
          // debounce: 解决搜索时频繁触发请求问题
          updateRequest: debounce((fn: (request: XRequest) => void) => {
            if (typeof fn === "function") {
              fn(obs);
            } else {
              throw new TypeError('调用"updateRequest"时，入参必须是函数');
            }
          }, 300),
        });

        if (field.unmounted) {
          if (typeof caches.dispose === "function") {
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

/**
 * @ignore
 */
export default FormilyRequest.getInstance();
