/**
 * 省市区
 */
// @ts-nocheck dumi needs React import for real-time editing
import React, { useMemo } from 'react';
import { type ISchema } from '@formily/react';
import { createForm, Field } from '@formily/core';
import { Form, FormButtonGroup, Reset, Submit } from '@formily/antd-v5';
import { SchemaField } from '../common/SchemaField';
import { type Option } from './types';
import CascaderDataManager from './cascader-data-manager';

const dataManager = new CascaderDataManager();

const getLevelData = async (params: any) => {
  return dataManager.getData(params);
};

const schema: ISchema = {
  type: 'object',
  properties: {
    values: {
      type: 'string',
      title: '省市区级联',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        wrapperWidth: 300,
      },
      'x-component': 'Cascader',
      'x-component-props': {
        fieldNames: { label: 'name', value: 'code' },
        changeOnSelect: true,
      },
      'x-request': {
        service: '{{ getLevelData }}',
        params: { type: 'provinces' },
      },
      'x-reactions': (
        field: Field,
        scope: { getLevelData: typeof getLevelData },
      ) => {
        const loadData = async (selectedOptions: Option[]) => {
          const targetOption = selectedOptions[selectedOptions.length - 1];
          let nextLevelData: Option[] = [];

          if (targetOption.type === 'provinces') {
            nextLevelData = await scope.getLevelData({
              type: 'cities',
              provinceId: targetOption.id,
            });
          } else if (targetOption.type === 'cities') {
            nextLevelData = await scope.getLevelData({
              type: 'districts',
              cityId: targetOption.id,
            });
          }

          field.dataSource = dataManager.updateNodeChildren(
            field.dataSource as Option[],
            targetOption.id,
            nextLevelData,
          );
        };
        field.setComponentProps({
          loadData,
        });
      },
    },
  },
};

export default () => {
  const form = useMemo(() => createForm({}), []);
  return (
    <Form
      labelWidth={200}
      form={form}
      onAutoSubmit={(values) => alert(JSON.stringify(values, null, 2))}
    >
      <SchemaField schema={schema} scope={{ getLevelData }} />
      <FormButtonGroup.FormItem>
        <Submit>提交</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup.FormItem>
    </Form>
  );
};
