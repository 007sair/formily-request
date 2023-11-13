[![NPM Package](https://img.shields.io/npm/v/formily-request.svg)](https://www.npmjs.org/package/formily-request)
[![Minified Size](https://img.shields.io/bundlephobia/min/formily-request.svg?label=minified)](https://bundlephobia.com/result?p=formily-request)
[![Gzipped Size](https://img.shields.io/bundlephobia/minzip/formily-request.svg?label=gzipped)](https://bundlephobia.com/result?p=formily-request)

一个灵活、轻量、无侵入性的扩展 formily schema 请求数据的插件.

<h3 style="text-align:center">

[ [DEMO](https://007sair.github.io/formily-request/) / [API 文档](https://github.com/007sair/formily-request/blob/main/docs/API.md) ]

</h3>

## 特性

- 组件无关，不用写额外的自定义组件；
- 框架无关，不用关注是 vue 还是 react；
- 组件库无关，不用关注是 antd 还是 element-plus；
- 高扩展性，可用于 Select、Radio、Checkbox、Cascader 等任何动态数据的组件；

## 入门使用

### 安装

**该库需要 peer 依赖 `@formily/react`、`@formil/reactive`，请先确保已经安装。**

```sh
$ npm i formily-request
```

### 使用

```tsx
import registerRequest from "formily-request";

// 注册"x-request"属性，函数入参配置请参考上方API文档
registerRequest();

const schema: ISchema = {
  type: "object",
  properties: {
    select: {
      type: "string",
      "x-component": "Select",
      // 具体配置请参考上方API文档
      "x-request": {
        url: "/ws/place/v1/suggestion",
      },
    },
  },
};

export default () => {
  return <SchemaField schema={schema} />;
};
```

### 使用方式

为满足不同的使用需求，x-request 提供了 3 种配置方式：

#### 方式一：直接使用 url、method 等配置

```json
{
  "x-request": {
    "url": "http://xxx.xx.com",
    "method": "post",
    "credentials": "include",
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
```

该方式使用了插件内置的`fetch`发起请求，并未做过多的封装，除了 url、method，还可以在`x-request`内使用`header`等任何 fetch 的配置。

但是，这种方式也有使用限制，由于 schema 配置固化，当 url 地址需要在不同开发环境发生变化，例如，开发环境使用了`/api`作为前缀，生成环境使用`http://`开头的场景，此时，就需要使用注册函数的入参功能：

```tsx
import registerRequest from "formily-request";

registerRequest({
  baseURL: import.meta.env.BASIC_API, // 全局配置
});
```

除了 `baseURL`，一些全局、不想在 scheme 上重复配置的参数也可以在这里（或组件内）配置。

**注意：使用 url 配置方式时，`x-request.params`的类型必须为`object`，否则无法解析参数。**

#### 方式二：使用`service`发起请求

方式一的内置 fetch 如果无法满足请求，或者有一些定制的逻辑处理，如：token 验证、响应拦截、错误处理...等等事情时，可以使用`service`配置：

```tsx
// 声明一些业务使用的请求函数
const queryUser = (params: { name: string }) => {
  return axios('/xxx/yyy', { params, method: 'GET' })
}

// 在scope中注入
<SchemaField scope={{ queryUser }} />

// 在schema配置中使用
{
  "x-request": {
    "service": "{{ queryUser }}",
    "params": {
      name: '' // 这里可以使用表达式处理一些其他字段依赖，如: '{{ $values.xx }}'
    },
  }
}
```

#### 方式三：使用`customService`

如果不想使用内置的 fetch，又想使用 x-request 配置，可以使用该方式，它介于一、二之间，例如：

```tsx
import type { RequestObject } from "formily-request";

// 入参为x-request配置项
const queryUser = (requestConfig: RequestObject) => {
  const { url, params, method } = RequestObject;
  return jsonp(url, { method, params });
};

// 在scope中注入
<SchemaField scope={{ queryUser }} />

// 在schema配置中使用
{
  "x-request": {
    "customService": "{{ queryUser }}", // 这里不再是service
    "params": {
      name: '' // 这里可以使用表达式处理一些其他字段依赖，如: '{{ $values.xx }}'
    },
  }
}
```

如果同时配置了以上 3 种方式，优先级为 `customService` > `service` > `内置 fetch`。

### 联动

目前已获知的联动场景如下：

- `Select`组件的`onSearch`事件会触发接口的二次请求；
- 其他字段与当前字段的联动，如：省市区；

省市区的联动比较简单，给当前字段增加 `$values.xxx` 即可，这里主要讲一下 `onSearch` 主动触发场景：

```ts
{
  "x-component": "Select",
  "x-component-props": {
    onSearch: '{{ str => $self.invoke("updateRequest", r => r.params.keyword = str) }}'
  },
  "x-request": {
    "url": "",
    "params": { keyword: "" }
  }
}
```

上面代码的原理是在 formily-request 内给 field 字段注入了 `updateRequest` 自定义事件，该事件要求接收 1 个函数入参: callback，callback 的参数为 request 配置。

对于 Select 组件的搜索场景，可以参考 demo：[example-basic-jsonp--search](https://007sair.github.io/formily-request/?path=/story/example-basic-jsonp--search)
