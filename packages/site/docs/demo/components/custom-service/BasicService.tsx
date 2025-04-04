// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const queryUser = () => {
  return new Promise((resolve) => {
    // mock request
    const mockData = [
      { name: 'admin', id: 1 },
      { name: 'test', id: 2 },
    ];
    setTimeout(() => {
      resolve(mockData.map((item) => ({ label: item.name, value: item.id })));
    }, 1000);
  });
};

const schema: ISchema = {
  type: 'object',
  properties: {
    select: {
      type: 'string',
      title: '基础下拉',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': { placeholder: '请选择下拉项' },
      'x-request': {
        service: '{{ queryUser }}',
        // format: '',  返回的数据可以直接被 Select 使用，所以不需要 format
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} scope={{ queryUser }} />;
};
