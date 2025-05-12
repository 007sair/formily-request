---
nav: { title: '指南', order: 1 }
group: { title: '进阶', order: 3 }
title: 工作原理
order: 1
toc: content
---

# 工作原理

formily-request 通过扩展 JSON Schema 字段的方式，为表单增加了异步数据请求的配置能力。

它的核心工作原理如下：

## 1. Schema 注册

formily-request 采用单例模式，确保在整个应用中只有一个实例。这样可以保证全局仅使用一个 Schema 的构造函数，注册的自定义字段、全局配置也是唯一的。

```typescript
class FormilyRequest {
  static _instance: FormilyRequest | null = null;
  private Schema: any = null;
  private key: `x-${string}` = 'x-request';

  static getInstance(): FormilyRequest {
    if (!this._instance) {
      this._instance = new FormilyRequest();
    }
    return this._instance;
  }

  use(_Schema: any) {
    if (!_Schema) {
      throw new Error('请传入Schema配置');
    }
    this.Schema = _Schema;
    return this;
  }
}
```

## 2. 响应式更新机制

插件使用 `@formily/reactive` 实现响应式更新机制，主要包含以下几个步骤：

1. **创建响应式对象**：将 `x-request` 配置转换为响应式对象
2. **依赖收集**：监听配置变化，收集动态依赖
3. **触发更新**：当依赖发生变化时，自动触发请求

## 3. 生命周期管理

formily-request 通过生命周期枚举（Lifecycle）来管理组件的不同状态：

```typescript
enum Lifecycle {
  INIT, // 初始化
  MOUNTED, // 组件挂载
  UNMOUNT, // 组件卸载
}
```

在不同的生命周期阶段，插件会执行相应的操作：

1. **初始化阶段**：

   - 解析 `x-request` 配置
   - 创建响应式对象
   - 设置监听器

2. **挂载阶段**：

   - 检查 `mountLoad` 配置
   - 触发首次数据请求
   - 开始监听依赖变化

3. **卸载阶段**：
   - 清理监听器
   - 重置生命周期状态

## 4. 完整流程

以下时序图展示了响应式更新的完整流程：

![https://mermaid.live/edit#pako:eNqdlM9vEkEUx_-VyZzaBEjaqodN7EX05I9EbobLlJ0CCezg7qzRNE202koULERKNahIoi2HStvUUkqL_DOd2eW_cJZZdrdgGyKXXeDz3vu-73szKzBBVAwVaOCnJtYSOJpGSR1l4xoQnxzSaTqRziGNglgihbMIIMN9myTupXFGdQC70WTFLfZrm7eOJ7FHSwbWn2HdIdnHIutW2PmmdXRmndUn4ceOLIMOs-6f8MM19uONVdpgn5uTbBRRFCOmnsAOzrcOeLHFu6W4JtGHhGJAnMKygZDPK4Dlv7Ld96xQHXxqe6olF15cHHamgLkI4EdNtlF4HtalrsF60eq1JD2EBDzqTwHzEZG3xs66Xpts_9Q-bIzr8SPI8A0tZfCMW2FWwiNE5HctUcBCBNitP6K-VSuz0p7niZ_YQ2VePCOeIUC0OymkJfHsVM7wwprd6wVtQRkKssTU6H2C1ItOl-omlv8EbfBq34jMgcFOle815EjkHP0AFwyGsFKenbbdgW-uibh_4Zfmt1m2j0_GU_tEOJje7ldY7ZtUc60O_v3cGVqhejXrrgav_ebVA9WrJ1GsqVN5bPdLdqPAt9syjW-zmRMpsVvN3t0RbV7r9LwrRBoR3M4rFuOi3-KVU7EWwc0MdnhpoaUCb5uDanHGwEDHGbES08tdAOy8y_LtwduiJ_pauZao-OGnffDaqjSR8UJLxDCN_qfprNgZW-zJE3xTnPjOurhwxo7YiHSnfysCRAvOSazUWbnHyk3-pW69a_OXr8aFuBHLziPi7wu4LcwzzAyNazAEs1jPorQqruUVJz4OqVCP41ARrypeRg4H49qqQJFJSUwYARXnGIag3Bj3FofKMhJzCUGspinRH8irfnjjh6C4M58Q4jM6MZMp75vMc3cY5_64-hdroJM4](https://mermaid.ink/svg/pako:eNqdlM9vEkEUx_-VyZzaBEjaqodN7EX05I9EbobLlJ0CCezg7qzRNE202koULERKNahIoi2HStvUUkqL_DOd2eW_cJZZdrdgGyKXXeDz3vu-73szKzBBVAwVaOCnJtYSOJpGSR1l4xoQnxzSaTqRziGNglgihbMIIMN9myTupXFGdQC70WTFLfZrm7eOJ7FHSwbWn2HdIdnHIutW2PmmdXRmndUn4ceOLIMOs-6f8MM19uONVdpgn5uTbBRRFCOmnsAOzrcOeLHFu6W4JtGHhGJAnMKygZDPK4Dlv7Ld96xQHXxqe6olF15cHHamgLkI4EdNtlF4HtalrsF60eq1JD2EBDzqTwHzEZG3xs66Xpts_9Q-bIzr8SPI8A0tZfCMW2FWwiNE5HctUcBCBNitP6K-VSuz0p7niZ_YQ2VePCOeIUC0OymkJfHsVM7wwprd6wVtQRkKssTU6H2C1ItOl-omlv8EbfBq34jMgcFOle815EjkHP0AFwyGsFKenbbdgW-uibh_4Zfmt1m2j0_GU_tEOJje7ldY7ZtUc60O_v3cGVqhejXrrgav_ebVA9WrJ1GsqVN5bPdLdqPAt9syjW-zmRMpsVvN3t0RbV7r9LwrRBoR3M4rFuOi3-KVU7EWwc0MdnhpoaUCb5uDanHGwEDHGbES08tdAOy8y_LtwduiJ_pauZao-OGnffDaqjSR8UJLxDCN_qfprNgZW-zJE3xTnPjOurhwxo7YiHSnfysCRAvOSazUWbnHyk3-pW69a_OXr8aFuBHLziPi7wu4LcwzzAyNazAEs1jPorQqruUVJz4OqVCP41ARrypeRg4H49qqQJFJSUwYARXnGIag3Bj3FofKMhJzCUGspinRH8irfnjjh6C4M58Q4jM6MZMp75vMc3cY5_64-hdroJM4)
