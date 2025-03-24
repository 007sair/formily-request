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
  debug: true,
  onLog: (level, msg, error) => {
    if (level === 'ERROR') {
      console.groupCollapsed(`%c${msg}`, 'color:red;font-size:12px');
      console.error(error);
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
