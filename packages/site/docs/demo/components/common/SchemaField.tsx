import { Schema, createSchemaField } from '@formily/react';
import {
  Cascader,
  Checkbox,
  FormItem,
  Input,
  Radio,
  Select,
  Submit,
  Switch,
  ArrayTable,
  ArrayItems,
  Space,
  Editable,
} from '@formily/antd-v5';
import { Flex } from 'antd';
import fxr from 'formily-request';
import { mockApiBaseURL } from '@site/constant/index';

fxr.use(Schema).register({
  baseURL: mockApiBaseURL,
  onLog: async (level, msg, error) => {
    if (level === 'ERROR') {
      console.group('全局onLog函数', msg);
      console.log('error:');
      console.dir(error);
      console.log('error.cause:');
      console.dir(error.cause);
      console.groupEnd();
    }
  },
});

export const SchemaField = createSchemaField({
  components: {
    FormItem,
    Select,
    Submit,
    Input,
    Radio,
    Switch,
    Checkbox,
    Cascader,
    ArrayTable,
    ArrayItems,
    Space,
    Editable,

    // antd
    Flex,
  },
});
