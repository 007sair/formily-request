import { useMemo } from 'react';
import { createForm } from '@formily/core';
import { Form, FormButtonGroup, Reset, Submit } from '@formily/antd-v5';
import { SchemaField } from './SchemaField';

import type { ISchema, ISchemaFieldProps } from '@formily/react';

type Props = {
  schema: ISchema;
  scope?: ISchemaFieldProps['scope'];
};

export const SchemaForm = ({ schema, scope }: Props) => {
  const form = useMemo(() => createForm(), []);
  return (
    <Form
      labelWidth={200}
      form={form}
      onAutoSubmit={(values) => alert(JSON.stringify(values, null, 2))}
    >
      <SchemaField schema={schema} scope={scope || {}} />
      <FormButtonGroup.FormItem>
        <Submit>提交</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup.FormItem>
    </Form>
  );
};
