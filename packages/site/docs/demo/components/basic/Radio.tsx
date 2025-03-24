import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    keyword: {
      type: 'string',
      title: '搜索关键字',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Input',
    },
    type: {
      type: 'string',
      title: '类型',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Radio.Group',
      'x-request': {
        url: '/api/search',
        params: {
          text: '{{ $values.keyword }}',
        },
        format:
          '{{ (res) => res?.data?.list.map(it => ({ label: it.text, value: it.id })) }}',
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
