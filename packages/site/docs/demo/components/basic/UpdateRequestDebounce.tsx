/**
 * description: 通过在 scope 中注入 debounce 函数，在 onSearch 事件中使用 debounce 函数来实现防抖更新请求。
 */
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';
import debounce from 'lodash.debounce';

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
          '{{ debounce((keyword) => $self.invoke("updateRequest", request => request.params.text = keyword), 500)  }}',
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
  return <SchemaForm schema={schema} scope={{ debounce }} />;
};
