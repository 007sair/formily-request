import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

const schema: ISchema = {
  type: 'object',
  properties: {
    visible: {
      type: 'boolean',
      title: '是否发起请求',
      default: true,
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
    },
    ready_select: {
      type: 'string',
      title: '基础下拉',
      'x-decorator': 'FormItem',
      'x-decorator-props': { wrapperWidth: 300 },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '{{ $values.visible ? "请选择下拉项" : "请先开启请求" }}',
        onSearch:
          '{{ keyword => $self.invoke("updateRequest", request => request.params.text = keyword) }}',
        showSearch: true,
        filterOption: false,
        fieldNames: { label: 'text', value: 'id' },
      },
      'x-request': {
        url: '/api/search',
        params: { text: '' },
        ready: '{{ !!$values.visible }}',
        format: '{{ (res) => res?.data?.list || [] }}',
      },
      // 切换 “是否发起请求” 时，清空下拉数据
      'x-reactions': {
        dependencies: ['.visible'],
        fulfill: { state: { dataSource: [] } },
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} />;
};
