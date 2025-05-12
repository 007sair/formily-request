---
nav: { title: '指南', order: 1 }
group: { title: '基础', order: 2 }
title: 配置概述
order: 1
toc: content
---

# 配置概述

## 基础使用

formily-request 提供了一套灵活的配置系统，让你能够轻松地处理各种请求场景。以下是一个基本的配置示例：

```json
{
  "x-request": {
    "url": "https://api.example.com/data",
    "method": "POST",
    "params": { "keyword": "" }
  }
}
```

这个简单的配置就能满足大多数的基础请求场景。对于更复杂的需求，你可以使用数据转换和条件控制等高级特性：

```typescript
{
  "x-request": {
    "url": "https://api.example.com/data",
    "format": "{{ data => data.map(item => ({ label: item.name, value: item.id })) }}",
    "ready": "{{ !!$form.values.parentId }}"
  }
}
```

:::info
完整的配置项说明请参考 [API 文档](/api)
:::

## 全局配置

通过 `fxr.register()` 方法，可以设置全局配置，影响所有使用 formily-request 的表单字段。

### 基础 URL 配置

设置 API 的基础 URL，避免在每个请求中重复配置完整 URL：

```typescript
import fxr from 'formily-request';
import { Schema } from '@formily/react';

fxr.use(Schema).register({
  // 全局基础URL
  baseURL: 'https://api.example.com',
});

// 在 schema 中使用相对路径
{
  'x-request': {
    url: '/users', // 实际请求 https://api.example.com/users
  }
}
```

在不同环境中可以灵活配置：

```typescript
fxr.register({
  baseURL:
    process.env.NODE_ENV === 'production' ? 'https://api.example.com' : '/api', // 本地开发时使用代理
});
```

### 认证与请求头配置

配置跨域请求时的凭证和请求头信息：

```typescript
fxr.register({
  // 跨域请求时是否携带凭证（cookies）
  credentials: 'include', // 'omit' | 'same-origin' | 'include'

  // 自定义请求头
  headers: {
    Authorization: 'Bearer token',
    'X-Custom-Header': 'custom-value',
  },
});
```

这些配置会应用到所有请求中，适用于需要统一认证的场景：

```typescript
// 在登录后设置全局认证信息
const setGlobalAuth = (token) => {
  fxr.register({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
```

### 错误处理配置

通过 `onLog` 回调函数可以实现全局统一的错误处理机制：

```typescript
fxr.register({
  debug: true, // 开启调试模式
  onLog: (type, message, data) => {
    // type: 'info' | 'error' | 'group' | 'groupEnd'
    if (type === 'error') {
      const error = data;
      message.error(error.message || '请求失败');

      // 根据错误类型进行不同处理
      if (error instanceof TypeError) {
        // 处理网络错误
        console.error('网络请求错误:', error);
      } else if (error.status === 401) {
        // 处理认证错误
        router.push('/login');
      }
    }
  },
});
```

`onLog` 回调函数接收三个参数：

- `type`: 日志类型，可能的值为 'info' | 'error' | 'group' | 'groupEnd'
- `message`: 日志消息
- `data`: 额外的数据，当 type 为 'error' 时，data 为错误对象

### 调试配置

通过全局配置开启调试模式，查看请求过程中的详细信息：

```typescript
fxr.register({
  debug: true,
});
```
