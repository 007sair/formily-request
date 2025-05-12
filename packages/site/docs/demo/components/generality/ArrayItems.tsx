import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    array: {
      type: 'array',
      title: '对象数组',
      'x-component': 'ArrayItems',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100,
      },
      'x-request': {
        url: '/api/user',
        onSuccess: '{{ res => $self.value = res?.data?.list || [] }}',
      },
      items: {
        type: 'object',
        properties: {
          space: {
            type: 'void',
            'x-component': 'Flex',
            'x-component-props': { gap: 20 },
            properties: {
              sort: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.SortHandle',
              },
              username: {
                type: 'string',
                title: 'UserName',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              email: {
                type: 'string',
                title: 'Email',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              status: {
                type: 'string',
                title: 'Status',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              remove: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加条目',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
