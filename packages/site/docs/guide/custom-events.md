---
nav: { title: '指南', order: 1 }
group: { title: '基础', order: 3 }
title: 自定义事件
order: 2
toc: content
---

# 自定义事件

formily-request 提供了两种自定义事件：`updateRequest` 和 `reloadRequest`，用于处理不同的数据更新场景。

## updateRequest

`updateRequest` 是一个用于更新请求配置的事件，主要用于处理数据更新场景，如搜索框输入。它通过 `field.inject()` 注入。对于频繁触发的场景，建议使用外部防抖函数包装。

### 实现原理

`updateRequest` 事件接收一个回调函数作为参数，该函数可以修改 request 配置的属性值。当属性值发生变化时，会触发响应式更新，重新发起请求。

```ts
$self.invoke("updateRequest", (request: XRequest) => void)
```

### 使用场景

1. Select 组件的搜索功能：

```json
{
  "x-component": "Select",
  "x-component-props": {
    "onSearch": "{{ v => $self.invoke('updateRequest', request => request.params.keyword = v) }}"
  },
  "x-request": {
    "url": "/api/users",
    "params": { "keyword": "" }
  }
}
```

2. 自定义防抖时间：

```json
{
  "x-component": "Select",
  "x-component-props": {
    "onSearch": "{{ debounce((keyword) => $self.invoke('updateRequest', request => request.params.text = keyword), 500) }}",
    "showSearch": true,
    "filterOption": false
  },
  "x-request": {
    "url": "/api/search",
    "params": { "text": "" }
  }
}
```

## reloadRequest

`reloadRequest` 是一个用于立即重新加载数据的事件，它不带防抖功能，适用于需要立即刷新数据的场景。

### 实现原理

`reloadRequest` 事件不接收参数，直接使用当前的 request 配置重新发起请求。它同样通过 `field.inject()` 注入。

```ts
$self.invoke('reloadRequest');
```

### 使用场景

1. 表单提交后刷新列表：

```json
{
  "x-component": "Form",
  "x-component-props": {
    "onSubmit": "{{ () => $self.invoke('reloadRequest') }}"
  }
}
```

2. 手动刷新按钮：

```json
{
  "x-component": "Button",
  "x-component-props": {
    "onClick": "{{ () => $self.invoke('reloadRequest') }}",
    "children": "刷新数据"
  }
}
```

## 最佳实践

1. 对于频繁触发的搜索场景，使用 `updateRequest` 并合理设置防抖时间
2. 对于需要立即刷新数据的场景，使用 `reloadRequest`
3. 在使用 `updateRequest` 时，确保回调函数内只修改必要的 request 属性
4. 避免在一个事件中同时调用多个 request 更新方法
