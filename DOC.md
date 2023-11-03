[![NPM Package](https://img.shields.io/npm/v/formily-request.svg)](https://www.npmjs.org/package/formily-request)
[![Minified Size](https://img.shields.io/bundlephobia/min/formily-request.svg?label=minified)](https://bundlephobia.com/result?p=formily-request)
[![Gzipped Size](https://img.shields.io/bundlephobia/minzip/formily-request.svg?label=gzipped)](https://bundlephobia.com/result?p=formily-request)

formily-request 是一个扩展 [Formily](https://formilyjs.org/) schema 动态获取数据能力的工具。

[Demo Website](https://007sair.github.io/formily-request/)

## Getting Started

### Installation

```sh
$ npm i formily-request @formily/reactive
```

工具应用于 formily，内部使用了响应式依赖收集，强依赖`@formily/reactive`

### 🚀 How to use

#### 组件

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

#### 配置

在 schema 中，formilyRequest 扩展了`x-component-props.request`字段，配合在组件中传入的 scope 函数，即可实现动态数据获取，详情见 demo 或文档。

```tsx
const schema: ISchema = {
  type: "object",
  properties: {
    select: {
      type: "string",
      "x-component": "Select",
      "x-component-props": {
        style: { width: 300 },
        placeholder: "请选择下拉项",
        request: {
          url: "/ws/place/v1/suggestion",
          params: {
            keyword: "",
          },
        },
      },
      "x-reactions": "{{ useAsyncDataSource }}",
    },
  },
};
```

## Features

- 组件无关，不用写额外的自定义组件；
- 框架无关，不用关注是 vue 还是 react；
- 组件库无关，不用关注是 antd 还是 element-plus；
- 高扩展性，可用于 Select、Radio、Checkbox、Cascader 等任何动态数据的组件；
- 小巧、使用方便，核心代码不过百余行，对外仅暴露一个函数；
