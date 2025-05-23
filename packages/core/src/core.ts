import { observe, observable, action } from "@formily/reactive";
import { simpleFetch, safeParams, getErrorMsg } from "./utils";
import { Logger } from "./logger";
import type { Field, FieldDataSource } from "@formily/core";
import type { XRequest, XRequestSchema, GlobalXRequest, Caches } from "./type";
import { Lifecycle } from "./type";

/**
 * formily-request 核心类
 * @description 导出单例
 */
class FormilyRequest {
  static _instance: FormilyRequest | null = null;

  // Why `any`: Schema类型如果框定在这里，会出现版本差异导致外部使用时类型报错
  private Schema: any = null;

  private key: `x-${string}` = "x-request";

  static getInstance(): FormilyRequest {
    if (!this._instance) {
      this._instance = new FormilyRequest();
    }
    return this._instance;
  }

  /**
   * 使用 `Schema` 构造函数：
   * @description 由于 react 和 vue 有各自的 Schema 包依赖，插件内部不再导入 Schema，需要使用 use 从外部注入。
   * @example
   * ```
   * import fxr from "formily-request"
   * import { Schema } from "@formily/react" // or "@formily/vue"
   * fxr.use(Schema) // Schema 作为`use`的入参使用
   * ```
   */
  use(_Schema: any) {
    if (!_Schema) {
      throw new Error("请传入Schema配置");
    }
    if (!("registerPatches" in _Schema)) {
      throw new Error('Schema缺少"registerPatches"方法');
    }
    if (!("compile" in _Schema)) {
      throw new Error('Schema缺少"compile"方法');
    }
    this.Schema = _Schema;
    return this;
  }

  register(): void;
  register(fieldKey: `x-${string}`): void;
  register(globalConfig: GlobalXRequest): void;
  register(fieldKey: `x-${string}`, globalConfig: GlobalXRequest): void;
  register(
    ...args:
      | []
      | [`x-${string}`]
      | [GlobalXRequest]
      | [`x-${string}`, GlobalXRequest]
  ) {
    try {
      if (!this.Schema) {
        throw new Error(
          'formily-request缺少Schema，请先使用"use"函数注入Schema'
        );
      }

      let globalConfig: GlobalXRequest = {};

      if (args.length === 1) {
        const [arg] = args;
        if (typeof arg === "string") {
          this.key = arg;
        } else {
          globalConfig = arg as GlobalXRequest;
        }
      } else if (args.length === 2) {
        const [key, config] = args;
        this.key = key;
        globalConfig = config;
      }

      if (!this.key.startsWith("x-")) {
        console.warn("字段没有使用x-开头", { key: this.key });
      }

      const flag = `${this.key}-registered` as `x-${string}`;

      this.Schema.registerPatches((schema: any) => {
        const x_request: XRequestSchema = schema[this.key];
        if (typeof x_request === "object" && !schema[flag]) {
          const caches: Caches = {
            lifecycle: Lifecycle.INIT,
            dispose: null,
          };
          const reaction = this.createReaction(x_request, globalConfig, caches);
          const x_reactions = schema["x-reactions"] || [];
          schema["x-reactions"] = [
            reaction,
            ...(Array.isArray(x_reactions) ? x_reactions : [x_reactions]),
          ];
          schema[flag] = true;
        }
        return schema;
      });
    } catch (error) {
      console.error("register调用错误", { key: this.key, error });
    }
  }

  /**
   * 处理组件最终接收到的`dataSource`数据
   * @link https://core.formilyjs.org/zh-CN/api/models/field#fielddatasource
   */
  private formatData(data: unknown, format: XRequest["format"]) {
    try {
      if (typeof format === "undefined") {
        return data as FieldDataSource[];
      }
      if (typeof format !== "function") {
        throw new TypeError("format字段的类型不是函数");
      }
      let formattedData = format(data);
      if (!Array.isArray(formattedData)) {
        throw new Error(`format字段的返回值不是数组`);
      }
      return formattedData;
    } catch (error) {
      const msg = getErrorMsg(error);
      throw new Error(`format格式化错误，${msg}`, { cause: error });
    }
  }

  private createLogger(
    debug: boolean,
    address: string,
    onLog?: GlobalXRequest["onLog"]
  ) {
    return new Logger(debug, address ? `${this.key}:${address}` : "", onLog);
  }

  private createReaction = (
    schema: XRequestSchema,
    globalConfig: GlobalXRequest = {},
    caches: Caches
  ) => {
    return (field: Field, scope: unknown) => {
      const request: XRequest = this.Schema.compile(schema, scope);
      const debug = globalConfig.debug || request.debug; // 全局配置的debug会优先生效
      const address = field.address.entire;
      const logger = this.createLogger(
        !!debug,
        typeof address === "string" ? address : "reg-exp address",
        globalConfig.onLog
      );

      logger.group("Reaction Called");

      const {
        format,
        mountLoad = true,
        ready,
        onSuccess,
        onError,
        disabledReactive,
      } = request;

      const obs = observable(request);

      const asyncLoader = (): Promise<unknown> => {
        // 本着配置就近原则，如果field的配置中使用了service、customService
        // 应当只在field层级生效，不应与全局配置混合使用，否则难以理解。

        // customService仅在field层级生效
        if (typeof request.customService === "function") {
          return request.customService(request, globalConfig);
        }

        // service仅在field层级生效
        if (typeof request.service === "function") {
          return request.service(request.params);
        }

        // 合并全局配置和字段配置（字段配置优先级最高）
        const mergeRequest = () => {
          try {
            const gp = globalConfig.params || {};
            let rp = safeParams(request.params);
            const sp = safeParams(request.staticParams);
            const params = Object.assign({}, gp, sp, rp);
            return Object.assign({}, globalConfig, request, { params });
          } catch (error) {
            logger.error("MergeRequest Failed", error);
            return {};
          }
        };
        return simpleFetch(mergeRequest());
      };

      const processCallback = <T extends unknown[]>(
        ...args: [callback?: (...rest: T) => void, ...rest: T]
      ) => {
        const [callback, ...rest] = args;
        if (typeof callback !== "function") return;
        try {
          callback(...rest);
        } catch (error) {
          logger.error(`调用 ${callback} 函数失败`, error);
        }
      };

      const asyncSetDataSource = async () => {
        try {
          logger.info("准备发起请求,判断是否发起请求");
          if (typeof ready === "boolean" && !ready) {
            logger.info("ready字段为false,不发起请求");
            return;
          }
          if (typeof ready === "function" && !ready(request)) {
            logger.info("ready字段返回false,不发起请求");
            return;
          }
          field.loading = true;
          logger.info("发起请求", { request });
          const result = await asyncLoader();
          // 使用 action.bound 包裹，内部无需收集依赖
          const run = action.bound?.(() => {
            logger.info("请求成功,准备设置dataSource", { format });
            field.dataSource = this.formatData(result, format);
            processCallback(onSuccess, result, request);
            logger.info("设置dataSource、调用onSuccess完毕");
          });
          run && run();
        } catch (error) {
          logger.error("设置dataSource失败,准备触发onError回调", error);
          processCallback(onError, error);
        } finally {
          field.loading = false;
        }
      };

      if (field.mounted) {
        // 依赖变化时发起请求
        if (caches.lifecycle > Lifecycle.MOUNTED && !disabledReactive) {
          logger.info(`${this.key}配置已被修改,触发请求`, {
            lifecycle: Lifecycle[caches.lifecycle],
          });
          asyncSetDataSource();
        }
        // 使用 enum 计数，避免重复执行
        if (caches.lifecycle < Lifecycle.MOUNTED) {
          caches.lifecycle = Lifecycle.MOUNTED;
          logger.info("组件已挂载", {
            lifecycle: Lifecycle[caches.lifecycle],
          });
          // 仅组件挂载时触发一次
          if (mountLoad) {
            logger.info("组件挂载后自动触发请求", { mountLoad, request });
            asyncSetDataSource();
          }
          caches.lifecycle++;
        }
      }

      if (typeof caches.dispose === "function") {
        caches.dispose();
      }

      // 监听 obs 变化，在 updateRequest 中修改时触发接口请求
      caches.dispose = observe(obs, (change) => {
        logger.info(`主动修改${this.key}配置,触发请求`, {
          change,
        });
        asyncSetDataSource();
      });

      field.inject({
        updateRequest: (fn: (request: XRequest) => void) => {
          logger.info("调用updateRequest");
          try {
            if (typeof fn !== "function") {
              throw new Error('调用"updateRequest"时,入参必须是函数');
            }
            fn(obs);
          } catch (error) {
            logger.error("updateRequest Failed", error);
          }
        },
        reloadRequest: () => {
          logger.info('主动调用"reloadRequest",触发请求', { request });
          return asyncSetDataSource();
        },
      });

      if (field.unmounted) {
        if (typeof caches.dispose === "function") {
          caches.dispose();
          caches.dispose = null;
        }
        caches.lifecycle = Lifecycle.UNMOUNT;
        logger.info("组件已卸载", { unmounted: field.unmounted });
      }

      logger.groupEnd();
    };
  };
}

export default FormilyRequest.getInstance();
