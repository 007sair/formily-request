# formily-request API 文档

核心逻辑围绕`x-component-props.request`进行，通过 request 配置与 scope 函数加持，实现数据的动态获取。

API 分为两大部分：

1. 核心函数：`formilyRender`
2. schema 配置：`x-component-props.request`

## `formilyRequest`

类型：

```tsx
type StaticReactive = {
  action: IAction;
  observe: (
    target: object,
    observer?: (change: DataChange) => void,
    deep?: boolean
  ) => () => void;
} | null;

interface FormilyRequest {
  reactive: StaticReactive;
  (baseConfig: Partial<RequestConfig>): (field: Field) => void;
}
```

用法：

```tsx
import formilyRequest from "formily-request";

import { action, observe } from "@formily/reactive";
import formilyRequest from "formily-request";

// 将响应式相关函数挂载到函数上
formilyRequest.reactive = { action, observe };

<SchemaField scope={{ useAsyncDataSource: formilyRequest(baseConfig) }} />;
```

由于函数内部依赖 `@formily/reactive`，目前采用函数挂载静态属性的方式在内部使用依赖。

`baseConfig`为全局配置，类型同 request 配置，发起请求时使用的配置为合并后的配置，全局配置会被局部配置覆盖。

## `x-component-props.request`

类型如下：

```tsx
interface RequestConfig extends RequestInit {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: string | number | ObjectParam;
  format?: (data: unknown) => [];
  baseURL?: string;
  staticParams?: string | number | ObjectParam;
  service?: (params: unknown) => Promise<unknown>;
  mountLoad?: boolean;
  customService?: (config: RequestConfig) => Promise<unknown>;
  debug?: boolean;
}
```

### `url`

必填。接口地址，可以是绝对、相对地址。如果为相对，可配合 baseURL 一起使用。

### `method`

可选，默认值为 GET。

### `params`

可选，与 url、method 一起使用时，params 需配置为 object；

配合`request.service`使用时，如果 service 为函数名，params 将作为其参数使用。

### `format`

可选，格式化函数，接口返回的数据可能无法直接应用，需要转换为组件可使用的数据。

函数接口原始数据，返回新的数据。

```
formate: '{{ res => res?.data || [] }}'
```

### `baseURL`

可选，接口前缀。

### `staticParams`

可选，一般情况下用不上，当接口参数一部分来自 scope，一部分来自 schema，可使用该配置与 params 进行合并使用。

```ts
scope = {{ $params: { a:1, b:2 } }}

request: {
  staticParams: '{{ {...$params} }}', // 注意是3个花括号
  params: { c: 3 }
}
```

### `service`

可选，获取接口数据的函数，该函数返回 Promise。有 service 时使用 service，没有就使用内置的 fetch 发起请求。

当内置的 fetch 无法满足需求时，可使用业务系统自带的函数发起请求，如下：

```ts
request: {
  service: '{{ queryUser }}',
  params: 0 | "" | {}  // 参数可以是number、string、object，直接作为service参数
}
// 或者
request: {
  service: '{{ () => queryUser("sair") }}'
}
```

### `mountLoad`

可选，字段 mount 时是否加载数据，默认为 true。

### `customService`

可选，自定义接口函数，参数为 request 配置，介于内置 fetch 与 service 之间的一种接口请求方式。

- fetch 是完全使用 request 配置发起请求
- service 是除了使用 requst.params 外完全自定义的函数
- customService 是使用 request 配置自定义的函数

### `debug`

可选，开启后会在控制台输出部分告警提示，方便排查问题。默认为 false

### `onError`

可选，用于配置接口异常处理，例如触发 `notification.error`，该配置通常用在使用内部 simpleFetch 时，simpleFetch 基于 fetch，需要手动处理错误，具体例子可参考：[storybook-onError](https://007sair.github.io/formily-request/?path=/story/example-onerror--url-error)

---

## 场景举例

#### 场景 1：反向代理动态配置

在有接口使用 proxy 的项目中，本地开发时一般会使用`/api`作为反向代理前缀，而线上环境如果没有配置 Nginx，会根据环境变量将前缀换为 http 开头。由于这是一个动态的配置，在 schema 中无法配置，可通过全局配置实现：

```tsx
formilyRender({
  baseURL: import.meta.env.VITE_BASIC_API,
});
```

#### 场景 2：全局参数

当业务系统中的接口入参需要固化、运行时变更时，可在全局配置。
