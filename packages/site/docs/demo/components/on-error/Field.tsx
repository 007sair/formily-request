import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    error_api: {
      type: 'string',
      title: 'error_api',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/error-url', // <- 错误的请求,触发了onError事件
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
    },
    type_error_format: {
      type: 'string',
      title: 'type_error_format',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/user',
        format: '{{ 123 }}', // <- 错误的format类型,触发了onError事件
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
    },
    return_error_format: {
      type: 'string',
      title: 'return_error_format',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/user',
        format: '{{ () => undefined }}', // <- 错误的format返回值,触发了onError事件
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
    },
    syntax_error_format: {
      type: 'string',
      title: 'syntax_error_format',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/user',
        format: '{{ (res) => ress?.data || [] }}', // <- 错误的format语法错误（ress）,触发了onError事件
        onError: '{{ error => $self.selfErrors = error.message }}',
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
