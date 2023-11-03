/**
 * 动态下拉组件
 */

import { Field } from "@formily/core";
import { connect, mapProps, mapReadPretty, useField } from "@formily/react";
import { PreviewText } from "@formily/antd-v5/esm/preview-text";
import { Select as AntdSelect } from "antd";
import type { SelectProps, LabeledValue } from "antd/lib/select";
import { LoadingOutlined } from "@ant-design/icons";
import fetch from "@/utils/request";
import useDeepCompareEffect from "ahooks/es/useDeepCompareEffect";
import debounce from "lodash/debounce";

type Config = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params: Record<string, any>;
  allData?: boolean;
  silent?: boolean;
  retry?: boolean;
  format?: (data: any) => LabeledValue[];
  service: (params: any) => Promise<any>;
  handleSearch: (keyword: string, oldParams: any) => any;
};

type Props = SelectProps & {
  request: Config;
};

const EnhanceSelect = (props: Props) => {
  const { request, ...rest } = props;
  const field = useField<Field>();
  const {
    url,
    params,
    method,
    format,
    allData = true,
    silent = true,
    retry,
    handleSearch,
  } = request;

  // 返回的options会受fieldNames影响，不一定是label、value，但一定是数组
  const getOptions = (data: unknown): any[] => {
    try {
      let _options;
      if (!format) {
        _options = data;
      }
      if (typeof format === "function") {
        _options = format(data);
      }
      if (!Array.isArray(_options) && !silent) {
        throw new Error(`转换options失败，options不是数组`);
      }
      return Array.isArray(_options) ? _options : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const loader = (params: any) => {
    if (typeof request.service === "function") {
      return request.service(params);
    }
    return fetch(url, { method: method || "GET", params }, allData);
  };

  const loadData = (params: any) => {
    field.loading = true;
    return loader(params)
      .then((res) => {
        field.dataSource = getOptions(res);
      })
      .catch((err) => {
        !silent && console.log(err);
      })
      .finally(() => {
        field.loading = false;
      });
  };

  // why useDeepCompareEffect:
  // 修复选择下拉项发起请求问题，当'x-component-props'内部有表达式时，request会导致该组件rerender
  useDeepCompareEffect(() => {
    loadData(params);
  }, [params]);

  // 搜索相关逻辑
  if (rest.showSearch) {
    rest.onSearch = debounce((keyword) => {
      if (typeof handleSearch !== "function" && !silent) {
        throw new Error("搜索需要配置request.handleSearch");
      }
      loadData(handleSearch(keyword, params));
    }, 300);
  }

  return (
    <AntdSelect
      {...rest}
      onDropdownVisibleChange={(open) => {
        if (typeof rest.onDropdownVisibleChange === "function") {
          rest.onDropdownVisibleChange(open);
        }
        if (retry && open && !field.dataSource) {
          // 重试
          loadData(params);
        }
      }}
    />
  );
};

export const DynamicSelect = connect(
  EnhanceSelect,
  mapProps(
    {
      dataSource: "options",
      loading: true,
    },
    (props, _field) => {
      const field = _field as Field;
      return {
        ...props,
        suffixIcon:
          field?.loading || field?.validating ? (
            <LoadingOutlined />
          ) : (
            props.suffixIcon
          ),
      };
    }
  ),
  mapReadPretty(PreviewText.Select)
);

export default DynamicSelect;
