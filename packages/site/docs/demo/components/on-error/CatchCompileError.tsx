// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';
import { Schema } from '@formily/react';
import { compiler } from './formily-catch-error';

Schema.registerCompiler(compiler); // 注册编译函数

const schema: ISchema = {
  type: 'object',
  properties: {
    compile_error_format: {
      type: 'string',
      title: 'compile_error_format',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-request': {
        url: '/api/user',
        format: '{{ $a }}', // <- 错误的变量
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
