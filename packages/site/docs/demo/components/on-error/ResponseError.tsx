// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    scene: {
      type: 'string',
      title: 'error_demo',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': { optionType: 'button' },
      description: '选择上方场景，查看不同的错误场景',
      enum: [
        { label: '错误的请求地址', value: 'error_url' },
        { label: '未授权接口', value: 'unauthorized' },
      ],
    },
    error_url: {
      type: 'string',
      title: 'error_api',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/error-url',
        ready: '{{ $self.visible }}',
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
      'x-visible': '{{ $values.scene === "error_url" }}',
    },
    unauthorized: {
      type: 'string',
      title: 'error_api',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/unauthorized', // 错误的 url
        ready: '{{ $self.visible }}',
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
      'x-visible': '{{ $values.scene === "unauthorized" }}',
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
