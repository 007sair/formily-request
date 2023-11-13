# API 文档

`formily-request`通过注册自定义属性（默认为`x-request`），配置化的方式实现组件的数据获取。

包默认导出的是 FormilyRequest 的实例，使用方式如下：

```tsx
import fxr from "formily-request"; // fxr: formily-x-request

fxr.use(Schema).register();

// or
fxr.use(Schema);
fxr.register();
```

**注意：**`use(Schema)`必不可少，需要在 `register` 之前调用，缺失时 `register` 不会生效；

API 分为如下几个部分

1. `fxr.use()`：从外部传入 Schame 类，供内部使用；
2. `fxr.register()`：实例需要先从外部使用`Schema`，再去注册自定义属性；
3. `x-request`：自定义属性，名称可通过注册函数自定义其他；
4. `field.invoke`：自定义事件，用于改变 request，触发接口请求。

## `use()`

```tsx
import { Schema } from "@formily/react"; // or import { Schema } from '@formily/vue'
import fxr from "formily-request";

fxr.use(Schema);
```

由于 react 和 vue 有各自的 Schema 包依赖，插件内部不再导入 Schema，需要使用 use 从外部导入。

## `register()`

```tsx
import fxr from "formily-request";

fxr.register();

// 使用方式1：不传任何参数，默认使用 "x-request" 作为自定义属性
function register(): void;
// 方式2：自定义属性名称，例如: "x-fetch"，建议使用 "x-" 开头的命名规范
function register(fieldKey: `x-${string}`): void;
// 方式3：传入全局配置
function register(baseConfig: RequestConfig): void;
// 方式4：自定义属性 + 全局配置
function register(fieldKey: `x-${string}`, baseConfig: RequestConfig): void;
```

该函数可以运行在组件外，当需要依赖组件状态时，可以像使用 `createForm()` 一样在组件内使用。

## `x-request`

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
  onError: (err: any) => void;
}
```

### `url`

> 数据获取方式之一：会使用内部 simpleFetch（fetch 简易封装），优先级相较于其他方式最低。

必填。接口地址，可以是绝对、相对地址。如果为相对，可配合 baseURL 一起使用。

### `method`

可选，默认值为 GET。配合 url 使用。

### `params`

可选，与 url、method 一起使用时，params 需配置为 object；与 `request.service` 使用时，如果 service 为函数名，params 将作为其参数使用。

### `format`

可选，接口数据格式化函数，接口返回的数据可能无法直接应用与组件，需要转换为可使用的数据格式。

```js
// res 为原始数据
format: "{{ res => res?.data || [] }}";
```

format 接收的 res，不关注来源，即目前三种获取数据的方式（内部 simpleFetch、request.service、request.cunstomService）返回的结果都会经过 format，然后被应用到 field.dataSource。

所以，format 还能扩展如下用法：

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

此时返回的 res 数据如果状态不是 200，会抛出异常，配合 onError 使用可以给出 ui 错误提示。

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

> 数据获取方式之二：需将函数传入 scope 使用，相较于其他方式优先级最高。

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

> 数据获取方式之三：使用场景介于 url、service 之间。既要使用配置，又要有自定义。

可选，自定义接口函数，参数为 request 配置，内部实现可基于入参自行实现，demo 中自行实现了 jsonp 的接口请求。

三种数据获取方式对比：

- `内置fetch`：完全使用 schema 配置，无需自定义；
- `service`：使用系统自带的函数，也可以配合 request.params 使用；
- `customService`：完全自定义，使用了 request 配置，但内部完全自己实现的接口请求。

### `debug`

可选，开启后会在控制台输出部分告警提示，方便排查问题。默认为 false

### `onError`

可选，用于配置接口异常处理，例如触发 `notification.error`，该配置通常用在使用内部 simpleFetch 时，simpleFetch 基于 fetch，需要手动处理错误，具体例子可参考：[storybook-onError](https://007sair.github.io/formily-request/?path=/story/example-onerror--url-error)

---

## 自定义事件

```tsx
$self.invoke("updateRequest", callback);
```

在 field 字段上注入了 `updateRequest` 事件，该事件的入参为`callback`函数。参数类型如下：

```tsx
(request: RequetObject) => void
```

在函数体可以修改 request 配置项。

常用于 Select 组件的 onSearch 方法中：

```json
{
  "x-component": "Select",
  "x-component-props": {
    "onSearch": "{{ str => $self.invoke('updateRequest', r => r.params.keyword = str) }}"
  }
}
```
