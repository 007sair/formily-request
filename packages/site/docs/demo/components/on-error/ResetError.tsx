// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    error_url: {
      type: 'boolean',
      title: '切换请求地址',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      description: '切换正确/错误的请求地址，重新错误场景',
    },
    error_api_url: {
      type: 'string',
      title: '下拉项',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': { fieldNames: { label: 'username', value: 'id' } },
      'x-request': {
        url: '{{ $values.error_url ? "/api/error-url" : "/api/user" }}',
        format: '{{ (res) => res?.data?.list || [] }}',
        onSuccess: '{{ res => $self.selfErrors = null }}',
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
