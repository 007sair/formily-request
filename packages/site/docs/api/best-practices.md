---
nav: { title: 'API', order: 2 }
---

# 最佳实践

## 配置分层

建议按照以下层次组织配置：

1. 系统级配置：整个表单的通用请求配置
2. 字段级配置：具体字段的个性化配置

```typescript
// Schema级配置（表单通用）
fxr.use(Schema).register({
  baseURL: '/api',
  headers: {
    /* 通用请求头 */
  },
});

// 字段级配置
const schema = {
  'x-request': {
    params: {
      /* 字段特定参数 */
    },
  },
};
```

## 选择合适的请求方式

```typescript
// 1. 简单场景：使用内置fetch
{
  "x-request": {
    url: "/api/simple-data",
    method: "GET"
  }
}

// 2. 需要更多控制：使用service
{
  "x-request": {
    service: async (params) => {
      const res = await axios.get("/api/data", {
        params,
        timeout: 5000
      })
      return res.data
    }
  }
}

// 3. 完全自定义：使用customService
{
  "x-request": {
    customService: async (config) => {
      const { url, params } = config
      // 实现完全自定义的请求逻辑
      const data = await complexRequest(url, params)
      return data
    }
  }
}
```

## 错误处理

### 错误分级处理

```typescript
// 全局错误处理（基础层）
fxr.use(Schema).register({
  onError: (error) => {
    console.error('全局错误:', error);
    notification.error({ message: '系统异常' });
  }
});

// 字段级处理（应用层）
{
  "x-request": {
    "onError": "{{ (error) => {
      $self.setFeedback({ type: 'error', message: '数据加载失败' })
    }}}"
  }
}
```

### 友好提示规范

```typescript
// 统一错误码映射
const ERROR_MAP = {
  401: '请重新登录',
  403: '权限不足',
  500: '服务不可用',
};

// 在全局处理中应用
fxr.register({
  onError: (err) => {
    const message = ERROR_MAP[err.code] || err.message;
    notification.error({ description: message });
  },
});
```

## 高级场景

### 条件请求

根据表单状态控制请求时机：

```json
{
  "x-request": {
    "url": "/api/advanced-options",
    "ready": "{{ $form.values.type === 'advanced' && !!$form.values.parentId }}"
  }
}
```

合理设置 ready 条件避免不必要请求：

```typescript
{
  "x-request": {
    "url": "/api/cities",
    "params": { "provinceId": "{{ $form.values.province }}" },
    "ready": "{{ !!$form.values.province }}"
  }
}
```

### 联动请求

实现表单字段间的联动请求：

```json
{
  "type": "object",
  "properties": {
    "province": {
      "type": "string",
      "title": "省份",
      "x-component": "Select",
      "x-request": {
        "url": "/api/provinces"
      }
    },
    "city": {
      "type": "string",
      "title": "城市",
      "x-component": "Select",
      "x-request": {
        "url": "/api/cities",
        "params": { "provinceId": "{{ $form.values.province }}" },
        "ready": "{{ !!$form.values.province }}"
      }
    }
  }
}
```

### 自定义请求逻辑

对于复杂的请求逻辑，可以使用 `customService`：

```typescript
{
  "x-request": {
    "customService": "{{ async (config) => {
      // 可以访问完整的请求配置
      const { url, params, method } = config;

      // 实现自定义的请求逻辑
      try {
        // 预处理请求参数
        const processedParams = processParams(params);

        // 发送请求
        const response = await fetch(url, {
          method,
          body: JSON.stringify(processedParams),
          headers: { 'Content-Type': 'application/json' }
        });

        // 处理响应
        if (!response.ok) {
          throw new Error(`请求失败: ${response.status}`);
        }

        const data = await response.json();

        // 后处理响应数据
        return processResponse(data);
      } catch (error) {
        // 自定义错误处理
        console.error('请求异常:', error);
        throw error;
      }
    }}}"
  }
}
```
