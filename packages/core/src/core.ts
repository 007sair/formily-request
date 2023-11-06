import merge from "lodash/merge";
import debounce from "lodash/debounce";
import type { ObjectParam, RequestConfig, FormilyRequest } from "./type";
import { simpleFetch } from "./fetch";
import type { FieldDataSource } from "@formily/core";

const formilyRequest: FormilyRequest = (baseConfig = {}) => {
  try {
    if (!formilyRequest.reactive) {
      throw new Error('函数缺少"reactive"属性');
    }
    const { action, observe } = formilyRequest.reactive;
    return function (field) {
      const request = field.componentProps.request as RequestConfig; // 收集request依赖

      if (!request) {
        console.error('formilyRequest执行失败，缺少"request"配置');
        return;
      }

      const { format, debug = false, mountLoad = true } = request;

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

      const asyncLoader = (): any => {
        const { params = {}, staticParams = {} } = request;
        // 本着配置就近原则，如果field的配置中使用了service、customService
        // 应当只在field层级生效，不应与全局配置混合使用，否则难以理解。

        // service仅在field层级生效
        if (typeof request.service === "function") {
          return request.service(params);
        }

        // customService仅在field层级生效
        if (typeof request.customService === "function") {
          return request.customService(request);
        }

        // 使用内置fetch时，可以使用一些全局配置，但不应过度依赖
        // merge会对baseConfig突变，改变baseConfig的值
        merge(baseConfig, request, { params: merge(params, staticParams) });

        return simpleFetch(
          baseConfig as RequestConfig & { params: ObjectParam }
        );
      };

      const asyncSetDataSource = () => {
        try {
          field.loading = true;
          return asyncLoader()
            .then(
              action.bound?.((res: unknown) => {
                field.dataSource = createDataSource(res);
              })
            )
            .catch((err: any) => {
              baseConfig.onError && baseConfig.onError(err);
              debug && console.error(`asyncLoader异步抛出异常，${err}`);
            })
            .finally(() => {
              field.loading = false;
            });
        } catch (err: any) {
          // 需要asyncLoader同步异常抛出的情况
          // 同步异常一般是配置时出现错误，需要打debug查看
          // 异步异常通常是接口错误，需要有ui界面查看
          debug && console.error(`"asyncSetDataSource"抛出异常，${err}`);
        }
      };

      const dispose = observe(request, debounce(asyncSetDataSource, 300));

      field.onMount = () => {
        mountLoad && asyncSetDataSource();
      };

      field.onUnmount = () => {
        dispose();
      };
    };
  } catch (error) {
    console.error(`"formilyRequest"执行失败，${error}`);
  }
  return () => {};
};

formilyRequest.reactive = null;

export default formilyRequest;
