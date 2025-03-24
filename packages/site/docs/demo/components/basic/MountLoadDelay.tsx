/**
 * title: 延迟请求下拉
 * description: 这个例子增加了延迟加载，方便看到效果
 */
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';
import { message, type SelectProps } from 'antd';
import { Field } from '@formily/core';

const schema: ISchema = {
  type: 'object',
  properties: {
    delay_search_select: {
      type: 'string',
      title: '搜索下拉',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择下拉项',
        fieldNames: { label: 'text', value: 'id' },
        onDropdownVisibleChange: '{{ useDropdownVisibleChange($self) }}',
      },
      'x-request': {
        url: '/api/search',
        params: { text: 'formily' },
        format: '{{ (res) => res?.data?.list || [] }}',
        mountLoad: false,
      },
    },
  },
};

const delay = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const useDropdownVisibleChange = (field: Field) => {
  const _onDropdownVisibleChange: SelectProps['onDropdownVisibleChange'] = (
    open,
  ) => {
    if (open) {
      message.loading('加载中...', 0);
      delay(3000).then(() => {
        field.invoke('reloadRequest').then(() => {
          message.destroy();
        });
      });
    } else {
      field.dataSource = [];
    }
  };
  return _onDropdownVisibleChange;
};

export default () => {
  return <SchemaForm schema={schema} scope={{ useDropdownVisibleChange }} />;
};
