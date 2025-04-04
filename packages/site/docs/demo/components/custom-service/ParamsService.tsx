// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const queryUserWithParams = (params: { keyword: string }) => {
  return new Promise((resolve) => {
    // mock request
    setTimeout(() => {
      if (!params.keyword) {
        resolve([]);
      } else {
        resolve({
          data: Array.from({ length: 10 }).map((_, index) => {
            return {
              label: `${params.keyword}-${index}`,
              value: `${params.keyword}-${index}`,
            };
          }),
        });
      }
    }, 1000);
  });
};

const schema: ISchema = {
  type: 'object',
  properties: {
    search_select: {
      type: 'string',
      title: '参数查询',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择下拉项',
        showSearch: true,
        filterOption: false,
        onSearch:
          '{{ value => $self.invoke("updateRequest", r => r.params.keyword = value) }}',
      },
      'x-request': {
        service: '{{ queryUserWithParams }}',
        params: { keyword: '' },
        format: '{{ res => res.data }}',
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} scope={{ queryUserWithParams }} />;
};
