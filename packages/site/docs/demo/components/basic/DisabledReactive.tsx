// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: '用户名',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Input',
    },
    password: {
      type: 'string',
      title: '密码',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Input',
    },
    database: {
      type: 'string',
      title: '库名',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择下拉项',
        fieldNames: { label: 'text', value: 'id' },
        onDropdownVisibleChange:
          '{{ open => open && $self.invoke("reloadRequest") }}',
      },
      'x-request': {
        url: '/api/search',
        params: {
          text: '{{  $values.username }}', // Demo演示的接口需要该字段作为入参，实际场景是下方的username、password
          username: '{{ $values.username }}',
          password: '{{ $values.password }}',
        },
        format: '{{ (res) => res?.data?.list || [] }}',
        mountLoad: false,
        disabledReactive: true, // 禁用响应式更新，params下的字段发生变化时不去发起请求
      },
    },
    table: {
      type: 'string',
      title: '表名',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/search',
        params: {
          text: '{{  $values.database }}',
        },
        format: '{{ (res) => res?.data?.list || [] }}',
        mountLoad: false,
        disabledReactive: false, // 不禁用响应式更新，库名的变化是下拉选择，相比输入来说不算频繁
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
