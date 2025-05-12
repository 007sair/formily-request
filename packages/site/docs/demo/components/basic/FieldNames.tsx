import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

export default function BasicSelect() {
  const schema: ISchema = {
    type: 'object',
    properties: {
      select: {
        type: 'string',
        title: '基础下拉',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          style: { width: 300 },
          placeholder: '请选择下拉项',
          fieldNames: { label: 'username', value: 'id' },
        },
        'x-request': {
          url: '/api/user',
          format: '{{ (res) => res?.data?.list || [] }}',
        },
      },
    },
  };
  return <SchemaForm schema={schema} />;
}
