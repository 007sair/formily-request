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
      default: 'error_url',
      enum: [
        { label: '类型错误', value: 'type_error' },
        { label: '返回值错误', value: 'return_error' },
        { label: '语法错误', value: 'syntax_error' },
      ],
    },
    type_error: {
      type: 'string',
      title: 'type_error_format',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/user',
        ready: '{{ $self.visible }}',
        format: '{{ 123 }}', // <- 错误的format类型,触发了onError事件
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
      'x-visible': '{{ $values.scene === "type_error" }}',
    },
    return_error: {
      type: 'string',
      title: 'return_error_format',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/user',
        ready: '{{ $self.visible }}',
        format: '{{ () => undefined }}', // <- 错误的format返回值,触发了onError事件
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
      'x-visible': '{{ $values.scene === "return_error" }}',
    },
    syntax_error: {
      type: 'string',
      title: 'syntax_error_format',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/user',
        ready: '{{ $self.visible }}',
        format: '{{ (res) => ress?.data || [] }}', // <- 错误的format语法错误（ress）,触发了onError事件
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
      'x-visible': '{{ $values.scene === "syntax_error" }}',
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
