/**
 * 省市区
 */

import { type ISchema } from '@formily/react';
import { useMemo } from 'react';
import { createForm } from '@formily/core';
import { Form, FormButtonGroup, Reset, Submit } from '@formily/antd-v5';
import { SchemaField } from '../common/SchemaField';

const schema: ISchema = {
  type: 'object',
  properties: {
    province: {
      type: 'string',
      title: '省',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        wrapperWidth: 300,
      },
      'x-component': 'Select',
      'x-component-props': {
        fieldNames: { label: 'name', value: 'code' },
      },
      'x-request': {
        url: '/api/area?type=provinces',
        format: '{{ res => res?.data || [] }}',
      },
    },
    city: {
      type: 'string',
      title: '市',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        wrapperWidth: 300,
      },
      'x-component': 'Select',
      'x-component-props': {
        fieldNames: { label: 'name', value: 'code' },
      },
      'x-request': {
        url: '/api/area',
        params: {
          type: 'cities',
          provinceId: '{{ $values.province }}',
        },
        ready: '{{ !!$values.province }}',
        format: '{{ res => res?.data || [] }}',
      },
      'x-reactions': {
        dependencies: ['province'],
        when: "{{ $self.query('.province').get('modified') }}",
        fulfill: { state: { value: null, modified: true } },
      },
    },
    district: {
      type: 'string',
      title: '区',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        wrapperWidth: 300,
      },
      'x-component': 'Select',
      'x-component-props': {
        fieldNames: { label: 'name', value: 'code' },
      },
      'x-request': {
        url: '/api/area',
        params: {
          type: 'districts',
          cityId: '{{ $values.city }}',
        },
        ready: '{{ (request) => !!request.params.cityId }}',
        format: '{{ res => res?.data || [] }}',
      },
      'x-reactions': {
        dependencies: ['city'],
        when: "{{ $self.query('.city').get('modified') }}",
        fulfill: { state: { value: null, modified: true } },
      },
    },
  },
};

export default () => {
  const form = useMemo(
    () =>
      createForm({
        values: {
          province: '11',
          city: '1101',
          district: '110115',
        },
      }),
    [],
  );

  return (
    <Form
      labelWidth={200}
      form={form}
      onAutoSubmit={(values) => alert(JSON.stringify(values, null, 2))}
    >
      <SchemaField schema={schema} />
      <FormButtonGroup.FormItem>
        <Submit>提交</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup.FormItem>
    </Form>
  );
};
