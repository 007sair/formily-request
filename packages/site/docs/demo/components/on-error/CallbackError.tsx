import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    on_error: {
      type: 'string',
      title: '基础下拉',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/error', // <- 错误的请求,触发了 onError 事件
        onError: '{{ error => $self.selfErrors(error.message) }}', // <- 错误使用 $self.selfErrors
      },
    },
    on_success: {
      type: 'string',
      title: '基础下拉',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/user', // <- 正确的请求，触发了 onSuccess 事件
        onSuccess: '{{ res => $self.selfErrors(res.message) }}', // <- 错误使用 $self.selfErrors
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
