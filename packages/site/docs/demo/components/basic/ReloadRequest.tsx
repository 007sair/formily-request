// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
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
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择类型',
        onDropdownVisibleChange:
          '{{ open => open && $self.invoke("reloadRequest") }}',
      },
      'x-request': {
        url: '/api/search',
        params: {
          text: '{{ $values.keyword || "" }}',
        },
        format:
          '{{ (res) => res?.data?.list.map(it => ({ label: it.text, value: it.id })) }}',
        disabledReactive: true,
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
