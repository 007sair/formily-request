// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    select: {
      type: 'string',
      title: '基础下拉',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择下拉项',
      },
      'x-request': {
        url: '/api/user',
        format:
          '{{ (res) => res?.data?.list.map(it => ({ label: it.username, value: it.id })) }}',
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
