---
order: 4
toc: content
---

# 错误处理

formily-request 提供了完善的错误处理机制，通过 `onError` 和 `onLog` 回调函数，可以有效地捕获和处理各类异常情况。本文将详细介绍错误处理的最佳实践。

## 错误类型

在使用 formily-request 时，可能遇到以下几类错误：

### 1. 请求错误

请求错误主要发生在接口调用阶段，常见情况包括：

- 接口地址配置错误（404）
- 接口返回非 200 状态码
- 网络连接超时

```tsx | pure
{
  'x-request': {
    url: '/api/error-url', // 错误的请求地址
    onError: '{{ error => $self.selfErrors = error.message }}'
  }
}
```

### 2. 格式化错误

格式化错误发生在 `format` 函数执行阶段，主要包括：

- 类型错误：format 配置了非函数类型
- 返回值错误：format 函数返回非数组类型
- 语法错误：format 函数内部存在语法错误

```tsx | pure
{
  'x-request': {
    url: '/api/user',
    format: '{{ 123 }}', // 类型错误
    onError: '{{ error => $self.selfErrors = error.message }}'
  }
}

{
  'x-request': {
    url: '/api/user',
    format: '{{ () => undefined }}', // 返回值错误
    onError: '{{ error => $self.selfErrors = error.message }}'
  }
}

{
  'x-request': {
    url: '/api/user',
    format: '{{ (res) => ress?.data || [] }}', // 语法错误
    onError: '{{ error => $self.selfErrors = error.message }}'
  }
}
```

### 3. 示例

<code src="./components/on-error/Field.tsx"></code>

## 错误处理最佳实践

### 1. 使用 onError 处理字段级错误

```tsx | pure
{
  'x-request': {
    url: '/api/user',
    onError: error => {
      // 设置字段错误信息
      $self.selfErrors = error.message
      // 可以同时触发其他操作
      console.error('字段请求错误:', error)
    }
  }
}
```

### 2. 使用 onLog 进行全局错误监控

```tsx | pure
import { registerRequest } from 'formily-request';

registerRequest({
  onLog: (level, message, error) => {
    if (level === 'ERROR') {
      // 错误上报
      reportError({ level, message, error });
    }
  },
});
```

### 3. 错误信息重置

在某些场景下，需要在请求成功后清除之前的错误信息：

```tsx | pure
{
  'x-request': {
    url: '/api/user',
    onSuccess: '{{ () => $self.selfErrors = "" }}',
    onError: '{{ error => $self.selfErrors = error.message }}'
  }
}
```

<code src="./components/on-error/SwitchError.tsx"></code>

### 4. 编译错误处理

对于表达式编译错误（如在 `{{}}` 中使用未定义变量），需要通过注册自定义 compiler 来捕获：

```tsx | pure
import { registerRequest } from 'formily-request';
import { Schema } from '@formily/react';

Schema.registerCompiler((expression, scope) => {
  try {
    return Schema.compile(expression, scope);
  } catch (error) {
    console.error('表达式编译错误:', error);
    return undefined;
  }
});
```

<code src="./components/on-error/Compile.tsx"></code>

## 调试与错误排查

1. 开启 debug 模式，查看详细日志：

```tsx | pure
{
  'x-request': {
    url: '/api/user',
    debug: true // 开启调试模式
  }
}
```

2. 使用 onLog 记录关键信息：

```tsx | pure
registerRequest({
  debug: true,
  onLog: (level, message, error) => {
    console.log(`[${level}] ${message}`, error);
  },
});
```

日志的输出格式如下：

```bash
[<timestamp>][<key><field-path>][level]:<message>
```

```bash
# timestamp: 日志记录的时间戳
# key: 配置字段，通常为 'x-request'
# field-path: 字段的路径
# level: 日志级别，如 'INFO'、'ERROR'
# message: 日志的具体信息

# 示例：
[2025/01/01 00:00:00][x-request:demos.error.compile_error_format][INFO]:组件已挂载 {"lifecycle":"MOUNTED"}
```
