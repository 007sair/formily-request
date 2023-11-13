import { createForm } from "@formily/core";
import { ISchema, createSchemaField } from "@formily/react";
import {
  Form,
  FormItem,
  Submit,
  Input,
  Select,
  Radio,
  Checkbox,
  Cascader,
} from "@formily/antd-v5";
import type { FormProps } from "@formily/antd-v5";
import { useMemo } from "react";
import { queryAddress, queryCascader, customJsonp } from "@/service";
import registerRequest, { RequestObject } from "formily-request";
import { notification } from "antd";

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Select,
    Submit,
    Input,
    Radio,
    Checkbox,
    Cascader,
  },
});

type Props = FormProps & {
  onSubmit: (values: unknown) => void;
  schema: ISchema;
};

const $beforeFormat = (format: RequestObject["format"]) => {
  return function (res: any) {
    if (res.status !== 0) {
      throw new Error("接口数据异常");
    }
    return format && format(res);
  };
};

registerRequest({
  baseURL: import.meta.env.VITE_BASIC_API,
  params: {
    key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
  },
  onError(err: any) {
    console.log("invoke onError");
    notification.error({
      message: "接口获取失败",
      description: err.message,
    });
  },
  debug: true,
});

function Demo({ schema, onSubmit, ...formProps }: Props) {
  // schema deps: 用于storybook下修改schema时使用
  const form = useMemo(() => createForm(), [schema]); // eslint-disable-line

  return (
    <div style={{ maxWidth: 600 }}>
      <Form form={form} {...formProps} onAutoSubmit={onSubmit}>
        <SchemaField
          schema={schema}
          scope={{
            queryAddress,
            queryCascader,
            customJsonp,
            $beforeFormat,
          }}
        />
        <div>
          <Submit>提交</Submit>
        </div>
      </Form>
    </div>
  );
}

export default Demo;
