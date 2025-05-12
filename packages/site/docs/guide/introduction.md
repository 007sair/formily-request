---
nav: { title: '指南', order: 1 }
order: 1
title: 简介
group: { title: '开始', order: 1 }
toc: content
---

# 什么是 Formily Request

Formily Request 是一个专注于配置化场景的数据请求解决方案。它通过扩展 JSON Schema 配置，以无侵入的方式实现接口请求和数据转换，为表单组件的动态数据获取提供了一种优雅且高效的方案。

## 为什么需要 Formily Request

在使用 [Formily](https://formilyjs.org/zh-CN) 构建表单时，我们经常需要为 Select、Radio、Cascader 等组件实现动态数据展示。目前主要有两种实现方式：

1. 按照[官方建议](https://formilyjs.org/zh-CN/guide/advanced/async)，通过自定义组件实现
2. 参考 [Ant Design](https://antd.formilyjs.org/zh-CN/components/select#json-schema-%E5%BC%82%E6%AD%A5%E8%81%94%E5%8A%A8%E6%95%B0%E6%8D%AE%E6%BA%90%E6%A1%88%E4%BE%8B) 的方案，使用 `useAsyncDataSource` 函数配合 `scope` 实现

这些方案在非配置化场景中运作良好，但在配置化场景下存在明显局限：

- 自定义组件方案需要进行额外的组件开发
- `useAsyncDataSource` 方案需要在系统中预先定义数据源函数

Formily Request 正是为解决这些问题而生，它让你可以直接在 JSON Schema 中配置数据请求，无需额外的开发工作。

以下是 `官方示例` vs `formily-request` 的效果对比：

```jsx
/**
 * inline: true
 */

import React from 'react';
import { Image } from 'antd';
import img from '../../assets/diff-new.png';

export default () => (
  <div style={{ margin: '10px 0' }}>
    <Image src={img} />
  </div>
);
```

## 核心特性

### 组件无关

- 无需修改现有组件
- 无需编写额外的自定义组件
- 可以专注于数据配置，而不是组件开发

### 框架无关

- 支持 React 和 Vue 等主流框架
- 统一的配置方式，跨框架复用
- 降低框架迁移成本

### 组件库无关

- 支持 Ant Design、Element Plus 等各类组件库
- 统一的数据获取方式
- 提供一致的开发体验

### 高扩展性

- 适用于所有需要动态数据的场景
- 支持 Select、Radio、Checkbox、Cascader、Table 等组件
- 可自定义数据转换规则
- 灵活的请求配置和响应处理

## 问题反馈

如果在使用过程中发现任何问题、或者有改善建议，欢迎在 [GitHub Issues](https://github.com/007sair/formily-request/issues) 进行反馈。我们将认真对待每一个反馈，持续改进产品质量。
