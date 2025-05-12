---
nav: { title: 'API', order: 2 }
---

# API

插件默认导出 FormilyRequest 的单例对象，实例上面挂载了 use、register 方法。

调用实例方法后，就可以在 schema 中使用注册后的字段（默认为：`x-request`）了。

## 实例方法

### `use()`

插件的核心原理是使用 `Schema.registerPatches` 方法将 `x-request` 注入到 schema 中。

为了减少包大小，需要将构造函数 `Schema` 通过 use 函数传入插件内部。

构造函数来自 `@formily/react` 或 `@formily/vue` 包：

```ts
import { Schema } from '@formily/react'; // or @formily/vue
import fxr from 'formily-request';

fxr.use(Schema);
```

### `register()`

通过 register 可以注册 JSON Schema 的配置字段 或者 设置全局配置，类型如下：

```typescript
register(): void;
register(fieldKey: `x-${string}`): void;
register(globalConfig: GlobalXRequest): void;
register(fieldKey: `x-${string}`, globalConfig: GlobalXRequest): void;
```

register 是一个多参数函数，支持以下几种参数传入方式：

- 无参数：默认使用 `x-request` 注册字段；
- 一个参数：注册指定字段，例如 `x-fetch`，或者传入全局配置；
- 两个参数：注册指定字段和全局配置。

```typescript
import fxr from 'formily-request';

fxr.register({
  // 全局基础URL
  baseURL: 'https://api.example.com',
  // 全局错误处理
  onError: (err) => {
    console.error(err);
    message.error('操作失败，请重试');
  },
  // 全局调试模式
  debug: process.env.NODE_ENV === 'development',
  // 全局静态参数
  params: {
    token: 'xxx',
  },
});
```

## 字段配置

字段配置是指在 `JSON Schema` 中配置的 `x-reqeust` 对象，类型定义如下：

```typescript
interface XRequest extends RequestInit {
  baseURL?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, any>;
  format?: (data: unknown) => any[];
  ready?: boolean | ((request: XRequest) => boolean);
  mountLoad?: boolean;
  service?: (params: XRequest['params']) => Promise<unknown>;
  customService?: (config: XRequest) => Promise<unknown>;
  debug?: boolean;
  onSuccess?: (data: unknown, request: XRequest) => void;
  staticParams?: Record<string, any>;
}
```

:::info{title=RequestInit}
由于 formily-request 默认使用 [fetch](https://mdn.org.cn/en-US/docs/Web/API/Window/fetch#google_vignette) 发起请求，所以配置的类型会继承 fetch 的第 2 个参数 [RequestInit](https://mdn.org.cn/en-US/docs/Web/API/RequestInit)，这样的设计可以最大限度使用 fetch 配置，可以在全局或字段处配置 fetch 自带配置，例如：`headers`, `credentials` 等等。
:::

### `baseURL`

- **类型**: `string`
- **必填**: 否
- **说明**: 接口前缀，配合 `url` 字段使用，通常配置在全局。
- **示例**:

```typescript
fxr.register({
  baseURL: process.env.BASE_URL, // 例如：/api
});

const schema = {
  'x-request': {
    url: '/users', // 最终请求地址为 /api/users
  },
};
```

### `url`

- **类型**: `string`
- **必填**: 是
- **说明**: 接口请求地址，使用 formily-request 默认的 fetch 发起请求时，必须要传入该字段。
- **示例**:

```typescript
{
  "x-request": {
    url: "https://api.example.com/users" // 或配合 baseURL 使用相对路径
  }
}
```

### `method`

- **类型**: `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'`
- **默认值**: `'GET'`
- **说明**: HTTP 请求方法，配合 `url` 字段使用。
- **示例**:

```typescript
{
  "x-request": {
    url: "/api/users",
    method: "POST",
    params: { name: "John" } // 如果 method 为 post，使用 fetch 发起请求时，params 会被序列化后赋值给 body
  }
}
```

### `params`

- **类型**: `Record<string, any>`
- **必填**: 否
- **说明**: 动态请求参数，可以使用表达式动态生成
- **示例**:

```typescript
{
  "x-request": {
    url: "/api/search",
    params: {
      keyword: "{{ $self.value }}", // 使用当前字段值作为搜索关键词
      type: "user"
    }
  }
}
```

### `format`

- **类型**: `(res: unknown) => any[]`
- **必填**: 否
- **说明**: 数据格式化函数，用于将接口返回的数据转换为组件所需的格式。
- **示例**:

```typescript
{
  "x-request": {
    url: "/api/users",
    format: '{{ (res) => res?.data?.map(user => ({ label: user.name, value: user.id } }}'
  }
}
```

:::info{title=注意}
无论是默认的 fetch，还是 service、customService，获取到的接口数据，都会经过 format 函数处理，然后被应用到 field.dataSource。<br />
如果自行处理过数据并适配当前组件，可以不配置 format。
:::

### `ready`

- **类型**: `boolean | ((request: XRequest) => boolean)`
- **必填**: 否
- **说明**: 是否发起请求，值为 `false` 或返回 `false` 的函数时，将阻止请求发送。
- **示例**:

```typescript
{
  "x-request": {
    url: "/api/data",
    ready: '{{ $self.visible }}', // 当前字段可见时才会发起请求
    ready: '{{ request => !!request?.params?.id }}' // 当前请求参数id存在时才会发起请求
  }
}
```

### `mountLoad`

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 控制是否在组件挂载后发起请求。默认情况下，组件挂载后会自动发起请求。
- **示例**:

```typescript
{
  "x-request": {
    url: "/api/options",
    mountLoad: false // 禁用挂载后请求，需要手动触发数据加载
  }
}
```

### `service`

- **类型**: `(params: any) => Promise<unknown>`
- **必填**: 否
- **说明**: 自定义请求服务，可以使用自定义的请求方法替代默认的 fetch 请求。
- **示例**:

```typescript
{
  "x-request": {
    service: async (params) => {
      // 使用自定义的axios实例发送请求
      const response = await axios.get('/api/users', { params })
      return response.data
    }
  }
}
```

### `customService`

- **类型**: `(config: RequestConfig) => Promise<unknown>`
- **必填**: 否
- **说明**: 完全自定义的请求逻辑函数，入参为 `x-request` 配置对象，返回值为请求结果。
- **示例**:

```typescript
{
  "x-request": {
    customService: async (config) => {
      const { url, params, method } = config
      // 实现自定义的请求逻辑
      const response = await customFetch(url, {
        method,
        params,
        // 添加自定义的请求处理
        timeout: 5000,
        retries: 3
      })
      return response.data
    }
  }
}
```

### `debug`

- **類型**: `boolean`
- **默认值**: `false`
- **说明**: 开启调试模式，会在控制台输出详细的请求信息
- **示例**:

```typescript
{
  "x-request": {
    url: "/api/data",
    debug: true // 开启调试模式
  }
}
```

### `onError`

- **類型**: `(err: unknown) => void`
- **必填**: 否
- **说明**: 错误处理函数，用于统一处理请求错误
- **示例**:

```typescript
{
  "x-request": {
    url: "/api/data",
    onError: (error) => {
      // 自定义错误处理逻辑
      console.error('请求失败:', error)
      message.error('数据加载失败，请重试')
    }
  }
}
```

### `staticParams`

- **类型**: `Record<string, any>`
- **必填**: 否
- **说明**: 静态请求参数，不会被动态参数覆盖，通常用于设置固定的查询条件
- **示例**:

```typescript
{
  "x-request": {
    url: "/api/products",
    staticParams: {
      category: "electronics" // 固定查询电子产品类别
    },
    params: {
      keyword: "{{ $self.value }}" // 动态搜索关键词
    }
  }
}
```

:::warning
staticParams 字段已被标记为废弃，后续版本不再支持。如需设置静态参数，可以使用 `params` 字段。
:::

## 字段方法

### `updateRequest`

formily-request 内部通过 [inject](https://core.formilyjs.org/zh-CN/api/models/field#inject) 方法注入了 updateRequest 方法，这样就可以在 schema 表达式中使用 `$self.invoke('updateRequest', request => request.params.xxx)` 来更新请求配置。

`invoke` 参数说明：

- `updateRequest`： 方法为 formily-request 内部注册的自定义方法；
- `(request) => void`：函数的 `request` 参数是一个 observable 对象，修改 request 会触发接口请求。

示例，在搜索框输入时，动态更新请求参数：

```json
{
  "ready_select": {
    "type": "string",
    "x-component": "Select",
    "x-component-props": {
      "onSearch": "{{ keyword => $self.invoke('updateRequest', xrequest => xrequest.params.text = keyword) }}"
    },
    "x-request": {
      "url": "/api/search",
      "params": { "text": "" }, // updateRequest第2个参数为函数，函数的参数为当前请求配置
      "ready": "{{ !!$values.visible }}",
      "format": "{{ (res) => res?.data?.list || [] }}"
    }
  }
}
```

具体示例参考：[Ready](/demo/basic#ready)

### `reloadRequest`

- **类型**: `() => Promise<void>`
- **必填**: 否
- **说明**: 主动触发请求的方法，使用当前的请求参数重新获取数据。与 `updateRequest` 的区别在于它不需要传入回调函数来修改请求参数。
- **示例**:

```typescript
{
  "x-component": "Select",
  "x-component-props": {
    "onVisibleChange": "{{ visible => visible && $self.invoke('reloadRequest') }}" // 展开下拉框时刷新数据
  },
  "x-request": {
    "url": "/api/options",
    "params": { "type": "user" },
    "mountLoad": false // 禁用挂载后请求
  }
}
```

以下场景特别适合使用 `reloadRequest`：

- 下拉框展开时刷新选项数据
- 用户手动触发数据刷新
- 需要定时更新数据
