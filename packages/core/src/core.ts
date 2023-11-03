import merge from "lodash/merge";
import debounce from "lodash/debounce";
import type { ObjectParam, RequestConfig, FormilyRequest } from "./type";
import { simpleFetch } from "./fetch";

const formilyRequest: FormilyRequest = (baseConfig) => {
  try {
    if (!formilyRequest.reactive) {
      throw new Error('函数缺少"reactive"属性');
    }
    const { action, observe } = formilyRequest.reactive;
    return function (field) {
      const request = field.componentProps.request as RequestConfig; // 收集request依赖
      const { format, debug = false, mountLoad = true } = request;

      /**
       * 在antd的Select组件中，最终生成的options会受到属性fieldNames影响，不一定是label/value的格式
       * 但options一定是数组
       */
      const getOptions = (data: unknown): any[] => {
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
              '下拉列表不是数组，请检查接口返回值或"format"配置'
            );
          }
          return _options;
        } catch (error) {
          debug && console.error(`"getOptions"抛出异常: ${error}`);
        }
        return [];
      };

      const mergeParams = (
        params: RequestConfig["params"],
        staticParams: RequestConfig["staticParams"]
      ) => {
        try {
          if (typeof params !== "object") {
            // 使用simpleFetch处理请求时，params类型必须为对象
            throw new TypeError("配置项params此时必须为object");
          }
          if (typeof staticParams !== "object") {
            return params;
          }
          return { ...staticParams, ...params };
        } catch (err) {
          debug && console.error(`mergeParams抛出异常,，${err}`);
        }
        return {};
      };

      const asyncLoader = (): any => {
        const { params, staticParams } = request;
        // 本着配置就近原则，如果field的配置中使用了service、customService
        // 应当只在field层级生效，不应该配置在全局

        // service仅在field层级生效
        if (typeof request.service === "function") {
          return request.service(params);
        }

        // customService仅在field层级生效
        if (typeof request.customService === "function") {
          return request.customService(request);
        }

        // 使用内置的fetch时，可以使用一些全局配置，但不应过渡依赖
        // merge会对baseConfig突变，改变baseConfig的值
        merge(baseConfig, request, {
          params: mergeParams(params, staticParams),
        });
        return simpleFetch(
          baseConfig as RequestConfig & { params: ObjectParam }
        );
      };

      const loadData = () => {
        try {
          field.loading = true;
          return asyncLoader()
            .then(
              action.bound?.((res: unknown) => {
                field.dataSource = getOptions(res);
              })
            )
            .catch((err: any) => {
              debug && console.error(`asyncLoader异步抛出异常，${err}`);
            })
            .finally(() => {
              field.loading = false;
            });
        } catch (err: any) {
          debug && console.error(`loadData抛出异常，${err}`);
        }
      };

      const dispose = observe(request, debounce(loadData, 300));

      field.onMount = () => {
        mountLoad && loadData();
      };

      field.onUnmount = () => {
        dispose();
      };
    };
  } catch (error) {
    console.error(`"useAsync"执行异常，${error}`);
  }
  return () => {};
};

formilyRequest.reactive = null;

export default formilyRequest;
