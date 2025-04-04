// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    select: {
      type: 'string',
      title: '下拉框',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择下拉项',
        onSearch:
          '{{ keyword => $self.invoke("updateRequest", request => request.params.text = keyword) }}',
        showSearch: true,
        filterOption: false,
        fieldNames: { label: 'text', value: 'id' },
      },
      'x-request': {
        url: '/api/search',
        params: { text: '' },
        format: '{{ (res) => res?.data?.list || [] }}',
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
