# API 文档

`formily-request` 核心围绕 `x-component-props.request` 配置进行，通过 request 与 scope 函数，实现数据的动态获取。

API 分为两大部分：

1. `formilyRender`：核心函数
2. `x-component-props.request`：schema配置

## `formilyRequest`

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

在传入 scope 前，可以将业务的全局配置传入到核心函数中，统一处理。由于schema配置是纯静态，如果需要处理运行时逻辑，可以放在该配置中。
schema级别字段会覆盖掉该全局配置。用法：

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

> 数据获取方式之一：会使用内部 simpleFetch(fetch简易封装)，优先级相较于另2种最低。

必填。接口地址，可以是绝对、相对地址。如果为相对，可配合 baseURL 一起使用。

### `method`

可选，默认值为 GET。配合 url 使用。

### `params`

可选，与 url、method 一起使用时，params 需配置为 object；与 `request.service` 使用时，如果 service 为函数名，params 将作为其参数使用。

### `format`

可选，接口数据格式化函数，接口返回的数据可能无法直接应用与组件，需要转换为可使用的数据格式。

```js
// res 为原始数据
format: '{{ res => res?.data || [] }}'
```

format 接收的res，不关注来源，即目前三种获取数据的方式（内部simpleFetch、request.service、request.cunstomService）返回的结果都会经过format，然后被应用到 field.dataSource。

所以，format还能扩展如下用法：

```ts
// 1.定义 format 前置函数，返回函数（函数入参为原始数据）
const $beforeFormat = (format: RequestConfig["format"]) => {
  return function (res: any) {
    if (res.status !== 0) {
      throw new Error("接口数据异常");
    }
    return format && format(res);
  };
};

// 2.传入 scope
const scope = {{ $beforeFormat }}

// 3.在schema中应用
format: "{{ $beforeFormat((res) => res?.data || []) }}"
```

此时返回的res数据如果状态不是200，会抛出异常，配合onError使用可以给出ui错误提示。

当然，如果接口请求方式是 service、customService，无需这样使用，其内部可以自行管理错误提示方式。

### `baseURL`

可选，接口前缀。配合 url 使用。

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

> 数据获取方式之二：需将函数传入 scope 使用，有其他2种配置时优先级最高。

可选，获取接口数据的函数，该函数返回 Promise。当内置的 fetch 无法满足需求时，可使用业务系统自带的函数发起请求，如下：

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

可选，字段 mount 时是否加载数据，默认为 true。用于页面加载时是否自动请求一次。

### `customService`

> 数据获取方式之三：使用场景介于url、service之间。既要使用配置，又要有自定义。

可选，自定义接口函数，参数为 request 配置，内部实现可基于入参自行实现，demo中自行实现了 jsonp 的接口请求。

三种数据获取方式对比：

- `内置fetch`：完全使用schema配置，无需自定义；
- `service`：使用系统自带的函数，也可以配合 request.params 使用；
- `customService`：完全自定义，使用了 request 配置，但内部完全自己实现的接口请求。

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
