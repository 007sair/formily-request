---
nav: { title: '指南', order: 1 }
group: { title: '基础', order: 2 }
title: 请求方式
order: 2
toc: content
---

# 请求方式

formily-request 提供了三种不同的请求方式，每种方式都有其特定的使用场景和优势。本文将帮助你选择最适合的请求方式。

## 内置 `fetch` 方式

这是最简单直接的请求方式，适用于大多数标准的 HTTP 请求场景。

**最佳实践：**

- 标准的 RESTful API 调用
- 简单的数据获取和提交
- 需要使用标准 HTTP 配置的场景

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

:::warning
使用 fetch 方式时，请注意：

1. `params`必须为 object 类型
2. 建议使用`fxr.register()`配置 baseURL，便于环境切换
3. 不要在 url 中硬编码环境相关的地址
   :::

**环境配置示例：**

```tsx | pure
import fxr from 'formily-request';

fxr.register({
  baseURL:
    process.env.NODE_ENV === 'production' ? 'https://api.example.com' : '/api',
});
```

## `service` 方式

适用于需要更多控制和自定义逻辑的场景，比如：

- 需要统一的请求/响应拦截
- 复杂的错误处理逻辑
- 使用已有的请求库（如 axios）
- 需要在请求前后做额外处理

**最佳实践：**

```tsx | pure
// 1.创建业务请求函数
const queryUser = async (params: { name: string }) => {
  const res = await axios('/api/user', { params })
  if (res.code !== 200) {
    throw new Error(res.message)
  }
  return res.data
}

// 2.注入到Schema
<SchemaField scope={{ queryUser }} />

// 3.配置使用
{
  "x-request": {
    "service": "{{ queryUser }}",
    "params": { "name": "{{ $form.values.name }}" }
  }
}
```

:::tip
使用 service 方式时：

1. 函数必须返回 Promise
2. 推荐在函数内统一处理错误
3. 可以结合已有的请求库使用
   :::

## `customService` 方式

这种方式适合以下场景：

- 需要使用特殊的请求方式（如 JSONP）
- 需要访问完整的 x-request 配置
- 需要在请求前对配置进行预处理

**最佳实践：**

```tsx | pure
import type { XRequest } from "formily-request";
import jsonp from "fetch-jsonp";

// 自定义请求处理
const queryUser = (config: XRequest) => {
  const { url, params } = config;
  return jsonp(`${url}?callback=custom`, { params });
};

// 注入到Schema
<SchemaField scope={{ queryUser }} />

// 配置使用
{
  "x-request": {
    "customService": "{{ queryUser }}",
    "url": "/api/users",
    "params": { "type": "{{ $form.values.type }}" }
  }
}
```

:::tip
使用 customService 方式时：

1. 函数参数为完整的 x-request 配置对象
2. 可以自由处理配置参数
3. 适合需要特殊请求方式的场景
   :::

## 请求方式选择指南

根据你的需求场景选择合适的请求方式：

- **使用 fetch 方式**，如果：

  - 只需要简单的 HTTP 请求
  - 使用标准的 RESTful API
  - 不需要复杂的请求处理逻辑

- **使用 service 方式**，如果：

  - 需要统一的请求/响应拦截
  - 需要复杂的错误处理
  - 已有成熟的请求库（如 axios）

- **使用 customService 方式**，如果：
  - 需要特殊的请求方式（如 JSONP）
  - 需要完整控制请求配置
  - 需要在请求前预处理配置

<br />

:::info{title=优先级说明}
当同时配置多种请求方式时，优先级为：`customService` > `service` > `内置fetch`
:::
