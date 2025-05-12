import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    switch: {
      type: 'boolean',
      title: '切换请求地址',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    error_api_url: {
      type: 'string',
      title: '下拉项',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': { fieldNames: { label: 'username', value: 'id' } },
      'x-request': {
        url: '{{ $values.switch ? "/api/user" : "/api/error-url" }}',
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
