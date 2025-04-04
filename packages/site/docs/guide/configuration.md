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

通过 `fxr.register()` 方法，可以设置全局配置，影响所有使用 formily-request 的表单字段。以下是一些常见的配置场景和最佳实践。

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

这些配置会应用到所有请求中，适用于需要统一认证的场景。例如，在登录后设置全局认证信息：

```typescript
const setGlobalAuth = (token) => {
  fxr.register({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
```

### 错误处理配置

通过 `onLog` 回调函数可以实现全局统一的错误处理机制。以下是一个完整的错误处理示例，包含了网络错误、认证错误和业务错误的处理：

```typescript
fxr.register({
  debug: true, // 开启调试模式
  onLog: (type, message, data) => {
    // type: 'info' | 'error' | 'group' | 'groupEnd'
    if (type === 'error') {
      const error = data;

      // 网络错误处理
      if (error instanceof TypeError) {
        console.error('网络请求错误:', error);
        message.error('网络连接失败，请检查网络设置');
        return;
      }

      // HTTP 状态码错误处理
      switch (error.status) {
        case 401:
          message.error('登录已过期，请重新登录');
          router.push('/login');
          break;
        case 403:
          message.error('没有操作权限');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误，请稍后重试');
          break;
        default:
          message.error(error.message || '操作失败，请重试');
      }

      // 错误日志上报
      errorTracker.captureException(error, {
        extra: {
          type,
          message,
          timestamp: new Date().toISOString(),
        },
      });
    }
  },
});
```

### 调试与日志配置

通过全局配置可以灵活控制调试信息的输出：

```typescript
fxr.register({
  debug: process.env.NODE_ENV === 'development',
  onLog: (type, message, data) => {
    // 开发环境下打印详细日志
    if (process.env.NODE_ENV === 'development') {
      console.group(`[${type}] ${message}`);
      if (data) console.log(data);
      console.groupEnd();
    }

    // 生产环境下只记录错误日志
    if (process.env.NODE_ENV === 'production' && type === 'error') {
      logger.error(message, data);
    }
  },
});
```

### 请求参数配置

通过全局配置可以设置一些通用的请求参数，这些参数会与字段配置的参数进行合并：

```typescript
fxr.register({
  // 全局静态参数
  params: {
    appId: 'your-app-id',
    version: '1.0.0',
    timestamp: () => new Date().getTime(), // 动态参数
  },

  // 请求超时设置
  timeout: 5000,

  // 请求格式设置
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
```
