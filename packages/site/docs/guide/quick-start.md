---
nav: { title: '指南', order: 1 }
title: 快速开始
order: 2
group: { title: '开始', order: 1 }
toc: content
---

## 安装

:::code-group

```bash [pnpm]
pnpm add @formily/reactive formily-request
```

```bash [npm]
npm install @formily/reactive formily-request
```

```bash [yarn]
yarn add @formily/reactive formily-request
```

:::

:::warning{title=注意}
formily-request 需要 peer 依赖 `@formily/reactive@>=2.2.27`，请确保已经安装。
具体原因请参考 [工作原理](/guide/working-principles)
:::

## 使用

### 基础配置

使用 formily-request 只需要三个简单步骤：

1. 引入 formily-request
2. 使用外部 Schema 并注册自定义字段
3. 在 JSON Schema 中配置请求

```tsx | pure
import { createForm } from '@formily/core';
import { Schema, createSchemaField } from '@formily/react';
import { Select } from '@formily/antd-v5';
import fxr from 'formily-request'; // 第1步: 引入 formily-request

fxr.use(Schema).register(); // 第2步: 使用外部 Schema 并注册自定义字段 x-request

const SchemaField = createSchemaField({
  components: {
    Select,
  },
});

const form = createForm();

const schema = {
  type: 'object',
  properties: {
    select: {
      type: 'string',
      title: 'Select',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      // 第3步: 使用 x-request 配置请求
      'x-request': {
        url: 'https://api.example.com/data',
        method: 'GET',
        params: { id: 10 },
        format: '{{ (res) => res.list }}',
      },
    },
  },
};

export const App = () => {
  return (
    <Form form={form}>
      <SchemaField schema={schema} />
    </Form>
  );
};
```

### 工作原理

formily-request 内部使用响应式机制来处理数据请求和更新。当组件初始化或依赖的响应式数据发生变化时，会自动触发请求并更新组件的数据源。

详细的工作原理和高级用法，请参考：[工作原理](/guide/working-principles)
