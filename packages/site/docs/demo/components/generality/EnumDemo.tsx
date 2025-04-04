// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      title: '组件类型',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        optionType: 'button',
        buttonStyle: 'solid',
      },
      default: 'Select',
      enum: [
        { label: 'Select', value: 'Select' },
        { label: 'Radio', value: 'Radio.Group' },
        { label: 'Checkbox', value: 'Checkbox.Group' },
      ],
    },
    comp: {
      type: 'string',
      title: '渲染组件',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        wrapperWidth: 400,
      },
      'x-component': '{{ $values.type  }}',
      'x-request': {
        url: '/api/user',
        format:
          '{{ (res) => res?.data?.list.map(it => ({ label: it.username, value: it.id })) }}',
        // 请求成功后，设置字段的默认值，这里默认选第0个
        onSuccess:
          '{{ () => (Array.isArray($self.dataSource) && $self.dataSource.length > 0) ? $self.initialValue = $self.dataSource[0].value : null }}',
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
