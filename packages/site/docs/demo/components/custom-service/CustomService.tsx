import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';
import { XRequest } from 'formily-request';

const obj2str = (obj: any) =>
  Object.keys(obj)
    .map((key: any) => key + '=' + obj[key])
    .join('&');

const queryUser: XRequest['customService'] = (config, globalConfig) => {
  const url = globalConfig.baseURL + (config.url || '');
  return fetch(`${url}?${obj2str(config.params)}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) =>
      res?.data?.list?.map((it: any) => ({
        label: it.text,
        value: it.id,
      })),
    );
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
      'x-component-props': {
        placeholder: '请选择下拉项',
        showSearch: true,
        filterOption: false,
        onSearch:
          '{{ v => $self.invoke("updateRequest", x => x.params.text = v) }}',
      },
      'x-request': {
        url: '/api/search',
        params: { text: '' },
        customService: '{{ queryUser }}',
      },
    },
  },
};

export default () => {
  return <SchemaForm schema={schema} scope={{ queryUser }} />;
};
