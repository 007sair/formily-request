/**
 * title: 基础下拉请求
 * description: 禁用 `mountLoad` 后，只有在下拉项打开时(`onDropdownVisibleChange`)才会发起请求
 */
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    search_select: {
      type: 'string',
      title: '搜索下拉',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择下拉项',
        fieldNames: { label: 'text', value: 'id' },
        onDropdownVisibleChange:
          '{{ open => open && $self.invoke("reloadRequest") }}',
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

export default () => {
  return <SchemaForm schema={schema} />;
};
