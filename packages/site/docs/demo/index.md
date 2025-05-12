---
order: 1
title: 基础用法
nav: { title: '示例', order: 3 }
toc: content
---

# 基础用法

## 数据转换

### format

`format` 属性用于对接口返回的数据进行转换，使其符合组件的数据结构要求。在 Select 组件中，通常需要将后端返回的数据转换为 `{ label, value }` 格式的选项数组。

<code src="./components/basic/Format.tsx"></code>

### fieldNames

当使用 antd 组件库的 Select 组件时，可以通过 `fieldNames` 属性来简化数据转换过程。这样可以直接指定后端返回数据中的字段映射，而无需编写复杂的 format 表达式。

<code src="./components/basic/FieldNames.tsx"></code>

## 请求控制

### ready

`ready` 属性用于控制请求的触发时机。当 `ready` 为 `false` 时，组件不会发起数据请求。这在处理具有依赖关系的表单字段时特别有用。

<code src="./components/basic/Ready.tsx"></code>

:::info{title=使用场景}
在[省市区联动](/demo/region#基本联动)示例中，市区数据的请求依赖于省份的选择。通过 `ready` 属性，我们可以确保只有在选择了省份后才会请求对应的市区数据，避免无效的请求。
:::

### mountLoad

`mountLoad` 属性控制组件在挂载时是否自动加载数据。通过设置 `mountLoad`，可以实现更灵活的数据加载策略。

<code src="./components/basic/MountLoad.tsx"></code>
<code src="./components/basic/MountLoadDelay.tsx"></code>

## 响应式更新

### 被动更新

在默认情况下，组件会自动响应依赖项的变化并更新数据。例如，当输入框的值发生变化时，Radio 组件会自动发起请求获取新的选项数据。

<code src="./components/basic/Radio.tsx"></code>

### 主动更新

在某些场景下，我们需要主动控制数据的更新时机，formily-request 提供了两种主动更新的方式：`reloadRequest` 和 `updateRequest`。

#### reloadRequest

`reloadRequest` 方法用于在特定时机重新触发接口请求，使用当前的请求参数重新获取数据。这在以下场景特别有用：

- 下拉框展开时刷新选项数据
- 用户手动触发数据刷新
- 需要定时更新数据

<code src="./components/basic/ReloadRequest.tsx"></code>

#### updateRequest

`updateRequest` 方法不仅会触发接口请求，还允许在请求前更新请求参数。这在以下场景特别有用：

- 实现搜索建议功能
- 动态更新筛选条件
- 根据用户交互更新请求参数

<code src="./components/basic/UpdateRequest.tsx"></code>

### 防抖优化

在搜索输入等场景中，为了避免频繁的请求，可以使用 `debounce` 方法来实现防抖。这样可以在用户输入过程中减少不必要的请求，提高性能和用户体验。

<code src="./components/basic/UpdateRequestDebounce.tsx"></code>

### disabledReactive

`disabledReactive` 属性用于控制组件的响应式更新行为。默认情况下（`false`），组件会响应依赖项的变化并自动更新数据。设置为 `true` 时，将禁用这种自动更新机制。

:::info{title=最佳实践}
在处理复杂的表单依赖关系时，合理使用 `disabledReactive` 可以优化用户体验。例如，在数据库表选择的场景中：

1. 库名下拉列表依赖用户名和密码作为请求参数
2. 表名下拉列表依赖所选库名
3. 为避免用户输入过程中频繁触发请求，可以设置 `disabledReactive: true`
4. 这样，只有在用户主动点击展开下拉列表时才会发起请求
   :::

<code src="./components/basic/DisabledReactive.tsx"></code>
