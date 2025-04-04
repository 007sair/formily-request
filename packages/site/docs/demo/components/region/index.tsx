/**
 * 省市区
 */
// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type ISchema } from '@formily/react';
import { SchemaForm } from '../common/SchemaForm';

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
  return <SchemaForm schema={schema} />;
};
