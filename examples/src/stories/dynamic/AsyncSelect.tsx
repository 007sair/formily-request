/**
 * 动态下拉组件
 */

import { Field } from "@formily/core";
import { connect, mapProps, mapReadPretty, useField } from "@formily/react";
import { PreviewText } from "@formily/antd-v5/esm/preview-text";
import { Select as AntdSelect } from "antd";
import type { SelectProps } from "antd/lib/select";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import formilyRequest from "formily-request";
import { action, observe } from "@formily/reactive";

formilyRequest.reactive = {
  action,
  observe,
};

const EnhanceSelect = (props: SelectProps) => {
  const field = useField<Field>();

  useEffect(() => {
    formilyRequest({
      baseURL: "/api",
      params: {
        key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
      },
    })(field);
  }, [field]);

  return <AntdSelect {...props} />;
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
