[![NPM Package](https://img.shields.io/npm/v/formily-request.svg)](https://www.npmjs.org/package/formily-request)
[![Minified Size](https://img.shields.io/bundlephobia/min/formily-request.svg?label=minified)](https://bundlephobia.com/result?p=formily-request)
[![Gzipped Size](https://img.shields.io/bundlephobia/minzip/formily-request.svg?label=gzipped)](https://bundlephobia.com/result?p=formily-request)

formily-request 是一个灵活、轻量、无侵入性的扩展 formily schema 获取数据能力的库.

[Demo](https://007sair.github.io/formily-request/)

[API 文档](/docs//API.md)

## 特性

- 组件无关，不用写额外的自定义组件；
- 框架无关，不用关注是 vue 还是 react；
- 组件库无关，不用关注是 antd 还是 element-plus；
- 高扩展性，可用于 Select、Radio、Checkbox、Cascader 等任何动态数据的组件；

## 入门使用

### 安装

```sh
$ npm i formily-request @formily/reactive
```

### 使用

在组件中，引入`formilyRequest`后，需要将 reactive 挂载到函数上，然后将返回的函数写到 scope 即可。

```tsx
// xxx/xx.tsx 部分代码省略
import { action, observe } from "@formily/reactive";
import formilyRequest from "formily-request";

// 将响应式相关函数挂载到函数上
formilyRequest.reactive = { action, observe };

export default () => {
  return <SchemaField scope={{ useAsyncDataSource: formilyRequest() }} />;
};
```

在 schema 中，formilyRequest 扩展了`x-component-props.request`字段，配合传入 scope 的核心函数，即可实现配置化获取数据。

```diff
const schema: ISchema = {
  type: "object",
  properties: {
    select: {
      type: "string",
      "x-component": "Select",
      "x-component-props": {
        style: { width: 300 },
        placeholder: "请选择下拉项",
+        request: {
+          url: "/ws/place/v1/suggestion",
+          params: {
+            keyword: "",
+          },
+        },
      },
+      "x-reactions": "{{ useAsyncDataSource }}",
    },
  },
};
```
